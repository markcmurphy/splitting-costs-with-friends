import {
  totalsRef,
  friendsRef,
  expensesRef,
  findFriendsRef,
  databaseRef,
  // firebase,
} from "../firebase";
const FETCH_FRIENDS = "FETCH_FRIENDS";
const FETCH_EXPENSES = "FETCH_EXPENSES";

const addFriend = (newFriend) => async (dispatch) => {
  friendsRef.push().set(newFriend);
  console.log("addFriend ran");
};

// const addFriend = (newFriend) => async (dispatch) => {
//   console.log(newFriend);
//   // function writeNewPost(uid, username, picture, title, body) {
//   // A post entry.
//   let postData = newFriend;

//   // {
//   //   name: newFriend.firstName,
//   //   friendId: newFriend.firstName,
//   //   // uid: uid,
//   //   // body: body,
//   //   // title: title,
//   //   // starCount: 0,
//   //   // authorPic: picture,
//   // };

//   // Get a key for a new Post.
//   var newPostKey = friendsRef.push().key;

//   // Write the new post's data simultaneously in the posts list and the user's post list.
//   var updates = {};
//   updates["/friends/" + newPostKey] = postData;
//   updates["/expenses/" + postData.friendId + "/" + newPostKey] = postData;

//   return databaseRef.update(updates);
// };

// friendsRef.push().set(newFriend);
// console.log("addFriend ran");

// const addPaidToFriend = (newWhoPaid) => async (dispatch) => {
//   // friendsRef.update(newWhoPaid);
//   friendUpdateRef.update(newWhoPaid);
//   console.log(newWhoPaid);
//   console.log("addPaidToFriend ran");
// };

const updateFriends = (friendId, name, amount) => async (dispatch) => {
  // firebase
  //   .database()
  //   .ref("friends/" + friendId)
  //   .set({
  //     firstName: name,
  //     amount: amount,
  //   });
};

const addExpense = (newExpense) => async (dispatch) => {
  let postData = newExpense;

  // Get a key for a new Post.
  var newPostKey = expensesRef.push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates["/expenses/" + newPostKey] = postData;
  updates["/friends/" + postData.whoPaid + "/" + newPostKey] = postData;

  return databaseRef.update(updates);
};

const addTotal = (newTotal) => async (dispatch) => {
  totalsRef.push().set(newTotal);
  console.log("addTotal ran");
};

const deleteFriend = (deleteFriend) => async (dispatch) => {
  console.log(deleteFriend);
  friendsRef.child(deleteFriend).remove();
};

const deleteExpense = (deleteExpense) => async (dispatch) => {
  let postData = deleteExpense;

  // Get a key for a new Post.
  // var newPostKey = expensesRef.push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates["/expenses/" + postData] = null;
  updates["/friends/" + postData] = null;

  return databaseRef.update(updates);

  expensesRef.child(deleteExpense).remove();
};

const fetchFriends = () => async (dispatch) => {
  friendsRef.on("value", (snapshot) => {
    dispatch({
      type: FETCH_FRIENDS,
      payload: snapshot.val(),
    });
  });
};

const fetchExpenses = () => async (dispatch) => {
  expensesRef.on("value", (snapshot) => {
    dispatch({
      type: FETCH_EXPENSES,
      payload: snapshot.val(),
    });
  });
};

export {
  addFriend,
  deleteFriend,
  deleteExpense,
  fetchFriends,
  fetchExpenses,
  // addPaidToFriend,
  addExpense,
  addTotal,
  updateFriends,
  FETCH_FRIENDS,
  FETCH_EXPENSES,
};
