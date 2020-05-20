import React, { Component } from "react";
import Friends from "../friends/Friends.js";

export class Sidebar extends Component {
  render() {
    return (
      <div className="nav-wrapper">
        <nav id="sidebar">
          {/* <div className="sidebar-header">
            <h3>Spodify</h3>
          </div> */}
          <Friends />

          {/* <ul className="list-unstyled">
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Library</li>
            <li>Home</li>
            <li>Search</li>
            <li>Last</li>
          </ul> */}
        </nav>
      </div>
    );
  }
}

export default Sidebar;
