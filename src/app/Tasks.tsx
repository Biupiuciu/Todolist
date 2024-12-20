import React, { useEffect } from "react";
import { Droppable } from "./Droppable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./array";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Header } from "./Header";
import { ListAPI, Task } from "@/stores/lists";
import { userStore } from "@/stores/users";
import { listStore } from "@/stores/lists";
export type ListType = "todo" | "inpro" | "done";

export const Tasks = () => {
  const user = userStore((state) => state.user);
  const userId = user.id as number;
  const lists = listStore((state) => state.lists);
  const { setLists } = listStore.getState();
  const listTypes = ["todo", "inpro", "done"];

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    ListAPI.getTasks(userId);
  }, []);

  const moveBetweenContainers = (
    lists: any,
    activeContainer: any,
    activeIndex: any,
    overContainer: any,
    overIndex: any,
    task: any
  ) => {
    const updatedLists = lists.map((list: any) => {
      if (list.title == activeContainer) {
        return {
          ...list,
          tasks: removeAtIndex(list.tasks, activeIndex),
        };
      } else if (list.title == overContainer) {
        return {
          ...list,
          tasks: insertAtIndex(list.tasks, overIndex, task),
        };
      } else {
        return { ...list };
      }
    });

    return updatedLists;
  };

  const handleDragOver = ({ active, over }: any) => {
    if (!over) {
      return;
    }
    //when drag to different container, overId will be that container's id
    const overId = over?.id;
    const activeContainer = active.data.current.sortable.containerId;
    const activeIndex = active.data.current.sortable.index;
    //when dragging to different container, over.data.current is undefined
    const overContainer = over.data.current?.sortable.containerId || overId;
    const overIndex = over.data.current?.sortable.index || 0;

    const task = lists.filter((list) => {
      return list.title == activeContainer;
    })[0].tasks[activeIndex];

    if (activeContainer !== overContainer) {
      const newLists = moveBetweenContainers(
        lists,
        activeContainer,
        activeIndex,
        overContainer,
        overIndex,
        task
      );
      ListAPI.UpdateTasksDB({ todoList: newLists }, userId);
      setLists(newLists);
    }
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;

      //when list is empty - over.id
      const overContainer = over.data.current?.sortable.containerId || "";

      if (!overContainer || activeContainer !== overContainer) {
        return;
      }

      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;
      const newList = lists.map((list) => {
        if (list.title == overContainer) {
          return {
            ...list,
            tasks: arrayMove(list.tasks, activeIndex, overIndex) as Array<Task>,
          };
        }
        return { ...list };
      });
      ListAPI.UpdateTasksDB({ todoList: newList }, userId);
      setLists(newList);
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="background">
          <div className="kanban">
            <Header></Header>
            <div className="tableContainer">
              {lists.map((list, index) => {
                const listType = listTypes[index] as ListType;
                return (
                  <Droppable
                    id={list.title}
                    key={listType}
                    list={list}
                    listSequence={index}
                  ></Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
};
