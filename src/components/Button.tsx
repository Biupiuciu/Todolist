import React from "react";

interface ButtonProps {
  value: string;
  classname?: string;
  clickHandler?: () => void | Promise<void>;
}

export const Button = (props: ButtonProps) => {
  const { value, classname, clickHandler } = props;
  return (
    <button className={`button-4 ${classname}`} onClick={clickHandler}>
      {value}
    </button>
  );
};
