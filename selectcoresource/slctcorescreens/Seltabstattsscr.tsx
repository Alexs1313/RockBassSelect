import {useFocusEffect} from '@react-navigation/native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useMemo, useState} from 'react';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
import Slctcorepressbtn from '../slctcorecmpnts/Slctcorepressbtn';

const SLCTCORE_STORAGE_KEYS = {
  moments: 'slctcore.moments',
  registrationDate: 'slctcore.registrationDate',
  firstOpenAt: 'slctcore.firstOpenAt',
  statsReset: 'slctcore.statsReset',
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

function slctcoreFormatDate(ts: number) {
  const d = new Date(ts);
  return `${slctcorePad2(d.getDate())}.${slctcorePad2(
    d.getMonth() + 1,
  )}.${d.getFullYear()}`;
}

function slctcoreRandInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Seltabstattsscr = () => {
  const [slctcoreMoments, setSlctcoreMoments] = useState<SlctcoreMoment[]>([]);
  const [slctcoreRegistrationTs, setSlctcoreRegistrationTs] = useState<
    number | null
  >(null);
  const [slctcoreFirstOpenTs, setSlctcoreFirstOpenTs] = useState<number | null>(
    null,
  );
  const [slctcoreStatsReset, setSlctcoreStatsReset] = useState(false);

  const slctcoreLoad = useCallback(async () => {
    try {
      const [momentsRaw, regRaw, firstRaw, resetRaw] =
        await AsyncStorage.multiGet([
          SLCTCORE_STORAGE_KEYS.moments,
          SLCTCORE_STORAGE_KEYS.registrationDate,
          SLCTCORE_STORAGE_KEYS.firstOpenAt,
          SLCTCORE_STORAGE_KEYS.statsReset,
        ]);

      const m = momentsRaw?.[1] ? (JSON.parse(momentsRaw[1]) as any) : [];
      setSlctcoreMoments(Array.isArray(m) ? (m as SlctcoreMoment[]) : []);

      const regTs = regRaw?.[1] ? Number(regRaw[1]) : NaN;
      setSlctcoreRegistrationTs(Number.isFinite(regTs) ? regTs : null);

      let firstTs = firstRaw?.[1] ? Number(firstRaw[1]) : NaN;
      if (!Number.isFinite(firstTs)) {
        firstTs = Date.now();
        await AsyncStorage.setItem(
          SLCTCORE_STORAGE_KEYS.firstOpenAt,
          `${firstTs}`,
        );
      }
      setSlctcoreFirstOpenTs(firstTs);
      setSlctcoreStatsReset(resetRaw?.[1] === 'true');
    } catch {
      setSlctcoreMoments([]);
      setSlctcoreRegistrationTs(null);
      setSlctcoreFirstOpenTs(null);
      setSlctcoreStatsReset(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      slctcoreLoad();
    }, [slctcoreLoad]),
  );

  const slctcoreHasStats = slctcoreMoments.length > 0;

  const slctcoreComputed = useMemo(() => {
    if (slctcoreStatsReset && !slctcoreHasStats) {
      return {
        timeMinutes: 0,
        registrationDate: '00.00.0000',
        moments: 0,
        activeDays: 0,
        counts: {car: 0, flamingo: 0, fishing: 0},
      };
    }

    if (!slctcoreHasStats) {
      const demoCar = slctcoreRandInt(10, 80);
      const demoFlamingo = slctcoreRandInt(1, 30);
      const demoFishing = slctcoreRandInt(1, 30);
      const demoMoments = slctcoreRandInt(20, 900);
      const demoActiveDays = slctcoreRandInt(1, 40);
      const demoMinutes = slctcoreRandInt(1, 120);
      const demoReg =
        slctcoreRegistrationTs ??
        new Date(
          2000 + slctcoreRandInt(0, 24),
          slctcoreRandInt(0, 11),
          slctcoreRandInt(1, 28),
        ).getTime();

      return {
        timeMinutes: demoMinutes,
        registrationDate: slctcoreFormatDate(demoReg),
        moments: demoMoments,
        activeDays: demoActiveDays,
        counts: {car: demoCar, flamingo: demoFlamingo, fishing: demoFishing},
      };
    }

    const counts = slctcoreMoments.reduce(
      (acc, m) => {
        acc[m.symbolId] = (acc[m.symbolId] ?? 0) + 1;
        return acc;
      },
      {car: 0, flamingo: 0, fishing: 0} as Record<
        SlctcoreMoment['symbolId'],
        number
      >,
    );

    const activeDaySet = new Set(
      slctcoreMoments.map(m => slctcoreFormatDate(m.createdAt)),
    );

    const now = Date.now();
    const first = slctcoreFirstOpenTs ?? now;
    const minutes = Math.max(1, Math.floor((now - first) / 60000));
    const regDate = slctcoreRegistrationTs
      ? slctcoreFormatDate(slctcoreRegistrationTs)
      : slctcoreFormatDate(now);

    return {
      timeMinutes: minutes,
      registrationDate: regDate,
      moments: slctcoreMoments.length,
      activeDays: activeDaySet.size,
      counts,
    };
  }, [
    slctcoreStatsReset,
    slctcoreHasStats,
    slctcoreMoments,
    slctcoreFirstOpenTs,
    slctcoreRegistrationTs,
  ]);

  const onSlctcoreShareStats = async () => {
    const msg = `Your statistics:
Time in the app: ${slctcoreComputed.timeMinutes} m
Date of registration: ${slctcoreComputed.registrationDate}
Moments: ${slctcoreComputed.moments}
Active days: ${slctcoreComputed.activeDays} days
Car: ${slctcoreComputed.counts.car}
Flamingo: ${slctcoreComputed.counts.flamingo}
Fishing: ${slctcoreComputed.counts.fishing}`;
    await Share.share({message: msg});
  };

  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreStatsContainer}>
        <View style={styles.slctcoreStatsHeader}>
          <Text style={styles.slctcoreStatsHeaderTitle}>Your statistics</Text>
        </View>

        <View style={styles.slctcoreStatsTopRow}>
          <View style={styles.slctcoreStatsMiniCard}>
            <Text style={styles.slctcoreStatsMiniLabel}>time in the app:</Text>
            <Text style={styles.slctcoreStatsMiniValue}>
              {slctcoreComputed.timeMinutes} m
            </Text>
          </View>

          <View style={styles.slctcoreStatsMiniCard}>
            <Text style={styles.slctcoreStatsMiniLabel}>
              Date of registration:
            </Text>
            <Text
              style={[
                styles.slctcoreStatsMiniValue,
                styles.slctcoreStatsMiniValueDate,
              ]}>
              {slctcoreComputed.registrationDate}
            </Text>
          </View>
        </View>

        <View style={styles.slctcoreStatsWideCard}>
          <View style={styles.slctcoreStatsWideCol}>
            <Text style={styles.slctcoreStatsWideLabel}>Moments</Text>
            <Text style={styles.slctcoreStatsWideValue}>
              {slctcoreComputed.moments}
            </Text>
          </View>
          <View style={styles.slctcoreStatsWideCol}>
            <Text style={styles.slctcoreStatsWideLabel}>Active days</Text>
            <Text style={styles.slctcoreStatsWideValue}>
              {slctcoreComputed.activeDays} days
            </Text>
          </View>
        </View>

        <View style={styles.slctcoreStatsSymbolCard}>
          <View style={styles.slctcoreStatsSymbolLeft}>
            <Text style={styles.slctcoreStatsSymbolTitle}>Car</Text>
            <Text style={styles.slctcoreStatsSymbolHint}>
              how many times selected car
            </Text>
            <Text style={styles.slctcoreStatsSymbolValue}>
              {slctcoreComputed.counts.car}
            </Text>
          </View>
          <Image
            source={SLCTCORE_SYMBOL_IMG_BY_ID.car}
            style={styles.slctcoreStatsSymbolImgCar}
          />
        </View>

        <View style={styles.slctcoreStatsSymbolCard}>
          <View style={styles.slctcoreStatsSymbolLeft}>
            <Text style={styles.slctcoreStatsSymbolTitle}>Flamingo</Text>
            <Text style={styles.slctcoreStatsSymbolHint}>
              how many times selected flamingo
            </Text>
            <Text style={styles.slctcoreStatsSymbolValue}>
              {slctcoreComputed.counts.flamingo}
            </Text>
          </View>
          <Image
            source={SLCTCORE_SYMBOL_IMG_BY_ID.flamingo}
            style={styles.slctcoreStatsSymbolImgFlamingo}
          />
        </View>

        <Slctcorepressbtn
          style={styles.slctcoreStatsShareBtn}
          onPress={onSlctcoreShareStats}>
          <Text style={styles.slctcoreStatsShareBtnText}>Share</Text>
        </Slctcorepressbtn>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabstattsscr;

const styles = StyleSheet.create({
  slctcoreStatsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 160,
  },
  slctcoreStatsHeader: {
    width: '90%',
    height: 86,
    borderRadius: 20,
    backgroundColor: '#4C1786',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  slctcoreStatsHeaderTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 22,
  },
  slctcoreStatsTopRow: {
    width: 360,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  slctcoreStatsMiniCard: {
    flex: 1,
    backgroundColor: '#4C1786',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 92,
  },
  slctcoreStatsMiniLabel: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    marginBottom: 8,
  },
  slctcoreStatsMiniValue: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 28,
  },
  slctcoreStatsMiniValueDate: {
    fontSize: 22,
  },
  slctcoreStatsWideCard: {
    width: 360,
    backgroundColor: '#4C1786',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  slctcoreStatsWideCol: {
    flex: 1,
    alignItems: 'center',
  },
  slctcoreStatsWideLabel: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 16,
    marginBottom: 10,
  },
  slctcoreStatsWideValue: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 28,
  },
  slctcoreStatsSymbolCard: {
    width: 360,
    backgroundColor: '#4C1786',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  slctcoreStatsSymbolLeft: {
    flex: 1,
    gap: 6,
  },
  slctcoreStatsSymbolTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
  },
  slctcoreStatsSymbolHint: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    opacity: 0.9,
  },
  slctcoreStatsSymbolValue: {
    color: '#3AFFA0',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 36,
  },
  slctcoreStatsSymbolImgCar: {
    width: 110,
    height: 60,
    resizeMode: 'contain',
  },
  slctcoreStatsSymbolImgFlamingo: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
  },
  slctcoreStatsShareBtn: {
    width: 360,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#3AFFA0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  slctcoreStatsShareBtnText: {
    color: '#000000',
    fontFamily: 'Manrope-Medium',
    fontSize: 18,
  },
});
