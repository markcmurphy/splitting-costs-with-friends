import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import LoadingSpinner from "../loading/LoadingSpinner";
import AddNewTrip from "../trips/AddNewTrip";
import ListTrips from "../trips/ListTrips";

class AllTrips extends Component {
  render() {
    const { trips } = this.props;
    if (isLoaded(trips)) {
      console.log(this.props);
    }
    return (
      <div>
        <h1>All Trips</h1>
        {/* 
        <ul>
          {trips ? (
            Object.keys(trips).map((item) => {
              console.log(item);
              return <li key={item}>{item.tripName}</li>;
            })
          ) : (
            <LoadingSpinner />
          )}
        </ul> */}

        <ListTrips uid={this.props.uid} />

        <AddNewTrip uid={this.props.uid} />
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "expenses",
      storeAs: "expense",
    },
    {
      collection: "friends",
      storeAs: "friend",
    },
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  //   return [{ collection: "users", doc: props.uid, subcollections: [{ collection: "tasks" }], storeAs: `${props.uid}-tasks` }];

  connect(({ firestore: { data } }, props) => ({
    expenses: data.expenses,
    friends: data.friends,
    trips: data[`${props.uid}-trips`],
  }))
)(AllTrips);
