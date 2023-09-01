import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
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
  const [containers, setContainers] = useState<ContainerType[]>(
    JSON.parse(localStorage.getItem("user_containers") ?? "[]")
  );
  const containersId = useMemo(
    () => containers.map((containers) => containers.id),
    [containers]
  );
  const [items, setItems] = useState<ItemType[]>(
    JSON.parse(localStorage.getItem("user_items") ?? "[]")
  );
  const itemsId = useMemo(() => items.map((items) => items.id), [items]);

  // useEffect(() => {
  //   const containers = ;
  //   const items = localStorage.getItem("user_items");

  //   if (items) {
  //     setItems(JSON.parse(items));
  //   }

  //   if (containers) {
  //     setContainers(JSON.parse(containers));
  //   }
  // }, []);

  useEffect(() => {
    if (items.length > 0)
      localStorage.setItem("user_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (containers.length > 0)
      localStorage.setItem("user_containers", JSON.stringify(containers));
  }, [containers]);

  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null
  );
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });

  return (
    <DndContext
      sensors={useSensors(touchSensor, mouseSensor)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-flow-col space-x-8">
        <SortableContext items={containersId}>
          {containers?.map((container) => (
            <Column
              handleColumnDelete={handleColumnDelete}
              handleAddTask={() => handleAddTask(container.id)}
              handleColumnNameChange={handleColumnNameChange}
              key={container.id}
              container={container}
            >
              {items &&
                items?.map((item) => {
                  if (item.parent === container.id) {
                    return (
                      <ColumnItem key={item.id} item={item}>
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
                handleColumnDelete={handleColumnDelete}
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

  function handleColumnDelete(containerId: string) {
    console.log({ containerId });
    setContainers((containers) => {
      return containers.filter((container) => container.id !== containerId);
    });
    setItems((items) => {
      return items.filter((items) => items.parent !== containerId);
    });
  }

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
    setItems((items) => {
      return [
        ...items,
        { id: crypto.randomUUID(), parent: parentId, title: null },
      ];
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    console.log({ over, active });
    if (!over) return;

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
    } else if (active.data.current?.type === "Item") {
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
