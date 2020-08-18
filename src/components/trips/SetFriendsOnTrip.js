import React from "react";
import Select from "@material-ui/core/Select";
import _ from "lodash";

import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

export default function SetFriendsOnTrip(props) {
  // import { colourOptions } from "../data";

  useFirestoreConnect([
    {
      collection: "users",
      where: [["onTrips", "array-contains", props.id]],
      storeAs: "tripFriendIDs",
    },
    {
      collection: "users",
      where: [["contactOf", "array-contains", props.uid]],
      storeAs: "myContacts",
    },
  ]);

  const myContacts = useSelector((state) => state.firestore.ordered.myContacts);

  const tripFriendIDs = useSelector(
    (state) => state.firestore.ordered.tripFriendIDs
  );

  //   console.log(tripFriendIDs);

  function inputChangeMultiple() {}

  return (
    <Select
      multiple
      native
      value={tripFriendIDs}
      onChange={inputChangeMultiple}
      // className="form-control"
      // id="friendsInvolved"
      // type="text"
      inputProps={{
        id: "select-multiple-native",
      }}
      fullWidth
    >
      {_.map(myContacts, (value, key) => {
        // console.log(value);
        return (
          <option key={key} value={value.id}>
            {value.username}
          </option>
        );

        // return <FriendsInvolved key={value.id} friends={value} />;
      })}
    </Select>
  );
}
