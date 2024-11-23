import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  required?: boolean;
}

export const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  minimumDate,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());
  
  const scale = useSharedValue(1);
  const modalY = useSharedValue(500);
  const opacity = useSharedValue(0);

  const handleOpen = () => {
    setIsOpen(true);
    modalY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    opacity.value = withTiming(1, { duration: 200 });
  };

  const handleClose = () => {
    modalY.value = withSpring(500);
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleConfirm = () => {
    onChange(tempDate);
    handleClose();
  };

  const handlePressIn = () => {
    'worklet';
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    'worklet';
    scale.value = withSpring(1);
  };

  const getDisplayText = () => {
    if (!value) return 'Select';
    
    switch (mode) {
      case 'date':
        return format(value, 'EEEE, dd MMMM yyyy');
      case 'time':
        return format(value, 'HH:mm');
      case 'datetime':
        return format(value, 'EEEE, dd MMMM yyyy HH:mm');
    }
  };

  const getIconName = () => {
    switch (mode) {
      case 'date':
        return 'event';
      case 'time':
        return 'access-time';
      default:
        return 'event';
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <AnimatedPressable
          onPress={handleOpen}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.inputContainer, containerStyle]}
        >
          <Icon 
            name={getIconName()} 
            size={20} 
            color="#6200ee"
            style={styles.icon}
          />
          <Text style={[
            styles.value,
            !value && styles.placeholder
          ]}>
            {getDisplayText()}
          </Text>
          <Icon 
            name="arrow-drop-down" 
            size={24} 
            color="#666"
          />
        </AnimatedPressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        statusBarTranslucent
        animationType="none"
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[styles.backdrop, backdropStyle]}
            onTouchStart={handleClose}
          />
          
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'time' ? 'Select Time' : 'Select Date'}
              </Text>
              <View style={styles.modalActions}>
                <Pressable 
                  onPress={handleClose}
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  onPress={handleConfirm}
                  style={[styles.modalButton, styles.confirmButton]}
                >
                  <Text style={styles.confirmText}>Confirm</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <DatePicker
                date={tempDate}
                onDateChange={setTempDate}
                mode={mode}
                minimumDate={minimumDate}
                androidVariant="nativeAndroid"
                textColor="#000"
                fadeToColor="white"
                // Menggunakan nilai numerik untuk width
                style={{ width: SCREEN_WIDTH }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#FF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 12,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#6200ee',
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});