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
    // const { id } = useParams();
    // console.log(this.props);
    console.log(this.props.location);

    return (
      <div
        className="row"
        //   style={{ minHeight: "87.7vh" }}
      >
        {/* <h3>Requested ID: {id}</h3> */}
        <div
          className="col-2"
          style={{
            padding: "0",
            backgroundColor: "#050405",
            margin: "0",
          }}
        >
          <Sidebar id={this.props.id} uid={this.props.uid} />
        </div>
        <div
          className="col-10"
          style={{
            padding: "0",
            backgroundColor: "#121212",
          }}
        >
          <MainViewContainer id={this.props.id} uid={this.props.uid} />
        </div>
      </div>
    );
  }
}

export default Trip;
