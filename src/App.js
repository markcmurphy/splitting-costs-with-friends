import React from "react";
import "./App.css";
// import { Friend } from "./components/friends/Friend.js";
import Friends from "./components/friends/Friends";
import Expense from "./components/expense/Expense";

function App() {
  return (
    <div className="App">
      <h1>Splitting Costs with Friends</h1>
      <Friends />
      {/* <Expense /> */}
    </div>
  );
}

export default App;
