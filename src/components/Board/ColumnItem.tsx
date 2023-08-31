import { useDraggable } from "@dnd-kit/core";
import { ItemType } from "./Board";

type ColumnItemType = {
  item: ItemType;
  children: (JSX.Element | undefined)[] | JSX.Element | null;
};

export function ColumnItem({ item, children }: ColumnItemType) {
  const { id } = item;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    // transition,
    // isOver,
    active,
    // isDragging,
  } = useDraggable({
    id: id,
    data: {
      type: "Item",
      item: item,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isActive = active?.id === id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex w-full min-h-[100px] p-4 bg-slate-300 rounded-lg ${
        isActive ? "shadow-2xl" : ""
      }`}
    >
      {children}
    </div>
  );
}
