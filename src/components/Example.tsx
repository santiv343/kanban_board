import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

export default function Example() {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState("A");
  const draggableMarkup = [
    <Draggable id="draggable">Drag me</Draggable>,
    <Draggable id="draggable2">Drag me2</Draggable>,
  ];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* {parent === null ? draggableMarkup : null} */}
      <div className="grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(200px,400px))] w-full space-x-8">
        {containers.map((id) => (
          // We updated the Droppable component so it would accept an `id`
          // prop and pass it to `useDroppable`
          <Droppable key={id} id={id}>
            {parent === id ? draggableMarkup : null}
          </Droppable>
        ))}
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
