import { MyContext } from "./MyContext";
import React, { useRef, useContext, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ListAPI } from "@/stores/lists";
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
        <div className="kanban-container">
          <div className="kanban-shadow"></div>
          <div className="kanban-title">Kanban Board</div>
        </div>

        <div className="kanbanTitleIcon" onClick={handleAddTask}>
          <AddCircleIcon
            fontSize="large"
            sx={{
              color: "#131111",
              "&:hover": {
                color: "#47FFDA",
                transition: "transform 0.3s ease, color 0.3s ease", // Smooth transition
              },
            }}
          ></AddCircleIcon>
        </div>
      </div>
      <div onClick={handleLogOut} className="textOnHover">
        Log out &gt;&gt;
      </div>
      {/* <Button value="Log out " clickHandler={handleLogOut} /> */}
    </div>
  );
};
