import { MyContext } from "./MyContext";
import React, { useRef, useContext, useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { ListAPI } from "@/stores/lists";
import { Button } from "../components/Button";
import { UserAPI, userStore } from "@/stores/users";
import { listStore } from "@/stores/lists";
export const Header = () => {
  const inputRef = useRef(document.getElementById(`0`));
  const { firstTimeFocused, setIsEditting, setEditId, setFirstTimeFocused } =
    useContext(MyContext);

  const user = userStore((state) => state.user);
  const userId = user.id as number;
  const {
    tasknum: taskNum,
    setTaskNum,
    setLists,
    lists,
  } = listStore.getState();

  useEffect(() => {
    //focus
    const task = taskNum - 1;
    inputRef.current = document.getElementById(task.toString());
    if (inputRef.current && taskNum > 1 && firstTimeFocused) {
      setIsEditting(true);
      setEditId(task);
    }
  }, [taskNum]);

  const handleAddTask = () => {
    const newList = [...lists];
    const newTask = { content: "", id: taskNum };
    const firstList = lists[0];
    const newTasks = firstList.tasks
      ? [...firstList.tasks, newTask]
      : [newTask];

    newList[0] = {
      ...firstList,
      tasks: newTasks,
    };

    ListAPI.UpdateTasksDB({ todoList: newList, addNewTask: true }, userId);
    setTaskNum(taskNum + 1);
    setFirstTimeFocused(true);

    setLists(newList);
  };

  const handleLogOut = () => {
    UserAPI.logOut();
  };
  return (
    <div className="kanbanTitle">
      <div className="kanbanLeft">
        <h2>Kanban Board</h2>
        <div className="kanbanTitleIcon" onClick={handleAddTask}>
          <ControlPointIcon></ControlPointIcon>
        </div>
      </div>

      <Button value="Log out " clickHandler={handleLogOut} />
    </div>
  );
};
