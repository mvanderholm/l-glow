import { View } from 'react-native';

// Native fallback — no drag-and-drop dependency exists for native here (see
// ReorderableList.web.js's header comment for why). Matt's call, July 30
// 2026: reordering is a web-only feature of the Practitioner Hub, since
// that's where Thea actually does this kind of editing. Metro picks this
// file automatically for iOS/Android builds via the .web.js extension
// convention — no Platform.OS branching needed, and no risk of the web-only
// drag library ever being bundled into a native build.
export default function ReorderableList({ data, keyExtractor, renderItem }) {
  return data.map((item, index) => (
    <View key={keyExtractor(item)}>
      {renderItem({ item, index, isActive: false, dragHandleProps: null })}
    </View>
  ));
}
