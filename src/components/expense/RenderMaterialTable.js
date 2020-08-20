import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Td } from "react-super-responsive-table";

import MUIDataTable from "mui-datatables";
import Switch from "@material-ui/core/Switch";

import "react-toggle/style.css";

import ContentEditable from "react-contenteditable";

import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";
import LoadingSpinner from "../loading/LoadingSpinner";
import CircularProgress from "@material-ui/core/CircularProgress";
import TransferList from "../layout/TransferList.js";

class RenderMaterialTable extends Component {
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
    const { tripExpenses } = this.props;
    let newTotal = 0;
    for (let x in tripExpenses) {
      newTotal += Number(tripExpenses[x].expenseAmount);
    }
    return newTotal;
  };

  renderFriend() {
    const { tripFriendIDs } = this.props;
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

        {_.map(tripFriendIDs, (value, key) => {
          return <WhoPaid key={value.id} friends={value} />;
        })}
      </select>
    );
    if (!isEmpty(tripFriendIDs)) {
      return <div>{friendSelect}</div>;
    } else {
      return <LoadingSpinner />;
    }
  }

  renderFriendsInvolved() {
    const { tripFriendIDs } = this.props;
    const { friendsInvolved } = this.state;
    const friendSelectMultiple = (
      <select
        multiple={true}
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        id="friendsInvolved"
        type="text"
      >
        {_.map(tripFriendIDs, (value, key) => {
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

  totalPerPerson() {
    const { tripFriendIDs, tripExpenses } = this.props;
    const friendsObj = {};

    if (!isEmpty(tripExpenses) && !isEmpty(tripFriendIDs)) {
      _.map(tripFriendIDs, (value, key) => {
        for (let expense of tripExpenses) {
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
    const { tripFriendIDs } = this.props;
    const map = _.map(tripFriendIDs, (value, key) => {
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
    const { tripFriendIDs, tripExpenses } = this.props;
    const friendsObj = {};
    if (!isEmpty(tripExpenses) && !isEmpty(tripFriendIDs)) {
      _.map(tripFriendIDs, (value, key) => {
        for (let expense of tripExpenses) {
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
    const { tripFriendIDs } = this.props;

    const friendsObj = this.totalAmountPaidPerPerson();

    const map1 = _.map(tripFriendIDs, (value, key) => {
      if (friendsObj[value.id]) {
        return <Td key={value.id}>${friendsObj[value.id].toFixed(2)}</Td>;
      } else {
        return <Td key={value.id}>$0</Td>;
      }
    });
    return map1;
  }

  renderTotalDifferencePerPerson1() {
    const { tripFriendIDs, tripExpenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    let diffAmount = {};
    if (!isEmpty(tripExpenses) && !isEmpty(tripFriendIDs)) {
      _.map(tripFriendIDs, (value, key) => {
        diffAmount[value.id] = 0;
        if (friendsObj[value.id]) {
          diffAmount[value.id] -= friendsObj1[value.id];
        }

        diffAmount[value.id] += friendsObj[value.id];
      });
    }
  }

  renderTotalDifferencePerPerson() {
    const { tripFriendIDs, tripExpenses } = this.props;
    let friendsObj = this.totalAmountPaidPerPerson();
    let friendsObj1 = this.totalPerPerson();
    const diffAmount = {};
    if (!isEmpty(tripExpenses) && !isEmpty(tripFriendIDs)) {
      _.map(tripFriendIDs, (value, key) => {
        diffAmount[value.id] = 0;
        diffAmount[value.id] += friendsObj[value.id] - friendsObj1[value.id];
      });
    }

    const map = _.map(tripFriendIDs, (value, key) => {
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
        collection: "expenses",
        doc: expense.id,
        // storeAs: `${tripId}-expenses`,
        // subcollections: [
        //   { collection: "trips", doc: tripId },
        //   { collection: "expenses", doc: expense.id },
        // ],
      },
      updExpense
    );
  };

  // handles deletion of expense from Firestore
  handleDelete = (expense) => {
    const { firestore, tripId, uid } = this.props;
    console.log(expense);
    firestore.delete({
      collection: "expenses",
      doc: expense,
      // storeAs: `${tripId.id}-expenses`,
      // subcollections: [
      //   { collection: "trips", doc: tripId },
      //   { collection: "expenses", doc: expense },
      // ],
    });
  };

  // renders name of friend who paid for expense
  renderWhoPaid(whoPaid) {
    // console.log(whoPaid);
    const { tripFriendIDs } = this.props;
    // console.log(tripFriendIDs);
    for (const friend of tripFriendIDs) {
      if (friend.id === whoPaid) {
        return friend.username;
      }
    }
    // if (friendsObj && friendsObj[whoPaid]) {
    //   return friendsObj[whoPaid].label;
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
        collection: "expenses",
        doc: expense.id,
        // storeAs: `${tripId}-expenses`,
        // subcollections: [
        //   { collection: "trips", doc: tripId },
        //   { collection: "expenses", doc: expense.id },
        // ],
      },
      updExpense
    );
  };

  renderFriendHeader() {
    const { tripFriendIDs, tripExpenses, tripId } = this.props;

    const columns = [
      {
        name: "expenseName",
        label: "Expense Name",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <ContentEditable
                html={value}
                data-column="name"
                data-value={value}
                data-row={tableMeta.rowIndex}
                disabled={false}
                onChange={(e) =>
                  this.handleContentEditableUpdate(
                    e,
                    tripExpenses[tableMeta.rowIndex]
                  )
                }

                // onBlur={(e) =>
                //   this.handleChange(e, expenses[tableMeta.rowIndex])
                // }
              />
            );
          },
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

    _.map(tripFriendIDs, (val, key) => {
      // console.log(val);
      columns.splice(3, 0, {
        name: val.username,
        label: val.username,
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
                    ? this.removeIncluded(
                        tripExpenses[tableMeta.rowIndex],
                        val.id
                      )
                    : this.addIncluded(
                        tripExpenses[tableMeta.rowIndex],
                        val.id
                      );
                }}
              />
            );
          },
        },
      });
    });
    return columns;
  }

  handleContentEditableUpdate = (event, expense) => {
    const { firestore, tripId, uid } = this.props;
    const {
      target: { value },
    } = event;

    // update expense in firestore
    firestore.update(
      {
        collection: "expenses",
        doc: expense.id,
      },
      { expenseName: value }
    );
  };

  renderMaterialExpense() {
    const { tripExpenses, tripFriendIDs } = this.props;
    const expenseArr = [];
    const expenseArr2 = [];

    _.map(tripExpenses, (value, key) => {
      return expenseArr.push([
        //   expense name
        value.expenseName,
        // who paid
        this.renderWhoPaid(value.whoPaid),
        // cost per person
        "$" +
          parseFloat(
            value.expenseAmount / value.friendsInvolved.length
          ).toFixed(2),
        // tripFriendIDs involved
        tripFriendIDs
          .slice(0)
          .reverse()
          .map((val, key) => {
            return value.friendsInvolved.includes(val.id);
          }),
        // expense amount
        "$" + parseFloat(value.expenseAmount).toFixed(2),
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
    if (prevProps.tripExpenses !== this.props.tripExpenses) {
      console.log("Updated!");
    }
  }

  options = {
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    rowsPerPage: 15,
    resizableColumns: "resizableColumns",
    onRowsDelete: (rowsDeleted, data, newTableData) => {
      const expenseArr = this.renderMaterialExpense();
      for (const i of rowsDeleted.data) {
        this.handleDelete(
          expenseArr[i.dataIndex][expenseArr[i.dataIndex].length - 1]
        );
      }
    },
  };

  render() {
    return (
      <Suspense fallback={<CircularProgress />}>
        <MUIDataTable
          title={
            this.props.tripName ? (
              this.props.tripName.tripName + " Expenses"
            ) : (
              <CircularProgress />
            )
          }
          data={this.props.tripFriendIDs ? this.renderMaterialExpense() : [""]}
          columns={this.props.tripFriendIDs ? this.renderFriendHeader() : [""]}
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
      where: [["onTrips", "array-contains", props.tripId]],
      storeAs: `${props.tripId}-tripFriendIDs`,
    },
    {
      collection: "expenses",
      where: [["tripID", "==", props.tripId]],
      storeAs: `${props.tripId}-expenses1`,
    },
    {
      collection: "trips",
      doc: props.tripId,
      // where: [["tripID", "==", props.tripId]],
      storeAs: `${props.tripId}-tripName`,
    },
  ]),
  connect(({ firestore: { ordered, data } }, props) => ({
    tripFriendIDs: ordered[`${props.tripId}-tripFriendIDs`],
    tripExpenses: ordered[`${props.tripId}-expenses1`],
    tripName: data[`${props.tripId}-tripName`],
  }))
)(RenderMaterialTable);
