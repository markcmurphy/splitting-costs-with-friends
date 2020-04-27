import React from "react";
import "./App.css";
import { Friend } from "./components/friends/Friend.js";
import List from "./components/List";

function App() {
  return (
    <div className="App">
      <h1>Splitting Costs with Friends</h1>
      <List />
      {/* <Friend /> */}
    </div>
  );
}

export default App;
