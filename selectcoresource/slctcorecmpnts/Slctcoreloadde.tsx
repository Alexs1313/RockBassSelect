import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

import {Animated} from 'react-native';

// const av = new Animated.Value(0);
// av.addListener(() => {
//   return;
// });

export const slctcorehtmlLoader = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loader {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 8px;
    }

    .loader .dot {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      border: 2px solid #212121;
      background: #16b0c1;
      animation: jump 0.8s ease-in-out infinite alternate;
      box-sizing: border-box;
    }

    @keyframes jump {
      100% {
        background: #661e92;
        transform: translateY(-48px) scale(1.9);
      }
    }

    .loader .dot:nth-child(1) {
      animation-delay: 0.1s;
    }

    .loader .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .loader .dot:nth-child(3) {
      animation-delay: 0.3s;
    }

    .loader .dot:nth-child(4) {
      animation-delay: 0.4s;
    }

    .loader .dot:nth-child(5) {
      animation-delay: 0.5s;
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</body>
</html>`;

const Slctcoreloadde = () => {
  const navigation = useNavigation();
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.replace('Seltabonbscrn');
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        console.log('timer cleared');
      }
    };
  }, [navigation]);

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../elmnts/i/slctcorelayout.png')}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignSelf: 'center',
          }}>
          <WebView
            originWhitelist={['*']}
            source={{html: slctcorehtmlLoader}}
            style={styles.slctcorewebView}
            scrollEnabled={false}
            transparent={true}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  slctcorewebView: {
    width: 260,
    height: 80,
    backgroundColor: 'transparent',
  },
});

export default Slctcoreloadde;
