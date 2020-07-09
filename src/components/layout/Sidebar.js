import React, { Component } from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";

export default class Sidebar extends Component {
  render() {
    // console.log(match);
    return (
      <div className="nav-wrapper pl-3 pr-2" style={{}} id="sidebar">
        {this.props.id ? (
          <>
            <AddExpense id={this.props.id} uid={this.props.uid} />
            <Friends id={this.props.id} uid={this.props.uid} />
          </>
        ) : (
          console.log(this.props)
        )}
      </div>
    );
  }
}
