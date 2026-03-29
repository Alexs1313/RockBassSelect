import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';

export const StoreContext = createContext<any>({});

export const useSlctcoreStore = () => {
  return useContext(StoreContext);
};

export const SlctcoreProvider = ({children}: {children: React.ReactNode}) => {
  const [slctcoreNotificationsEnabled, setSlctcoreNotificationsEnabled] =
    useState(false);

  useEffect(() => {
    const mateLogLoadPrefs = async () => {
      try {
        const mateLogNotificationsValue = await AsyncStorage.getItem(
          'toggleSlctcoreNotifications',
        );
        if (mateLogNotificationsValue !== null) {
          setSlctcoreNotificationsEnabled(
            JSON.parse(mateLogNotificationsValue),
          );
        }

        const mateLogSoundValue = await AsyncStorage.getItem('toggleSound');
        if (mateLogSoundValue !== null) {
          setSlctcoreNotificationsEnabled(JSON.parse(mateLogSoundValue));
        }
      } catch {}
    };

    mateLogLoadPrefs().catch(() => {});
  }, []);

  const contextValues = {
    slctcoreNotificationsEnabled,
    setSlctcoreNotificationsEnabled,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};
