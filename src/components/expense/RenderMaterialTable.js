import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import MaterialTable from "material-table";

import MUIDataTable from "mui-datatables";

import ExpenseList from "./ExpenseList";
import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";
import LoadingSpinner from "../loading/LoadingSpinner";

class RenderMaterialTable extends Component {
  constructor(props) {
    // console.log(props);
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

  //   lifecycle tests
  componentDidUpdate() {
    console.log("Updated!");
  }
  componentDidMount() {
    console.log("Mounted!");
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
          return (
            <FriendsInvolved
              key={value.id}
              friends={value}
              uid={this.props.uid}
            />
          );
        })}
      </select>
    );

    return <div>{friendSelectMultiple}</div>;
  }

  renderExpense() {
    const { expenses, friends, firestore, tripId } = this.props;

    const expensesList = _.map(expenses, (value, key) => {
      return (
        <ExpenseList
          key={key}
          expense={value}
          friends={friends}
          firestore={firestore}
          tripId={tripId}
          uid={this.props.uid}
        />
      );
    });
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      return expensesList;
    }
    return (
      <Tr>
        <Td className="mt-4">
          <h4>You have no expenses logged!</h4>
        </Td>
      </Tr>
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
    return friendsObj;
  }

  renderTotalPerPerson(friendsObj) {
    const { friends } = this.props;
    const map = _.map(friends, (value, key) => {
      if (friendsObj[value.id]) {
        return (
          <Td key={value.id}>${parseFloat(friendsObj[value.id]).toFixed(2)}</Td>
        );
      } else {
        return <Td key={value.id}>$0</Td>;
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
        return <Td key={value.id}>${friendsObj[value.id].toFixed(2)}</Td>;
      } else {
        return <Td key={value.id}>$0</Td>;
      }
    });
    return map1;
  }

  renderTotalDifferencePerPerson1() {
    const { friends, expenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    let diffAmount = {};
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      _.map(friends, (value, key) => {
        diffAmount[value.id] = 0;
        if (friendsObj[value.id]) {
          diffAmount[value.id] -= friendsObj1[value.id];
        }

        diffAmount[value.id] += friendsObj[value.id];
      });
    }
  }

  renderTotalDifferencePerPerson() {
    const { friends, expenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    const diffAmount = {};
    if (!isEmpty(expenses) && !isEmpty(friends)) {
      _.map(friends, (value, key) => {
        diffAmount[value.id] = 0;
        diffAmount[value.id] += friendsObj[value.id] - friendsObj1[value.id];
      });
    }

    const map = _.map(friends, (value, key) => {
      if (diffAmount[value.id]) {
        return <Td key={value.id}>${diffAmount[value.id].toFixed(2)}</Td>;
      }
    });

    return map;
  }

  //   renderFriendHeader() {
  //     const { friends } = this.props;
  //     console.log(friends);
  //     const friendsList = _.map(friends, (value, key) => {
  //       return <Th key={key}>{value.firstName}</Th>;
  //     });
  //     if (!isEmpty(friends)) {
  //       return friendsList;
  //     }
  //   }

  renderFriendHeader() {
    const { friends } = this.props;
    console.log(friends);
    const columns = [
      {
        name: "expenseName",
        label: "Expense Name",
      },
      {
        name: "whoPaid",
        label: "Who Paid",
      },
      {
        name: "costPerPerson",
        label: "Cost Per Person",
      },

      {
        name: "expenseAmount",
        label: "Expense Amount",
      },
    ];
    // const friendsList = _.map(friends, (value, key) => {
    //   columns.push({
    //       title: value.firstName,
    //       label: value.firstName
    //   })
    //   return <Th key={key}>{value.firstName}</Th>;
    // });

    //   return <Th key={key}>{value.firstName}</Th>;

    if (!isEmpty(friends)) {
      friends.forEach((value) => {
        columns.splice(3, 0, {
          name: value.firstName,
          label: value.firstName,
        });
      });
      console.log(columns);
      return columns;
    }
  }

  render() {
    const columns = this.renderFriendHeader();

    const data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];
    this.renderFriendHeader();
    return (
      <>
        {/* material-ui-datatables */}

        <MUIDataTable
          title={"Employee List"}
          data={data}
          columns={columns}
          //   options={options}
        />
        {/* // Old Table */}

        <Table
          key={_.map(this.props.friends, (value, key) => {
            return key;
          })}
          className={"table table-striped table-bordered"}
        >
          <Thead>
            <Tr>
              <Th>Expense Name</Th>
              <Th>Who Paid</Th>
              <Th>Cost Per Person</Th>
              {/* Insert name of friend as table heading */}
              {/* {this.renderFriendHeader()} */}
              <Th>Expense Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.renderExpense()}
            <Tr>
              <Th colSpan="3">Total Owed</Th>
              {this.renderTotalPerPerson(this.totalPerPerson())}
              <Td className="table-success" style={{ color: "black" }}>
                <strong>
                  ${this.addTotalPaidExpenses(this.totalPerPerson())}
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Th colSpan="3">Total Paid</Th>
              {this.renderTotalAmountPaidPerPerson()}
              <Td className="table-success" style={{ color: "black" }}>
                <strong>
                  ${this.addTotalPaidExpenses(this.totalAmountPaidPerPerson())}
                </strong>
              </Td>
            </Tr>
            <Tr>
              {/* TODO: have conditional colors for cells */}
              <Th colSpan="3">Difference</Th>
              {this.renderTotalDifferencePerPerson()}
            </Tr>
          </Tbody>
        </Table>
        {/* // </div> */}
      </>
    );
  }
}

export default compose(
  // gets clients from firestore and puts them in the clients prop
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

  connect(({ firestore: { ordered } }, props) => ({
    expenses: ordered[`${props.tripId}-expenses`],
    friends: ordered[`${props.tripId}-friends`],
  }))
)(RenderMaterialTable);
