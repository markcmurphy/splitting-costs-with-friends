import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import MaterialTable from "material-table";

import MUIDataTable from "mui-datatables";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";

import Toggle from "react-toggle";
import "react-toggle/style.css";

import ExpenseList from "./ExpenseList";
import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";
import LoadingSpinner from "../loading/LoadingSpinner";
import MaterialExpenseList from "./MaterialExpenseList";
// import { RenderExpenseTable } from "./MaterialExpenseList";

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
      data: [""],
      switchA: true,
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

  // handles deletion of expense from Firestore
  handleDelete = (expense) => {
    const { expenses, firestore, tripId, uid } = this.props;
    firestore.delete({
      collection: "users",
      doc: uid,
      storeAs: `${tripId.id}-expenses`,
      subcollections: [
        { collection: "trips", doc: tripId },
        { collection: "expenses", doc: expense },
      ],
    });
  };

  // renders name of friend who paid for expense
  renderWhoPaid(whoPaid) {
    // console.log(whoPaid);
    const { friends } = this.props;
    // console.log(friends);
    for (const friend of friends) {
      if (friend.id === whoPaid) {
        return friend.firstName;
      }
    }
    // if (friendsObj && friendsObj[whoPaid]) {
    //   return friendsObj[whoPaid].firstName;
    // } else {
    //   return null;
    // }
  }

  // upon checkbox click, removes friend from friendsIncluded array on expense and updates Firestore
  removeIncluded = (expense, id) => {
    const { firestore, tripId, uid } = this.props;
    // console.log(this.props);
    console.log("Removed: " + expense.id, id);

    // Update expense
    const updExpense = {
      friendsInvolved: expense.friendsInvolved.filter(
        (item) => !id.includes(item)
      ),
    };

    console.log(updExpense);

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

  renderFriendHeader() {
    const { friends, expenses } = this.props;

    const columns = [
      {
        name: "expenseName",
        label: "Expense Name",
        options: {
          filter: true,
        },
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

    _.map(friends, (val, key) => {
      columns.splice(3, 0, {
        name: val.firstName,
        label: val.firstName,
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Switch
                checked={value}
                value={value}
                name={"switchA"}
                color="primary"
                onChange={() => {
                  value
                    ? this.removeIncluded(expenses[tableMeta.rowIndex], val.id)
                    : this.addIncluded(expenses[tableMeta.rowIndex], val.id);
                }}
              />
            );
          },
        },
      });
    });
    return columns;
  }

  renderMaterialExpense() {
    const { expenses, friends, firestore, tripId } = this.props;
    const expenseArr = [];
    const expenseArr2 = [];

    _.map(expenses, (value, key) => {
      return expenseArr.push([
        //   expense name
        value.name,
        // who paid
        // null,
        this.renderWhoPaid(value.whoPaid),
        // cost per person
        parseFloat(value.expenseAmount / value.friendsInvolved.length).toFixed(
          2
        ),

        // null,
        friends
          .slice(0)
          .reverse()
          .map((val, key) => {
            return value.friendsInvolved.includes(val.id);
          }),
        // _.map(friends, (val, key) => {
        //   return value.friendsInvolved.includes(val.id);
        // }),
        parseFloat(value.expenseAmount).toFixed(2),
        value.id,
      ]);
    });

    for (const expense of expenseArr) {
      expenseArr2.push(expense.flat());
    }

    return expenseArr2;
  }

  //   lifecycle tests
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.expenses !== this.props.expenses) {
      console.log("Updated!");
    }
  }

  options = {
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    tableBodyHeight: "500px",
    rowsPerPage: 15,
    resizableColumns: "resizableColumns",
    onRowsDelete: (rowsDeleted, data, newTableData) => {
      const expenseArr = this.renderMaterialExpense();
      //   console.log(expenseArr[rowsDeleted.data[0]]);
      //   console.log(rowsDeleted.data[0].dataIndex);
      //   console.log(
      //     expenseArr[rowsDeleted.data[0].dataIndex][
      //       expenseArr[rowsDeleted.data[0].dataIndex].length - 1
      //     ]
      //   );

      for (const i of rowsDeleted.data) {
        this.handleDelete(
          expenseArr[i.dataIndex][expenseArr[i.dataIndex].length - 1]
        );

        // this.handleDelete(
        // console.log(

        //     expenseArr[rowsDeleted.data[i.dataIndex].dataIndex][
        //         expenseArr[rowsDeleted.data[i.dataIndex].dataIndex].length - 1
        //     ]
        //     )
        // );
      }

      //   console.log(rowsDeleted.data.length);

      // works
      //   this.handleDelete(
      //     expenseArr[rowsDeleted.data[0].dataIndex][
      //       expenseArr[rowsDeleted.data[0].dataIndex].length - 1
      //     ]
      //   );

      //   console.log(rowsDeleted);
      //   console.log(data);
      //   console.log(newTableData);
    },
  };

  render() {
    // console.log(this.options);
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <MUIDataTable
          title={"Expenses"}
          data={this.props.friends ? this.renderMaterialExpense() : [""]}
          columns={this.props.friends ? this.renderFriendHeader() : [""]}
          options={this.options}
        />
      </Suspense>
    );
  }
}

// gets clients from firestore and puts them in the clients prop
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

  connect(({ firestore: { ordered } }, props) => ({
    expenses: ordered[`${props.tripId}-expenses`],
    friends: ordered[`${props.tripId}-friends`],
  }))
)(RenderMaterialTable);
