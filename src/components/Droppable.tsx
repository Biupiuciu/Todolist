import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import type { List } from "../stores/lists";
import React from "react";

export interface Droppable {
  id: string;
  listSequence: number;
  list: List;
}
export const Droppable = ({ id, list, listSequence }: Droppable) => {
  // useDroppable -- hook for Defining a droppable area.
  // setNodeRef -- designate a DOM element as a droppable area, when one element is dragged into this area, it can handle the corresponding drag-and-drop event
  const { setNodeRef } = useDroppable({ id });
  const { title, tasks } = list;

  return (
    <SortableContext id={title} items={tasks} strategy={rectSortingStrategy}>
      <div>
        <div className="tableHeader">{title}</div>
        <div ref={setNodeRef} className="tableColumn">
          {tasks ? (
            tasks.map((task, index) => {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  id={index}
                  listId={listSequence}
                ></TaskItem>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </SortableContext>
  );
};
