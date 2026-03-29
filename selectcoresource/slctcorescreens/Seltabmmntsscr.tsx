import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, Share, StyleSheet, Text, View} from 'react-native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';

const SLCTCORE_STORAGE_KEYS = {
  moments: 'slctcore.moments',
};

type SlctcoreMoment = {
  id: string;
  symbolId: 'flamingo' | 'car' | 'fishing';
  text: string;
  photoUri: string;
  createdAt: number;
};

const SLCTCORE_SYMBOL_IMG_BY_ID: Record<SlctcoreMoment['symbolId'], any> = {
  flamingo: require('../../elmnts/i/slctcorsym1.png'),
  car: require('../../elmnts/i/slctcorsym2.png'),
  fishing: require('../../elmnts/i/slctcorsym3.png'),
};

function slctcorePad2(n: number) {
  return String(n).padStart(2, '0');
}

function slctcoreFormatDateTime(ts: number) {
  const d = new Date(ts);
  const date = `${slctcorePad2(d.getDate())}.${slctcorePad2(
    d.getMonth() + 1,
  )}.${d.getFullYear()}`;
  const time = `${slctcorePad2(d.getHours())}:${slctcorePad2(d.getMinutes())}`;
  return {date, time};
}

const Seltabmmntsscr = () => {
  const [slctcoreMoments, setSlctcoreMoments] = useState<SlctcoreMoment[]>([]);

  const slctcoreLoad = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SLCTCORE_STORAGE_KEYS.moments);
      const arr = raw ? (JSON.parse(raw) as SlctcoreMoment[]) : [];
      setSlctcoreMoments(Array.isArray(arr) ? arr : []);
    } catch {
      setSlctcoreMoments([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      slctcoreLoad();
    }, [slctcoreLoad]),
  );

  const slctcoreHasMoments = slctcoreMoments.length > 0;

  const slctcoreDemoMoment = useMemo<SlctcoreMoment>(
    () => ({
      id: 'demo',
      symbolId: 'flamingo',
      text: 'Do something strange, but simple, for yourself, without explanation.',
      photoUri: '',
      createdAt: Date.now(),
    }),
    [],
  );

  const slctcoreShownMoments = slctcoreHasMoments
    ? slctcoreMoments
    : [slctcoreDemoMoment];

  const onSlctcoreShareMoment = async (m: SlctcoreMoment) => {
    await Share.share({
      message: m.text,
      url: m.photoUri || undefined,
    });
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreMmntsContainer}>
        <View
          style={[
            styles.slctcoreMmntsHeader,
            slctcoreHasMoments && styles.slctcoreMmntsHeaderWhenSaved,
          ]}>
          <Text style={styles.slctcoreMmntsHeaderTitle}>Your moments</Text>
        </View>

        {!slctcoreHasMoments && (
          <>
            <Text style={styles.slctcoreMmntsSubtitle}>
              Saved solutions and{'\n'}photos just for you.
            </Text>

            <Text style={styles.slctcoreMmntsHint}>
              You will have the{'\n'}following moment:
            </Text>
          </>
        )}

        <View style={styles.slctcoreMmntsCardWrap}>
          {slctcoreShownMoments.map(m => {
            const {date, time} = slctcoreFormatDateTime(m.createdAt);
            return (
              <View
                key={m.id}
                style={[
                  styles.slctcoreMmntsCard,
                  slctcoreHasMoments && styles.slctcoreMmntsCardSaved,
                ]}>
                <View style={styles.slctcoreMmntsCardTopRow}>
                  <Text
                    style={[
                      styles.slctcoreMmntsCardText,
                      slctcoreHasMoments && styles.slctcoreMmntsCardTextSaved,
                    ]}>
                    {m.text}
                  </Text>
                  <Image
                    source={SLCTCORE_SYMBOL_IMG_BY_ID[m.symbolId]}
                    style={[
                      styles.slctcoreMmntsSymbolImg,
                      slctcoreHasMoments && styles.slctcoreMmntsSymbolImgSaved,
                    ]}
                  />
                </View>

                <View
                  style={[
                    styles.slctcoreMmntsPhotoWrap,
                    slctcoreHasMoments && styles.slctcoreMmntsPhotoWrapSaved,
                  ]}>
                  {m.photoUri ? (
                    <Image
                      source={{uri: m.photoUri}}
                      style={styles.slctcoreMmntsPhoto}
                    />
                  ) : (
                    <Image
                      source={require('../../elmnts/i/slctcorsysplaceh.jpg')}
                      style={styles.slctcoreMmntsPhoto}
                    />
                  )}
                </View>

                <View style={styles.slctcoreMmntsMetaRow}>
                  <Text
                    style={[
                      styles.slctcoreMmntsMetaText,
                      slctcoreHasMoments && styles.slctcoreMmntsMetaTextSaved,
                    ]}>
                    {slctcoreHasMoments ? date : 'Date'}
                  </Text>
                  <Text
                    style={[
                      styles.slctcoreMmntsMetaText,
                      slctcoreHasMoments && styles.slctcoreMmntsMetaTextSaved,
                    ]}>
                    {slctcoreHasMoments ? time : 'Time'}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.slctcoreMmntsShareBtn,
                    slctcoreHasMoments && styles.slctcoreMmntsShareBtnSaved,
                  ]}
                  onPress={() => onSlctcoreShareMoment(m)}>
                  <Text
                    style={[
                      styles.slctcoreMmntsShareBtnText,
                      slctcoreHasMoments &&
                        styles.slctcoreMmntsShareBtnTextSaved,
                    ]}>
                    Share
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabmmntsscr;

const styles = StyleSheet.create({
  slctcoreMmntsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 160,
  },
  slctcoreMmntsHeader: {
    width: '90%',
    height: 86,
    borderRadius: 22,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  slctcoreMmntsHeaderTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 22,
  },
  slctcoreMmntsHeaderWhenSaved: {
    marginBottom: 24,
  },
  slctcoreMmntsSubtitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 68,
    marginTop: 5,
  },
  slctcoreMmntsHint: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 14,
  },
  slctcoreMmntsCardWrap: {
    width: 360,
    alignItems: 'center',
    gap: 18,
  },
  slctcoreMmntsCard: {
    width: '80%',
    borderRadius: 22,
    backgroundColor: '#4C1786',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 20,
  },
  slctcoreMmntsCardSaved: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  slctcoreMmntsCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  slctcoreMmntsCardText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 12,
  },
  slctcoreMmntsCardTextSaved: {
    fontSize: 18,
  },
  slctcoreMmntsSymbolImg: {
    width: 40,
    height: 60,
    resizeMode: 'contain',
  },
  slctcoreMmntsSymbolImgSaved: {
    width: 54,
    height: 78,
  },
  slctcoreMmntsPhotoWrap: {
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  slctcoreMmntsPhotoWrapSaved: {
    height: 140,
    borderRadius: 18,
    marginBottom: 14,
  },
  slctcoreMmntsPhoto: {
    width: '100%',
    height: '100%',
  },
  slctcoreMmntsPhotoStub: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  slctcoreMmntsMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slctcoreMmntsMetaText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 10,
  },
  slctcoreMmntsMetaTextSaved: {
    fontSize: 12,
  },
  slctcoreMmntsShareBtn: {
    height: 46,
    borderRadius: 17,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreMmntsShareBtnSaved: {
    height: 66,
    borderRadius: 22,
  },
  slctcoreMmntsShareBtnText: {
    color: '#000000',
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
  },
  slctcoreMmntsShareBtnTextSaved: {
    fontSize: 18,
  },
});
