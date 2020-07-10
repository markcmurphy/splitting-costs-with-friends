import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

class AddNewTrip extends Component {
  state = {
    showForm: false,
    tripName: "",
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { tripName } = this.state;
    const { firestore, uid } = this.props;
    const docRefConfig = {
      collection: "users",
      doc: uid,
      subcollections: [{ collection: "trips" }],
    };
    firestore.add(docRefConfig, { tripName: tripName }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    });

    this.setState({
      tripName: "",
    });
  };

  renderForm = () => {
    const { showForm, tripName } = this.state;
    if (showForm) {
      return (
        <div className="card  mt-3 pl-1">
          <div className="card-header">Add Expense</div>
          <div className="card-body">
            <form onSubmit={this.formSubmit}>
              <div className="form-group">
                <label>Trip Name</label>
                <input
                  value={tripName}
                  className="form-control"
                  onChange={this.inputChange}
                  id="tripName"
                  type="text"
                  name="tripName"
                />
              </div>

              <input
                type="submit"
                value="Submit"
                className="btn btn-success btn-block"
              />
            </form>
          </div>
        </div>
      );
    }
  };

  render() {
    const { showForm } = this.state;

    return (
      <div
        style={{
          marginLeft: "5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {showForm ? (
          <button
            className="btn btn-danger btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Add Trip{" "}
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

  connect(({ firestore: { data } }, props) => ({
    expenses: data.expenses,
    friends: data.friends,
    trips: data[`${props.uid}-trips`],
  }))
)(AddNewTrip);
