import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";

import FriendDetails from "./FriendDetails";
import EditFriend from "./EditFriend";

class Friends extends Component {
  state = {
    showForm: false,
    firstName: "",
  };

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { firestore } = this.props;
    const { firstName } = this.state;
    firestore
      .add({ collection: "friends" }, { firstName: firstName })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        firestore.update(
          { collection: "friends", doc: docRef.id },
          { id: docRef.id }
        );
      });

    this.setState({ firstName: "" });
  };

  renderForm = () => {
    const { showForm, firstName } = this.state;
    if (showForm) {
      return (
        <div className="card mb-4 mt-4 bg-dark">
          <div className="card-header">Add Friend</div>
          <div className="card-body">
            <form onSubmit={this.formSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  value={firstName}
                  onChange={this.inputChange}
                  id="friendNext"
                  type="text"
                  className="form-control"
                  name="firstName"
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
      );
    }
  };

  renderFriend = (props) => {
    const { friends } = this.props;
    const friendsList = _.map(friends, (value, key) => {
      return <FriendDetails key={value.id} friends={value} />;
    });

    if (friends) {
      return friendsList;
    } else {
      return (
        <tbody>
          <tr>
            <td>Loading</td>
          </tr>
        </tbody>
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
        {/* <div
          class="btn-group-vertical ml-3 mr-2"
          role="group"
          aria-label="Basic example"
        >
          <button type="button" class="btn btn-secondary">
            Add Friend
          </button>
          <button type="button" class="btn btn-secondary">
            Add Expense
          </button>
          <button type="button" class="btn btn-secondary">
            Right
          </button>
        </div> */}
        {/* <button
          style={{
            width: "80%",
            marginLeft: "10%",
          }}
          className="mt-4 btn btn-sm btn-secondary"
          onClick={() => this.setState({ showForm: !showForm })}
        >
          {showForm ? <i>Close</i> : <i>Add Friend</i>}
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
            Add Friend
          </button>
        )}
        {this.renderForm()}
        <table className="table table-responseive table-striped table-dark mt-4">
          <thead className="thead-inverse">
            <tr>
              <th>Friend Name</th>
              {/* <th>{""}</th> */}
            </tr>
          </thead>
          {this.renderFriend()}
        </table>
      </div>
    );
  }
}

export default compose(
  firestoreConnect([{ collection: "friends" }]),

  connect((state, props) => ({
    friends: state.firestore.ordered.friends,
  }))
)(Friends);
