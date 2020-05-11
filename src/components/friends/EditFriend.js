import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import LoadingSpinner from "../loading/LoadingSpinner";

class EditFriend extends Component {
  constructor(props) {
    super(props);
    // Create refs
    this.firstNameInput = React.createRef();
  }

  formSubmit = (e) => {
    e.preventDefault();

    const { firestore, friend } = this.props;

    // Update friend
    const updFriend = {
      firstName: this.firstNameInput.current.value,
    };

    // update friend in firestore
    firestore.update({ collection: "friends", doc: friend.id }, updFriend);
  };

  render() {
    const { friend } = this.props;
    if (this.props) {
      return (
        <div>
          <div className="card mb-4 mt-4 bg-dark">
            <div className="card-header">Edit Friend</div>
            <div className="card-body">
              <form onSubmit={this.formSubmit}>
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

export default compose(
  // gets friends from firestore and puts them in the friends prop
  firestoreConnect((props) => [
    {
      collection: "friends",
      storeAs: "friend",
      doc: props.id,
    },
  ]),
  connect(({ firestore: { data } }, props) => ({
    friend: data.friend && data.friend[props.id],
  }))
)(EditFriend);
