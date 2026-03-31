import Toast from 'react-native-toast-message';
import {useSlctcoreStore} from '../slctcorestrage/slctcorescontext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import Slctcorepressbtn from '../slctcorecmpnts/Slctcorepressbtn';

const SLCTCORE_STORAGE_KEYS = {
  nickname: 'slctcore.nickname',
  avatarUri: 'slctcore.avatarUri',
  moments: 'slctcore.moments',
  registrationDate: 'slctcore.registrationDate',
  firstOpenAt: 'slctcore.firstOpenAt',
  statsReset: 'slctcore.statsReset',
};

const Seltabproflscr = () => {
  const [slctcoreNickname, setSlctcoreNickname] = useState('NICK');
  const [slctcoreAvatarUri, setSlctcoreAvatarUri] = useState('');
  const [slctcoreCanDeleteMoments, setSlctcoreCanDeleteMoments] =
    useState(false);
  const [slctcoreCanResetStats, setSlctcoreCanResetStats] = useState(false);
  const {slctcoreNotificationsEnabled, setSlctcoreNotificationsEnabled} =
    useSlctcoreStore();

  const slctcoreLoad = useCallback(async () => {
    const [nickRaw, avatarRaw, momentsRaw, regRaw, firstOpenRaw, resetRaw] =
      await AsyncStorage.multiGet([
        SLCTCORE_STORAGE_KEYS.nickname,
        SLCTCORE_STORAGE_KEYS.avatarUri,
        SLCTCORE_STORAGE_KEYS.moments,
        SLCTCORE_STORAGE_KEYS.registrationDate,
        SLCTCORE_STORAGE_KEYS.firstOpenAt,
        SLCTCORE_STORAGE_KEYS.statsReset,
      ]);
    setSlctcoreNickname(nickRaw?.[1] || 'NICK');
    setSlctcoreAvatarUri(avatarRaw?.[1] || '');

    const slctcoreMoments = momentsRaw?.[1]
      ? (JSON.parse(momentsRaw[1]) as unknown[])
      : [];
    const slctcoreHasMoments =
      Array.isArray(slctcoreMoments) && slctcoreMoments.length > 0;
    const slctcoreHasReg = Boolean(regRaw?.[1]);
    const slctcoreHasFirstOpen = Boolean(firstOpenRaw?.[1]);
    const slctcoreIsReset = resetRaw?.[1] === 'true';

    setSlctcoreCanDeleteMoments(slctcoreHasMoments);
    setSlctcoreCanResetStats(
      slctcoreHasMoments ||
        slctcoreHasReg ||
        slctcoreHasFirstOpen ||
        !slctcoreIsReset,
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      slctcoreLoad();
    }, [slctcoreLoad]),
  );

  const onSlctcoreDeleteAllMoments = async () => {
    await AsyncStorage.removeItem(SLCTCORE_STORAGE_KEYS.moments);
    setSlctcoreCanDeleteMoments(false);
    setSlctcoreCanResetStats(
      Boolean(
        (await AsyncStorage.getItem(SLCTCORE_STORAGE_KEYS.registrationDate)) ||
          (await AsyncStorage.getItem(SLCTCORE_STORAGE_KEYS.firstOpenAt)),
      ),
    );
    if (slctcoreNotificationsEnabled) {
      Toast.show({
        type: 'success',
        text1: 'All moments successfully deleted',
      });
    }
  };

  const onSlctcoreResetStats = async () => {
    await AsyncStorage.multiRemove([
      SLCTCORE_STORAGE_KEYS.moments,
      SLCTCORE_STORAGE_KEYS.firstOpenAt,
      SLCTCORE_STORAGE_KEYS.registrationDate,
    ]);
    await AsyncStorage.setItem(SLCTCORE_STORAGE_KEYS.statsReset, 'true');
    setSlctcoreCanDeleteMoments(false);
    setSlctcoreCanResetStats(false);
    if (slctcoreNotificationsEnabled) {
      Toast.show({
        type: 'success',
        text1: 'Statistics successfully reset',
      });
    }
  };

  const toggleNotifications = async (selectedValue: boolean) => {
    Toast.show({
      text1: !slctcoreNotificationsEnabled
        ? 'Notifications turned on'
        : 'Notifications turned off',
    });

    try {
      await AsyncStorage.setItem(
        'toggleSlctcoreNotifications',
        JSON.stringify(selectedValue),
      );
      setSlctcoreNotificationsEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreProflContainer}>
        <View style={styles.slctcoreProflHeader}>
          <Text style={styles.slctcoreProflHeaderTitle}>Profile</Text>
        </View>

        <ImageBackground
          source={require('../../elmnts/i/slctcoreboard.png')}
          style={styles.slctcoreProflBoard}
          resizeMode="stretch">
          <View style={styles.slctcoreProflNickWrap}>
            <Text style={styles.slctcoreProflNickText}>{slctcoreNickname}</Text>
          </View>

          <View style={styles.slctcoreProflAvatarWrap}>
            {slctcoreAvatarUri ? (
              <Image
                source={{uri: slctcoreAvatarUri}}
                style={styles.slctcoreProflAvatar}
              />
            ) : (
              <Image source={require('../../elmnts/i/slctcorsyim.png')} />
            )}
          </View>
        </ImageBackground>

        <View style={styles.slctcoreProflSettingsCard}>
          <Text style={styles.slctcoreProflSettingsTitle}>Settings:</Text>

          <View style={styles.slctcoreProflRow}>
            <Text style={styles.slctcoreProflRowLabel}>Notifications</Text>
            <Slctcorepressbtn
              onPress={() => toggleNotifications(!slctcoreNotificationsEnabled)}
              style={[
                styles.slctcoreProflSwitchWrap,
                slctcoreNotificationsEnabled &&
                  styles.slctcoreProflSwitchWrapActive,
              ]}>
              <Text
                style={[
                  styles.slctcoreProflSwitchState,
                  slctcoreNotificationsEnabled &&
                    styles.slctcoreProflSwitchStateActive,
                ]}>
                {slctcoreNotificationsEnabled ? 'On' : 'Off'}
              </Text>

              <View
                style={[
                  styles.slctcoreProflSwitchStateDot,
                  slctcoreNotificationsEnabled &&
                    styles.slctcoreProflSwitchStateDotActive,
                ]}
              />
            </Slctcorepressbtn>
          </View>

          {/* <View style={styles.slctcoreProflRow}>
            <Text style={styles.slctcoreProflRowLabel}>Camera access</Text>
            <View style={styles.slctcoreProflSwitchWrap}>
              <Text style={styles.slctcoreProflSwitchState}>
                {slctcoreCameraAccess ? 'On' : 'Off'}
              </Text>
              <Switch
                value={slctcoreCameraAccess}
                onValueChange={setSlctcoreCameraAccess}
                trackColor={{false: '#2A1A4F', true: '#3AFFA0'}}
                thumbColor={slctcoreCameraAccess ? '#2A1A4F' : '#3AFFA0'}
              />
            </View>
          </View> */}

          <Slctcorepressbtn
            disabled={!slctcoreCanDeleteMoments}
            style={[
              styles.slctcoreProflActionBtn,
              slctcoreCanDeleteMoments && styles.slctcoreProflActionBtnActive,
              !slctcoreCanDeleteMoments &&
                styles.slctcoreProflActionBtnDisabled,
            ]}
            onPress={onSlctcoreDeleteAllMoments}>
            <Text style={styles.slctcoreProflActionBtnText}>
              Delete all moments
            </Text>
          </Slctcorepressbtn>

          <Slctcorepressbtn
            disabled={!slctcoreCanResetStats}
            style={[
              styles.slctcoreProflActionBtn,
              slctcoreCanResetStats && styles.slctcoreProflActionBtnActive,
              !slctcoreCanResetStats && styles.slctcoreProflActionBtnDisabled,
            ]}
            onPress={onSlctcoreResetStats}>
            <Text style={styles.slctcoreProflActionBtnText}>
              Reset statistics
            </Text>
          </Slctcorepressbtn>
        </View>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabproflscr;

const styles = StyleSheet.create({
  slctcoreProflContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 160,
  },
  slctcoreProflHeader: {
    width: '90%',
    height: 86,
    borderRadius: 20,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  slctcoreProflHeaderTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
  },
  slctcoreProflBoard: {
    width: 353,
    height: 333,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
    paddingVertical: 40,
    marginBottom: 18,
  },
  slctcoreProflNickWrap: {
    width: '90%',
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  slctcoreProflNickText: {
    color: '#333333',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
  slctcoreProflAvatarWrap: {
    width: '90%',
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slctcoreProflAvatar: {
    width: '100%',
    height: '100%',
  },
  slctcoreProflSettingsCard: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#4C1786',
    borderWidth: 1,
    borderColor: '#4C1786',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  slctcoreProflSettingsTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    marginBottom: 14,
  },
  slctcoreProflRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slctcoreProflRowLabel: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 12,
  },
  slctcoreProflSwitchWrap: {
    minWidth: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#3AFFA0',
    height: 41,
  },
  slctcoreProflSwitchWrapActive: {
    backgroundColor: '#3AFFA0',
  },
  slctcoreProflSwitchState: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
  },
  slctcoreProflSwitchStateActive: {
    color: '#343434',
  },
  slctcoreProflSwitchStateDot: {
    width: 26,
    height: 26,
    borderRadius: 25,
    backgroundColor: '#3AFFA0',
  },
  slctcoreProflSwitchStateDotActive: {
    backgroundColor: '#343434',
  },
  slctcoreProflActionBtn: {
    height: 60,
    borderRadius: 20,
    backgroundColor: '#53A6AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  slctcoreProflActionBtnActive: {
    backgroundColor: '#3AFFA0',
  },
  slctcoreProflActionBtnDisabled: {
    opacity: 0.65,
  },
  slctcoreProflActionBtnText: {
    color: '#1C1C1C',
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
  },
});
