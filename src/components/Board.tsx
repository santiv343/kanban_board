import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

export default function Board() {
  
  const containers = ["A", "B", "C"];
  const [items, setItems] = useState([
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(200px,400px))] w-full space-x-8">
        {containers.map((id) => (
          <Droppable key={id} id={id}>
            {items.map((item) => {
              if (item.parent === id) {
                return <Draggable id={item.id}>{item.title}</Draggable>;
              }
            })}
          </Droppable>
        ))}
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { over, active } = event;

    if (over) {
      setItems((oldItems) => {
        const newItems = structuredClone(oldItems);

        const activeItemIndex = oldItems.findIndex(
          (item) => item.id === active.id
        );

        newItems[activeItemIndex].parent = over.id;

        return newItems;
      });
    }
  }
}
