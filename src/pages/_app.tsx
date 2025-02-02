import React from "react";
import { AppProps } from "next/app";
import { MyContext } from "../context/MyContext";
import "../app/app.scss";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [isEditting, setIsEditting] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [showMenu, setShowMenu] = useState<[number, number]>([-1, -1]);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [firstTimeFocused, setFirstTimeFocused] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
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
        isHomePage,
        setIsHomePage,
      }}
    >
      <Component {...pageProps} />
    </MyContext.Provider>
  );
}

export default MyApp;
