import React, { Component } from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import AddNewTrip from "../trips/AddNewTrip";
import ListTrips from "../trips/ListTrips";

export default function Sidebar(props) {
  const { id } = useParams();

  return (
    <div>
      <div className="nav-wrapper mt-3" style={{}} id="sidebar">
        <>
          <div class="alert alert-info mt-4" role="alert">
            Add friend or friends prior to adding expense!
          </div>
          <div
            // className="card"
            style={
              {
                // padding: "3%",
                // width: "45rem",
              }
            }
          >
            {/* <h4>All Trips</h4> */}
            <AddNewTrip uid={props.uid} />
            <ListTrips uid={props.uid} />
          </div>
          <AddExpense id={id} uid={props.uid} />
          <Friends id={id} uid={props.uid} />
        </>
      </div>
    </div>
  );
}
