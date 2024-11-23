import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DeleteModalProps {
  visible: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  const confirmScale = useSharedValue(1);
  const cancelScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(SCREEN_HEIGHT);
    }
  }, [visible]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const confirmButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confirmScale.value }],
  }));

  const cancelButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
  }));

  const handleConfirmPressIn = () => {
    'worklet';
    confirmScale.value = withSpring(0.95);
  };

  const handleConfirmPressOut = () => {
    'worklet';
    confirmScale.value = withSpring(1);
  };

  const handleCancelPressIn = () => {
    'worklet';
    cancelScale.value = withSpring(0.95);
  };

  const handleCancelPressOut = () => {
    'worklet';
    cancelScale.value = withSpring(1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.background, backgroundStyle]}>
          <Pressable
            style={styles.backdrop}
            onPress={onCancel}
          />
        </Animated.View>

        <Animated.View style={[styles.contentContainer, containerStyle]}>
          <View style={styles.handle} />

          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="delete" size={32} color="#FF4444" />
            </View>
          </View>

          <Text style={styles.title}>Delete Task?</Text>

          <View style={styles.warningContainer}>
            <Icon name="error" size={20} color="#FF8B00" />
            <Text style={styles.warningText}>This action cannot be undone</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            Are you sure you want to delete "{taskTitle}"?
          </Text>

          <View style={styles.buttonContainer}>
            <AnimatedPressable
              onPressIn={handleCancelPressIn}
              onPressOut={handleCancelPressOut}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton, cancelButtonStyle]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPressIn={handleConfirmPressIn}
              onPressOut={handleConfirmPressOut}
              onPress={onConfirm}
              style={[styles.button, styles.deleteButton, confirmButtonStyle]}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 12,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningText: {
    marginLeft: 8,
    color: '#FF8B00',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
