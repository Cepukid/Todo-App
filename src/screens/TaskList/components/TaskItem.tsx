import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Task } from '../../../types/task';
import { deleteTask } from '../../../store/slices/taskSlice';
import { DeleteModal } from '../../../components/modals/DeleteModal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const SWIPE_THRESHOLD = -100;

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(70);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const showModal = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    itemHeight.value = withSpring(0);
    dispatch(deleteTask(task.id));
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newTranslateX = event.translationX + context.startX;
      translateX.value = Math.min(0, newTranslateX);
    },
    onEnd: () => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withSpring(SWIPE_THRESHOLD);
        runOnJS(showModal)();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const handlePressIn = () => {
    'worklet';
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    'worklet';
    scale.value = withSpring(1);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    height: itemHeight.value,
    opacity: opacity.value,
  }));

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <AnimatedView style={[styles.container, animatedStyles]}>
          <AnimatedPressable
            style={[styles.content, task.isDone && styles.contentDone]}
            onPress={onToggle}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={[styles.checkbox, task.isDone && styles.checkboxChecked]}>
              {task.isDone && (
                <Icon name="check" size={18} color="white" />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[styles.title, task.isDone && styles.titleDone]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              {task.time && (
                <View style={styles.timeContainer}>
                  <Icon name="access-time" size={14} color="#666" />
                  <Text style={styles.time}>{task.time}</Text>
                </View>
              )}
            </View>
          </AnimatedPressable>
        </AnimatedView>
      </PanGestureHandler>

      <DeleteModal
        visible={showDeleteModal}
        taskTitle={task.title}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          translateX.value = withSpring(0);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: Math.abs(SWIPE_THRESHOLD),
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  contentDone: {
    backgroundColor: '#F8F8F8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6200ee',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#6200ee',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TaskItem;
