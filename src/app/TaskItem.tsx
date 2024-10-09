import React from "react";
import { useContext, LegacyRef, createRef, useEffect } from "react";
import { MyContext } from "./MyContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { GetAccessToken, RefreshAccessToken } from "./Todo";
interface ItemContent {
  task: {
    content: string | number | readonly string[] | undefined;
    id: string;
  };
  id: number;
  listId: number;
}

export const UpdateTasksDB = async (lists: any, userId: number) => {
  const accessToken = GetAccessToken();
  try {
    const { status } = await axios.post(`/api/profile/${userId}`, lists, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (status == 200) {
      console.log("Update Successfully!");
      return;
    }
    throw new Error("Failed");
  } catch (err) {
    const error = err as Error;
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (data == "Expired token") {
        const refreshResult = await RefreshAccessToken();
        if (refreshResult == userId) {
          await UpdateTasksDB(lists, userId);
        }
      }
    }
  }
};

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
    lists,
    userId,
    setEditId,
    setIsEditting,
    isEditting,
    editId,
    setLists,
  } = useContext(MyContext);

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
    UpdateTasksDB({ todoList: updatedLists, addNewTask: false }, userId);
  };

  const MakeItEditable = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(taskId);
    e.preventDefault();
    setIsEditting(true);
    setEditId(taskId);
  };

  const FinishEditting = (event: any) => {
    if (event.key === "Enter") {
      setIsEditting(false);
      setEditId("");
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
      (task) => task.id != showMenu[0].toString()
    );

    setLists(updatedLists);
    UpdateTasksDB({ todoList: updatedLists }, userId);
  };

  return (
    <div
      className={`item ${props.task.id != editId ? "" : "item-focus "} `}
      {...attributes}
      id={taskId}
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
        // onDoubleClick={MakeItEditable}
        onBlur={(e) => {
          const updatedtask = e.currentTarget.textContent;
          updateList(updatedtask);
          setIsEditting(false);
          setEditId("");
        }}
      >
        {content || ""}
      </p>
    </div>
  );
};
