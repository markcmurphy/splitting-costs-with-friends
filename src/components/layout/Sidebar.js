import React from "react";

import ListFriends from "../friends/ListFriends.js";
// import ListFriendsOnTrip from "../friends/ListFriendsOnTrip.js";
import AddExpense from "../expense/AddExpense.js";

import { Route, useParams } from "react-router-dom";

// import AddNewTrip from "../trips/AddNewTrip";
import MaterialAddNewTrip from "../trips/MaterialAddNewTrip";
import TripList from "../trips/TripList";
import Divider from "@material-ui/core/Divider";
import AddContact from "../friends/AddContact";
import ListFriendsOnTrip from "../friends/ListFriendsOnTrip.js";
import TransferList from "./TransferList.js";

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
            <MaterialAddNewTrip uid={props.uid} friends={props.friends} />

            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            {/* <TripList uid={props.uid} id={props.id} /> */}
            <TripList uid={props.uid} id={props.id} />
          </>
        ) : null}
      </>

      <Route
        path="/trip/:id"
        render={() => (
          <div>
            <AddExpense id={id} uid={props.uid} />

            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />

            <AddContact uid={props.uid} id={id} />

            {/* <Divider style={{ marginTop: "15px", marginBottom: "15px" }} /> */}

            {/* <Friends id={id} uid={props.uid} /> */}

            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            {/* <TransferList id={id} uid={props.uid} /> */}
            <ListFriends id={id} uid={props.uid} />
            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            <ListFriendsOnTrip id={id} uid={props.uid} />
          </div>
        )}
      />
    </div>
  );
}
