import React, { Component } from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";

export class Sidebar extends Component {
  render() {
    return (
      <div className="nav-wrapper pl-3 pr-2">
        <nav id="sidebar">
          <AddExpense id={this.props.id} uid={this.props.uid} />
          <Friends id={this.props.id} uid={this.props.uid} />
        </nav>
      </div>
    );
  }
}

export default Sidebar;
