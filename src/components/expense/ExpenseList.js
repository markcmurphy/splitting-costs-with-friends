import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import _ from "lodash";
import WhoPaid from "./WhoPaid";

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isIncluded: false,
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
    console.log(xfriends);
    console.log(friends);
    console.log(whoPaid);
    if (friends && friends[whoPaid]) {
      return <td>{friends[whoPaid].firstName}</td>;
    } else {
      return <td>''</td>;
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

    if (!isEmpty(xexpenses)) {
      return (
        <tr key={xexpenses.id}>
          {/* Delete Button */}
          <td>
            <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
            </button>
          </td>
          {/* Expense Name */}
          <td>{xexpenses.name}</td>
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
