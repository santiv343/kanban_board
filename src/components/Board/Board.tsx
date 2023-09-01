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

  useEffect(() => {
    localStorage.setItem("user_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("user_containers", JSON.stringify(containers));
  }, [containers]);

  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null
  );
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  console.log({ activeContainer, activeItem });

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
              <SortableContext items={itemsId}>
                {items &&
                  items?.map((item) => {
                    if (item.parent === container.id) {
                      return (
                        <ColumnItem
                          handleItemDelete={handleItemDelete}
                          key={item.id}
                          item={item}
                        />
                      );
                    }
                  })}
              </SortableContext>
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
                          <ColumnItem
                            handleItemDelete={handleItemDelete}
                            item={item}
                          />
                        );
                      }
                    })}
                </SortableContext>
              </Column>
            ) : activeItem ? (
              <ColumnItem
                handleItemDelete={handleItemDelete}
                item={activeItem}
              />
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

  // Handlers

  function handleItemDelete(itemId: string) {
    setItems((items) => {
      return items.filter((item) => item.id !== itemId);
    });
  }

  function handleColumnDelete(containerId: string) {
    console.log({ containerId });
    setContainers((containers) => {
      return containers.filter((container) => container.id !== containerId);
    });
    setItems((items) => {
      return items.filter((item) => item.parent !== containerId);
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

        const activeItemIndex = newItems.findIndex(
          (item) => item.id === active.id
        );

        const overItemIndex = newItems.findIndex(
          (item) => item.id === over?.id
        );

        if (newItems[activeItemIndex].parent !== over.id) {
          newItems[activeItemIndex].parent = over.id as string;
        }

        console.log({ activeItemIndex, overItemIndex });

        [newItems[overItemIndex], newItems[activeItemIndex]] = [
          newItems[activeItemIndex],
          newItems[overItemIndex],
        ];

        return newItems;
      });
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    console.log({ active });

    if (active.data.current?.type === "Column") {
      setActiveContainer(active.data.current.container);
    }
    if (active.data.current?.type === "Item") {
      setActiveItem(active.data.current.item);
    }
  }
}
