import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import colors from '../../../constants/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showAddButton = false,
  onAddPress,
}) => {
  const navigation = useNavigation();
  const addButtonScale = useSharedValue(1);

  const onPressIn = () => {
    'worklet';
    addButtonScale.value = withSpring(0.9);
  };

  const onPressOut = () => {
    'worklet';
    addButtonScale.value = withSpring(1);
  };

  const addButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightContainer}>
          {showAddButton && (
            <AnimatedTouchable
              onPress={onAddPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={[styles.addButton, addButtonStyle]}
            >
              <Icon name="add" size={24} color={colors.background} />
              <Text style={styles.addButtonText}>New Task</Text>
            </AnimatedTouchable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    height: Platform.OS === 'ios' ? 44 : 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: -8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.background,
  },
});
