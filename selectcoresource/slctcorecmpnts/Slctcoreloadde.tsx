import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

import {Animated} from 'react-native';

// const av = new Animated.Value(0);
// av.addListener(() => {
//   return;
// });

export const slctcorehtmlLoader = `   <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
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

          .loading-wave {
            width: 300px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
          }

          .loading-bar {
            width: 20px;
            height: 10px;
            margin: 0 5px;
            background-color: #3498db;
            border-radius: 5px;
            animation: loading-wave-animation 1s ease-in-out infinite;
          }

          .loading-bar:nth-child(2) {
            animation-delay: 0.1s;
          }

          .loading-bar:nth-child(3) {
            animation-delay: 0.2s;
          }

          .loading-bar:nth-child(4) {
            animation-delay: 0.3s;
          }

          @keyframes loading-wave-animation {
            0% {
              height: 10px;
            }

            50% {
              height: 50px;
            }

            100% {
              height: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="loading-wave">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
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
