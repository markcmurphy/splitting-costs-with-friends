import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import ExpenseList from "./ExpenseList";
import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";

class RenderExpenseList extends Component {
  state = {
    showForm: false,
    expense: "",
    amount: 0,
    friendsInvolved: [""],
    whoPaid: "",
    total: 0,
  };

  //   inputChange = (e) => {
  //     this.setState({
  //       [e.target.name]: e.target.value,
  //     });
  //   };

  //   inputChangeMultiple = (e) => {
  //     this.setState({
  //       friendsInvolved: Array.from(
  //         e.target.selectedOptions,
  //         (item) => item.value
  //       ),
  //     });
  //   };

  addTotalExpenses = () => {
    const { expenses } = this.props;
    let newTotal = 0;
    for (let x in expenses) {
      newTotal += Number(expenses[x].expenseAmount);
    }
    return newTotal;
  };

  renderFriend() {
    const { friends } = this.props;
    const friendSelect = (
      <select
        multiple={false}
        value={this.state.whoPaid}
        onChange={this.inputChange}
        id="whoPaid"
        type="text"
        name="whoPaid"
      >
        <option value="">Select Option</option>
        {_.map(friends, (value, key) => {
          return <WhoPaid key={value.id} friends={value} />;
        })}
      </select>
    );
    return <div>{friendSelect}</div>;
  }

  renderFriendHeader = (props) => {
    const { friends } = this.props;
    const friendsList = _.map(friends, (value, key) => {
      return <th key={key}>{value.firstName}</th>;
    });

    if (friends) {
      return friendsList;
    } else {
      return <th>Loading</th>;
    }
  };

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;
    const friendSelectMultiple = (
      <select
        multiple={true}
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        id="friendsInvolved"
        type="text"
      >
        {_.map(friends, (value, key) => {
          return <FriendsInvolved key={value.id} friends={value} />;
        })}
      </select>
    );

