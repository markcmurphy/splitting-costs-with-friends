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
    const editIcon = (
      <svg
        className="bi bi-pencil-square"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        // onClick={() => this.setState({ showForm: !showForm })}
        cursor="pointer"
      >
        <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z" />
        <path
          fillRule="evenodd"
          d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
          clipRule="evenodd"
        />
      </svg>
    );
    const { friends } = this.props;
    const { showForm } = this.state;
    return (
      <tbody>
        <tr key={friends.id}>
          <td>
            {friends.firstName}{" "}
            <div style={{ float: "right" }}>
              <svg
                className="bi bi-trash-fill ml-2"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={this.handleDelete}
                cursor="pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z"
                  clipRule="evenodd"
                />
              </svg>
              {/* <i className="fa fa-edit" /> */}
              {/* <button onClick={this.handleDelete} className="btn-sm btn-danger">
              Delete
            </button> */}
              {/* <i onClick={this.handleDelete} classNames="fa fa-trash-alt" /> */}
              {this.renderEditForm(friends.id)}
              <span
                className="ml-2"
                onClick={() => this.setState({ showForm: !showForm })}
              >
                {showForm ? (
                  <button>
                    <i>Close</i>
                  </button>
                ) : (
                  editIcon
                )}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }
}

export default compose(
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
