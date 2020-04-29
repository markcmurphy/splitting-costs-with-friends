import React from "react";

export default function WhoPaid(props) {
  const { friend, friendId } = props;
  return <option value={friendId}>{friend.name}</option>;
}
