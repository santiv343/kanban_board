import { useDraggable } from "@dnd-kit/core";

export type DraggableType = {
  id: string;
  children: (JSX.Element | undefined)[] | JSX.Element;
};

export function Draggable({ id, children }: DraggableType) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex w-full min-h-[100px] p-4 bg-slate-300 rounded-lg"
    >
      {children}
    </div>
  );
}
