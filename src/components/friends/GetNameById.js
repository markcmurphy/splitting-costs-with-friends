import React from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

export default function GetNameById({ id }) {
  useFirestoreConnect(() => [
    { collection: "users", doc: id }, // or `todos/${props.todoId}`
  ]);

  const userName = useSelector(
    ({ firestore: { data } }) => data.users && data.users[id]
  );

  console.log(userName.firstName);

  return userName.firstName;
}
