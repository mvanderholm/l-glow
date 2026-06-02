import { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIEW_MODE_KEY = '@lavender-glow/view-mode';

const ViewModeContext = createContext({
  viewMode: 'app',
  setViewMode: () => {},
  isWebMode: false,
});

export function ViewModeProvider({ children }) {
  const [viewMode, setViewModeState] = useState('app');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    AsyncStorage.getItem(VIEW_MODE_KEY).then(saved => {
      if (saved === 'web' || saved === 'app') setViewModeState(saved);
    }).catch(err => console.error('ViewModeContext: AsyncStorage read failed:', err));
  }, []);

  function setViewMode(mode) {
    setViewModeState(mode);
    if (Platform.OS === 'web') AsyncStorage.setItem(VIEW_MODE_KEY, mode);
  }

  return (
    <ViewModeContext.Provider value={{
      viewMode,
      setViewMode,
      isWebMode: Platform.OS === 'web' && viewMode === 'web',
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
