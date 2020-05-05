import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

class FriendDetails extends Component {
  handleDelete = () => {
    const { friends, firestore } = this.props;
    firestore.delete({ collection: "friends", doc: friends.id });
    // .then(() => this.props.history.push("/"));
  };

  renderWhoseInvolved(id) {
    const { friend } = this.props;
    return <td>{friend[id].name}</td>;
  }

  render() {
    const { friends } = this.props;
    return (
      <tbody>
        <tr key={friends.id}>
          <td>{friends.name}</td>
          {/* <td>${parseFloat(expenses.expenseAmount).toFixed(2)}</td> */}
          <td>
            <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
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
      // storeAs: "friend",
      // doc: props.friend.id,
    },
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    friend: ordered.friend && ordered.friend[0],
  }))
)(FriendDetails);
