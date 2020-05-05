import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";

import Spinner from "../Spinner";
import FriendDetails from "./FriendDetails";

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
    firestore.add({ collection: "friends" }, { name: firstName });
    // .then(() => this.props.history.push("/"));
    this.setState({ firstName: "" });
  };

  renderForm = () => {
    const { showForm, firstName } = this.state;
    if (showForm) {
      return (
        <div className="mt-4">
          <form onSubmit={this.formSubmit}>
            <div>
              <i>Add Friend</i>
              <div className="form-group">
                <input
                  value={firstName}
                  onChange={this.inputChange}
                  id="friendNext"
                  type="text"
                  name="firstName"
                />
              </div>
            </div>
            <input className="btn btn-primary" type="submit" value="Submit" />
          </form>
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
      return "Loading";
    }
  };

  componentWillMount() {}

  render() {
    const { showForm } = this.state;
    return (
      <div>
        <div>
          <hr style={{ backgroundColor: "#fff" }} />

          <table className="table table-sm table-striped table-dark mt-4 ">
            <thead className="thead-inverse">
              <tr>
                <th>Friend Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            {this.renderFriend()}
          </table>
          {this.renderForm()}
        </div>
        <div>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? <i>Close</i> : <i>Add Friend</i>}
          </button>
        </div>
      </div>
    );
  }
}

export default compose(
  // gets clients from firestore and puts them in the clients prop
  firestoreConnect([{ collection: "friends" }]),

  connect((state, props) => ({
    friends: state.firestore.ordered.friends,
  }))
)(Friends);
