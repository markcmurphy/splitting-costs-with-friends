import React, { Component } from "react";
import Sidebar from "./Sidebar.js";
import MainViewContainer from "./MainViewContainer.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

export class VertBody extends Component {
  render() {
    return (
      <div className="row">
        <div
          className="col-2"
          style={{
            padding: "0",
            backgroundColor: "#050405",
            margin: "0",
          }}
        >
          <Sidebar id={this.props.id} />
        </div>
        <div
          className="col-10"
          style={{
            padding: "0",
            backgroundColor: "#121212",
          }}
        >
          <MainViewContainer />
        </div>
      </div>
    );
  }
}

export default VertBody;
