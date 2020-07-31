import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import _ from "lodash";
import EditExpense from "./EditExpense";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Toggle from "react-toggle";
import "react-toggle/style.css";

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isIncluded: false,
      showForm: false,
    };
  }

  // handles deletion of expense from Firestore
  handleDelete = () => {
    const { expense, firestore, tripId, uid } = this.props;
    firestore.delete({
      collection: "users",
      doc: uid,
      storeAs: `${tripId.id}-expenses`,
      subcollections: [
        { collection: "trips", doc: tripId },
        { collection: "expenses", doc: expense.id },
      ],
    });
  };

  // renders name of friend who paid for expense
  renderWhoPaid(whoPaid) {
    const { friendsObj } = this.props;
    const whoPaidArr = [];
    if (friendsObj && friendsObj[whoPaid]) {
      whoPaidArr.push(friendsObj[whoPaid].firstName);
    }
    return whoPaidArr;
  }

  // shows edit form to change expense details
  renderEditForm(id) {
    const { showForm } = this.state;
    const { expense, friends, firestore, tripId, uid } = this.props;

    if (showForm) {
      return (
        <EditExpense
          expenseId={id}
          expense={expense.name}
          amount={expense.expenseAmount}
          friendsInvolved={expense.friendsInvolved}
          whoPaid={expense.whoPaid}
          friends={friends}
          tripId={tripId}
          firestore={firestore}
          uid={uid}
        />
      );
    }
  }

  // handles input from form
  handleInputChange = (e) => {
    const target = e.target;
    const value = target.name === "isIncluded" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  // upon checkbox click, adds friend to friendsIncluded array on expense and updates Firestore
  addIncluded = (expense, id) => {
    const { firestore, tripId, uid } = this.props;
    // Update expense
    const updExpense = {
      friendsInvolved: expense.friendsInvolved.concat(id),
    };
    console.log("Added: " + expense.id, id);

    // update expense in firestore
    firestore.update(
      {
        collection: "users",
        doc: uid,
        storeAs: `${tripId}-expenses`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expense.id },
        ],
      },
      updExpense
    );
  };

  // upon checkbox click, removes friend from friendsIncluded array on expense and updates Firestore

  removeIncluded = (expense, id) => {
    const { firestore, tripId, uid } = this.props;
    console.log("Removed: " + expense, id);

    // Update expense
    const updExpense = {
      friendsInvolved: expense.friendsInvolved.filter(
        (item) => !id.includes(item)
      ),
    };

    // update expense in firestore
    firestore.update(
      {
        collection: "users",
        doc: uid,
        storeAs: `${tripId}-expenses`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expense.id },
        ],
      },
      updExpense
    );
  };

  // method to render expense table in app
  renderExpenseTable() {
    const { expensesObj, expense, friends, friendsObj } = this.props;
    // const friendsInvolved = expense.friendsInvolved;
    const { showForm } = this.state;

    // console.log(this.props.expense);
    const editIcon = (
      // pencil/edit icon
      <svg
        className="bi bi-pencil-square"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
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

    const expenseArr = [];
    // for ()
    expenseArr.push([
      expense.name,
      this.renderWhoPaid(expense.whoPaid),
      parseFloat(
        expense.expenseAmount / expense.friendsInvolved.length
      ).toFixed(2),
      _.map(friends, (val, key) => {
        return (
          <Td key={key}>
            <Toggle
              checked={expense.friendsInvolved.includes(val.id)}
              value={val.id}
              name="isIncluded"
              onChange={() => {
                expense.friendsInvolved.includes(val.id)
                  ? this.removeIncluded(expense, val.id)
                  : this.addIncluded(expense, val.id);
              }}
            />
          </Td>
        );
      }),
      parseFloat(expense.expenseAmount).toFixed(2),
    ]);
    console.log(expenseArr);

    return expenseArr;
    //   <Tr key={this.props.key}>
    //     <Td>
    //       {expense.name}
    //       {this.renderEditForm(expense.id)}
    //       <div style={{ float: "right" }}>
    //         {/* trash/delete icon */}
    //         <svg
    //           className="bi bi-trash-fill ml-2"
    //           width="1em"
    //           height="1em"
    //           viewBox="0 0 16 16"
    //           fill="currentColor"
    //           xmlns="http://www.w3.org/2000/svg"
    //           onClick={this.handleDelete}
    //           cursor="pointer"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z"
    //             clipRule="evenodd"
    //           />
    //         </svg>
    //         <span
    //           className="ml-2"
    //           onClick={() => this.setState({ showForm: !showForm })}
    //         >
    //           {showForm ? (
    //             <button className="btn-danger">
    //               <i>Close</i>
    //             </button>
    //           ) : (
    //             editIcon
    //           )}
    //         </span>
    //       </div>
    //     </Td>
    //     {/* Who Paid for Expense */}
    //     {this.renderWhoPaid(expense.whoPaid)}
    //     {/* Cost per person for expense */}
    //     <Td>
    //       $
    //       {parseFloat(
    //         expense.expenseAmount / expense.friendsInvolved.length
    //       ).toFixed(2)}
    //     </Td>

    //     {/* Toggles whether friend is included in expense */}
    //     {_.map(friends, (val, key) => {
    //       return (
    //         <Td key={key}>
    //           <Toggle
    //             checked={expense.friendsInvolved.includes(val.id)}
    //             value={val.id}
    //             name="isIncluded"
    //             onChange={() => {
    //               expense.friendsInvolved.includes(val.id)
    //                 ? this.removeIncluded(expense, val.id)
    //                 : this.addIncluded(expense, val.id);
    //             }}
    //           />
    //         </Td>
    //       );
    //     })}
    //     {/* Expense Amount */}
    //     <Td>${parseFloat(expense.expenseAmount).toFixed(2)}</Td>
    //   </Tr>
    // );
  }

  render() {
    return <td>Hi</td>;
    // show expense table
    // console.log(this.RenderExpenseTable());
    // return this.renderExpenseTable();
  }
}

// connects to relevent Firestore collections and documents and passes to props
export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      storeAs: `${props.tripId}-expenses`,
      subcollections: [
        { collection: "trips", doc: props.tripId },
        { collection: "expenses" },
      ],
    },
    {
      collection: "users",
      doc: props.uid,
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
