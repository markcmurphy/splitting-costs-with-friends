import React from "react";

export default function FriendsInvolved(props) {
  const { friends } = props;
  return <option value={friends.id}>{friends.firstName}</option>;
}
