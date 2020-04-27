import { todosRef } from "../firebase";
const FETCH_TODOS = "FETCH_TODOS";

const addToDo = (newToDo) => async (dispatch) => {
  todosRef.push().set(newToDo);
  console.log("addTodo ran");
};

const completeToDo = (completeToDo) => async (dispatch) => {
  todosRef.child(completeToDo).remove();
};

const fetchToDos = () => async (dispatch) => {
  todosRef.on("value", (snapshot) => {
    dispatch({
      type: FETCH_TODOS,
      payload: snapshot.val(),
    });
  });
};

export { addToDo, completeToDo, fetchToDos, FETCH_TODOS };
