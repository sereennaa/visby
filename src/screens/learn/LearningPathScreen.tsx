import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { LEARNING_PATH_NODES, getPathTiers } from '../../config/learningPaths';
import { getDueCount } from '../../services/spacedRepetition';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import type { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NODE_SIZE = 64;
const TIER_GAP = 28;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LearningPath'>;
};

const NODE_ICON_MAP: Record<string, IconName> = {
  chat: 'chat',
  quiz: 'quiz',
  cards: 'cards',
  globe: 'globe',
  flag: 'flag',
  map: 'map',
  temple: 'temple',
  food: 'food',
  cooking: 'food',
  language: 'language',
  landmark: 'landmark',
  culture: 'culture',
  sort: 'filter',
  history: 'history',
  book: 'book',
  outfit: 'shirt',
  treasure: 'sparkles',
};

export const LearningPathScreen: React.FC<Props> = ({ navigation }) => {
  const { lessonProgress, completedPathNodes } = useStore();

  const completedNodeIds = useMemo(() => {
    const ids = new Set<string>(completedPathNodes);
    for (const lp of lessonProgress) {
      if (lp.completed) {
        const node = LEARNING_PATH_NODES.find(
          (n) => n.routeParams?.lessonId === lp.lessonId || n.id === lp.lessonId,
        );
        if (node) ids.add(node.id);
      }
    }
    return ids;
  }, [lessonProgress, completedPathNodes]);

  const tiers = useMemo(() => getPathTiers(), []);

  const getNodeStatus = (nodeId: string, requires: string[]): 'completed' | 'available' | 'locked' => {
    if (completedNodeIds.has(nodeId)) return 'completed';
    if (requires.every((r) => completedNodeIds.has(r))) return 'available';
    return 'locked';
  };

  const handleNodePress = (node: typeof LEARNING_PATH_NODES[0]) => {
    const status = getNodeStatus(node.id, node.requires);
    if (status === 'locked') return;
    navigation.navigate(node.routeName as any, { ...node.routeParams, pathNodeId: node.id } as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.wisteriaFaded, colors.calm.skyLight, colors.base.cream]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles count={6} variant="sparkle" opacity={0.1} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3} style={styles.headerTitle}>Learning Path</Heading>
          <View style={{ width: 40 }} />
        </View>

        <Caption style={styles.subtitle}>
          Complete activities to unlock the next step on your journey!
        </Caption>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tiers.map((tier, tierIndex) => (
            <Animated.View
              key={tierIndex}
              entering={FadeInDown.duration(400).delay(tierIndex * 80)}
              style={styles.tierRow}
            >
              {tierIndex > 0 && (
                <View style={styles.connectorLine} />
              )}
              <View style={styles.nodesRow}>
                {tier.map((node) => {
                  const status = getNodeStatus(node.id, node.requires);
                  const isCompleted = status === 'completed';
                  const isAvailable = status === 'available';
                  const isLocked = status === 'locked';
                  const iconName = NODE_ICON_MAP[node.icon] || 'sparkles';

                  return (
                    <Animated.View
                      key={node.id}
                      entering={ZoomIn.duration(300).delay(tierIndex * 80 + 50)}
                    >
                      <TouchableOpacity
                        style={[
                          styles.nodeCircle,
                          isCompleted && styles.nodeCompleted,
                          isAvailable && styles.nodeAvailable,
                          isLocked && styles.nodeLocked,
                        ]}
                        onPress={() => handleNodePress(node)}
                        disabled={isLocked}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`${node.title} - ${status}`}
                      >
                        {isCompleted && (
                          <View style={styles.checkBadge}>
                            <Icon name="check" size={12} color="#FFF" />
                          </View>
                        )}
                        <Icon
                          name={iconName}
                          size={28}
                          color={
                            isCompleted
                              ? '#FFF'
                              : isAvailable
                              ? colors.primary.wisteriaDark
                              : colors.text.light
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.nodeLabel,
                          isLocked && styles.nodeLabelLocked,
                        ]}
                        numberOfLines={2}
                      >
                        {node.title}
                      </Text>
                      {isLocked && (
                        <Icon
                          name="lock"
                          size={12}
                          color={colors.text.light}
                          style={styles.lockIcon}
                        />
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center' },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.text.secondary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  tierRow: {
    alignItems: 'center',
    marginBottom: TIER_GAP,
    width: '100%',
  },
  connectorLine: {
    width: 3,
    height: 24,
    backgroundColor: colors.primary.wisteriaLight,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  nodesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  nodeCircle: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary.wisteriaLight,
    backgroundColor: colors.surface.card,
  },
  nodeCompleted: {
    backgroundColor: colors.success.emerald,
    borderColor: colors.success.emerald,
  },
  nodeAvailable: {
    borderColor: colors.primary.wisteriaDark,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  nodeLocked: {
    borderColor: colors.text.light + '40',
    backgroundColor: colors.surface.card + '80',
    opacity: 0.5,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nodeLabel: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 80,
  },
  nodeLabelLocked: {
    color: colors.text.light,
  },
  lockIcon: {
    alignSelf: 'center',
    marginTop: 2,
  },
  bottomSpacer: { height: 100 },
});

export default LearningPathScreen;
