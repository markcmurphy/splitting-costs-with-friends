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

class ListTrips extends Component {
  state = {
    showForm: false,
  };

  renderForm = () => {
    const { showForm } = this.state;
    const { trips, uid } = this.props;

    if (!showForm) {
      return (
        <ul className="list-group mt-4">
          <li className="list-group-item active">All Trips</li>
          {trips ? (
            trips.map((item) => {
              return (
                <li className="list-group-item" key={item.id}>
                  <Link
                    to={{
                      pathname: `/trip/${item.id}`,
                      tripProps: { uid: "uid" },
                    }}
                  >
                    {item.tripName}
                  </Link>
                </li>
              );
            })
          ) : (
            <LoadingSpinner />
          )}
        </ul>
      );
    }
  };

  render() {
    const { showForm } = this.state;

    console.log(this.props);
    const { trips, uid } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {showForm ? (
          <button
            className="btn btn-secondary mt-2"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Display All Trips
          </button>
        ) : (
          <button
            className="btn btn-danger mt-2"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close Trip List
          </button>
        )}
        <div>
          <div className="">{this.renderForm()}</div>
        </div>
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

  connect(({ firestore: { ordered } }, props) => ({
    trips: ordered[`${props.uid}-trips`],
  }))
)(ListTrips);
