import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import Toast from 'react-native-toast-message';
import Slctcorepressbtn from '../slctcorecmpnts/Slctcorepressbtn';

import {useSlctcoreStore} from '../slctcorestrage/slctcorescontext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SLCTCORE_STORAGE_KEYS = {
  savedMotivation: 'slctcore.savedMotivation',
};

const SLCTCORE_DEMO_SAVED = {
  title: 'Example motivation',
  text: "Save it so you don't forget and stay motivated.",
};

const Seltabsavdscrn = () => {
  const [slctcoreSaved, setSlctcoreSaved] = useState<string[]>([]);
  const {slctcoreNotificationsEnabled} = useSlctcoreStore();

  const slctcoreLoad = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(
        SLCTCORE_STORAGE_KEYS.savedMotivation,
      );
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      setSlctcoreSaved(Array.isArray(arr) ? arr : []);
    } catch {
      setSlctcoreSaved([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      slctcoreLoad();
    }, [slctcoreLoad]),
  );

  const slctcoreHasSaved = slctcoreSaved.length > 0;

  const slctcoreCards = useMemo(() => {
    if (!slctcoreHasSaved) {
      return [
        {
          id: 'demo',
          title: SLCTCORE_DEMO_SAVED.title,
          text: SLCTCORE_DEMO_SAVED.text,
        },
      ];
    }
    return slctcoreSaved.map((t, idx) => ({
      id: `${idx}-${t}`,
      title: 'Daily motivation:',
      text: t,
    }));
  }, [slctcoreHasSaved, slctcoreSaved]);

  const onSlctcoreShare = async (slctcoreText: string) => {
    try {
      await Share.share({message: slctcoreText});
    } catch {
      Alert.alert('Error', 'Could not open share dialog.');
    }
  };

  const onSlctcoreRemove = async (slctcoreText: string) => {
    const next = slctcoreSaved.filter(t => t !== slctcoreText);
    setSlctcoreSaved(next);
    try {
      await AsyncStorage.setItem(
        SLCTCORE_STORAGE_KEYS.savedMotivation,
        JSON.stringify(next),
      );
      if (slctcoreNotificationsEnabled) {
        Toast.show({
          type: 'success',
          text1: 'Motivation removed',
        });
      }
    } catch {
      Alert.alert('Error', 'Could not update saved list.');
    }
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreSavdContainer}>
        <View style={styles.slctcoreSavdHeader}>
          <Text style={styles.slctcoreSavdHeaderTitle}>SAVED MOTIVATION</Text>
        </View>

        <View style={styles.slctcoreSavdList}>
          {slctcoreCards.map(card => {
            const isDemo = card.id === 'demo';
            return (
              <View key={card.id} style={styles.slctcoreSavdCard}>
                <View style={styles.slctcoreSavdCardTop}>
                  <View style={styles.slctcoreSavdTextWrap}>
                    <Text style={styles.slctcoreSavdCardTitle}>
                      {card.title}
                    </Text>
                    <Text style={styles.slctcoreSavdCardText}>{card.text}</Text>
                  </View>
                  <View style={styles.slctcoreSavdCardActions}>
                    <Slctcorepressbtn
                      hitSlop={10}
                      onPress={() =>
                        isDemo ? undefined : onSlctcoreRemove(card.text)
                      }>
                      <Image
                        source={require('../../elmnts/i/slctcorsysaved.png')}
                      />
                    </Slctcorepressbtn>
                    <Slctcorepressbtn
                      hitSlop={10}
                      onPress={() => onSlctcoreShare(card.text)}>
                      <Image
                        source={require('../../elmnts/i/slctcorshrr.png')}
                      />
                    </Slctcorepressbtn>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {!slctcoreHasSaved && (
          <View style={styles.slctcoreSavdDemoImageWrap}>
            <Image
              source={require('../../elmnts/i/slctcorsym2.png')}
              style={styles.slctcoreSavdDemoImage}
            />
          </View>
        )}
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabsavdscrn;

const styles = StyleSheet.create({
  slctcoreSavdContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 160,
  },
  slctcoreSavdHeader: {
    width: '90%',
    height: 86,
    borderRadius: 20,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  slctcoreSavdHeaderTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  slctcoreSavdList: {
    width: 360,
    gap: 14,
  },
  slctcoreSavdCard: {
    backgroundColor: '#4C1786',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FCD3A9',
  },
  slctcoreSavdCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slctcoreSavdTextWrap: {
    gap: 10,
  },
  slctcoreSavdCardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
  },
  slctcoreSavdCardActions: {
    alignItems: 'center',
    gap: 16,
  },
  slctcoreSavdHeart: {
    color: '#3AFFA0',
    fontSize: 18,
  },
  slctcoreSavdShare: {
    color: '#3AFFA0',
    fontSize: 18,
  },
  slctcoreSavdCardText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    width: '80%',
  },
  slctcoreSavdDemoImageWrap: {
    width: 220,
    height: 220,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: '#3AFFA0',
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreSavdDemoImage: {
    width: 190,
    height: 120,
    resizeMode: 'contain',
  },
});
