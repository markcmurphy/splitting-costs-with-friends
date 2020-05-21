import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import _ from "lodash";
import WhoPaid from "./WhoPaid";
import EditExpense from "./EditExpense";

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isIncluded: false,
      showForm: false,
    };
  }

  handleDelete = () => {
    const { xexpenses, firestore } = this.props;
    console.log(xexpenses);
    firestore.delete({ collection: "expenses", doc: xexpenses.id });
    // .then(() => this.props.history.push("/"));
  };

  renderWhoPaid(whoPaid) {
    const { xfriends, friends } = this.props;
    if (friends && friends[whoPaid]) {
      return <td>{friends[whoPaid].firstName}</td>;
    } else {
      return <td>''</td>;
    }
  }

  renderEditForm(id) {
    const { showForm } = this.state;
    const { xexpenses, xfriends } = this.props;

    if (showForm) {
      return (
        <EditExpense
          id={id}
          expense={xexpenses.name}
          amount={xexpenses.expenseAmount}
          friendsInvolved={xexpenses.friendsInvolved}
          whoPaid={xexpenses.whoPaid}
          friends={xfriends}
        />
      );
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

  renderExpenseTable() {
    const { xexpenses, xfriends } = this.props;
    const friendsInvolved = xexpenses.friendsInvolved;
    const { showForm } = this.state;

    const editIcon = (
      <svg
        class="bi bi-pencil-square"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        // onClick={() => this.setState({ showForm: !showForm })}
        cursor="pointer"
      >
        <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z" />
        <path
          fill-rule="evenodd"
          d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
          clip-rule="evenodd"
        />
      </svg>
    );

    if (!isEmpty(xexpenses)) {
      return (
        <tr key={xexpenses.id}>
          {/* Delete Button */}
          {/* <td>
            <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
            </button>
            <button
              className="btn-sm ml-4 btn-primary"
              onClick={() => this.setState({ showForm: !showForm })}
            >
              {showForm ? <i>Close</i> : <i className="fa fa-2x fa-edit" />}
            </button>
          </td> */}
          {/* Expense Name */}
          <td>
            {xexpenses.name}
            {this.renderEditForm(xexpenses.id)}
            <div style={{ float: "right" }}>
              <svg
                className="bi bi-trash-fill ml-2"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={this.handleDelete}
                cursor="pointer"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                className="ml-2"
                onClick={() => this.setState({ showForm: !showForm })}
              >
                {showForm ? (
                  <button className="btn-danger">
                    <i>Close</i>
                  </button>
                ) : (
                  editIcon
                )}
              </span>
            </div>
          </td>
          {/* Who Paid for Expense */}
          {this.renderWhoPaid(xexpenses.whoPaid)}
          {/* TODO: Render input for whether to include person in expense */}
          {/* Cost per person for expense */}
          <td>
            $
            {parseFloat(
              xexpenses.expenseAmount / xexpenses.friendsInvolved.length
            ).toFixed(2)}
          </td>
          {/* Whether Friend is Included in Expense */}
          {_.map(xfriends, (value, key) => {
            if (friendsInvolved.includes(value.id)) {
              return (
                <td style={{ textAlign: "center" }}>
                  <i className="fa fa-2x fa-check-square" />
                </td>
              );
            } else {
              return (
                <td style={{ textAlign: "center" }}>
                  <i className="fa fa-2x fa-window-close" />
                </td>
              );
            }
          })}
          {/* Expense Amount */}
          <td>${parseFloat(xexpenses.expenseAmount).toFixed(2)}</td>
        </tr>
      );
    } else {
      return "loading";
    }
  }

  render() {
    return this.renderExpenseTable();
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "expenses",
      storeAs: "expense",
    },
    {
      collection: "friends",
      storeAs: "friend",
    },
  ]),

  connect(({ firestore: { data } }, props) => ({
    expenses: data.expenses,
    friends: data.friends,
  }))
)(ExpenseList);
