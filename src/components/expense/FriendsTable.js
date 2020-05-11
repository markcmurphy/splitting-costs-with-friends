import React, { Component } from "react";
import _ from "lodash";

export class FriendsTable extends Component {
  renderFriendHeader = (props) => {
    const { friend } = this.props;

    const friendsHeader = _.map(friend, (value, key) => {
      return <th key={key}>{value.firstName}</th>;
    });

    if (friend) {
      return friendsHeader;
    } else {
      return <th>Loading</th>;
    }
  };

  render() {
    const { expenses, friend, friendsInvolved } = this.props;

    if (expenses && friend) {
      return (
        <table className="table table-bordered table-dark ">
          <thead className="thead-inverse">
            <tr>{this.renderFriendHeader()}</tr>
          </thead>
          <tbody>
            {_.map(friend, (value, key) => {
              if (friendsInvolved.includes(key)) {
                return <td>X</td>;
              } else {
                return <td>$0</td>;
              }
            })}
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  }
}

export default FriendsTable;
