import React from "react";
import "./App.css";
import List from "./components/List";
import Expense from "./components/expense/Expense";

function App() {
  return (
    <div className="App">
      <h1>Splitting Costs with Friends</h1>
      <List />
      <Expense />
    </div>
  );
}

export default App;
