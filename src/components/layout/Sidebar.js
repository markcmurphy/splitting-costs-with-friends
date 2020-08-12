import React from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";

import { Route, useParams } from "react-router-dom";

// import AddNewTrip from "../trips/AddNewTrip";
import MaterialAddNewTrip from "../trips/MaterialAddNewTrip";
import TripList from "../trips/TripList";
import Divider from "@material-ui/core/Divider";

export default function Sidebar(props) {
  const { id } = useParams();
  return (
    <div style={{ paddingLeft: "10%" }}>
      {/* <div className="alert alert-info mt-4" role="alert">
        Add friend or friends prior to adding expense!
      </div> */}
      <>
        {props ? (
          <>
            <MaterialAddNewTrip uid={props.uid} />

            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            <TripList uid={props.uid} />
          </>
        ) : null}
      </>
      <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />

      <Route
        path="/trip/:id"
        render={() => (
          <div>
            <AddExpense id={id} uid={props.uid} />

            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />

            <Friends id={id} uid={props.uid} />
          </div>
        )}
      />
    </div>
  );
}
