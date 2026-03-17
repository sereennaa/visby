import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Text, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { FloatingParticles, getCountryParticleVariant } from '../effects/FloatingParticles';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { VisbyChatInner } from '../visby/VisbyChatInner';
import type { PlaceChatMessage, ChatEmote } from '../../types';
import { fetchPlaceChatMessages, subscribePlaceChat } from '../../services/socialSync';
import { filterPlaceChatMessage } from '../../config/safetyFilters';
import { getPhrasesForRoom, PHRASE_CATEGORIES, CATEGORY_LABELS } from '../../config/quickChatPhrases';
import { useStore } from '../../store/useStore';

const EMOTE_MAP: Record<ChatEmote, IconName> = {
  wave: 'hand', heart: 'heart', laugh: 'happy', wow: 'star',
  cool: 'flash', dance: 'music', sparkle: 'sparkles', thumbsup: 'like',
};
const EMOTE_LIST: ChatEmote[] = ['wave', 'heart', 'laugh', 'wow', 'cool', 'dance', 'sparkle', 'thumbsup'];
const RATE_LIMIT_MS = 2000;

type ChatTab = 'visby' | 'room';

interface RoomChatContainerProps {
  visible: boolean;
  onClose: () => void;
  roomName: string;
  channelKey: string;
  messages: PlaceChatMessage[];
  userId: string;
  onSendMessage: (text: string) => void;
  countryId?: string;
}

