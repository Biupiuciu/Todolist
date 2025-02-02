import React from "react";
import { useContext, LegacyRef, createRef, useEffect } from "react";
import { MyContext } from "../context/MyContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { listStore, type Task } from "../stores/lists";
import { ListAPI } from "../stores/lists";
import { userStore } from "@/stores/users";
interface ItemContent {
  task: Task;
  id: number;
  listId: number;
}

export const TaskItem = (props: ItemContent) => {
  const pElementRef: LegacyRef<HTMLParagraphElement> | undefined = createRef();
  const {
    task: { content, id: taskId },

    listId,
  } = props;

  const {
    showMenu,
    setShowMenu,
    menuPosition,
    setMenuPosition,
    setEditId,
    setIsEditting,
    isEditting,
    editId,
  } = useContext(MyContext);

  const user = userStore((state) => state.user);
  const userId = user.id as number;
  const { lists, setLists } = listStore.getState();

  useEffect(() => {
    if (pElementRef?.current && taskId == editId && isEditting) {
      console.log("pELE:", pElementRef.current);
      pElementRef?.current.focus();
    }
  }, [editId, isEditting]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId });

  const taskStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateList = (updatedtask: string | null) => {
    const updatedLists = [...lists];
    const listToUpdate = updatedLists[listId];
    const updatedTasks = listToUpdate.tasks.map((task: any) => {
      if (task.id === taskId) {
        return { ...task, content: updatedtask };
      }
      return task;
    });

    updatedLists[listId] = { ...listToUpdate, tasks: updatedTasks };

    setLists(updatedLists);
    ListAPI.UpdateTasksDB(
      { todoList: updatedLists, addNewTask: false },
      userId
    );
  };

  const MakeItEditable = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditting(true);
    setEditId(taskId as number);
  };

  const FinishEditting = (event: any) => {
    if (event.key === "Enter") {
      setIsEditting(false);
      setEditId(-1);
      const updatedtask = event.currentTarget.textContent;
      updateList(updatedtask);
    }
  };

  const showingMenu = (event: any) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setShowMenu([Number(taskId), listId]);
  };

  const deleteTask = () => {
    setShowMenu([-1, showMenu[1]]);
    const updatedLists = [...lists];
    updatedLists[showMenu[1]].tasks = updatedLists[showMenu[1]].tasks.filter(
      (task) => task.id != showMenu[0]
    );

    setLists(updatedLists);
    ListAPI.UpdateTasksDB({ todoList: updatedLists }, userId);
  };

  return (
    <div
      className={`item ${props.task.id != editId ? "" : "item-focus "} ${
        showMenu[0] > -1 ? "" : "item-hover"
      }`}
      {...attributes}
      id={taskId.toString()}
      style={taskStyle}
      ref={setNodeRef}
      onDoubleClick={MakeItEditable}
      {...(isEditting || showMenu[0] > -1 ? {} : listeners)}
      onContextMenu={showingMenu}
    >
      {showMenu[0] > -1 && (
        <ul
          className="contextmunu"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
        >
          <li onClick={deleteTask}>Delete</li>
        </ul>
      )}
      <p
        ref={pElementRef}
        suppressContentEditableWarning={true}
        contentEditable={taskId == editId && isEditting}
        onKeyDown={FinishEditting}
        onBlur={(e) => {
          const updatedtask = e.currentTarget.textContent;
          updateList(updatedtask);
          setIsEditting(false);
          setEditId(-1);
        }}
      >
        {content || ""}
      </p>
    </div>
  );
};
