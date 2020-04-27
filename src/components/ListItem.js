import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteFriend } from "../actions/index.js";

class ListItem extends Component {
  handleDelete = (deleted) => {
    const { deleteFriend } = this.props;
    deleteFriend(deleted);
  };

  render() {
    const { friendId, friend } = this.props;
    return (
      <div key="friendName">
        <h4>
          {friend.name}
          <span onClick={() => this.handleDelete(friendId)}>
            <i>Done</i>
          </span>
        </h4>
      </div>
    );
  }
}

export default connect(null, { deleteFriend })(ListItem);