export const RoomChatContainer = React.memo<RoomChatContainerProps>(({
  visible,
  onClose,
  roomName,
  channelKey,
  messages,
  userId,
  onSendMessage,
  countryId,
}) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<ChatTab>('visby');
  const [input, setInput] = useState('');
  const [showPhrases, setShowPhrases] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('greetings');
  const [filterHint, setFilterHint] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const lastSendTime = useRef(0);
  const receivePlaceChatMessage = useStore(s => s.receivePlaceChatMessage);
  const chatMode = useStore(s => s.settings.chatMode);
  const isFriend = useStore(s => s.isFriend);
  const isUserBlocked = useStore(s => s.isUserBlocked);
  const blockUser = useStore(s => s.blockUser);
  const reportMessage = useStore(s => s.reportMessage);
  const friends = useStore(s => s.friends);

  const phrases = useMemo(() => getPhrasesForRoom(countryId), [countryId]);
  const particleVariant = countryId ? getCountryParticleVariant(countryId) : undefined;
  const isSafeChatOnly = chatMode === 'safe_chat_only';
  const isChatOff = chatMode === 'off';

  const visibleMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (isUserBlocked(msg.userId)) return false;
      if (chatMode === 'friends_only' && msg.userId !== userId && !isFriend(msg.userId)) return false;
      return true;
    });
  }, [messages, chatMode, userId, isFriend, isUserBlocked, friends]);

  useEffect(() => {
    if (!visible || !channelKey || isChatOff) return;
    fetchPlaceChatMessages(channelKey, 30).then(remoteMessages => {
      remoteMessages.forEach(msg => receivePlaceChatMessage(channelKey, msg));
    }).catch(() => {});
    const { unsubscribe } = subscribePlaceChat(channelKey, (msg) => {
      if (msg.userId !== userId) {
        receivePlaceChatMessage(channelKey, msg);
      }
    });
    return () => unsubscribe();
  }, [visible, channelKey, userId, receivePlaceChatMessage, isChatOff]);

  useEffect(() => {
    if (filterHint) {
      const t = setTimeout(() => setFilterHint(null), 3000);
      return () => clearTimeout(t);
    }
  }, [filterHint]);

  const trySend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isChatOff) return;
    const now = Date.now();
    if (now - lastSendTime.current < RATE_LIMIT_MS) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), RATE_LIMIT_MS - (now - lastSendTime.current));
      return;
    }
    const result = filterPlaceChatMessage(trimmed);
    if (!result.allowed) {
      setFilterHint(result.hint || "Let's keep things friendly!");
      return;
    }
    lastSendTime.current = now;
    onSendMessage(trimmed);
    setInput('');
    setShowPhrases(false);
  }, [onSendMessage, isChatOff]);

  const handleSend = useCallback(() => { trySend(input); }, [input, trySend]);

  const handleEmote = useCallback((emote: ChatEmote) => {
    const now = Date.now();
    if (now - lastSendTime.current < RATE_LIMIT_MS) return;
    lastSendTime.current = now;
    onSendMessage(EMOTE_MAP[emote]);
  }, [onSendMessage]);

  const togglePhrases = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPhrases(v => !v);
  }, []);

  const handleLongPressBubble = useCallback((msg: PlaceChatMessage) => {
    if (msg.userId === userId) return;
    Alert.alert(
      msg.username,
      'What would you like to do?',
      [
        { text: 'Block this person', style: 'destructive', onPress: () => blockUser(msg.userId) },
        {
          text: 'Report message',
          onPress: () => {
            reportMessage(msg.id, 'inappropriate');
            setFilterHint('Thanks for reporting. We\'ll review it.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [userId, blockUser, reportMessage]);

  const handleVisbyNavigateAway = useCallback((screen: string, params?: object) => {
    onClose();
    if (params) navigation.navigate(screen, params);
    else navigation.navigate(screen);
  }, [onClose, navigation]);

  const switchTab = useCallback((tab: ChatTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  }, []);

  const filteredPhrases = phrases.filter(p => p.category === activeCategory);

  const roomChatContent = (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {visibleMessages.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="chat" size={32} color={colors.text.light} />
            <Text style={styles.emptyText}>
              {chatMode === 'friends_only'
                ? 'No friends chatting here yet. Invite a friend!'
                : 'No messages yet. Say hello!'}
            </Text>
          </View>
        )}
        {visibleMessages.map((msg) => {
          const isYou = msg.userId === userId;
          const createdAt = typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt;
          const isEmote = msg.emote || (msg.message.length <= 2 && /[\u{1F300}-\u{1FAFF}]/u.test(msg.message));
          if (isEmote) {
            return (
              <Animated.View key={msg.id} entering={ZoomIn.duration(250).springify()} style={[styles.emoteRow, isYou && styles.emoteRowYou]}>
                {!isYou && <Caption style={styles.emoteUsername}>{msg.username}</Caption>}
                <Text style={styles.emoteBig}>{msg.message}</Text>
              </Animated.View>
            );
          }
          return (
            <Animated.View key={msg.id} entering={FadeInDown.duration(200).springify()} style={[styles.bubbleRow, isYou && styles.bubbleRowYou]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onLongPress={() => handleLongPressBubble(msg)}
                delayLongPress={500}
                style={[styles.bubble, isYou ? styles.bubbleYou : styles.bubbleOther]}
              >
                {!isYou && <Caption style={styles.bubbleUsername}>{msg.username}</Caption>}
                <Text style={[styles.bubbleText, isYou && styles.bubbleTextYou]}>{msg.message}</Text>
                <Caption style={styles.bubbleTime}>
                  {createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Caption>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {filterHint && (
        <Animated.View entering={FadeInUp.duration(200)} style={styles.filterHint}>
          <Icon name="info" size={14} color={colors.accent.coral} />
          <Text style={styles.filterHintText}>{filterHint}</Text>
        </Animated.View>
      )}

      <View style={styles.emoteBar}>
        {EMOTE_LIST.map((emote) => (
          <TouchableOpacity key={emote} style={styles.emoteBtn} onPress={() => handleEmote(emote)} activeOpacity={0.6}>
            <Icon name={EMOTE_MAP[emote]} size={20} color={colors.primary.wisteriaDark} />
          </TouchableOpacity>
        ))}
      </View>

      {showPhrases && (
        <Animated.View entering={FadeInUp.duration(200)} style={styles.phrasesPanel}>
          <View style={styles.phraseCategoryRow}>
            {PHRASE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.phraseCategoryBtn, activeCategory === cat && styles.phraseCategoryActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.phraseCategoryText, activeCategory === cat && styles.phraseCategoryTextActive]}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.phraseGrid}>
            {filteredPhrases.map((p) => (
              <TouchableOpacity key={p.text} style={styles.phraseChip} onPress={() => trySend(p.text)} activeOpacity={0.7}>
                <Text style={styles.phraseChipText}>{p.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      {isSafeChatOnly ? (
        <View style={styles.safeChatOnlyBar}>
          <TouchableOpacity onPress={togglePhrases} style={styles.safeChatToggle} activeOpacity={0.7}>
            <Icon name="chat" size={18} color={colors.primary.wisteria} />
            <Text style={styles.safeChatToggleText}>{showPhrases ? 'Hide phrases' : 'Tap to chat with safe phrases'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={togglePhrases} style={styles.phrasesToggle} hitSlop={8}>
            <Icon name="chat" size={20} color={showPhrases ? colors.primary.wisteria : colors.text.muted} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={cooldown ? 'Slow down...' : 'Say something...'}
            placeholderTextColor={colors.text.light}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            maxLength={200}
            editable={!cooldown}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || cooldown) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || cooldown}
          >
            <Icon name="send" size={20} color={input.trim() && !cooldown ? colors.primary.wisteriaDark : colors.text.light} />
          </TouchableOpacity>
        </View>
      )}
      <Caption style={styles.hintText}>
        {chatMode === 'friends_only' ? 'Only friends can see your messages' : 'Keep it kind and fun!'}
      </Caption>
    </>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          {particleVariant && (
            <View style={styles.particlesWrap} pointerEvents="none">
              <FloatingParticles count={4} variant={particleVariant.variant} opacity={0.12} speed="slow" />
            </View>
          )}

          {/* Header with close */}
          <View style={styles.header}>
            <Text style={styles.title}>{roomName}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Icon name="close" size={22} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'visby' && styles.tabActive]}
              onPress={() => switchTab('visby')}
              activeOpacity={0.7}
            >
              <Icon name="heart" size={14} color={activeTab === 'visby' ? colors.primary.wisteriaDark : colors.text.muted} />
              <Text style={[styles.tabText, activeTab === 'visby' && styles.tabTextActive]}>Visby</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'room' && styles.tabActive]}
              onPress={() => switchTab('room')}
              activeOpacity={0.7}
            >
              <Icon name="people" size={14} color={activeTab === 'room' ? colors.primary.wisteriaDark : colors.text.muted} />
              <Text style={[styles.tabText, activeTab === 'room' && styles.tabTextActive]}>Room</Text>
              {visibleMessages.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{visibleMessages.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {activeTab === 'visby' ? (
              <VisbyChatInner
                active={visible && activeTab === 'visby'}
                onNavigateAway={handleVisbyNavigateAway}
                showNeeds={false}
              />
            ) : isChatOff ? (
              <View style={styles.chatOffState}>
                <Icon name="lock" size={40} color={colors.text.light} />
                <Text style={styles.chatOffText}>Chat is turned off</Text>
                <Caption style={styles.chatOffHint}>A parent can turn it on in Settings.</Caption>
              </View>
            ) : (
              roomChatContent
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  card: {
    backgroundColor: colors.base.cream,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xl + 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  particlesWrap: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.xs, zIndex: 1,
  },
  title: { fontSize: 18, fontFamily: 'Nunito-Bold', color: colors.text.primary },

  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(184,165,224,0.08)',
  },
  tabActive: {
    backgroundColor: colors.primary.wisteriaFaded,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.3)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.primary.wisteriaDark,
  },
  tabBadge: {
    backgroundColor: colors.primary.wisteria,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  tabContent: {
    flex: 1,
    zIndex: 1,
  },

  /* Room chat */
  messageList: { maxHeight: 240, zIndex: 1 },
  messageListContent: { paddingVertical: spacing.xs },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { fontFamily: 'Nunito-Medium', fontSize: 14, color: colors.text.muted, textAlign: 'center', paddingHorizontal: spacing.lg },

  chatOffState: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.sm },
  chatOffText: { fontSize: 16, fontWeight: '700', color: colors.text.secondary },
  chatOffHint: { fontSize: 13, color: colors.text.muted },

  bubbleRow: { marginBottom: spacing.sm, alignItems: 'flex-start' },
  bubbleRowYou: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '85%', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  bubbleYou: { backgroundColor: colors.primary.wisteria },
  bubbleOther: {},
  bubbleUsername: { marginBottom: 2, color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold', fontSize: 11 },
  bubbleText: { fontSize: 14, color: colors.text.primary },
  bubbleTextYou: { color: colors.text.inverse },
  bubbleTime: { marginTop: 2, fontSize: 10, color: colors.text.muted },

  emoteRow: { marginBottom: spacing.sm, alignItems: 'flex-start' },
  emoteRowYou: { alignItems: 'flex-end' },
  emoteUsername: { fontSize: 10, color: colors.text.muted, marginBottom: 2 },
  emoteBig: { fontSize: 36 },

  filterHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(231,76,60,0.08)', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 12, marginBottom: spacing.xs, zIndex: 1,
  },
  filterHintText: { fontSize: 12, color: colors.accent.coral, flex: 1 },

  emoteBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 6, marginBottom: spacing.xs, zIndex: 1,
  },
  emoteBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(184,165,224,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  emoteIcon: { fontSize: 20 },

  phrasesPanel: { marginBottom: spacing.xs, zIndex: 1 },
  phraseCategoryRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  phraseCategoryBtn: {
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12,
    backgroundColor: 'rgba(184,165,224,0.1)',
  },
  phraseCategoryActive: { backgroundColor: colors.primary.wisteria },
  phraseCategoryText: { fontSize: 12, fontWeight: '600', color: colors.text.muted },
  phraseCategoryTextActive: { color: colors.text.inverse },
  phraseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  phraseChip: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(184,165,224,0.2)',
  },
  phraseChipText: { fontSize: 13, fontWeight: '600', color: colors.primary.wisteriaDark },

  safeChatOnlyBar: { marginTop: spacing.xs, marginBottom: spacing.xs, zIndex: 1 },
  safeChatToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 10, borderRadius: 16,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  safeChatToggleText: { fontSize: 14, fontWeight: '600', color: colors.primary.wisteriaDark },

  phrasesToggle: { padding: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.base.parchment, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 12, marginTop: spacing.xs, zIndex: 1,
  },
  input: {
    flex: 1, fontSize: 15, color: colors.text.primary,
    paddingVertical: 6, paddingHorizontal: 4,
  },
  sendBtn: { padding: 8 },
  sendBtnDisabled: { opacity: 0.5 },
  hintText: { textAlign: 'center', marginTop: spacing.xs, color: colors.text.muted, zIndex: 1 },
});
