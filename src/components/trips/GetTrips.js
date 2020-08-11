import React from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

export default function GetTrips(props) {
  useFirestoreConnect([
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: "trips",
    }, // or 'todos'
  ]);
  const trips = useSelector((state) => state.firestore.ordered.trips);
  return trips;
}
