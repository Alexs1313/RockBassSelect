import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import Toast from 'react-native-toast-message';
import {useSlctcoreStore} from '../slctcorestrage/slctcorescontext';

const SLCTCORE_STORAGE_KEYS = {
  savedMotivation: 'slctcore.savedMotivation',
};

const SLCTCORE_MOTIVATION_TEXTS: string[] = [
  'You are already moving.',
  'A small step is a step.',
  'Continue without pressure.',
  'You choose your own pace.',
  'Don’t dwell on doubts.',
  'You can start without confidence.',
  'Do what works.',
  'You are not behind.',
  'Today’s choice is yours.',
  'You don’t need more.',
  'You are in your place.',
  'Simpler is better than nothing.',
  'Just move.',
  'Don’t wait for the perfect moment.',
  'You are coping.',
  'The choice has already been made.',
  'It is normal not to know everything.',
  'Continue at your own pace.',
  'You don’t have to rush.',
  'Every day is not from scratch.',
  'You are moving forward.',
  'Don’t underestimate this step.',
  'It makes sense for you.',
  'Give yourself a chance.',
  'That is enough.',
  'Movement is already a result.',
  'You are not here by chance.',
  'Everything is going its own way.',
  'You can continue.',
];

function slctcorePickNUnique(
  slctcoreAll: string[],
  slctcoreCount: number,
): string[] {
  const slctcoreCopy = [...slctcoreAll];
  for (let i = slctcoreCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slctcoreCopy[i], slctcoreCopy[j]] = [slctcoreCopy[j], slctcoreCopy[i]];
  }
  return slctcoreCopy.slice(0, Math.min(slctcoreCount, slctcoreCopy.length));
}

const Seltabmotvtnscr = () => {
  const navigation = useNavigation<any>();
  const {slctcoreNotificationsEnabled} = useSlctcoreStore();
  const slctcoreShown = useMemo(
    () => slctcorePickNUnique(SLCTCORE_MOTIVATION_TEXTS, 4),
    [],
  );
  const [slctcoreSavedSet, setSlctcoreSavedSet] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const slctcoreLoad = async () => {
      try {
        const raw = await AsyncStorage.getItem(
          SLCTCORE_STORAGE_KEYS.savedMotivation,
        );
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        setSlctcoreSavedSet(new Set(arr));
      } catch (e) {
        setSlctcoreSavedSet(new Set());
      }
    };
    slctcoreLoad();
  }, []);

  const onSlctcoreToggleSave = async (slctcoreText: string) => {
    const slctcoreNext = new Set(slctcoreSavedSet);
    let slctcoreAction: 'saved' | 'removed' = 'saved';
    if (slctcoreNext.has(slctcoreText)) {
      slctcoreNext.delete(slctcoreText);
      slctcoreAction = 'removed';
    } else {
      slctcoreNext.add(slctcoreText);
      slctcoreAction = 'saved';
    }
    setSlctcoreSavedSet(slctcoreNext);
    try {
      await AsyncStorage.setItem(
        SLCTCORE_STORAGE_KEYS.savedMotivation,
        JSON.stringify(Array.from(slctcoreNext)),
      );

      if (slctcoreNotificationsEnabled) {
        Toast.show({
          type: 'success',
          text1:
            slctcoreAction === 'saved'
              ? 'Motivation successfully saved!'
              : 'Motivation removed!',
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save.');
    }
  };

  const onSlctcoreShare = async (slctcoreText: string) => {
    try {
      await Share.share({message: slctcoreText});
    } catch (e) {
      Alert.alert('Error', 'Could not open share dialog.');
    }
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreMotvtnContainer}>
        <View style={styles.slctcoreMotvtnHeader}>
          <Pressable
            style={styles.slctcoreMotvtnBackBtn}
            onPress={() => navigation.goBack()}>
            <Image source={require('../../elmnts/i/slctcorsybackar.png')} />
          </Pressable>
          <Text style={styles.slctcoreMotvtnTitle}>DAILY MOTIVATION</Text>
        </View>

        <View style={styles.slctcoreMotvtnList}>
          {slctcoreShown.map(slctcoreText => {
            const slctcoreSaved = slctcoreSavedSet.has(slctcoreText);
            return (
              <View key={slctcoreText} style={styles.slctcoreMotvtnCard}>
                <View style={styles.slctcoreMotvtnCardTop}>
                  <View style={styles.slctcoreMotvtnTextWrap}>
                    <Text style={styles.slctcoreMotvtnCardTitle}>
                      Daily motivation:
                    </Text>
                    <Text style={styles.slctcoreMotvtnCardText}>
                      {slctcoreText}
                    </Text>
                  </View>
                  <View style={styles.slctcoreMotvtnActions}>
                    <Pressable
                      hitSlop={5}
                      onPress={() => onSlctcoreToggleSave(slctcoreText)}>
                      <Image
                        source={
                          slctcoreSaved
                            ? require('../../elmnts/i/slctcorsysaved.png')
                            : require('../../elmnts/i/slctcorssave.png')
                        }
                      />
                    </Pressable>
                    <Pressable
                      hitSlop={4}
                      onPress={() => onSlctcoreShare(slctcoreText)}>
                      <Image
                        source={require('../../elmnts/i/slctcorshrr.png')}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabmotvtnscr;

const styles = StyleSheet.create({
  slctcoreMotvtnContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
  },
  slctcoreMotvtnHeader: {
    width: '90%',
    height: 86,
    borderRadius: 20,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  slctcoreMotvtnBackBtn: {
    position: 'absolute',
    left: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  slctcoreMotvtnTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  slctcoreMotvtnList: {
    width: '90%',
    gap: 14,
  },
  slctcoreMotvtnCard: {
    backgroundColor: '#4C1786',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FCD3A9',
    height: 120,
    justifyContent: 'center',
  },
  slctcoreMotvtnCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slctcoreMotvtnTextWrap: {
    gap: 10,
  },
  slctcoreMotvtnCardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
  },
  slctcoreMotvtnActions: {
    alignItems: 'center',
    gap: 10,
  },
  slctcoreMotvtnHeart: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  slctcoreMotvtnHeartActive: {
    color: '#3AFFA0',
  },
  slctcoreMotvtnShare: {
    color: '#3AFFA0',
    fontSize: 18,
  },
  slctcoreMotvtnCardText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
  },
});
