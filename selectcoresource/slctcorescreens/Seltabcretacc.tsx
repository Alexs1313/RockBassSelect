import React, {useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, type Asset} from 'react-native-image-picker';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import Slctcorepressbtn from '../slctcorecmpnts/Slctcorepressbtn';

const SLCTCORE_STORAGE_KEYS = {
  nickname: 'slctcore.nickname',
  avatarUri: 'slctcore.avatarUri',
  registrationDate: 'slctcore.registrationDate',
  statsReset: 'slctcore.statsReset',
};

const Seltabcretacc = () => {
  const navigation = useNavigation<any>();
  const [slctcoreNickname, setSlctcoreNickname] = useState('');
  const [slctcoreAvatar, setSlctcoreAvatar] = useState<Asset | null>(null);
  const slctcoreBtnShakeX = useRef(new Animated.Value(0)).current;

  const onSlctcoreShakeContinueBtn = () => {
    Animated.sequence([
      Animated.timing(slctcoreBtnShakeX, {
        toValue: 10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(slctcoreBtnShakeX, {
        toValue: -10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(slctcoreBtnShakeX, {
        toValue: 8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slctcoreBtnShakeX, {
        toValue: -8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slctcoreBtnShakeX, {
        toValue: 0,
        duration: 35,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slctcoreCretaccContinueAnimStyle = {
    transform: [{translateX: slctcoreBtnShakeX}],
  };

  const onSlctcorePickAvatar = async () => {
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
        slctcoreResult.errorMessage ?? 'Could not open photo library.',
      );
      return;
    }

    const slctcoreSelectedAsset = slctcoreResult.assets?.[0];
    if (slctcoreSelectedAsset?.uri) {
      setSlctcoreAvatar(slctcoreSelectedAsset);
    }
  };

  const onSlctcoreContinue = async () => {
    const slctcoreTrimmedNickname = slctcoreNickname.trim();
    if (!slctcoreTrimmedNickname) {
      onSlctcoreShakeContinueBtn();
      return;
    }

    try {
      const slctcoreNow = Date.now();
      await AsyncStorage.multiSet([
        [SLCTCORE_STORAGE_KEYS.nickname, slctcoreTrimmedNickname],
        [SLCTCORE_STORAGE_KEYS.avatarUri, slctcoreAvatar?.uri ?? ''],
        [SLCTCORE_STORAGE_KEYS.registrationDate, `${slctcoreNow}`],
        [SLCTCORE_STORAGE_KEYS.statsReset, 'false'],
      ]);

      navigation.replace('Seltabroutes' as never);
    } catch (e) {
      Alert.alert('Error', 'Could not save your data.');
    }
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreCretaccContainer}>
        <View style={styles.slctcoreCretaccTitleWrap}>
          <Image
            source={require('../../elmnts/i/slctcoreicon.png')}
            style={styles.slctcoreCretaccTitleIconImg}
          />
          <Text style={styles.slctcoreCretaccTitle}>CREATE PROFILE</Text>
        </View>

        <Text style={styles.slctcoreCretaccSubtitle}>
          We do not publish content or create public profiles.
        </Text>

        <ImageBackground
          source={require('../../elmnts/i/slctcoreboard.png')}
          style={styles.slctcoreCretaccBoard}
          resizeMode="stretch">
          <TextInput
            value={slctcoreNickname}
            onChangeText={setSlctcoreNickname}
            placeholder="NICKNAME"
            placeholderTextColor="#B0B0B0"
            style={styles.slctcoreCretaccInput}
            maxLength={15}
          />

          <Pressable
            style={styles.slctcoreCretaccAvatarPicker}
            onPress={onSlctcorePickAvatar}>
            {slctcoreAvatar?.uri ? (
              <Image
                source={{uri: slctcoreAvatar.uri}}
                style={styles.slctcoreCretaccAvatarPreview}
              />
            ) : (
              <View style={styles.slctcoreCretaccAvatarPlaceholder}>
                <Image source={require('../../elmnts/i/slctcorsyim.png')} />
                <Text style={styles.slctcoreCretaccAvatarPlaceholderText}>
                  ADD PHOTO
                </Text>
              </View>
            )}
          </Pressable>
        </ImageBackground>

        <Animated.View
          style={[
            styles.slctcoreCretaccContinueWrap,
            slctcoreCretaccContinueAnimStyle,
          ]}>
          <Slctcorepressbtn
            slctcoreContainerStyle={styles.slctcoreCretaccContinueBtnWrap}
            style={styles.slctcoreCretaccContinueBtn}
            onPress={onSlctcoreContinue}>
            <Text style={styles.slctcoreCretaccContinueText}>Continue</Text>
          </Slctcorepressbtn>
        </Animated.View>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabcretacc;

const styles = StyleSheet.create({
  slctcoreCretaccContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  slctcoreCretaccTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 22,
  },
  slctcoreCretaccTitleIconImg: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },
  slctcoreCretaccTitleIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#B480F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreCretaccTitleIcon: {
    fontSize: 28,
  },
  slctcoreCretaccTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
  },
  slctcoreCretaccSubtitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 10,
    marginBottom: 12,
    marginTop: 10,
  },
  slctcoreCretaccBoard: {
    width: 353,
    height: 333,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingVertical: 40,
    marginBottom: 50,
  },
  slctcoreCretaccInput: {
    width: '90%',
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    marginBottom: 16,
  },
  slctcoreCretaccAvatarPicker: {
    width: '90%',
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  slctcoreCretaccAvatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreCretaccAvatarPlaceholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  slctcoreCretaccAvatarPlaceholderText: {
    color: '#9E9E9E',
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    marginTop: 10,
  },
  slctcoreCretaccAvatarPreview: {
    width: '100%',
    height: '100%',
  },
  slctcoreCretaccContinueBtn: {
    width: 260,
    height: 72,
    borderRadius: 44,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreCretaccContinueBtnWrap: {
    width: 260,
  },
  slctcoreCretaccContinueWrap: {
    width: 260,
  },
  slctcoreCretaccContinueText: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'Manrope-SemiBold',
  },
});
