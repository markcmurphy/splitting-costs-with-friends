import { friendsRef } from "../firebase";
const FETCH_FRIENDS = "FETCH_FRIENDS";

const addFriend = (newFriend) => async (dispatch) => {
  friendsRef.push().set(newFriend);
  console.log("addFriend ran");
};

const deleteFriend = (deleteFriend) => async (dispatch) => {
  friendsRef.child(deleteFriend).remove();
};

const fetchFriends = () => async (dispatch) => {
  friendsRef.on("value", (snapshot) => {
    dispatch({
      type: FETCH_FRIENDS,
      payload: snapshot.val(),
    });
  });
};

export { addFriend, deleteFriend, fetchFriends, FETCH_FRIENDS };
