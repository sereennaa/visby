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
import type { VisbyMemory } from '../../types';

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

function generateVisbyReply(userText: string, justAddedMemory: boolean): string {
  const t = userText.trim().toLowerCase();
  if (justAddedMemory) {
    const options = [
      "I'll remember that! You've got this. 💜",
      "That sounds like a lot — I'm here for you!",
      "I'm rooting for you. One step at a time!",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (/^(good|great|ok|okay|fine|nice|doing well|pretty good|not bad)$/.test(t)) {
    return "I'm so glad you're here! Want to tell me more or just chill? Either way I've got you. 💜";
  }
  if (/^(tired|exhausted|stressed|sad|anxious)$/.test(t) || t.includes('tired') || t.includes('stressed')) {
    return "That's okay. You're doing your best. I'm really glad you checked in. 💜";
  }
  const affirmations = [
    "You're doing great.",
    "I believe in you!",
    "So glad you told me that.",
    "One step at a time. I'm rooting for you!",
    "That made me so happy to hear!",
    "You're awesome. Keep being you. 💜",
  ];
  return affirmations[Math.floor(Math.random() * affirmations.length)];
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
    setLastVisbyCheckInAt,
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

    const memorySummary = extractMemory(text);
    if (memorySummary) addVisbyMemory(memorySummary);

    const reply = generateVisbyReply(text, !!memorySummary);
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
