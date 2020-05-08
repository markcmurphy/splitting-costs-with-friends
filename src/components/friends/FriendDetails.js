import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import EditFriend from "./EditFriend";

class FriendDetails extends Component {
  state = {
    showForm: false,
  };

  handleDelete = () => {
    const { friends, firestore } = this.props;
    firestore.delete({ collection: "friends", doc: friends.id });
  };

  renderWhoseInvolved(id) {
    const { friend } = this.props;
    return <td>{friend[id].firstName}</td>;
  }

  renderEditForm(id) {
    const { showForm } = this.state;

    if (showForm) {
      return <EditFriend id={id} firstName={this.props.friend.firstName} />;
    }
  }

  render() {
    const { friends } = this.props;
    const { showForm } = this.state;
    return (
      <tbody>
        <tr key={friends.id}>
          <td>{friends.firstName}</td>
          <td>
            <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
            </button>
            {this.renderEditForm(friends.id)}
            <button
              className="btn-sm ml-4 btn-primary"
              onClick={() => this.setState({ showForm: !showForm })}
            >
              {showForm ? <i>Close</i> : <i>Edit Friend</i>}
            </button>
          </td>
        </tr>
      </tbody>
    );
  }
}

export default compose(
  // gets friends from firestore and puts them in the clients prop
  firestoreConnect((props) => [
    {
      collection: "friends",
      storeAs: "friend",
      doc: props.id,
    },
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    friend: ordered.friend && ordered.friend[0],
  }))
)(FriendDetails);
