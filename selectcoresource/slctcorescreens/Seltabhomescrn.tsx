import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import {launchImageLibrary, type Asset} from 'react-native-image-picker';
import Slctcorepressbtn from '../slctcorecmpnts/Slctcorepressbtn';
import WebView from 'react-native-webview';

import {slctcorehtmlLoader} from '../slctcorecmpnts/Slctcoreloadde';

const SLCTCORE_STORAGE_KEYS = {
  nickname: 'slctcore.nickname',
  avatarUri: 'slctcore.avatarUri',
  symbolId: 'slctcore.symbolId',
  optionIds: 'slctcore.optionIds',
  moments: 'slctcore.moments',
  statsReset: 'slctcore.statsReset',
};

type SlctcoreSymbol = {
  id: string;
  label: string;
  image: ImageSourcePropType;
  emoji?: string;
};

type SlctcoreOption = {
  id: string;
  title: string;
};

type SlctcoreMoment = {
  id: string;
  symbolId: 'flamingo' | 'car' | 'fishing';
  text: string;
  photoUri: string;
  createdAt: number;
};

const SLCTCORE_RESULT_TEXT_BY_SYMBOL_ID: Record<string, string[]> = {
  car: [
    'Get in the car, drive without a route and take your time.',
    'Drive out of town, turn off the music and just drive.',
    'Change direction, even if you don’t know where.',
    'Drive a familiar road, but look at it differently.',
    'Stop where you’ve never stopped before.',
    'Drive at night, without a plan and without explanation.',
    'Choose a road at random and trust it.',
    'Drive out of town without thinking about coming back.',
    'Drive alone, without talking or messaging.',
    'Just drive until it’s calmer.',
  ],
  flamingo: [
    'Do something strange but simple, just for yourself.',
    'Allow yourself to be frivolous.',
    'Change your mood without changing your plans.',
    'Make choices without logic.',
    'Trust your gut feeling, not your explanation.',
    'Take it easy, even if for no reason.',
    'Do something unusual and don’t explain it.',
    'Let your day go differently.',
    'Be a little weird and don’t be ashamed of it.',
    'Choose ease over control.',
  ],
  fishing: [
    'Find a quiet place, stop and just wait.',
    'Sit and observe without trying to change anything.',
    'Spend time without a goal or result.',
    'Let events take their own pace.',
    'Focus on the process, not the end.',
    'Pause and don’t decide anything.',
    'Be in the moment, without thinking ahead.',
    'Put down your phone and look around.',
    'Allow yourself to just wait.',
    'Don’t rush events, they will come by themselves.',
  ],
};

