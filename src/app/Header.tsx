import { MyContext } from "./MyContext";
import React, { useRef, useContext, useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { UpdateTasksDB } from "./TaskItem";
import { ToDoList } from "./MyContext";
export const Header = () => {
  const inputRef = useRef(document.getElementById(`0`));
  const {
    userId,
    setUserId,
    setTaskNum,
    setLists,
    taskNum,
    firstTimeFocused,
    setIsEditting,
    setEditId,
    setFirstTimeFocused,
  } = useContext(MyContext);
  useEffect(() => {
    //focus
    const task = taskNum - 1;
    inputRef.current = document.getElementById(task.toString());
    if (inputRef.current && taskNum > 1 && firstTimeFocused) {
      setIsEditting(true);
      setEditId(task.toString());
    }
  }, [taskNum]);
  const handleAddTask = () => {
    setLists((preList: ToDoList) => {
      const newList = [...preList];
      const newTask = { content: "", id: taskNum.toString() };
      const firstList = preList[0];
      const newTasks = firstList.tasks
        ? [...firstList.tasks, newTask]
        : [newTask];

      newList[0] = {
        ...firstList,
        tasks: newTasks,
      };

      UpdateTasksDB({ todoList: newList, addNewTask: true }, userId);
      setTaskNum(taskNum + 1);
      setFirstTimeFocused(true);
      return newList;
    });
  };

  const handleLogOut = () => {
    setLists([
      { tasks: [], title: "To do" },
      { tasks: [], title: "In progress" },
      { tasks: [], title: "Done" },
    ]);
    setUserId(0);
    localStorage.removeItem("accessToken");
  };
  return (
    <div className="kanbanTitle">
      <div className="kanbanLeft">
        <h2>Kanban Board</h2>
        <div className="kanbanTitleIcon" onClick={handleAddTask}>
          <ControlPointIcon></ControlPointIcon>
        </div>
      </div>

      <div className="button-4" onClick={handleLogOut}>
        Log out
      </div>
    </div>
  );
};
