import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import type { VisbyMemory, VisbyChatMessage } from '../../types';

const SOCIAL_BATTERY_CHAT_USER = 6;
const SOCIAL_BATTERY_CHAT_VISBY = 4;

function getGreetingWithMemory(memories: VisbyMemory[]): string {
  const recent = memories
    .filter((m) => {
      const d = new Date(m.createdAt);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000; // last 7 days
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (recent) {
    return `Hey! How are you? How did ${recent.summary} go? 💜`;
  }
  return "Hey! How are you? I'm so glad you're here. 💜";
}

function extractMemory(userText: string): string | null {
  const t = userText.trim().toLowerCase();
  if (t.length < 4) return null;
  const patterns = [
    /(?:working on|working at|busy with)\s+(.+?)(?:\.|!|\?|$)/i,
    /(?:have a|have an|got a)\s+(.+?)(?:\.|!|\?|tomorrow|today|$)/i,
    /(?:stressed|worried|excited|nervous)\s+(?:about|for)?\s*(.+?)(?:\.|!|\?|$)/i,
    /(?:going to|gonna)\s+(.+?)(?:\.|!|\?|tomorrow|today|$)/i,
    /(?:trying to|learning to)\s+(.+?)(?:\.|!|\?|$)/i,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m && m[1]) return m[1].trim().slice(0, 120);
  }
  if (t.length >= 15 && (t.includes('project') || t.includes('exam') || t.includes('test') || t.includes('interview'))) {
    return t.slice(0, 100);
  }
  return null;
}

function getLastVisbyReply(messages: VisbyChatMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'visby') return messages[i].text;
  }
  return null;
}

