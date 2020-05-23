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
    const { expenses, firestore, tripId } = this.props;

    firestore.delete({
      collection: "users",
      doc: "mmurphy",
      storeAs: `${tripId.id}-expenses`,
      subcollections: [
        { collection: "trips", doc: tripId },
        { collection: "expenses", doc: expenses.id },
      ],
    });
  };

  renderWhoPaid(whoPaid) {
    const { friendsObj } = this.props;
    if (friendsObj && friendsObj[whoPaid]) {
      return <td>{friendsObj[whoPaid].firstName}</td>;
    } else {
      return <td>''</td>;
    }
  }

  renderEditForm(id) {
    const { showForm } = this.state;
    const { expenses, friends, firestore, tripId } = this.props;

    if (showForm) {
      return (
        <EditExpense
          expenseId={id}
          expense={expenses.name}
          amount={expenses.expenseAmount}
          friendsInvolved={expenses.friendsInvolved}
          whoPaid={expenses.whoPaid}
          friends={friends}
          tripId={tripId}
          firestore={firestore}
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

  addIncluded = (expense, id) => {
    // console.log(expense.friendsInvolved.filter((item) => !id.includes(item)));
    // console.log(expense.friendsInvolved.concat(id));
    const { firestore, tripId } = this.props;

    // Update expense
    const updExpense = {
      //   name: this.nameInput.current.value,
      // expenseAmount: Number(this.amountInput.current.value),
      friendsInvolved: expense.friendsInvolved.concat(id),
      // whoPaid: this.whoPaidInput.current.value,
    };

    // update expense in firestore
    // firestore.update({ collection: "expenses", doc: expense.id }, updExpense);
    firestore.update(
      {
        collection: "users",
        doc: "mmurphy",
        storeAs: `${tripId}-expenses`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expense.id },
        ],
      },
      updExpense
    );
  };

  removeIncluded = (expense, id) => {
    // console.log(expense.friendsInvolved.filter((item) => !id.includes(item)));
    // console.log(expense.friendsInvolved.concat(id));
    const { firestore, tripId } = this.props;

    // Update expense
    const updExpense = {
      //   name: this.nameInput.current.value,
      // expenseAmount: Number(this.amountInput.current.value),
      friendsInvolved: expense.friendsInvolved.filter(
        (item) => !id.includes(item)
      ),
      // whoPaid: this.whoPaidInput.current.value,
    };

    // update expense in firestore
    // firestore.update({ collection: "expenses", doc: expense.id }, updExpense);
    firestore.update(
      {
        collection: "users",
        doc: "mmurphy",
        storeAs: `${tripId}-expenses`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expense.id },
        ],
      },
      updExpense
    );
  };

  renderExpenseTable() {
    const { expensesObj, expenses, friends, friendsObj } = this.props;
    const friendsInvolved = expenses.friendsInvolved;
    const { showForm } = this.state;
    console.log(this.props);
    const editIcon = (
      <svg
        className="bi bi-pencil-square"
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
          fillRule="evenodd"
          d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
          clipRule="evenodd"
        />
      </svg>
    );

    if (!isEmpty(expenses)) {
      return (
        <tr key={expenses.id}>
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
            {expenses.name}
            {this.renderEditForm(expenses.id)}
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
                  fillRule="evenodd"
                  d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z"
                  clipRule="evenodd"
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
          {/* {isChecked ? (
            <button className="btn-danger">
              <i>Close</i>
            </button>
          ) : (
            editIcon
          )} */}

          {_.map(friends, (value, key) => {
            if (friendsInvolved.includes(value.id)) {
              return (
                <td
                  key={value.id}
                  // onClick={() => this.setState({ isChecked: !isChecked })}
                  style={{ textAlign: "center" }}
                >
                  {/* <i className="fa fa-2x fa-check-square" /> */}
                  <svg
                    className="bi bi-check-box"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    cursor="pointer"
                    onClick={() => this.removeIncluded(expenses, value.id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M1.5 13A1.5 1.5 0 003 14.5h10a1.5 1.5 0 001.5-1.5V8a.5.5 0 00-1 0v5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5h8a.5.5 0 000-1H3A1.5 1.5 0 001.5 3v10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </td>
              );
            } else {
              return (
                <td key={value.id} style={{ textAlign: "center" }}>
                  {/* <i className="fa fa-2x fa-window-close" /> */}
                  <svg
                    className="bi bi-x-square"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    cursor="pointer"
                    onClick={() => this.addIncluded(expenses, value.id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </td>
              );
            }
          })}
          {/* Expense Amount */}
          <td>${parseFloat(expenses.expenseAmount).toFixed(2)}</td>
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
  //   firestoreConnect((props) => [
  //     {
  //       collection: "expenses",
  //       storeAs: "expense",
  //     },
  //     {
  //       collection: "friends",
  //       storeAs: "friend",
  //     },
  //   ]),

  firestoreConnect((props) => [
    {
      collection: "users",
      doc: "mmurphy",
      storeAs: `${props.tripId}-expenses`,
      subcollections: [
        { collection: "trips", doc: props.tripId },
        { collection: "expenses" },
      ],
    },
    {
      collection: "users",
      doc: "mmurphy",
      storeAs: `${props.tripId}-friends`,
      subcollections: [
        { collection: "trips", doc: props.tripId },
        { collection: "friends" },
      ],
    },
  ]),

  connect(({ firestore: { data } }, props) => ({
    expensesObj: data[`${props.tripId}-expenses`],
    friendsObj: data[`${props.tripId}-friends`],
  }))
)(ExpenseList);
