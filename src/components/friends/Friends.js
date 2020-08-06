import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import FriendDetails from "./FriendDetails";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import PersonAddIcon from "@material-ui/icons/PersonAdd";

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      firstName: "",
    };
  }

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { firestore, uid } = this.props;
    const { firstName } = this.state;
    firestore
      .add(
        {
          collection: "users",
          doc: uid,
          subcollections: [
            { collection: "trips", doc: this.props.id },
            { collection: "friends" },
          ],
        },
        { firstName: firstName }
      )
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });

    this.setState({ firstName: "" });
  };

  renderForm = () => {
    const { showForm, firstName } = this.state;
    if (showForm) {
      return (
        <div className="card mb-4 mt-4 ">
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
    const { friends, uid } = this.props;
    const friendsList = _.map(friends, (value, key) => {
      return (
        <FriendDetails
          key={value.id}
          friends={value}
          tripId={this.props.id}
          firestore={this.props.firestore}
          uid={uid}
        />
      );
    });

    if (friends) {
      return friendsList;
    } else {
      return (
        <Tbody>
          <Tr>
            <Td>Loading</Td>
          </Tr>
        </Tbody>
      );
    }
  };

  render() {
    const { showForm } = this.state;
    return (
      <div>
        {showForm ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ showForm: !showForm })}
            style={{ marginTop: "5px" }}
          >
            Close
          </Button>
        ) : (
          // <button
          //   className="btn btn-danger btn-block mt-4"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close
          // </button>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.setState({ showForm: !showForm })}
              style={{ marginTop: "5px" }}
            >
              Add Friend
            </Button>
            <IconButton aria-label="delete" color="primary">
              <PersonAddIcon />
            </IconButton>
          </div>

          // <button
          //   className="btn btn-secondary btn-block mt-4"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Add Friend
          // </button>
        )}
        {this.renderForm()}
        <Table className="mt-4">
          <Thead>
            <Tr>
              <Th>Friend Name</Th>
            </Tr>
          </Thead>
          {this.renderFriend()}
        </Table>
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      storeAs: `${props.id}-friends`,
      subcollections: [
        { collection: "trips", doc: props.id },
        { collection: "friends" },
      ],
    },
  ]),

  connect(({ firestore: { ordered } }, props) => ({
    friends: ordered[`${props.id}-friends`],
  }))
)(Friends);