function pickWithoutRepeat<T>(options: T[], exclude: T | null): T {
  const filtered = exclude != null ? options.filter((o) => o !== exclude) : options;
  const pool = filtered.length > 0 ? filtered : options;
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateVisbyReply(
  userText: string,
  justAddedMemory: boolean,
  recentMessages: VisbyChatMessage[],
): string {
  const t = userText.trim().toLowerCase();
  const lastVisby = getLastVisbyReply(recentMessages);

  if (justAddedMemory) {
    const options = [
      "I'll remember that! You've got this. 💜",
      "That sounds like a lot — I'm here for you!",
      "I'm rooting for you. One step at a time!",
      "Noted! I'm in your corner.",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Acknowledging Visby ("you too", "same", "back at you", "right back at you")
  if (/^(you too|same|back at you|right back at you|ditto|same here|thanks, you too)$/.test(t)) {
    const options = [
      "Aw, thanks! So what's on your mind today?",
      "You're sweet! Anything you want to talk about or just vibing?",
      "Thanks! How are you really doing?",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // "What else?" / "And?" / follow-up prompts
  if (/^(what else|and what else|wht else|what about you|and\?|what now|what next|tell me more|more)$/.test(t)) {
    const options = [
      "I'm good! You could try today's adventure, or we can just hang here. What sounds fun?",
      "Want to try today's adventure, or tell me what you're up to!",
      "Up to you! We can keep chatting, or you could explore the world. What do you feel like?",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Thanks
  if (/^(thanks|thank you|thx|ty|thanks!|thank you!)$/.test(t)) {
    const options = [
      "Anytime! You're the best. 💜",
      "Of course! I'm always here.",
      "You're welcome!",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Positive short ("good", "great", "ok", etc.)
  if (/^(good|great|ok|okay|fine|nice|doing well|pretty good|not bad|good!|great!)$/.test(t)) {
    const options = [
      "I'm so glad you're here! Want to tell me more or just chill? Either way I've got you. 💜",
      "Love to hear it! What's been good? Or we can just hang.",
      "Yay! Anything else on your mind?",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Low / tired / stressed
  if (/^(tired|exhausted|stressed|sad|anxious|not great|meh)$/.test(t) || /\b(tired|stressed|exhausted)\b/.test(t)) {
    const options = [
      "That's okay. You're doing your best. I'm really glad you checked in. 💜",
      "I get it. Some days are like that. Proud of you for showing up.",
      "Here for you. No need to be on — we can just sit here.",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Questions (ends with ?)
  if (t.endsWith('?')) {
    const options = [
      "Good question! I'm not sure I have one answer — what do you think?",
      "Hmm, I'd say follow your gut! What feels right to you?",
      "I'm still figuring that out too! Want to tell me what you're thinking?",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Very short / vague (few words, no clear category)
  if (t.split(/\s+/).length <= 2 && t.length <= 15) {
    const options = [
      "Tell me more! I'm listening.",
      "What's on your mind?",
      "I'm here — want to elaborate or just hang? 💜",
    ];
    return pickWithoutRepeat(options, lastVisby);
  }

  // Open-ended: varied, contextual affirmations — never repeat last reply
  const affirmations = [
    "That's really cool to hear.",
    "I'm glad you shared that with me. 💜",
    "You're doing great.",
    "I believe in you!",
    "One step at a time. I'm rooting for you!",
    "That made me happy to hear!",
    "You're awesome. Keep being you. 💜",
    "Thanks for telling me — I'm here for you.",
    "I love that. Keep going!",
    "Sounds like you're on it. Proud of you!",
  ];
  return pickWithoutRepeat(affirmations, lastVisby);
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const VisbyCheckInModal: React.FC<Props> = ({ visible, onClose }) => {
  const {
    visby,
    visbyChatMessages,
    addVisbyChatMessage,
    addVisbyMemory,
    chargeSocialBattery,
    getVisbyMemories,
    getVisbyChatMessages,
    setLastVisbyCheckInAt,
    checkDailyMissionCompletion,
  } = useStore();
  const [input, setInput] = useState('');
  const [greeting, setGreeting] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const memories = getVisbyMemories();
  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  useEffect(() => {
    if (visible) setGreeting(getGreetingWithMemory(memories));
  }, [visible, memories.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    addVisbyChatMessage('user', text);
    chargeSocialBattery(SOCIAL_BATTERY_CHAT_USER);
    checkDailyMissionCompletion('chat_with_visby', 1);

    const memorySummary = extractMemory(text);
    if (memorySummary) addVisbyMemory(memorySummary);

    const recentMessages = getVisbyChatMessages();
    const reply = generateVisbyReply(text, !!memorySummary, recentMessages);
    setTimeout(() => {
      addVisbyChatMessage('visby', reply);
      chargeSocialBattery(SOCIAL_BATTERY_CHAT_VISBY);
    }, 400 + Math.random() * 400);
  };

  const handleClose = () => {
    setLastVisbyCheckInAt();
    onClose();
  };

  const messagesInSession = visible ? visbyChatMessages : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.visbyWrap}>
              <VisbyCharacter
                appearance={defaultAppearance}
                equipped={visby?.equipped}
                mood="happy"
                size={56}
                animated
              />
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={12}>
              <Icon name="close" size={22} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Check-in with your Visby</Text>
          {greeting ? (
            <View style={styles.greetingBubble}>
              <Text variant="body" style={styles.greetingText}>{greeting}</Text>
            </View>
          ) : null}
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {messagesInSession.map((msg) => (
              <View
                key={msg.id}
                style={[styles.messageRow, msg.role === 'user' ? styles.messageRowUser : styles.messageRowVisby]}
              >
                <View style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleVisby]}>
                  <Text variant="body" style={msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextVisby}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Say something..."
              placeholderTextColor={colors.text.light}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
              maxLength={300}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              disabled={!input.trim()}
            >
              <Icon name="send" size={20} color={input.trim() ? colors.primary.wisteriaDark : colors.text.light} />
            </TouchableOpacity>
          </View>
          <Caption style={styles.hint}>Chatting with Visby fills their social battery. So does hanging out with friends!</Caption>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    backgroundColor: colors.base.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl + 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  visbyWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  greetingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.wisteriaFaded,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '90%',
  },
  greetingText: {
    color: colors.primary.wisteriaDark,
  },
  messageList: {
    maxHeight: 220,
    marginBottom: spacing.sm,
  },
  messageListContent: {
    paddingVertical: spacing.xs,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowVisby: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: colors.primary.wisteria,
  },
  bubbleVisby: {
    backgroundColor: colors.primary.wisteriaFaded,
  },
  bubbleTextUser: {
    color: colors.text.inverse,
  },
  bubbleTextVisby: {
    color: colors.text.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.base.parchment,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    maxHeight: 80,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sendBtn: {
    padding: 8,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  hint: {
    color: colors.text.muted,
    textAlign: 'center',
  },
});
