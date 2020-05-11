import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

class EditExpense extends Component {
  constructor(props) {
    super(props);
    // Create refs
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.emailInput = React.createRef();
    this.phoneInput = React.createRef();
    this.balanceInput = React.createRef();
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { firestore, friend, history } = this.props;

    // Update friend
    const updFriend = {
      firstName: this.firstNameInput.current.value,
      lastName: this.lastNameInput.current.value,
      email: this.emailInput.current.value,
      phone: this.phoneInput.current.value,
      balance:
        this.balanceInput.current.value === ""
          ? 0
          : this.balanceInput.current.value,
    };

    // update friend in firestore
    firestore
      .update({ collection: "friends", doc: friend.id }, updFriend)
      .then(history.push("/"));
  };

  render() {
    const { friend } = this.props;

    if (friend) {
      return (
        <div>
          <div className="card mb-4 mt-4">
            <div className="card-header">Add Friend</div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    minLength="2"
                    required
                    ref={this.firstNameInput}
                    defaultValue={friend.firstName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    minLength="2"
                    required
                    ref={this.lastNameInput}
                    defaultValue={friend.lastName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    minLength="2"
                    required
                    ref={this.emailInput}
                    defaultValue={friend.email}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    minLength="10"
                    required
                    ref={this.phoneInput}
                    defaultValue={friend.phone}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="balance">Balance</label>
                  <input
                    type="text"
                    className="form-control"
                    name="balance"
                    required
                    ref={this.balanceInput}
                    defaultValue={friend.balance}
                    disabled={disableBalanceOnEdit}
                  />
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

EditExpense.propTypes = {
  friend: PropTypes.any,
  firestore: PropTypes.any,
};

export default compose(
  // gets friends from firestore and puts them in the friends prop
  firestoreConnect((props) => [
    { collection: "friends", storeAs: "friend", doc: props.match.params.id },
  ]),
  connect(({ firestore: { ordered }, settings }, props) => ({
    friend: ordered.friend && ordered.friend[0],
    settings: settings,
  }))
)(EditExpense);
