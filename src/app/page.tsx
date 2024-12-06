"use client";

import { Todo } from "./Todo";
import { MyContext } from "./MyContext";
import axios from "axios";
import { useState } from "react";
import "./app.scss";

export default function Home() {
  // axios.defaults.baseURL = "http://localhost:8080";
  axios.defaults.withCredentials = true;

  const [userId, setUserId] = useState(0);
  const [taskNum, setTaskNum] = useState(0);
  const [isEditting, setIsEditting] = useState(false);
  const [editId, setEditId] = useState("");
  const [showMenu, setShowMenu] = useState([-1, -1]);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [firstTimeFocused, setFirstTimeFocused] = useState(false);
  const [lists, setLists] = useState([
    { title: "To do", tasks: [{ content: "", id: "" }] },
    { title: "In progress", tasks: [{ content: "", id: "" }] },
    { title: "Done", tasks: [{ content: "", id: "" }] },
  ]);
  return (
    <MyContext.Provider
      value={{
        menuPosition,
        setMenuPosition,
        showMenu,
        setShowMenu,
        userId,
        setUserId,
        taskNum,
        setTaskNum,
        isEditting,
        setIsEditting,
        editId,
        setEditId,
        lists,
        setLists,
        firstTimeFocused,
        setFirstTimeFocused,
      }}
    >
      <Todo />
    </MyContext.Provider>
  );
}
