import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteExpense } from "../../actions/index.js";

class ExpenseList extends Component {
  handleDelete = (deleted) => {
    const { deleteExpense } = this.props;
    deleteExpense(deleted);
  };

  render() {
    const { expenseId, expense } = this.props;
    console.log(expenseId);
    return (
      <div className="mt-4" key="expenseId">
        <h4>
          {expense.name} - ${expense.expenseAmount}
          <span onClick={() => this.handleDelete(expenseId)}>
            <i className="ml-4">X</i>
          </span>
        </h4>
      </div>
    );
  }
}

export default connect(null, { deleteExpense })(ExpenseList);
