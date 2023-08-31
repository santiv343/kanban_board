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
  title: string | null;
};

export default function Board() {
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: crypto.randomUUID(), title: "pingo" },
    { id: crypto.randomUUID(), title: "pingo" },
    { id: crypto.randomUUID(), title: "pingo" },
  ]);
  const [items, setItems] = useState<ItemType[]>([
    {
      parent: containers[0].id,
      id: crypto.randomUUID(),
      title: "Drag me",
    },
    {
      parent: containers[1].id,
      id: crypto.randomUUID(),
      title: "Drag me 2",
    },
    {
      parent: containers[2].id,
      id: crypto.randomUUID(),
      title: "Drag me 3",
    },
  ]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-flow-col w-full space-x-8">
        {containers.map(({ id: parentId, title }) => (
          <Droppable
            handleAddTask={() => handleAddTask(parentId)}
            handleColumnNameChange={handleColumnNameChange}
            title={title}
            key={parentId}
            id={parentId}
          >
            {items.map((item) => {
              if (item.parent === parentId) {
                return (
                  <Draggable id={item.id}>
                    <div className="flex flex-col">
                      <p className="text-[8px] text-gray-500">{item.id}</p>
                      <p>{item.title}</p>
                    </div>
                  </Draggable>
                );
              }
            })}
          </Droppable>
        ))}
        <button
          onClick={handleAddColumn}
          className="flex flex-col space-y-2 h-20 bg-slate-400 p-4 rounded-lg"
        >
          Add column
        </button>
      </div>
    </DndContext>
  );

  function handleColumnNameChange(newName: string, containerId: string) {
    setContainers((containers) => {
      const newContainers = structuredClone(containers);

      const activeContainer = newContainers.findIndex(
        (container) => container.id === containerId
      );

      newContainers[activeContainer].title = newName as string;

      return newContainers;
    });
  }

  function handleAddColumn() {
    setContainers([...containers, { id: crypto.randomUUID(), title: null }]);
  }

  function handleAddTask(parentId: string) {
    setItems((items) => {
      return [
        ...items,
        { id: crypto.randomUUID(), parent: parentId, title: null },
      ];
    });
  }

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
