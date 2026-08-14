import { useEffect } from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
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
  const pathname = usePathname();
  // Practitioner Hub is an admin tool with its own header/nav
  // (app/practitioner/_layout.js), not part of the consumer app shell — it
  // shouldn't be squeezed into the 480px mobile-app frame (that's what Thea
  // was seeing by default on her PC) or need the "Web View" toggle to open
  // wide. Always render it full-bleed on web; on native it just fills the
  // screen like everything else already does. See roadmap #50.
  const isPractitionerRoute = pathname.startsWith('/practitioner');
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(c.bg);
      NavigationBar.setButtonStyleAsync(theme.statusBar === 'light' ? 'light' : 'dark');
    }
  }, [theme]);

  // Tapping a message push used to just open the app to its default screen
  // — no way to tell it landed you anywhere near the actual message. Both
  // paths below read the `data` payload notify-new-message now attaches
  // (see that function's own comment) and route straight to the thread:
  // a client always goes to /messages; a practitioner goes to that specific
  // client's Messages tab via the same ?clientId=&tab=messages deep link
  // the Dashboard and Inbox screens already use. Covers both a cold start
  // (app launched by the tap — getLastNotificationResponseAsync) and a
  // warm/background tap while the app's already running (the listener).
  useEffect(() => {
    if (Platform.OS === 'web') return; // no real push on web, nothing to catch

    function routeFromNotification(response) {
      const data = response?.notification?.request?.content?.data;
      if (data?.type !== 'message') return;
      if (data.recipientRole === 'practitioner' && data.clientId) {
        router.push({ pathname: '/practitioner', params: { clientId: data.clientId, tab: 'messages' } });
      } else if (data.recipientRole === 'client') {
        router.push('/messages');
      }
    }

    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) routeFromNotification(response);
    });
    const sub = Notifications.addNotificationResponseReceivedListener(routeFromNotification);
    return () => sub.remove();
  }, []);

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
      <Stack.Screen name="today"           options={{ headerShown: false }} />
      <Stack.Screen name="herbs"           options={{ headerShown: false }} />
      {/* legacy screens — still reachable, not in bottom nav */}
      <Stack.Screen name="journey"         options={{ headerShown: false }} />
      <Stack.Screen name="tools"           options={{ headerShown: false }} />
      <Stack.Screen name="journal"         options={{ headerShown: false }} />
      <Stack.Screen name="you"             options={{ headerShown: false }} />
      <Stack.Screen name="quiz"     options={{ headerShown: false }} />
      <Stack.Screen name="quizzes" options={{ headerShown: false }} />
      <Stack.Screen name="prakriti" options={{ headerShown: false }} />
      <Stack.Screen name="vikriti"  options={{ headerShown: false }} />
      <Stack.Screen name="prakriti-quiz" options={{ headerShown: false }} />
      <Stack.Screen name="vikriti-quiz"  options={{ headerShown: false }} />
      <Stack.Screen name="search"   options={{ headerShown: false }} />
      <Stack.Screen name="manual"   options={{ headerShown: false }} />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="activity" options={{ headerShown: false }} />
      <Stack.Screen name="result"          options={{ headerShown: false }} />
      <Stack.Screen name="recommendations" options={{ headerShown: false }} />
      <Stack.Screen name="about"           options={{ headerShown: false }} />
      <Stack.Screen name="learn"           options={{ headerShown: false }} />
      <Stack.Screen name="affirmations"    options={{ headerShown: false }} />
      <Stack.Screen name="recipes"         options={{ headerShown: false }} />
      <Stack.Screen name="breathwork"      options={{ headerShown: false }} />
      <Stack.Screen name="meditation"      options={{ headerShown: false }} />
      <Stack.Screen name="selfmassage"     options={{ headerShown: false }} />
      <Stack.Screen name="intake"       options={{ headerShown: false }} />
      <Stack.Screen name="practitioner" options={{ headerShown: false }} />
      <Stack.Screen name="guna-quiz"    options={{ headerShown: false }} />
      <Stack.Screen name="guna-result"  options={{ headerShown: false }} />
      <Stack.Screen name="agni-quiz"    options={{ headerShown: false }} />
      <Stack.Screen name="agni-result"  options={{ headerShown: false }} />
      <Stack.Screen name="tongue-check" options={{ headerShown: false }} />
      <Stack.Screen name="tongue-result" options={{ headerShown: false }} />
      <Stack.Screen name="login"        options={{ headerShown: false }} />
      <Stack.Screen name="signup"       options={{ headerShown: false }} />
      <Stack.Screen name="welcome"      options={{ headerShown: false }} />
    </Stack>
  );

  return (
    <>
      <HamburgerDrawer />
      <StatusBar style={theme.statusBar} />
      {isPractitionerRoute ? (
        <View style={isWeb ? { width: '100%', height: '100vh' } : { flex: 1 }}>
          {stack}
        </View>
      ) : isWebMode ? (
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
