import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import ExpenseList from "./ExpenseList";
import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";
import LoadingSpinner from "../loading/LoadingSpinner";

class RenderExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      expense: "",
      amount: 0,
      friendsInvolved: [""],
      whoPaid: "",
      total: 0,
      totals: {},
    };
  }

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
    if (!isEmpty(friends)) {
      return <div>{friendSelect}</div>;
    } else {
      return <LoadingSpinner />;
    }
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

  renderExpense() {
    const { expenses, friends } = this.props;

    const expensesList = _.map(expenses, (value, key) => {
      return (
        <ExpenseList key={value.id} xexpenses={value} xfriends={friends} />
      );
    });
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      return expensesList;
    }
    return (
      <tr>
        <td className="mt-4">
          <h4>You have no expenses logged!</h4>
        </td>
      </tr>
    );
  }

  totalPerPerson() {
    const { friends, expenses } = this.props;
    const friendsObj = {};

    if (!isEmpty(expenses) && !isEmpty(friends)) {
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
    }
    // this.setState({
    //   totals: friendsObj,
    // });
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
    if (!isEmpty(expenses) && !isEmpty(friends)) {
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
          } else if (!friendsObj[value.id]) {
            friendsObj[value.id] = 0;
          }
        }
      });
    }

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

  renderTotalDifferencePerPerson1() {
    const { friends, expenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    let diffAmount = {};
    console.log(friendsObj);
    console.log(friendsObj1);
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      _.map(friends, (value, key) => {
        diffAmount[value.id] = 0;
        if (friendsObj[value.id]) {
          diffAmount[value.id] -= friendsObj1[value.id];
        }

        diffAmount[value.id] += friendsObj[value.id];
        console.log(friendsObj1);
        // console.log(value.id + " " + diffAmount[value.id]);
      });
    }
    console.log(diffAmount);
  }

  renderTotalDifferencePerPerson() {
    const { friends, expenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    const diffAmount = {};
    // const friendsObj = {};
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      _.map(friends, (value, key) => {
        // for (let expense of expenses) {
        // let expenseAmount = expense.expenseAmount;
        // let costPerPerson = expenseAmount / expense.friendsInvolved.length;
        // let net = costPerPerson - expenseAmount;
        console.log(friendsObj[value.id]);
        console.log(friendsObj1[value.id]);
        // if (diffAmount[value.id]) {
        diffAmount[value.id] = 0;
        diffAmount[value.id] += friendsObj[value.id] - friendsObj1[value.id];
        // } else if (!diffAmount[value.id]) {
        // diffAmount[value.id] = 0;
        // }
        // if (
        //   expense.friendsInvolved.includes(value.id) &&
        //   expense.whoPaid.includes(value.id)
        // ) {
        //   friendsObj[value.id] = net * -1;
        //   console.log(net);
        // } else if (expense.whoPaid.includes(value.id)) {
        //   friendsObj[value.id] = expenseAmount;
        // } else if (expense.friendsInvolved.includes(value.id)) {
        //   friendsObj[value.id] = costPerPerson;
        // }
      });
      console.log(diffAmount);
      // return diffAmount;
    }

    const map = _.map(friends, (value, key) => {
      if (diffAmount[value.id]) {
        return <td key={value.id}>${diffAmount[value.id].toFixed(2)}</td>;
      }
      // else {
      // return <td key={value.id}>$0</td>;
      // }
    });

    return map;
  }
  // renderTotalDifferencePerPerson() {
  //   const { friends, expenses } = this.props;
  //   const friendsObj = {};
  //   if (!isEmpty(expenses) && !isEmpty(friends)) {
  //     _.map(friends, (value, key) => {
  //       for (let expense of expenses) {
  //         let expenseAmount = expense.expenseAmount;
  //         let costPerPerson = expenseAmount / expense.friendsInvolved.length;
  //         let net = costPerPerson - expenseAmount;

  //         if (friendsObj[value.id]) {
  //           if (
  //             expense.friendsInvolved.includes(value.id) &&
  //             expense.whoPaid.includes(value.id)
  //           ) {
  //             friendsObj[value.id] -= net;
  //             console.log(net);
  //           } else if (expense.whoPaid.includes(value.id)) {
  //             friendsObj[value.id] += expenseAmount;
  //           } else if (expense.friendsInvolved.includes(value.id)) {
  //             friendsObj[value.id] += costPerPerson;
  //           }
  //         } else if (!friendsObj[value.id]) {
  //           if (
  //             expense.friendsInvolved.includes(value.id) &&
  //             expense.whoPaid.includes(value.id)
  //           ) {
  //             friendsObj[value.id] = net * -1;
  //             console.log(net);
  //           } else if (expense.whoPaid.includes(value.id)) {
  //             friendsObj[value.id] = expenseAmount;
  //           } else if (expense.friendsInvolved.includes(value.id)) {
  //             friendsObj[value.id] = costPerPerson;
  //           }
  //         }
  //       }
  //     });
  //     console.log(friendsObj);
  //   }

  //   const map = _.map(friends, (value, key) => {
  //     if (friendsObj[value.id]) {
  //       return <td key={value.id}>${friendsObj[value.id].toFixed(2)}</td>;
  //     } else {
  //       return <td key={value.id}>$0</td>;
  //     }
  //   });

  //   return map;
  // }

  render() {
    return (
      <div>
        <div>
          <div className="mt-4">
            <table className="table table-bordered table-dark ">
              <thead className="thead-inverse">
                <tr>
                  {/* <th>Delete</th> */}
                  <th>Expense Name</th>
                  <th>Who Paid</th>
                  <th>Cost Per Person</th>
                  {/* Insert name of friend as table heading */}
                  {this.renderFriendHeader()}
                  <th>Expense Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.renderExpense()}
                <tr>
                  <th colSpan="3">Total Owed</th>
                  {this.renderTotalPerPerson(this.totalPerPerson())}
                  <td className="table-success" style={{ color: "black" }}>
                    <strong>
                      ${this.addTotalPaidExpenses(this.totalPerPerson())}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <th colSpan="3">Total Paid</th>
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
                  <th colSpan="3">Difference</th>
                  {this.renderTotalDifferencePerPerson()}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    { collection: "friends", storeAs: "guests" },
    { collection: "expenses", storeAs: "expenses" },
  ]),
  connect((state) => ({
    expenses: state.firestore.ordered.expenses,
    friends: state.firestore.ordered.friends,
  }))
)(RenderExpenseList);
