import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import WhoPaid from "./WhoPaid.js";
import FriendsInvolved from "./FriendsInvolved";

class AddExpense extends Component {
  state = {
    showForm: false,
    expense: "",
    amount: 0,
    friendsInvolved: [""],
    whoPaid: "",
    total: 0,
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  inputChangeMultiple = (e) => {
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });
  };

  renderFriend() {
    const { friends } = this.props;
    const friendSelect = (
      <select
        multiple={false}
        value={this.state.whoPaid}
        onChange={this.inputChange}
        className="form-control"
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

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;
    const friendSelectMultiple = (
      <select
        multiple={true}
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        className="form-control"
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

  formSubmit = (e) => {
    e.preventDefault();
    const { expense, amount, friendsInvolved, whoPaid } = this.state;
    const { firestore } = this.props;

    firestore.add(
      { collection: "expenses" },
      {
        name: expense,
        expenseAmount: Number(amount),
        friendsInvolved: friendsInvolved,
        whoPaid: whoPaid,
      }
    );
    this.setState({
      expense: "",
      amount: 0,
      friendsInvolved: [""],
      whoPaid: "",
    });
  };

  renderForm = () => {
    const { showForm, expense, amount } = this.state;
    if (showForm) {
      return (
        <div className="card mb-4 mt-4 bg-dark">
          <div className="card-header">Add Expense</div>
          <div className="card-body">
            <form onSubmit={this.formSubmit}>
              <div className="form-group mt-4">
                <label>Cost</label>
                <input
                  value={expense}
                  className="form-control"
                  onChange={this.inputChange}
                  id="friendNext"
                  type="text"
                  name="expense"
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  value={amount}
                  onChange={this.inputChange}
                  className="form-control"
                  type="number"
                  id="amount"
                  name="amount"
                />
              </div>
              {/* Friends involved */}
              <div className="form-group">
                <label>Friends Involved {""}</label>
                {this.renderFriendsInvolved()}
              </div>
              {/* Who Paid */}
              <div className="form-group">
                <label>Who Paid</label>
                {this.renderFriend()}
              </div>

              <input
                type="submit"
                value="Submit"
                className="btn btn-primary btn-block"
              />
            </form>
          </div>
        </div>
      );
    }
  };

  render() {
    const { showForm } = this.state;

    return (
      <div>
        <div>
          <div className="mt-4">{this.renderForm()}</div>
        </div>
        <div>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? <i>Close</i> : <i>Add Expense</i>}
          </button>
        </div>
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
)(AddExpense);
