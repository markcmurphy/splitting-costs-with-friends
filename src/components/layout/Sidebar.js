import React, { Component } from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

export default function Sidebar(props) {
  const { id } = useParams();
  return (
    <div>
      <div className="nav-wrapper mt-3" style={{}} id="sidebar">
        <>
          <div class="alert alert-info mt-4" role="alert">
            Add friend or friends prior to adding expense!
          </div>
          <AddExpense id={id} uid={props.uid} />
          <Friends id={id} uid={props.uid} />
        </>
      </div>
    </div>
  );
}
