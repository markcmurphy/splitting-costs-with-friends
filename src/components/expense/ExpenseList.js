import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isIncluded: false,
    };
  }

  handleDelete = () => {
    const { expenses, firestore } = this.props;
    firestore.delete({ collection: "expenses", doc: expenses.id });
    // .then(() => this.props.history.push("/"));
  };

  renderWhoPaid(id) {
    const { friend } = this.props;
    if (friend && friend[id]) {
      return <td>{friend[id].name}</td>;
    }
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.name === "isIncluded" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  renderExpenseTable = () => {
    const { expenses, expense, friend, friends } = this.props;
    const friendsInvolved = expenses.friendsInvolved;

    if (expenses) {
      return (
        <tr key={expenses.id}>
          {/* Delete Button */}
          <td>
            <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
            </button>
          </td>
          {/* Expense Name */}
          <td>{expenses.name}</td>
          {/* Who Paid for Expense */}
          {this.renderWhoPaid(expenses.whoPaid)}
          {/* TODO: Render input for whether to include person in expense */}
          {/* Cost per person for expense */}
          <td>
            $
            {parseFloat(
              expenses.expenseAmount / expenses.friendsInvolved.length
            ).toFixed(2)}
          </td>
          {/* Whether Friend is Included in Expense */}
          {_.map(friend, (value, key) => {
            if (friendsInvolved.includes(key)) {
              return <td>X</td>;
            } else {
              return <td>$0</td>;
            }
          })}
          {/* Expense Amount */}
          <td>${parseFloat(expenses.expenseAmount).toFixed(2)}</td>
        </tr>
      );
    } else {
      return "loading";
    }
  };

  render() {
    return this.renderExpenseTable();
  }
}

export default compose(
  // gets expenses from firestore and puts them in the expenses prop
  firestoreConnect((props) => [
    {
      collection: "expenses",
      storeAs: "expense",
      // doc: props.expense.id,
    },
    {
      collection: "friends",
      storeAs: "friend",
      // doc: props.friend.id,
    },
  ]),
  connect(({ firestore: { data } }, props) => ({
    expense: data.expense,
    // && ordered.expense[0],
    friend: data.friend,
    // && ordered.friend[0],
  }))
)(ExpenseList);
