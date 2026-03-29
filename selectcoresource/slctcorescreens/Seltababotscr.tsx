import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';

const Seltababotscr = () => {
  const navigation = useNavigation<any>();

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreAbotContainer}>
        <View style={styles.slctcoreAbotHeader}>
          <Pressable
            style={styles.slctcoreAbotBackBtn}
            onPress={() => navigation.goBack()}>
            <Image source={require('../../elmnts/i/slctcorsybackar.png')} />
          </Pressable>
          <Text style={styles.slctcoreAbotTitle}>ABOUT THE APP</Text>
        </View>

        <Image
          source={require('../../elmnts/i/slctcoreicon.png')}
          style={styles.slctcoreAbotLogo}
        />

        <View style={styles.slctcoreAbotTextCard}>
          <Text style={styles.slctcoreAbotText}>
            This app helps you make conscious choices in your daily life. You
            choose a few parameters, and the app generates a script without
            judgment or pressure. After you have done it, you can save the
            moment as a photo and return to it later. All data remains private,
            with no social features or public content.
          </Text>
        </View>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltababotscr;

const styles = StyleSheet.create({
  slctcoreAbotContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 80,
  },
  slctcoreAbotHeader: {
    width: '90%',
    height: 86,
    borderRadius: 20,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 44,
  },
  slctcoreAbotBackBtn: {
    position: 'absolute',
    left: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  slctcoreAbotBackText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 28,
    marginTop: -2,
  },
  slctcoreAbotTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  slctcoreAbotLogo: {
    width: 176,
    height: 176,
    resizeMode: 'contain',
    marginBottom: 34,
    borderRadius: 52,
  },
  slctcoreAbotTextCard: {
    width: 360,
    borderRadius: 22,
    backgroundColor: '#4C1786',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  slctcoreAbotText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
