import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useRef} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import Seltabhomescrn from './selectcoresource/slctcorescreens/Seltabhomescrn';
import Seltabmmntsscr from './selectcoresource/slctcorescreens/Seltabmmntsscr';
import Seltabstattsscr from './selectcoresource/slctcorescreens/Seltabstattsscr';
import Seltabproflscr from './selectcoresource/slctcorescreens/Seltabproflscr';
import Seltabsavdscrn from './selectcoresource/slctcorescreens/Seltabsavdscrn';

const Tab = createBottomTabNavigator();

const AnimatedTabButton = (props: Record<string, unknown>) => {
  const {children, style, onPress, onLongPress, ...rest} = props;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress as () => void}
      onLongPress={onLongPress as (() => void) | undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style as ViewStyle, styles.totemGuidetabButton]}
      {...rest}>
      <Animated.View
        style={[styles.totemGuidetabButtonInner, {transform: [{scale}]}]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
};

const Seltabroutes = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.totemGuidetabBar],
        tabBarActiveTintColor: '#555555',
        tabBarButton: props => (
          <AnimatedTabButton {...(props as Record<string, unknown>)} />
        ),
        tabBarBackground: () => <View style={StyleSheet.absoluteFill}></View>,
      }}>
      <Tab.Screen
        name="Seltabhomescrn"
        component={Seltabhomescrn}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.totemGuidetabIconWrap}>
              <Image
                source={require('./elmnts/i/slctcoretabb1.png')}
                tintColor={focused ? '#3AFFA0' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Seltabmmntsscr"
        component={Seltabmmntsscr}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.totemGuidetabIconWrap}>
              <Image
                source={require('./elmnts/i/slctcoretabb2.png')}
                tintColor={focused ? '#3AFFA0' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Seltabstattsscr"
        component={Seltabstattsscr}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.totemGuidetabIconWrap}>
              <Image
                source={require('./elmnts/i/slctcoretabb3.png')}
                tintColor={focused ? '#3AFFA0' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Seltabproflscr"
        component={Seltabproflscr}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.totemGuidetabIconWrap}>
              <Image
                source={require('./elmnts/i/slctcoretabb4.png')}
                tintColor={focused ? '#3AFFA0' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Seltabsavdscrn"
        component={Seltabsavdscrn}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.totemGuidetabIconWrap}>
              <Image
                source={require('./elmnts/i/slctcoretabb5.png')}
                tintColor={focused ? '#3AFFA0' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  totemGuidetabButton: {
    flex: 1,
  },
  totemGuidetabButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totemGuidetabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totemGuidetabDot: {
    width: 24,
    height: 2,
    borderRadius: 25,
    backgroundColor: '#57C1FF',
    position: 'absolute',
    top: 28,
  },
  totemGuidetabBar: {
    marginHorizontal: 63,
    elevation: 0,
    paddingTop: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 10,
    borderColor: '#FCD3A9',
    borderTopWidth: 1,
    borderTopColor: '#FCD3A9',
    backgroundColor: '#4C1786',
    borderRadius: 22,
    height: 91,
    paddingBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
});

export default Seltabroutes;
