import React from "react";
import "./App.css";

import Vertbody from "./components/layout/Vertbody";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main">
        <Vertbody />
        {/* <RenderExpenseList /> */}
        {/* <AddExpense /> */}
        {/* <Friends /> */}
      </div>
    </div>
  );
}

export default App;
