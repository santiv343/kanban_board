import { useDroppable } from "@dnd-kit/core";
import { DraggableType } from "./Draggable";

type DroppableType = DraggableType & {
  title: string | null;
  handleAddTask: () => void;
  handleColumnNameChange: (newName: string, id: string) => void;
};

export function Droppable({
  id,
  title,
  children,
  handleAddTask,
  handleColumnNameChange,
}: DroppableType) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col space-y-2 min-h-[300px] h-fit min-w-[200px] bg-slate-400 p-4 rounded-lg transition-all"
    >
      <p className="text-[8px] text-gray-500">{id}</p>
      <input
        onChange={(e) => handleColumnNameChange(e.target.value, id)}
        style={{ all: "unset" }}
        defaultValue={title ? title : "Add title"}
        className={`my-2 w-fit ${!title && "text-gray-600"}`}
      />

      {children}

      <button onClick={handleAddTask}>Add task</button>
    </div>
  );
}
