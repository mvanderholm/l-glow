import { View } from 'react-native';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';

// Web-only drag-and-drop for the Practitioner Hub's question editors.
// react-native-draggable-flatlist (the original choice) turned out to be
// broken on react-native-web — it calls findNodeHandle internally, which
// react-native-web dropped support for, and the library itself looks
// unmaintained (see github.com/computerjazz/react-native-draggable-flatlist
// issues #133, #542, #543 — last merged PR was Feb 2023, the fix for this
// exact crash has sat unmerged for over a year). dnd-kit has no native
// module at all — pure DOM/pointer-events — so it's a better fit for a
// feature Matt confirmed (July 30 2026) only needs to work on web anyway.
// See ReorderableList.js for the native fallback (a plain, non-draggable
// list), picked automatically for native builds via the .web.js extension.

function SortableRow({ id, item, index, renderItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  const style = {
    ...(transform ? { transform: [{ translateX: transform.x }, { translateY: transform.y }] } : null),
    zIndex: isDragging ? 10 : 0,
    position: isDragging ? 'relative' : undefined,
  };
  return (
    <View ref={setNodeRef} style={style}>
      {renderItem({ item, index, isActive: isDragging, dragHandleProps: { listeners, attributes } })}
    </View>
  );
}

export default function ReorderableList({ data, keyExtractor, onDragEnd, renderItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = data.map(keyExtractor);

  function handleEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    onDragEnd({ data: arrayMove(data, oldIndex, newIndex) });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {data.map((item, index) => (
          <SortableRow key={keyExtractor(item)} id={keyExtractor(item)} item={item} index={index} renderItem={renderItem} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
