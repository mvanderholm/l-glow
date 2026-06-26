import { useEffect } from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ViewModeProvider, useViewMode } from '../context/ViewModeContext';
import { DrawerProvider } from '../context/DrawerContext';
import { AuthProvider } from '../context/AuthContext';
import LogoMark from '../components/LogoMark';
import WebLayout from '../components/WebLayout';
import BottomNav from '../components/BottomNav';
import HamburgerDrawer from '../components/HamburgerDrawer';

function HeaderLogo() {
  return <LogoMark size={36} compact />;
}

function WebViewToggle() {
  const { setViewMode } = useViewMode();
  const { theme: { colors: c, radius } } = useTheme();
  return (
    <Pressable
      onPress={() => setViewMode('web')}
      style={{
        marginRight: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: c.border,
      }}
    >
      <Text style={{ color: c.textMuted, fontSize: 12, fontWeight: '600' }}>Web View</Text>
    </Pressable>
  );
}

function AppNavigator() {
  const { theme, theme: { colors: c } } = useTheme();
  const { isWebMode } = useViewMode();
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(c.bg);
      NavigationBar.setButtonStyleAsync(theme.statusBar === 'light' ? 'light' : 'dark');
    }
  }, [theme]);

  const stack = (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.bg },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: c.bg },
        headerShadowVisible: false,
        headerTitle: HeaderLogo,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerShown: !isWebMode,
        headerRight: isWeb && !isWebMode ? () => <WebViewToggle /> : undefined,
      }}
    >
      <Stack.Screen name="index"           options={{ headerShown: false }} />
      <Stack.Screen name="lifestyle"       options={{ headerShown: false }} />
      <Stack.Screen name="movement"        options={{ headerShown: false }} />
      <Stack.Screen name="nourishment"     options={{ headerShown: false }} />
      <Stack.Screen name="checkin"         options={{ headerShown: false }} />
      {/* legacy screens — still reachable, not in bottom nav */}
      <Stack.Screen name="journey"         options={{ headerShown: false }} />
      <Stack.Screen name="tools"           options={{ headerShown: false }} />
      <Stack.Screen name="journal"         options={{ headerShown: false }} />
      <Stack.Screen name="you"             options={{ headerShown: false }} />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="result" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="about" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="affirmations" />
      <Stack.Screen name="herbs" />
      <Stack.Screen name="recipes" />
      <Stack.Screen name="breathwork" />
      <Stack.Screen name="meditation" />
      <Stack.Screen name="selfmassage" />
      <Stack.Screen name="intake"      options={{ headerShown: false }} />
      <Stack.Screen name="guna-quiz"   options={{ headerShown: false }} />
      <Stack.Screen name="guna-result" options={{ headerShown: false }} />
      <Stack.Screen name="agni-quiz"   options={{ headerShown: false }} />
      <Stack.Screen name="agni-result" options={{ headerShown: false }} />
      <Stack.Screen name="login"       options={{ headerShown: false }} />
      <Stack.Screen name="signup"      options={{ headerShown: false }} />
    </Stack>
  );

  return (
    <>
      <HamburgerDrawer />
      <StatusBar style={theme.statusBar} />
      {isWebMode ? (
        <View style={{ width: '100%', height: '100vh' }}>
          <WebLayout>{stack}</WebLayout>
        </View>
      ) : (
        <View style={isWeb
          ? { width: '100%', height: '100vh', alignItems: 'center', backgroundColor: c.bg }
          : { flex: 1 }
        }>
          <View style={isWeb
            ? { width: '100%', maxWidth: 480, height: '100vh', flexDirection: 'column' }
            : { flex: 1, flexDirection: 'column' }
          }>
            <View style={{ flex: 1 }}>{stack}</View>
            <BottomNav />
          </View>
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ViewModeProvider>
        <AuthProvider>
          <DrawerProvider>
            <AppNavigator />
          </DrawerProvider>
        </AuthProvider>
      </ViewModeProvider>
    </ThemeProvider>
  );
}
