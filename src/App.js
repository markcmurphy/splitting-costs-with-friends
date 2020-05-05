import React from "react";
import "./App.css";
import Friends from "./components/friends/Friends";
import AddExpense from "./components/expense/AddExpense";

function App() {
  return (
    <div className="App">
      <h1>Splitting Costs with Friends</h1>
      <AddExpense />
      <Friends />
    </div>
  );
}

export default App;
