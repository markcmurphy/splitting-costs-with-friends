import React from "react";
import RenderExpenseList from "../expense/RenderExpenseList";
import AddExpense from "../expense/AddExpense";

export default function MainViewContainer() {
  return (
    <div className="pl-4 pr-4">
      {/* <AddExpense /> */}
      <RenderExpenseList />
    </div>
  );
}
