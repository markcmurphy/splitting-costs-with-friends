import React from "react";
import RenderExpenseList from "../expense/RenderExpenseList";
import AddExpense from "../expense/AddExpense";

export default function MainViewContainer() {
  return (
    <div>
      <AddExpense />
      <RenderExpenseList />
    </div>
  );
}
