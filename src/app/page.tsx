"use client";

import { Todo } from "./Todo";
import { MyContext } from "./MyContext";
import { useState } from "react";
import "./app.scss";

export default function Home() {
  const [isEditting, setIsEditting] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [showMenu, setShowMenu] = useState<[number, number]>([-1, -1]);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [firstTimeFocused, setFirstTimeFocused] = useState(false);

  return (
    <MyContext.Provider
      value={{
        menuPosition,
        setMenuPosition,
        showMenu,
        setShowMenu,
        isEditting,
        setIsEditting,
        editId,
        setEditId,
        firstTimeFocused,
        setFirstTimeFocused,
      }}
    >
      <Todo />
    </MyContext.Provider>
  );
}
