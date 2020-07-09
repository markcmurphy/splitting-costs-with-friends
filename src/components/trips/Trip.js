import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import MainViewContainer from "../layout/MainViewContainer";
import Sidebar from "../layout/Sidebar";

export class Trip extends Component {
  render() {
    console.log(this.props);

    return (
      <>
        {/* <nav
          className="col-2"
          style={{
            padding: "0",
            // backgroundColor: "#050405",
            margin: "0",
          }}
        >
          <Sidebar id={this.props.id} uid={this.props.uid} />
        </nav> */}
        <div
          className="col-10"
          style={{
            padding: "0",
            // backgroundColor: "#121212",
          }}
        >
          <MainViewContainer id={this.props.id} uid={this.props.uid} />
        </div>
      </>
    );
  }
}

export default Trip;
