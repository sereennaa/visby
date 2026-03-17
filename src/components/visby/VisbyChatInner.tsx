import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { FloatingParticles } from '../effects/FloatingParticles';
import { GiftShop } from './GiftShop';
import { NeedsDisplay, CareHintCard, NeedKey } from './NeedsShared';
import type { VisbyMemory, VisbyChatMessage } from '../../types';
import { getAIReply, isAIChatConfigured, extractMemoryAI, abortPendingAIRequest, filterUserInput, getSafetyResponse } from '../../services/aiChat';
import { calculateTraitLevels, getDominantTrait, getPersonalityGreeting } from '../../config/visbyPersonality';
import { analyticsService } from '../../services/analytics';
import { speakAsVisby, stopVisbyTTS } from '../../services/visbyTTS';

const SOCIAL_BATTERY_CHAT_USER = 6;
const SOCIAL_BATTERY_CHAT_VISBY = 4;

function getGreetingWithMemory(memories: VisbyMemory[]): string {
  const recent = memories
    .filter((m) => {
      const d = new Date(m.createdAt);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (recent) {
    return `Hey! How are you? How did ${recent.summary} go?`;
  }
  return "Hey! How are you? I'm so glad you're here.";
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
    return pickWithoutRepeat([
      "I'll remember that! You've got this.",
      "That sounds like a lot — I'm here for you!",
      "I'm rooting for you. One step at a time!",
      "Noted! I'm in your corner.",
    ], lastVisby);
  }

  if (/^(you too|same|back at you|right back at you|ditto|same here|thanks, you too)$/.test(t)) {
    return pickWithoutRepeat([
      "Aw, thanks! So what's on your mind today?",
      "You're sweet! Anything you want to talk about or just vibing?",
      "Thanks! How are you really doing?",
    ], lastVisby);
  }

  if (/^(what else|and what else|wht else|what about you|and\?|what now|what next|tell me more|more)$/.test(t)) {
    return pickWithoutRepeat([
      "I'm good! You could try today's adventure, or we can just hang here. What sounds fun?",
      "Want to try today's adventure, or tell me what you're up to!",
      "Up to you! We can keep chatting, or you could explore the world. What do you feel like?",
    ], lastVisby);
  }

  if (/^(thanks|thank you|thx|ty|thanks!|thank you!)$/.test(t)) {
    return pickWithoutRepeat([
      "Anytime! You're the best.",
      "Of course! I'm always here.",
      "You're welcome!",
    ], lastVisby);
  }

  if (/^(good|great|ok|okay|fine|nice|doing well|pretty good|not bad|good!|great!)$/.test(t)) {
    return pickWithoutRepeat([
      "I'm so glad you're here! Want to tell me more or just chill? Either way I've got you.",
      "Love to hear it! What's been good? Or we can just hang.",
      "Yay! Anything else on your mind?",
    ], lastVisby);
  }

  if (/^(tired|exhausted|stressed|sad|anxious|not great|meh)$/.test(t) || /\b(tired|stressed|exhausted)\b/.test(t)) {
    return pickWithoutRepeat([
      "That's okay. You're doing your best. I'm really glad you checked in.",
      "I get it. Some days are like that. Proud of you for showing up.",
      "Here for you. No need to be on — we can just sit here.",
    ], lastVisby);
  }

  if (t.endsWith('?')) {
    return pickWithoutRepeat([
      "Good question! I'm not sure I have one answer — what do you think?",
      "Hmm, I'd say follow your gut! What feels right to you?",
      "I'm still figuring that out too! Want to tell me what you're thinking?",
    ], lastVisby);
  }

  if (t.split(/\s+/).length <= 2 && t.length <= 15) {
    return pickWithoutRepeat([
      "Tell me more! I'm listening.",
      "What's on your mind?",
      "I'm here — want to elaborate or just hang?",
    ], lastVisby);
  }

  return pickWithoutRepeat([
    "That's really cool to hear.",
    "I'm glad you shared that with me.",
    "You're doing great.",
    "I believe in you!",
    "One step at a time. I'm rooting for you!",
    "That made me happy to hear!",
    "You're awesome. Keep being you.",
    "Thanks for telling me — I'm here for you.",
    "I love that. Keep going!",
    "Sounds like you're on it. Proud of you!",
  ], lastVisby);
}

function getQuickReplies(lastVisbyText: string | null, isFirstMessage: boolean): string[] {
  if (isFirstMessage || !lastVisbyText) {
    return ["I'm doing great!", "Not the best day", "Tell me something cool"];
  }
  const t = lastVisbyText.toLowerCase();
  if (t.includes('?')) {
    return ["Yes!", "Hmm, I'm not sure", "Tell me more"];
  }
  if (/adventure|explore|country|travel/.test(t)) {
    return ["Let's go!", "Tell me a fun fact", "What should we do today?"];
  }
  return ["What should we do today?", "Tell me a fun fact", "How are you?"];
}

const REACTION_TRIGGERS: Record<string, 'sparkle' | 'love' | 'happy_wiggle'> = {
  'proud': 'sparkle',
  'amazing': 'sparkle',
  'awesome': 'happy_wiggle',
  'love': 'love',
  'best': 'happy_wiggle',
  'great job': 'sparkle',
  'believe in you': 'love',
};

function detectReaction(text: string): 'sparkle' | 'love' | 'happy_wiggle' | undefined {
  const t = text.toLowerCase();
  for (const [trigger, reaction] of Object.entries(REACTION_TRIGGERS)) {
    if (t.includes(trigger)) return reaction;
  }
  return undefined;
}

function getMoodParticleVariant(mood: string): 'sparkle' | 'dust' | 'snow' | 'stars' {
  if (mood === 'happy' || mood === 'excited' || mood === 'proud') return 'sparkle';
  if (mood === 'sleepy' || mood === 'cozy') return 'dust';
  if (mood === 'sad' || mood === 'lonely') return 'snow';
  return 'stars';
}

const BondMeter: React.FC = () => {
  const visbyBond = useStore((s) => s.visbyBond);
  const level = visbyBond.level;
  const THRESHOLDS = [0, 10, 30, 60, 100, 160, 240, 340, 460, 600];
  const currentThreshold = THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = THRESHOLDS[level] ?? THRESHOLDS[THRESHOLDS.length - 1];
  const progress = nextThreshold > currentThreshold
    ? Math.min(1, (visbyBond.totalBondPoints - currentThreshold) / (nextThreshold - currentThreshold))
    : 1;

  return (
    <View style={bondStyles.container}>
      <View style={bondStyles.row}>
        <Icon name="heart" size={14} color="#E74C3C" />
        <Text style={bondStyles.levelText}>Bond Lv. {level}</Text>
        <Text style={bondStyles.pointsText}>{visbyBond.totalBondPoints} pts</Text>
      </View>
      <View style={bondStyles.barBg}>
        <View style={[bondStyles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const bondStyles = StyleSheet.create({
  container: { marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  levelText: { fontWeight: '700', fontSize: 13, color: '#E74C3C' },
  pointsText: { fontSize: 11, color: colors.text.muted, marginLeft: 'auto' },
  barBg: { height: 6, backgroundColor: 'rgba(231,76,60,0.12)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: '#E74C3C', borderRadius: 3 },
});

export interface VisbyChatInnerProps {
  active: boolean;
  onNavigateAway?: (screen: string, params?: object) => void;
  onCleanup?: () => void;
  showNeeds?: boolean;
}

export const VisbyChatInner: React.FC<VisbyChatInnerProps> = ({
  active,
  onNavigateAway,
  onCleanup,
  showNeeds = true,
}) => {
  const {
    user,
    visby,
    visbyChatMessages,
    addVisbyChatMessage,
    addVisbyMemory,
    chargeSocialBattery,
    getVisbyMemories,
    getVisbyChatMessages,
    setLastVisbyCheckInAt,
    checkDailyMissionCompletion,
    getGrowthStage,
    lessonProgress,
    getSustainabilityLessonsCompleted,
  } = useStore();
  const [input, setInput] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [activeHint, setActiveHint] = useState<NeedKey | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [visbyReaction, setVisbyReaction] = useState<'sparkle' | 'love' | 'happy_wiggle' | undefined>();
  const scrollRef = useRef<ScrollView>(null);
  const visbyMood = useStore((s) => s.getVisbyMood());
  const hasInitialized = useRef(false);

  const memories = getVisbyMemories();
  const defaultAppearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const speakReply = useCallback((text: string) => {
    if (!ttsEnabled) return;
    setIsSpeaking(true);
    speakAsVisby(text, () => setIsSpeaking(false));
  }, [ttsEnabled]);

  useEffect(() => {
    if (active && !hasInitialized.current) {
      hasInitialized.current = true;
      setShowGifts(false);
      setActiveHint(null);
      const traits = calculateTraitLevels({
        bites: user?.bitesCollected || 0,
        lessonsCompleted: lessonProgress.filter((l) => l.completed).length,
        countriesVisited: user?.countriesVisited || 0,
        chatMessages: visbyChatMessages.length,
        wordMatchGames: user?.perfectWordMatches || 0,
        gamesPlayed: user?.gamesPlayed || 0,
        stampsCollected: user?.stampsCollected || 0,
        averageNeedLevel: 50,
        sustainabilityLessonsCompleted: getSustainabilityLessonsCompleted?.(),
      });
      const dominant = getDominantTrait(traits);
      const stage = getGrowthStage();
      const personalityGreeting = getPersonalityGreeting(dominant, stage);
      const memoryGreeting = getGreetingWithMemory(memories);
      let chosen: string;
      if (dominant && dominant.level >= 20 && Math.random() > 0.5) {
        chosen = personalityGreeting;
      } else {
        chosen = memoryGreeting;
      }
      setGreeting(chosen);
      speakReply(chosen);
    }
    if (!active) {
      hasInitialized.current = false;
    }
  }, [active]);

  const addVisbyReply = useCallback((reply: string) => {
    addVisbyChatMessage('visby', reply);
    chargeSocialBattery(SOCIAL_BATTERY_CHAT_VISBY);
    speakReply(reply);
    const reaction = detectReaction(reply);
    if (reaction) {
      setVisbyReaction(reaction);
      setTimeout(() => setVisbyReaction(undefined), 2500);
    }
  }, [addVisbyChatMessage, chargeSocialBattery, speakReply]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');
    setIsThinking(true);
    addVisbyChatMessage('user', text);
    chargeSocialBattery(SOCIAL_BATTERY_CHAT_USER);
    checkDailyMissionCompletion('chat_with_visby', 1);
    analyticsService.trackChatMessage();

    const safetyFlag = filterUserInput(text);
    if (safetyFlag.level === 'high') {
      const safeReply = getSafetyResponse(safetyFlag) || "I'm glad you told me. Please talk to a grown-up you trust.";
      addVisbyReply(safeReply);
      setIsThinking(false);
      return;
    }

    const memorySummary = extractMemoryAI(text) || extractMemory(text);
    if (memorySummary) addVisbyMemory(memorySummary);

    const recentMessages = getVisbyChatMessages();

    if (isAIChatConfigured) {
      try {
        const reply = await getAIReply(text, recentMessages, memories);
        addVisbyReply(reply);
        setIsThinking(false);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          setIsThinking(false);
          return;
        }
      }
    }

    const reply = generateVisbyReply(text, !!memorySummary, recentMessages);
    setTimeout(() => {
      addVisbyReply(reply);
      setIsThinking(false);
    }, 400 + Math.random() * 400);
  };

  const cleanup = useCallback(() => {
    abortPendingAIRequest();
    stopVisbyTTS();
    setIsThinking(false);
    setIsSpeaking(false);
    setLastVisbyCheckInAt();
    onCleanup?.();
  }, [onCleanup, setLastVisbyCheckInAt]);

  useEffect(() => {
    return () => {
      if (hasInitialized.current) {
        abortPendingAIRequest();
        stopVisbyTTS();
      }
    };
  }, []);

  const toggleGifts = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowGifts((prev) => !prev);
  };

  const handleTapNeed = useCallback((key: NeedKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveHint((prev) => (prev === key ? null : key));
  }, []);

  const handleCareAction = useCallback((screen: string, params?: object) => {
    setActiveHint(null);
    cleanup();
    onNavigateAway?.(screen, params);
  }, [onNavigateAway, cleanup]);

  const handleDismissHint = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveHint(null);
  }, []);

  const handleQuickReply = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => {
      setInput('');
      const syntheticText = text;
      if (!syntheticText.trim() || isThinking) return;
      setIsThinking(true);
      addVisbyChatMessage('user', syntheticText);
      chargeSocialBattery(SOCIAL_BATTERY_CHAT_USER);
      checkDailyMissionCompletion('chat_with_visby', 1);
      analyticsService.trackChatMessage();
      const safetyFlag = filterUserInput(syntheticText);
      if (safetyFlag.level === 'high') {
        const safeReply = getSafetyResponse(safetyFlag) || "I'm glad you told me. Please talk to a grown-up you trust.";
        addVisbyReply(safeReply);
        setIsThinking(false);
        return;
      }
      const recentMessages = getVisbyChatMessages();
      if (isAIChatConfigured) {
        getAIReply(syntheticText, recentMessages, memories).then((reply) => {
          addVisbyReply(reply);
          setIsThinking(false);
        }).catch((err: any) => {
          if (err?.name !== 'AbortError') {
            const reply = generateVisbyReply(syntheticText, false, recentMessages);
            addVisbyReply(reply);
          }
          setIsThinking(false);
        });
      } else {
        const reply = generateVisbyReply(syntheticText, false, recentMessages);
        setTimeout(() => { addVisbyReply(reply); setIsThinking(false); }, 400 + Math.random() * 400);
      }
    }, 0);
  }, [isThinking, addVisbyChatMessage, chargeSocialBattery, checkDailyMissionCompletion, addVisbyReply, getVisbyChatMessages, memories]);

  const lastVisbyMessage = getLastVisbyReply(visbyChatMessages);
  const quickReplies = getQuickReplies(lastVisbyMessage || greeting, visbyChatMessages.length === 0);
  const messagesInSession = active ? visbyChatMessages : [];

  return (
    <View style={styles.container}>
      <View style={styles.particlesWrap} pointerEvents="none">
        <FloatingParticles count={6} variant={getMoodParticleVariant(visbyMood)} opacity={0.15} speed="slow" />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.visbyWrap, isSpeaking && styles.visbyWrapSpeaking]}>
            <VisbyCharacter
              appearance={defaultAppearance}
              equipped={visby?.equipped}
              mood={isSpeaking ? 'excited' : (isThinking ? 'thinking' : 'happy')}
              size={44}
              animated
              reaction={visbyReaction}
            />
          </View>
          <View>
            <Text style={styles.title}>Chat with Visby</Text>
            <BondMeter />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { setTtsEnabled((v) => !v); if (ttsEnabled) stopVisbyTTS(); }}
          style={styles.speakerBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={ttsEnabled ? 'Mute Visby voice' : 'Unmute Visby voice'}
        >
          <Icon name={ttsEnabled ? 'volumeHigh' : 'volumeOff'} size={20} color={ttsEnabled ? colors.primary.wisteria : colors.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Needs */}
      {showNeeds && (
        <>
          <NeedsDisplay activeHint={activeHint} onTapNeed={handleTapNeed} />
          {activeHint && (
            <CareHintCard needKey={activeHint} onAction={handleCareAction} onDismiss={handleDismissHint} />
          )}
        </>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {greeting ? (
          <Animated.View entering={FadeInDown.duration(300).springify()} style={[styles.messageRow, styles.messageRowVisby]}>
            <View style={[styles.bubble, styles.bubbleVisby]}>
              <Text variant="body" style={styles.bubbleTextVisby}>{greeting}</Text>
            </View>
          </Animated.View>
        ) : null}
        {messagesInSession.map((msg) => (
          <Animated.View
            key={msg.id}
            entering={FadeInDown.duration(250).springify()}
            style={[styles.messageRow, msg.role === 'user' ? styles.messageRowUser : styles.messageRowVisby]}
          >
            <View style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleVisby]}>
              <Text variant="body" style={msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextVisby}>
                {msg.text}
              </Text>
            </View>
          </Animated.View>
        ))}
        {isThinking && (
          <Animated.View entering={FadeIn.duration(200)} style={[styles.messageRow, styles.messageRowVisby]}>
            <View style={styles.typingBubble}>
              <View style={styles.thinkingVisbyWrap}>
                <VisbyCharacter
                  appearance={defaultAppearance}
                  equipped={visby?.equipped}
                  mood="thinking"
                  size={24}
                  animated
                />
              </View>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Quick reply chips */}
      {!isThinking && !input.trim() && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplies} contentContainerStyle={styles.quickRepliesContent}>
          {quickReplies.map((qr) => (
            <TouchableOpacity key={qr} style={styles.quickChip} onPress={() => handleQuickReply(qr)} activeOpacity={0.7}>
              <Text style={styles.quickChipText}>{qr}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={toggleGifts} style={styles.giftToggle} hitSlop={8}>
          <Icon name="gift" size={20} color={showGifts ? colors.primary.wisteria : colors.text.muted} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={isThinking ? 'Visby is typing...' : 'Say something...'}
          placeholderTextColor={colors.text.light}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
          maxLength={300}
          editable={!isThinking}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendBtn, (!input.trim() || isThinking) && styles.sendBtnDisabled]}
          disabled={!input.trim() || isThinking}
        >
          <Icon name="send" size={20} color={input.trim() && !isThinking ? colors.primary.wisteriaDark : colors.text.light} />
        </TouchableOpacity>
      </View>

      {showGifts && <GiftShop onGiftGiven={() => {}} />}

      <Caption style={styles.hint}>
        {isAIChatConfigured ? 'AI-powered chat' : 'Give gifts to boost needs!'}
      </Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  particlesWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  visbyWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visbyWrapSpeaking: {
    transform: [{ scale: 1.08 }],
  },
  speakerBtn: {
    padding: spacing.xs,
    marginRight: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  messageList: {
    flex: 1,
    minHeight: 120,
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: spacing.xs,
  },
  giftToggle: {
    padding: 8,
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
  quickReplies: {
    maxHeight: 40,
    marginBottom: spacing.xs,
  },
  quickRepliesContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  quickChip: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.25)',
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary.wisteriaDark,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.wisteriaFaded,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 8,
  },
  thinkingVisbyWrap: {
    width: 24,
    height: 24,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteria,
    opacity: 0.4,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  hint: {
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 4,
  },
});
