import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Icon } from '../ui/Icon';
import { VisbyChatInner } from './VisbyChatInner';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const VisbyCheckInModal: React.FC<Props> = ({ visible, onClose }) => {
  const navigation = useNavigation<any>();

  const handleNavigateAway = useCallback((screen: string, params?: object) => {
    onClose();
    if (params) navigation.navigate(screen, params);
    else navigation.navigate(screen);
  }, [navigation, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Icon name="close" size={22} color={colors.text.muted} />
          </TouchableOpacity>
          <VisbyChatInner
            active={visible}
            onNavigateAway={handleNavigateAway}
            onCleanup={onClose}
          />
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
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.md,
    zIndex: 10,
    padding: spacing.xs,
  },
});
