import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
import AddNewTrip from "./AddNewTrip";
import ListTrips from "./ListTrips";
import Trip from "./Trip.js";
import Sidebar from "../layout/Sidebar";

class AllTrips extends Component {
  render() {
    const { trips } = this.props;
    return (
      <div>
        {!this.props.uid ? (
          <LoadingSpinner />
        ) : (
          <Router>
            <Switch>
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
              <div>
                <div
                  className="card"
                  style={
                    {
                      // marginLeft: "35%",
                      // marginRight: "35%",
                    }
                  }
                >
                  <div className="card-body">
                    <h1>All Trips</h1>
                    <AddNewTrip uid={this.props.uid} />
                    <ListTrips uid={this.props.uid} />
                  </div>
                </div>
                <div>
                  <Route
                    path="/trip/:id"
                    render={({ match }) => (
                      <Trip id={match.params.id} uid={this.props.uid} />
                    )}
                  />
                </div>
              </div>
            </Switch>
          </Router>
        )}
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  connect(({ firestore: { data } }, props) => ({
    trips: data[`${props.uid}-trips`],
  }))
)(AllTrips);
