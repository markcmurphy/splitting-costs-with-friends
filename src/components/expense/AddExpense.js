import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

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
          return <option value={value.id}>{value.firstName}</option>;
        })}
      </select>
    );

    return friendSelect;
  }

  renderFriendsInvolved() {
    const { friends } = this.props;
    console.log(this.props);
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

    firestore
      // .add(
      //   { collection: "expenses" },
      //   {
      //     name: expense,
      //     expenseAmount: Number(amount),
      //     friendsInvolved: friendsInvolved,
      //     whoPaid: whoPaid,
      //   }
      // )
      .add(
        {
          collection: "users",
          doc: "Dv8b8sjyMrX8HdWC13Gk3tZrUM22",
          subcollections: [
            { collection: "trips", doc: this.props.id },
            { collection: "expenses" },
          ],
        },
        {
          name: expense,
          expenseAmount: Number(amount),
          friendsInvolved: friendsInvolved,
          whoPaid: whoPaid,
        }
      )
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // firestore.update(
        //   { collection: "expenses", doc: docRef.id },
        //   { id: docRef.id }
        // );
      });

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
        <div className="card bg-dark mt-3 pl-1">
          <div className="card-header">Add Expense</div>
          <div className="card-body">
            <form onSubmit={this.formSubmit}>
              <div className="form-group">
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
                className="btn btn-success btn-block"
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
      <div
        style={{
          marginLeft: "5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* <button
          className="btn btn-secondary btn-sm mt-4"
          onClick={() => this.setState({ showForm: !showForm })}
          style={{
            width: "80%",
            marginLeft: "15%",
          }}
        >
          {showForm ? <i>Close</i> : <i>Add Expense</i>}
        </button> */}
        {showForm ? (
          <button
            className="btn btn-danger btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
            // style={{
            //   width: "80%",
            //   marginLeft: "15%",
            // }}
          >
            Close
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
            // style={{
            //   width: "80%",
            //   marginLeft: "15%",
            // }}
          >
            Add Expense{" "}
          </button>
        )}
        <div>
          <div className="">{this.renderForm()}</div>
        </div>
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: "Dv8b8sjyMrX8HdWC13Gk3tZrUM22",
      storeAs: `${props.id}-expenses`,
      subcollections: [
        { collection: "trips", doc: props.id },
        { collection: "expenses" },
      ],
    },
    {
      collection: "users",
      doc: "Dv8b8sjyMrX8HdWC13Gk3tZrUM22",
      storeAs: `${props.id}-friends`,
      subcollections: [
        { collection: "trips", doc: props.id },
        { collection: "friends" },
      ],
    },
  ]),

  connect(({ firestore: { ordered } }, props) => ({
    friends: ordered[`${props.id}-friends`],
    expenses: ordered[`${props.id}-expenses`],
  }))
  // connect((state, props) => ({
  //   expenses: state.firestore.ordered.expenses,
  //   friends: state.firestore.ordered.friends,
  // }))
)(AddExpense);
