import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { ColumnItem } from "./ColumnItem";
import { Column } from "./Column";
import AddIcon from "../Icons/AddIcon";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export type ContainerType = {
  id: string;
  title: string | null;
};

export type ItemType = {
  parent: string;
  id: string;
  title: string | null;
};

// const mockContainers = [
//   { id: crypto.randomUUID(), title: "pingo" },
//   { id: crypto.randomUUID(), title: "pingo" },
//   { id: crypto.randomUUID(), title: "pingo" },
// ];

// const mockItems = [
//   {
//     parent: mockContainers[0].id,
//     id: crypto.randomUUID(),
//     title: "Drag me",
//   },
//   {
//     parent: mockContainers[1].id,
//     id: crypto.randomUUID(),
//     title: "Drag me 2",
//   },
//   {
//     parent: mockContainers[2].id,
//     id: crypto.randomUUID(),
//     title: "Drag me 3",
//   },
// ];

export default function Board() {
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const containersId = useMemo(
    () => containers.map((containers) => containers.id),
    [containers]
  );
  const [items, setItems] = useState<ItemType[]>([]);
  const itemsId = useMemo(() => items.map((items) => items.id), [items]);

  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null
  );
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-flow-col space-x-8">
        <SortableContext items={containersId}>
          {containers?.map((container) => (
            <Column
              handleAddTask={() => handleAddTask(container.id)}
              handleColumnNameChange={handleColumnNameChange}
              key={container.id}
              container={container}
            >
              {items &&
                items?.map((item) => {
                  if (item.parent === container.id) {
                    return (
                      <ColumnItem item={item}>
                        <div className="flex flex-col">
                          <p>{item.title}</p>
                          <p className="text-[8px] text-gray-500 mt-auto">
                            {item.id}
                          </p>
                        </div>
                      </ColumnItem>
                    );
                  }
                })}
            </Column>
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeContainer ? (
              <Column
                handleAddTask={() => handleAddTask(activeContainer.id)}
                handleColumnNameChange={handleColumnNameChange}
                key={activeContainer.id}
                container={activeContainer}
              >
                <SortableContext items={itemsId}>
                  {items &&
                    items?.map((item) => {
                      if (item.parent === activeContainer.id) {
                        return (
                          <ColumnItem item={item}>
                            <div className="flex flex-col">
                              <p>{item.title}</p>
                              <p className="text-[8px] text-gray-500 mt-auto">
                                {item.id}
                              </p>
                            </div>
                          </ColumnItem>
                        );
                      }
                    })}
                </SortableContext>
              </Column>
            ) : activeItem ? (
              <ColumnItem item={activeItem}>
                <div className="flex flex-col">
                  <p>{activeItem.title}</p>
                  <p className="text-[8px] text-gray-500 mt-auto">
                    {activeItem.id}
                  </p>
                </div>
              </ColumnItem>
            ) : null}
          </DragOverlay>,
          document.body
        )}

        <button
          onClick={handleAddColumn}
          className="flex justify-center items-center space-x-2 h-fit bg-slate-400 p-4 rounded-lg w-fit"
        >
          <AddIcon className="h-8 w-8 fill-none stroke-black stroke-1" />
          <p>Add column</p>
        </button>
      </div>
    </DndContext>
  );

  function handleColumnNameChange(newName: string, containerId: string) {
    setContainers((containers) => {
      const newContainers = structuredClone(containers);

      const activeContainer = newContainers?.findIndex(
        (container) => container.id === containerId
      );

      if (newContainers && activeContainer !== -1) {
        newContainers[activeContainer].title = newName as string;
      }

      return newContainers;
    });
  }

  function handleAddColumn() {
    setContainers([...containers, { id: crypto.randomUUID(), title: null }]);
  }

  function handleAddTask(parentId: string) {
    console.log({ parentId });
    setItems((items) => {
      return [
        ...items,
        { id: crypto.randomUUID(), parent: parentId, title: null },
      ];
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (active.data.current?.type === "Column") {
      setContainers((containers) => {
        const newContainers = structuredClone(containers);

        const activeContainerIndex = containers.findIndex(
          (container) => container.id === active.id
        );

        const overContainerIndex = containers.findIndex(
          (container) => container.id === over?.id
        );

        [
          newContainers[overContainerIndex],
          newContainers[activeContainerIndex],
        ] = [
          newContainers[activeContainerIndex],
          newContainers[overContainerIndex],
        ];

        return newContainers;
      });
    } else {
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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (active.data.current?.type === "Column") {
      setActiveContainer(active.data.current.container);
    }
    if (active.data.current?.type === "Item") {
      setActiveItem(active.data.current.container);
    }
  }
}
