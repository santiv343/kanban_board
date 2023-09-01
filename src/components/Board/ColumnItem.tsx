import { useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../Icons/DeleteIcon";
import { ItemType } from "./Board";

type ColumnItemType = {
  item: ItemType;
  handleItemDelete: (itemId: string) => void;
};

export function ColumnItem({ handleItemDelete, item }: ColumnItemType) {
  const { id, title } = item;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    // isOver,
    active,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Item",
      item: item,
    },
  });

  const style = transform
    ? {
        transition,
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
      className={`flex flex-col w-full min-h-[100px] bg-slate-300 rounded-lg group ${
        isActive ? "shadow-2xl" : ""
      } ${isDragging ? "opacity-50 border-white border" : ""}`}
    >
      <div className="flex justify-between items-center rounded-t-lg p-3">
        <h6>{title}</h6>
        <button
          onClick={() => handleItemDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <DeleteIcon className="h-4 w-4 fill-red-700" />
        </button>
      </div>
      <p className="text-[8px] text-gray-500 mt-auto p-1 ">{id}</p>
    </div>
  );
}
