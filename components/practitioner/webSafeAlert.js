import { Alert, Platform } from 'react-native';

// react-native-web's Alert.alert is a total no-op — see
// node_modules/react-native-web/src/exports/Alert/index.js: `static alert()
// {}`. Every Alert.alert call in the Practitioner Hub was silently invisible
// whenever used on web, which is the Hub's actual primary context (see
// app/practitioner/_layout.js's own "shouldn't be squeezed into the mobile
// frame" comment). Found July 30 2026 chasing a "the button does nothing"
// report on the Danger Zone's deactivate button — turned out to affect
// every save/delete/validation alert across the whole Hub, not just that one.

export function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

// Returns a Promise<boolean> — true if the confirm/destructive button was
// chosen, false if cancelled. Covers both call shapes already in use here:
// fire-and-forget (`confirmAsync(...).then(ok => { if (ok) ... })`) and
// awaited (`if (!(await confirmAsync(...))) return;`).
export function confirmAsync(title, message, confirmLabel = 'Delete') {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise(resolve => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
