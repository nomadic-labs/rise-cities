import React from "react";
import { EditableText } from "react-easy-editables";

export default (props) => {
  return (
    <blockquote className={"quote text-lg text-dark"}>
      <EditableText
        { ...props }
      />
    </blockquote>
  );
};

