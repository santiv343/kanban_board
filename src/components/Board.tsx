import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

type ContainerType = {
  id: string;
  title: string | null;
};

type ItemType = {
  parent: string;
  id: string;
  title: string;
};

export default function Board() {
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: "A", title: "pingo" },
    { id: "B", title: "pingo" },
    { id: "C", title: "pingo" },
  ]);
  const [items, setItems] = useState<ItemType[]>([
    {
      parent: "A",
      id: "draggable",
      title: "Drag me",
    },
    {
      parent: "B",
      id: "draggable2",
      title: "Drag me 2",
    },
    {
      parent: "C",
      id: "draggable3",
      title: "Drag me 3",
    },
  ]);

  const addColumn = () => {
    setContainers([...containers, { id: crypto.randomUUID(), title: null }]);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-flow-col w-full space-x-8">
        {containers.map(({ id, title }) => (
          <Droppable title={title} key={id} id={id}>
            {items.map((item) => {
              if (item.parent === id) {
                return (
                  <Draggable id={item.id}>
                    <p>{item.title}</p>
                  </Draggable>
                );
              }
            })}
          </Droppable>
        ))}
        <button
          onClick={addColumn}
          className="flex flex-col space-y-2 h-20 bg-slate-400 p-4 rounded-lg"
        >
          Add column
        </button>
      </div>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over) {
      setItems((oldItems) => {
        const newItems = structuredClone(oldItems);

        const activeItemIndex = oldItems.findIndex(
          (item) => item.id === active.id
        );

        newItems[activeItemIndex].parent = over.id as string;

        return newItems;
      });
    }
  }
}
