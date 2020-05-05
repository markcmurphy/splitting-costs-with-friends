import React from "react";
import spinner from "./loading.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={spinner}
        alt="Loading"
        style={{ width: "32px", margin: "auto", display: "block" }}
      />
    </div>
  );
}
