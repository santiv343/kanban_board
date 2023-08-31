import { useSortable } from "@dnd-kit/sortable";
import AddIcon from "../Icons/AddIcon";
import { ContainerType } from "./Board";
import DragIcon from "../Icons/DragIcon";

type ColumnType = {
  container: ContainerType;
  children: (JSX.Element | undefined)[] | JSX.Element | null;
  handleAddTask: () => void;
  handleColumnNameChange: (newName: string, id: string) => void;
};

export function Column({
  container,
  children,
  handleAddTask,
  handleColumnNameChange,
}: ColumnType) {
  const { id, title } = container;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    isOver,
    active,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Column",
      container: container,
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
      className={`flex flex-col space-y-2 min-h-[200px] h-fit min-w-[300px] max-w-[400px] bg-slate-400 p-4 rounded-lg ${
        isOver ? "border-2 border-slate-200" : ""
      } ${isActive ? "shadow-2xl" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex justify-between items-center">
        <input
          onChange={(e) => handleColumnNameChange(e.target.value, id)}
          style={{ all: "unset" }}
          defaultValue={title ? title : "Add title"}
          className={`my-2 w-fit ${!title && "text-gray-600"}`}
        />
        <button {...attributes} {...listeners}>
          <DragIcon className="h-8 w-8 stroke-black" />
        </button>
      </div>

      {children}

      <button
        onClick={handleAddTask}
        className="flex justify-center items-center space-x-2 h-fit bg-slate-400 py-4 rounded-lg w-fit"
      >
        <AddIcon className="h-6 w-6 fill-none stroke-black stroke-1" />
        <p>Add task</p>
      </button>
      <p className="text-[8px] text-gray-500 mt-auto">{id}</p>
    </div>
  );
}
