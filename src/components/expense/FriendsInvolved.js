import React from "react";
import MenuItem from "@material-ui/core/MenuItem";

export default function FriendsInvolved(props) {
  const { friends } = props;
  return <MenuItem value={friends.id}>{friends.firstName}</MenuItem>;
}
