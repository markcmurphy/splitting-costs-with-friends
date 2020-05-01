import React from "react";

export default function WhoPaid(props) {
  // console.log(props.friend);
  // console.log(props.friendId);
  const { friend, friendId } = props;
  return <option value={friendId}>{friend.name}</option>;
}
