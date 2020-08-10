import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
import Button from "@material-ui/core/Button";

class ListTrips extends Component {
  state = {
    showForm: false,
    tripID: "",
  };

  renderForm = () => {
    const { showForm } = this.state;
    const { trips } = this.props;

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
                      // tripProps: {
                      //   uid: "uid",
                      // },
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
    // const { trips, uid } = this.props;

    return (
      <div>
        {showForm ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Display All Trips
          </Button>
        ) : (
          // <button
          //   className="btn btn-secondary mt-4 btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Display All Trips
          // </button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close Trip List
          </Button>
          // <button
          //   className="btn btn-danger mt-4 btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close Trip List
          // </button>
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
