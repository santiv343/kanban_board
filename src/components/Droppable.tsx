import { useDroppable } from "@dnd-kit/core";

export type DroppableType = {
  id: string;
  title: string | null;
  children: (JSX.Element | undefined)[] | JSX.Element;
};

export function Droppable({ id, title, children }: DroppableType) {
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
      <input
        style={{ all: "unset" }}
        defaultValue={title ? title : "Add title"}
        className={`my-2 w-fit ${!title && "text-gray-600"}`}
      />

      {children}
    </div>
  );
}
