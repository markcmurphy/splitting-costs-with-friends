import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import LoadingSpinner from "../loading/LoadingSpinner";
import FriendsInvolved from "./FriendsInvolved";

class EditExpense extends Component {
  constructor(props) {
    super(props);
    // Create refs
    this.nameInput = React.createRef();
    this.amountInput = React.createRef();
    this.friendsInvolvedInput = React.createRef();
    this.whoPaidInput = React.createRef();
  }

  state = {
    friendsInvolved: this.props.friendsInvolved,
  };

  renderFriend() {
    const { friends, whoPaid } = this.props;

    const friendSelect = (
      <select
        multiple={false}
        defaultValue={whoPaid}
        className="form-control"
        id="whoPaid"
        type="text"
        name="whoPaid"
        ref={this.whoPaidInput}
      >
        <option value="">Select Option</option>
        {_.map(friends, (value, key) => {
          return <option value={value.id}>{value.firstName}</option>;
        })}
      </select>
    );

    return friendSelect;
  }

  inputChangeMultiple = (e) => {
    console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });

    const optionValues = _.map(e.target.selectedOptions, (value, key) => {
      return value.value;
    });
  };

  renderFriendsInvolved() {
    const { friendsInvolved, friends, uid } = this.props;
    console.log(this.props);
    const friendSelectMultiple = (
      <select
        multiple={true}
        defaultValue={friendsInvolved}
        onChange={this.inputChangeMultiple}
        className="form-control"
        id="friendsInvolved"
        type="text"
      >
        {_.map(friends, (value, key) => {
          return <FriendsInvolved key={value.id} friends={value} uid={uid} />;
        })}
      </select>
    );
    return <div>{friendSelectMultiple}</div>;
  }

  formSubmit = (e) => {
    e.preventDefault();

    const { firestore, tripId, expenseId, uid } = this.props;

    // Update expense
    const updExpense = {
      name: this.nameInput.current.value,
      expenseAmount: Number(this.amountInput.current.value),
      friendsInvolved: this.state.friendsInvolved,
      whoPaid: this.whoPaidInput.current.value,
    };

    // update expense in firestore
    firestore.update(
      {
        collection: "users",
        doc: uid,
        storeAs: `${tripId}-expense`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expenseId },
        ],
      },
      updExpense
    );
  };

  render() {
    const { expense, amount } = this.props;
    console.log(this.props);
    if (this.props) {
      return (
        <div>
          <div className="card mb-4 mt-4 ">
            <div className="card-header">Edit Expense</div>
            <div className="card-body">
              <form onSubmit={this.formSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Expense Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="expense name"
                    minLength="2"
                    required
                    ref={this.nameInput}
                    defaultValue={expense}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expenseAmount">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    minLength="1"
                    required
                    ref={this.amountInput}
                    defaultValue={amount}
                  />
                </div>

                <div className="form-group">
                  <label>Friends Involved {""}</label>
                  {this.renderFriendsInvolved()}
                </div>

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
        </div>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}

export default EditExpense;