function slctcorePickRandom<T>(arr: T[]): T | null {
  if (!arr.length) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

const Seltabhomescrn = () => {
  const navigation = useNavigation<any>();
  const slctcoreSymbols: SlctcoreSymbol[] = useMemo(
    () => [
      {
        id: 'flamingo',
        label: 'Flamingo',
        image: require('../../elmnts/i/slctcorsym1.png'),
      },
      {
        id: 'car',
        label: 'Car',
        image: require('../../elmnts/i/slctcorsym2.png'),
      },
      {
        id: 'fishing',
        label: 'Fishing',
        image: require('../../elmnts/i/slctcorsym3.png'),
      },
    ],
    [],
  );
  const slctcoreOptions: SlctcoreOption[] = useMemo(
    () => [
      {id: 'action', title: 'Action'},
      {id: 'direction', title: 'Direction'},
      {id: 'vibe', title: 'Vibe'},
      {id: 'pace', title: 'Pace'},
      {id: 'focus', title: 'Focus'},
    ],
    [],
  );

  const [slctcoreNickname, setSlctcoreNickname] = useState<string>('Nick');
  const [slctcoreAvatarUri, setSlctcoreAvatarUri] = useState<string>('');

  const [slctcoreSelectedSymbolId, setSlctcoreSelectedSymbolId] = useState<
    string | null
  >(null);
  const [slctcoreMoment, setSlctcoreMoment] = useState<Asset | null>(null);
  const [slctcoreSavedMomentId, setSlctcoreSavedMomentId] = useState<
    string | null
  >(null);
  const [slctcoreResultText, setSlctcoreResultText] = useState<string>('');
  const [slctcoreSelectedOptionIds, setSlctcoreSelectedOptionIds] = useState<
    string[]
  >([]);
  const [slctcorePhase, setSlctcorePhase] = useState<
    | 'slctcoreChooseOptions'
    | 'slctcoreChooseSymbol'
    | 'slctcoreLoading'
    | 'slctcoreResult'
  >('slctcoreChooseOptions');

  const slctcoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const slctcoreLoad = async () => {
      const [slctcoreNick, slctcoreAvatar] = await AsyncStorage.multiGet([
        SLCTCORE_STORAGE_KEYS.nickname,
        SLCTCORE_STORAGE_KEYS.avatarUri,
      ]);
      setSlctcoreNickname(slctcoreNick?.[1] || 'Nick');
      setSlctcoreAvatarUri(slctcoreAvatar?.[1] || '');
    };

    slctcoreLoad();

    return () => {
      if (slctcoreTimerRef.current) {
        clearTimeout(slctcoreTimerRef.current);
        slctcoreTimerRef.current = null;
      }
    };
  }, []);

  const slctcoreSelectedSymbol = useMemo(() => {
    return slctcoreSymbols.find(s => s.id === slctcoreSelectedSymbolId) ?? null;
  }, [slctcoreSelectedSymbolId, slctcoreSymbols]);

  const onSlctcorePickSymbol = async (slctcoreSymbolId: string) => {
    setSlctcoreSelectedSymbolId(slctcoreSymbolId);
    setSlctcoreSavedMomentId(null);
    setSlctcoreResultText(
      slctcorePickRandom(
        SLCTCORE_RESULT_TEXT_BY_SYMBOL_ID[slctcoreSymbolId] ?? [],
      ) ??
        'Do something strange, but simple, for yourself, without explanation.',
    );
    setSlctcorePhase('slctcoreLoading');
    await AsyncStorage.setItem(
      SLCTCORE_STORAGE_KEYS.symbolId,
      slctcoreSymbolId,
    );

    if (slctcoreTimerRef.current) {
      clearTimeout(slctcoreTimerRef.current);
    }
    slctcoreTimerRef.current = setTimeout(() => {
      setSlctcorePhase('slctcoreResult');
    }, 3500);
  };

  const onSlctcoreToggleOption = (slctcoreOptionId: string) => {
    setSlctcoreSelectedOptionIds(prev => {
      if (prev.includes(slctcoreOptionId)) {
        return prev.filter(id => id !== slctcoreOptionId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, slctcoreOptionId];
    });
  };

  const onSlctcoreToChooseSymbol = async () => {
    if (slctcoreSelectedOptionIds.length !== 3) {
      return;
    }
    await AsyncStorage.setItem(
      SLCTCORE_STORAGE_KEYS.optionIds,
      JSON.stringify(slctcoreSelectedOptionIds),
    );
    setSlctcorePhase('slctcoreChooseSymbol');
  };

  const onSlctcoreSkip = () => {
    if (slctcoreTimerRef.current) {
      clearTimeout(slctcoreTimerRef.current);
      slctcoreTimerRef.current = null;
    }
    setSlctcoreMoment(null);
    setSlctcoreSavedMomentId(null);
    setSlctcoreResultText('');
    setSlctcoreSelectedOptionIds([]);
    setSlctcoreSelectedSymbolId(null);
    setSlctcorePhase('slctcoreChooseOptions');
  };

  const onSlctcoreGoHome = () => {
    onSlctcoreSkip();
  };

  const onSlctcoreShareResult = async () => {
    try {
      const slctcoreText =
        slctcoreResultText ||
        'Do something strange, but simple, for yourself, without explanation.';

      // Moment is saved when photo is picked; avoid duplicates here.
      if (
        !slctcoreSavedMomentId &&
        slctcoreSelectedSymbolId &&
        slctcoreMoment?.uri
      ) {
        const slctcoreNow = Date.now();
        const slctcoreNewMoment: SlctcoreMoment = {
          id: `${slctcoreNow}`,
          symbolId: slctcoreSelectedSymbolId as SlctcoreMoment['symbolId'],
          text: slctcoreText,
          photoUri: slctcoreMoment.uri,
          createdAt: slctcoreNow,
        };

        const raw = await AsyncStorage.getItem(SLCTCORE_STORAGE_KEYS.moments);
        const prev = raw ? (JSON.parse(raw) as SlctcoreMoment[]) : [];
        const next = [slctcoreNewMoment, ...(Array.isArray(prev) ? prev : [])];
        await AsyncStorage.setItem(
          SLCTCORE_STORAGE_KEYS.moments,
          JSON.stringify(next),
        );
        setSlctcoreSavedMomentId(slctcoreNewMoment.id);
      }

      await Share.share({
        message: slctcoreText,
        url: slctcoreMoment?.uri,
      });
    } catch (e) {
      Alert.alert('Error', 'Could not open share dialog.');
    }
  };

  const onSlctcoreAddMoment = async () => {
    const slctcoreResult = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (slctcoreResult.didCancel) {
      return;
    }

    if (slctcoreResult.errorCode || slctcoreResult.errorMessage) {
      Alert.alert(
        'Error',
        slctcoreResult.errorMessage ?? 'Could not pick image',
      );
      return;
    }

    const slctcoreSelectedAsset = slctcoreResult.assets?.[0];
    if (slctcoreSelectedAsset?.uri) {
      setSlctcoreMoment(slctcoreSelectedAsset);

      // Save moment immediately after photo pick
      if (!slctcoreSavedMomentId && slctcoreSelectedSymbolId) {
        const slctcoreText =
          slctcoreResultText ||
          'Do something strange, but simple, for yourself, without explanation.';
        const slctcoreNow = Date.now();
        const slctcoreNewMoment: SlctcoreMoment = {
          id: `${slctcoreNow}`,
          symbolId: slctcoreSelectedSymbolId as SlctcoreMoment['symbolId'],
          text: slctcoreText,
          photoUri: slctcoreSelectedAsset.uri,
          createdAt: slctcoreNow,
        };

        try {
          const raw = await AsyncStorage.getItem(SLCTCORE_STORAGE_KEYS.moments);
          const prev = raw ? (JSON.parse(raw) as SlctcoreMoment[]) : [];
          const next = [
            slctcoreNewMoment,
            ...(Array.isArray(prev) ? prev : []),
          ];
          await AsyncStorage.setItem(
            SLCTCORE_STORAGE_KEYS.moments,
            JSON.stringify(next),
          );
          await AsyncStorage.setItem(SLCTCORE_STORAGE_KEYS.statsReset, 'false');
          setSlctcoreSavedMomentId(slctcoreNewMoment.id);
        } catch {
          console.log('error saving moment');
        }
      }
    }
  };

  const onSlctcoreOpenMotivation = () => {
    navigation.navigate('Seltabmotvtnscr');
  };

  const onSlctcoreOpenAbout = () => {
    navigation.navigate('Seltababotscr');
  };

  const slctcoreHeader = (
    <View style={styles.slctcoreHomeHeader}>
      <View style={styles.slctcoreHomeHeaderLeft}>
        <View style={styles.slctcoreHomeAvatarWrap}>
          {slctcoreAvatarUri ? (
            <Image
              source={{uri: slctcoreAvatarUri}}
              style={styles.slctcoreHomeAvatar}
            />
          ) : (
            <Image source={require('../../elmnts/i/slctcorsyim.png')} />
          )}
        </View>
        <Text style={styles.slctcoreHomeHello}>Hello, {slctcoreNickname}</Text>
      </View>

      <Slctcorepressbtn onPress={onSlctcoreOpenAbout}>
        <Image source={require('../../elmnts/i/slctcorsyspabt.png')} />
      </Slctcorepressbtn>
    </View>
  );

  if (slctcorePhase === 'slctcoreLoading') {
    return (
      <ImageBackground
        source={require('../../elmnts/i/slctcorelayout.png')}
        style={styles.slctcoreHomeLoaderBg}>
        <View style={styles.slctcoreHomeLoaderWrap}>
          <View style={styles.slctcoreHomeLoaderWebWrap}>
            <WebView
              originWhitelist={['*']}
              source={{html: slctcorehtmlLoader}}
              style={styles.slctcoreHomeLoaderWeb}
              scrollEnabled={false}
              transparent={true}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (slctcorePhase === 'slctcoreResult') {
    return (
      <Slctcorelayoutt>
        <View style={styles.slctcoreHomeContainer}>
          <View style={styles.slctcoreHomeCard}>
            <Image
              source={slctcoreSelectedSymbol?.image}
              style={styles.slctcoreHomeSymbolImg}
            />

            <Text style={styles.slctcoreHomeResultText}>
              {slctcoreResultText ||
                'Do something strange, but simple, for yourself, without explanation.'}
            </Text>

            <Slctcorepressbtn
              style={styles.slctcoreHomeMomentStub}
              onPress={onSlctcoreAddMoment}>
              {slctcoreMoment?.uri ? (
                <Image
                  source={{uri: slctcoreMoment.uri}}
                  style={styles.slctcoreHomeMomentImage}
                />
              ) : (
                <>
                  <Image source={require('../../elmnts/i/slctcorsyim.png')} />
                  <Text style={styles.slctcoreHomeMomentStubText}>
                    Add moment
                  </Text>
                </>
              )}
            </Slctcorepressbtn>

            {slctcoreMoment?.uri ? (
              <View style={styles.slctcoreHomeResultActionsRow}>
                <Slctcorepressbtn
                  style={styles.slctcoreHomeResultHomeBtn}
                  onPress={onSlctcoreGoHome}>
                  <Text style={styles.slctcoreHomeResultHomeBtnText}>Home</Text>
                </Slctcorepressbtn>
                <Pressable
                  style={styles.slctcoreHomeResultShareBtn}
                  onPress={onSlctcoreShareResult}>
                  <Text style={styles.slctcoreHomeResultShareBtnText}>
                    Share result
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Slctcorepressbtn
                style={styles.slctcoreHomeSkipBtn}
                onPress={onSlctcoreSkip}>
                <Text style={styles.slctcoreHomeSkipBtnText}>SKIP</Text>
              </Slctcorepressbtn>
            )}
          </View>
        </View>
      </Slctcorelayoutt>
    );
  }

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreHomeContainer}>
        {slctcoreHeader}

        {slctcorePhase === 'slctcoreChooseOptions' ? (
          <View style={styles.slctcoreHomeBoard}>
            <Text style={styles.slctcoreHomeBoardTitle}>
              Choose three options:
            </Text>

            <View style={styles.slctcoreHomeOptionsWrap}>
              {slctcoreOptions.map(option => {
                const slctcoreIsSelected = slctcoreSelectedOptionIds.includes(
                  option.id,
                );
                return (
                  <Slctcorepressbtn
                    key={option.id}
                    style={[
                      styles.slctcoreHomeOptionBtn,
                      slctcoreIsSelected &&
                        styles.slctcoreHomeOptionBtnSelected,
                    ]}
                    onPress={() => onSlctcoreToggleOption(option.id)}>
                    <Text
                      style={[
                        styles.slctcoreHomeOptionBtnText,
                        slctcoreIsSelected &&
                          styles.slctcoreHomeOptionBtnTextSelected,
                      ]}>
                      {option.title}
                    </Text>
                  </Slctcorepressbtn>
                );
              })}
            </View>

            {slctcoreSelectedOptionIds.length === 3 && (
              <View style={styles.slctcoreHomeNextWrap}>
                <Slctcorepressbtn
                  style={styles.slctcoreHomeNextBtn}
                  onPress={onSlctcoreToChooseSymbol}>
                  <Text style={styles.slctcoreHomeNextBtnText}>Next</Text>
                  <Image source={require('../../elmnts/i/slctcornxt.png')} />
                </Slctcorepressbtn>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.slctcoreHomeBoard}>
            <Text style={styles.slctcoreHomeBoardTitle}>Choose a symbol:</Text>

            <View style={styles.slctcoreHomeSymbolsRow}>
              {slctcoreSymbols.slice(0, 3).map(s => {
                const slctcoreIsSelected = s.id === slctcoreSelectedSymbolId;
                return (
                  <Pressable
                    key={s.id}
                    style={[
                      styles.slctcoreHomeSymbolBtn,
                      slctcoreIsSelected &&
                        styles.slctcoreHomeSymbolBtnSelected,
                    ]}
                    onPress={() => onSlctcorePickSymbol(s.id)}>
                    <Image
                      source={s.image}
                      style={styles.slctcoreHomeSymbolPickImg}
                    />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.slctcoreHomeSymbolsRowCenter}>
              {slctcoreSymbols.slice(2, 3).map(s => {
                const slctcoreIsSelected = s.id === slctcoreSelectedSymbolId;
                return (
                  <Pressable
                    key={s.id}
                    style={[
                      styles.slctcoreHomeSymbolBtnSmall,
                      slctcoreIsSelected &&
                        styles.slctcoreHomeSymbolBtnSelected,
                    ]}
                    onPress={() => onSlctcorePickSymbol(s.id)}>
                    <Text style={styles.slctcoreHomeSymbolEmoji}>
                      {s.emoji}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <Slctcorepressbtn
          style={styles.slctcoreHomeMotivationBtn}
          onPress={onSlctcoreOpenMotivation}>
          <Text style={styles.slctcoreHomeMotivationBtnText}>
            DAILY MOTIVATION
          </Text>
        </Slctcorepressbtn>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabhomescrn;

const styles = StyleSheet.create({
  slctcoreHomeLoaderBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeLoaderWrap: {
    alignItems: 'center',
    gap: 12,
  },
  slctcoreHomeLoaderWebWrap: {
    alignSelf: 'center',
  },
  slctcoreHomeLoaderWeb: {
    width: 260,
    height: 80,
    backgroundColor: 'transparent',
  },
  slctcoreHomeLoaderText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
  slctcoreHomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 74,
    paddingBottom: 160,
  },
  slctcoreHomeHeader: {
    width: '90%',
    borderRadius: 22,
    backgroundColor: '#4C1786',
    borderWidth: 1,
    borderColor: '#4C1786',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  slctcoreHomeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  slctcoreHomeAvatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeAvatar: {
    width: '100%',
    height: '100%',
  },
  slctcoreHomeHello: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  slctcoreHomeInfoDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeInfoDotText: {
    color: '#000000',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 14,
    marginTop: -1,
  },
  slctcoreHomeBoard: {
    width: '77%',
    borderRadius: 18,
    backgroundColor: '#4C1786',
    paddingHorizontal: 18,
    paddingTop: 26,
    borderWidth: 1,
    borderColor: '#FCD3A9',
    marginBottom: 18,
    paddingBottom: 54,
  },
  slctcoreHomeBoardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 18,
  },
  slctcoreHomeNextWrap: {
    position: 'absolute',
    right: 20,
    bottom: 15,
  },
  slctcoreHomeSymbolsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  slctcoreHomeSymbolPickImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  slctcoreHomeOptionsWrap: {
    gap: 10,
    marginTop: 5,
  },
  slctcoreHomeOptionBtn: {
    height: 48,
    width: '75%',
    borderRadius: 17,
    borderWidth: 0.8,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  slctcoreHomeOptionBtnSelected: {
    backgroundColor: '#3AFFA0',
    borderColor: '#3AFFA0',
  },
  slctcoreHomeOptionBtnText: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
  },
  slctcoreHomeOptionBtnTextSelected: {
    color: '#000000',
  },
  slctcoreHomeNextBtn: {flexDirection: 'row', alignItems: 'center', gap: 4},
  slctcoreHomeNextBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
  },
  slctcoreHomeSymbolsRowCenter: {
    alignItems: 'center',
  },
  slctcoreHomeSymbolBtn: {
    width: '45%',
    height: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  slctcoreHomeSymbolBtnSelected: {
    backgroundColor: '#3AFFA0',
  },
  slctcoreHomeSymbolEmoji: {
    fontSize: 46,
  },
  slctcoreHomeMotivationBtn: {
    width: 257,
    height: 66,
    borderRadius: 17,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeMotivationBtnText: {
    color: '#000000',
    fontFamily: 'Manrope-Medium',
    fontSize: 20,
  },
  slctcoreHomeCard: {
    width: 360,
    borderRadius: 26,
    backgroundColor: '#4C1786',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  slctcoreHomeSymbolImg: {
    width: 220,
    height: 210,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  slctcoreHomeSymbolBig: {
    fontSize: 86,
    textAlign: 'center',
    marginBottom: 10,
  },
  slctcoreHomeResultText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    marginBottom: 18,
  },
  slctcoreHomeMomentStub: {
    height: 140,
    borderRadius: 22,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  slctcoreHomeMomentImage: {
    width: '100%',
    height: '100%',
  },
  slctcoreHomeMomentStubIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  slctcoreHomeMomentStubText: {
    color: '#9A9A9A',
    fontFamily: 'Manrope-SemiBold',
    marginTop: 5,
    fontSize: 12,
  },
  slctcoreHomeSkipBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 94,
    height: 60,
    marginTop: 10,
  },
  slctcoreHomeSkipBtnText: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-Medium',
  },
  slctcoreHomeResultActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 10,
  },
  slctcoreHomeResultHomeBtn: {
    width: 100,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeResultHomeBtnText: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
  },
  slctcoreHomeResultShareBtn: {
    height: 60,
    flex: 1,

    borderRadius: 20,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreHomeResultShareBtnText: {
    color: '#000000',
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
  },
});