    return <div>{friendSelectMultiple}</div>;
  }

  //   formSubmit = (e) => {
  //     e.preventDefault();
  //     const { expense, amount, friendsInvolved, whoPaid } = this.state;
  //     const { firestore } = this.props;

  //     firestore.add(
  //       { collection: "expenses" },
  //       {
  //         name: expense,
  //         expenseAmount: Number(amount),
  //         friendsInvolved: friendsInvolved,
  //         whoPaid: whoPaid,
  //       }
  //     );
  //     this.setState({
  //       expense: "",
  //       amount: 0,
  //       friendsInvolved: [""],
  //       whoPaid: "",
  //     });
  //   };

  //   renderForm = () => {
  //     const { showForm, expense, amount, friendsInvolved, whoPaid } = this.state;
  //     if (showForm) {
  //       return (
  //         <div className="mt-4">
  //           <form onSubmit={this.formSubmit}>
  //             <div>
  //               <i>Add Expense</i>
  //               {/* Cost */}
  //               <div className="form-group mt-4">
  //                 <label>
  //                   Cost {""}
  //                   <input
  //                     value={expense}
  //                     onChange={this.inputChange}
  //                     id="friendNext"
  //                     type="text"
  //                     name="expense"
  //                   />
  //                 </label>
  //               </div>
  //               {/* Amount */}
  //               <div className="form-group">
  //                 <label>
  //                   Amount {""}
  //                   <input
  //                     value={amount}
  //                     onChange={this.inputChange}
  //                     type="number"
  //                     id="amount"
  //                     name="amount"
  //                   />
  //                 </label>
  //               </div>
  //               {/* Friends involved */}
  //               <div className="form-group">
  //                 <label>Friends Involved {""}</label>
  //                 {this.renderFriendsInvolved()}
  //               </div>
  //               {/* Who Paid */}
  //               <div className="form-group">
  //                 <label>Who Paid</label>
  //                 {this.renderFriend()}
  //               </div>
  //             </div>
  //             <input className="btn btn-primary" type="submit" value="Submit" />
  //           </form>
  //         </div>
  //       );
  //     }
  //   };

  renderExpense = (props) => {
    const { expenses } = this.props;

    const expensesList = _.map(expenses, (value, key) => {
      return <ExpenseList key={value.id} expenses={value} />;
    });
    if (!_.isEmpty(expenses)) {
      return expensesList;
    }
    return (
      //   <div>
      <tr>
        <td className="mt-4">
          <h4>You have no expenses logged!</h4>
        </td>
      </tr>
      //   </div>
    );
  };

  totalPerPerson() {
    const { friends, expenses } = this.props;
    const friendsObj = {};

    _.map(friends, (value, key) => {
      for (let expense of expenses) {
        if (
          friendsObj[value.id] &&
          expense.friendsInvolved.includes(value.id)
        ) {
          let bal = expense.expenseAmount / expense.friendsInvolved.length;
          friendsObj[value.id] += bal;
        } else if (
          !friendsObj[value.id] &&
          expense.friendsInvolved.includes(value.id)
        ) {
          let bal = expense.expenseAmount / expense.friendsInvolved.length;
          friendsObj[value.id] = bal;
        }
      }
    });

    return friendsObj;
  }
  renderTotalPerPerson(friendsObj) {
    const { friends } = this.props;

    const map = _.map(friends, (value, key) => {
      if (friendsObj[value.id]) {
        return (
          <td key={value.id}>${parseFloat(friendsObj[value.id]).toFixed(2)}</td>
        );
      } else {
        return <td key={value.id}>$0</td>;
      }
    });
    return map;
  }

  totalAmountPaidPerPerson() {
    const { friends, expenses } = this.props;
    const friendsObj = {};

    _.map(friends, (value, key) => {
      for (let expense of expenses) {
        if (friendsObj[value.id] && expense.whoPaid.includes(value.id)) {
          let bal = expense.expenseAmount;
          friendsObj[value.id] += bal;
        } else if (
          !friendsObj[value.id] &&
          expense.whoPaid.includes(value.id)
        ) {
          let bal = expense.expenseAmount;
          friendsObj[value.id] = bal;
        }
      }
    });

    // const map1 = _.map(friends, (value, key) => {
    //   if (friendsObj[value.id]) {
    //     return <td key={value.id}>${friendsObj[value.id].toFixed(2)}</td>;
    //   } else {
    //     return <td key={value.id}>$0</td>;
    //   }
    // });
    // console.log(friendsObj);
    return friendsObj;
  }

  addTotalPaidExpenses = (obj) => {
    let newTotal = 0;
    for (let x in obj) {
      newTotal += Number(obj[x]);
    }
    return newTotal;
  };

  renderTotalAmountPaidPerPerson() {
    const { friends } = this.props;

    const friendsObj = this.totalAmountPaidPerPerson();

    const map1 = _.map(friends, (value, key) => {
      if (friendsObj[value.id]) {
        return <td key={value.id}>${friendsObj[value.id].toFixed(2)}</td>;
      } else {
        return <td key={value.id}>$0</td>;
      }
    });
    return map1;
  }

  renderTotalDifferencePerPerson() {
    const { friends, expenses } = this.props;
    // const { totalExpensesPerPerson } = this.state;
    const friendsObj = {};

    _.map(friends, (value, key) => {
      for (let expense of expenses) {
        let expenseAmount = expense.expenseAmount;
        let costPerPerson = expenseAmount / expense.friendsInvolved.length;
        let net = costPerPerson - expenseAmount;

        if (friendsObj[value.id]) {
          if (
            expense.friendsInvolved.includes(value.id) &&
            expense.whoPaid.includes(value.id)
          ) {
            friendsObj[value.id] += net;
          } else if (expense.whoPaid.includes(value.id)) {
            friendsObj[value.id] += expenseAmount;
          } else if (expense.friendsInvolved.includes(value.id)) {
            friendsObj[value.id] += costPerPerson;
          }
        } else if (!friendsObj[value.id]) {
          if (
            expense.friendsInvolved.includes(value.id) &&
            expense.whoPaid.includes(value.id)
          ) {
            friendsObj[value.id] = net;
          } else if (expense.whoPaid.includes(value.id)) {
            friendsObj[value.id] = expenseAmount;
          } else if (expense.friendsInvolved.includes(value.id)) {
            friendsObj[value.id] = costPerPerson;
          }
        }
      }
    });

    const map = _.map(friends, (value, key) => {
      if (friendsObj[value.id]) {
        return <td key={value.id}>${friendsObj[value.id].toFixed(2)}</td>;
      } else {
        return <td key={value.id}>$0</td>;
      }
    });

    return map;
  }

  render() {
    // const { showForm } = this.state;

    return (
      <div>
        <div>
          <div className="mt-4">
            <table className="table table-bordered table-dark ">
              <thead className="thead-inverse">
                <tr>
                  <th>Delete</th>
                  <th>Expense Name</th>
                  <th>Who Paid</th>
                  {/* Insert name of friend as table heading */}
                  <th>Cost Per Person</th>
                  {this.renderFriendHeader()}
                  <th>Expense Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.renderExpense()}
                <tr>
                  <th colSpan="4">Total Owed</th>
                  {this.renderTotalPerPerson(this.totalPerPerson())}
                  <td className="table-success" style={{ color: "black" }}>
                    <strong>
                      ${this.addTotalPaidExpenses(this.totalPerPerson())}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <th colSpan="4">Total Paid</th>
                  {this.renderTotalAmountPaidPerPerson()}
                  <td className="table-success" style={{ color: "black" }}>
                    <strong>
                      $
                      {this.addTotalPaidExpenses(
                        this.totalAmountPaidPerPerson()
                      )}
                    </strong>
                  </td>
                </tr>
                <tr>
                  {/* TODO: have conditional colors for cells */}
                  <th colSpan="4">Difference</th>
                  {this.renderTotalDifferencePerPerson()}
                  {/* <td className="table-success" style={{ color: "black" }}>
                    <strong>${this.addTotalExpenses()}</strong>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
          {/* {this.renderForm()} */}
        </div>
        {/* <div>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? <i>Close</i> : <i>Add Expense</i>}
          </button>
        </div> */}
      </div>
    );
  }
}

export default compose(
  // gets clients from firestore and puts them in the clients prop
  firestoreConnect([{ collection: "expenses" }, { collection: "friends" }]),

  connect((state, props) => ({
    expenses: state.firestore.ordered.expenses,
    friends: state.firestore.ordered.friends,
  }))
)(RenderExpenseList);
