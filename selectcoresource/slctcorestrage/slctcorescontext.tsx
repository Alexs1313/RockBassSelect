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
    const slctcoreLoadPrefs = async () => {
      try {
        const slctcoreNotificationsValue = await AsyncStorage.getItem(
          'toggleSlctcoreNotifications',
        );
        if (slctcoreNotificationsValue !== null) {
          setSlctcoreNotificationsEnabled(
            JSON.parse(slctcoreNotificationsValue),
          );
        }

        const slctcoreSoundValue = await AsyncStorage.getItem('toggleSound');
        if (slctcoreSoundValue !== null) {
          setSlctcoreNotificationsEnabled(JSON.parse(slctcoreSoundValue));
        }
      } catch {}
    };

    slctcoreLoadPrefs().catch(() => {});
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
