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
      <div className="mainView">
        <nav>
          <Sidebar id={this.props.id} uid={this.props.uid} />
        </nav>
        <div className="mainViewContainer">
          <MainViewContainer id={this.props.id} uid={this.props.uid} />
        </div>
      </div>
    );
  }
}

export default Trip;
