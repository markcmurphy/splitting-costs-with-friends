import React from "react";
import classnames from "classnames";

const Alert = (props) => {
  const { message, messageType } = props;
  return (
    <div
      className={classnames("alert", {
        "alert-success": messageType === "success",
        "alert-danger": messageType === "error",
      })}
    >
      {message}
    </div>
  );
};

export default Alert;
