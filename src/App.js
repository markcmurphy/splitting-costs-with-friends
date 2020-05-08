import React from "react";
import "./App.css";
import Friends from "./components/friends/Friends";
import AddExpense from "./components/expense/AddExpense";
import Navbar from "./components/layout/Navbar";
import RenderExpenseList from "./components/expense/RenderExpenseList";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main">
        <RenderExpenseList />
        <AddExpense />
        <Friends />
      </div>
    </div>
  );
}

export default App;
