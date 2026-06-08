import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../theme';

const THEME_KEY = '@lglow/theme';
const BRAND_KEY = '@lglow/brand';

const ThemeContext = createContext({
  theme: themes.cream,
  themeName: 'cream',
  setThemeName: () => {},
  brandStyle: 'wordmark',
  setBrandStyle: () => {},
});

export function ThemeProvider({ children }) {
  const [themeName, setThemeNameState] = useState('cream');
  const [brandStyle, setBrandStyleState] = useState('wordmark');

  // Theme toggle is currently disabled (see about.js). Reading a stale non-lavender
  // value from AsyncStorage conflicts with the lavender bg hardcoded in +html.js,
  // producing a split appearance on web. Re-enable this read when the toggle comes back.
  useEffect(() => {
    AsyncStorage.multiGet([THEME_KEY, BRAND_KEY]).then(pairs => {
      // Clear any stale theme so it doesn't conflict if the read is re-enabled later.
      if (pairs[0][1]) AsyncStorage.removeItem(THEME_KEY);
      const savedBrand = pairs[1][1];
      if (savedBrand === 'wordmark' || savedBrand === 'lettermark') setBrandStyleState(savedBrand);
    }).catch(err => console.error('ThemeContext: AsyncStorage read failed:', err));
  }, []);

  function setThemeName(name) {
    if (!themes[name]) return;
    setThemeNameState(name);
    AsyncStorage.setItem(THEME_KEY, name);
  }

  function setBrandStyle(name) {
    if (name !== 'wordmark' && name !== 'lettermark') return;
    setBrandStyleState(name);
    AsyncStorage.setItem(BRAND_KEY, name);
  }

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, setThemeName, brandStyle, setBrandStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
