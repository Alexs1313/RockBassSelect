import React, {useRef} from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

type Props = PressableProps & {
  slctcoreScaleTo?: number;
  slctcoreContainerStyle?: ViewStyle | ViewStyle[];
};

const Slctcorepressbtn = ({
  slctcoreScaleTo = 0.96,
  slctcoreContainerStyle,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: Props) => {
  const slctcoreScale = useRef(new Animated.Value(1)).current;

  const onSlctcorePressIn: PressableProps['onPressIn'] = e => {
    Animated.spring(slctcoreScale, {
      toValue: slctcoreScaleTo,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
    onPressIn?.(e);
  };

  const onSlctcorePressOut: PressableProps['onPressOut'] = e => {
    Animated.spring(slctcoreScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 10,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Pressable onPressIn={onSlctcorePressIn} onPressOut={onSlctcorePressOut} {...rest}>
      <Animated.View
        style={[slctcoreContainerStyle, {transform: [{scale: slctcoreScale}]}]}>
        <Animated.View style={style as any}>{children}</Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default Slctcorepressbtn;

