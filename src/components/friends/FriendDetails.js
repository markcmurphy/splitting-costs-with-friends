import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
// import { deleteFriend } from "../../actions/index.js";

class FriendDetails extends Component {
  // handleDelete = (deleted) => {
  //   // const { deleteFriend } = this.props;
  //   // deleteFriend(deleted);
  // };
  // console.log(this.props)

  handleDelete = () => {
    const { friends, firestore } = this.props;
    console.log(firestore);
    firestore.delete({ collection: "friends", doc: friends.id });
    // .then(() => this.props.history.push("/"));
  };

  render() {
    console.log(this.props);
    const { friends } = this.props;
    // console.log(friends);
    return (
      <div className="mt-4">
        <h4>{friends.name}</h4>
        <button onClick={this.handleDelete} className="btn btn-danger">
          Delete
        </button>
        {/* <span onClick={() => this.handleDelete(friendId)}>
            <i className="ml-4">X</i>
          </span> */}
      </div>
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
