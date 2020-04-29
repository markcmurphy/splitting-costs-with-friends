import { totalsRef, friendsRef, expensesRef } from "../firebase";
const FETCH_FRIENDS = "FETCH_FRIENDS";
const FETCH_EXPENSES = "FETCH_EXPENSES";

const addFriend = (newFriend) => async (dispatch) => {
  friendsRef.push().set(newFriend);
  console.log("addFriend ran");
};

const addExpense = (newExpense) => async (dispatch) => {
  expensesRef.push().set(newExpense);
  console.log(newExpense);
};

const addTotal = (newTotal) => async (dispatch) => {
  totalsRef.push().set(newTotal);
  console.log("addTotal ran");
};

const deleteFriend = (deleteFriend) => async (dispatch) => {
  friendsRef.child(deleteFriend).remove();
};

const deleteExpense = (deleteExpense) => async (dispatch) => {
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
  addExpense,
  addTotal,
  FETCH_FRIENDS,
  FETCH_EXPENSES,
};
