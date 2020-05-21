import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

// import FriendsInvolved from "./FriendsInvolved";

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

    // firestore.add(
    //   {
    //     collection: "users",
    //     doc: props.uid,
    //     subcollections: [{ collection: "trips" }],
    //   },
    //   {
    //     tripName: tripName,
    //   }
    // );
    const docRefConfig = {
      collection: "users",
      doc: uid,
      subcollections: [{ collection: "trips" }],
    };
    firestore.add(docRefConfig, { tripName: tripName }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    });
    //     firestore.update(
    //       {
    //         collection: "users",
    //         doc: this.props.uid,
    //         subcollections: [{ collection: "trips",  }],
    //         doc: docRef.id,
    //       },
    //       { id: docRef.id }
    //     );
    //   });

    this.setState({
      tripName: "",
    });
  };

  renderForm = () => {
    const { showForm, tripName } = this.state;
    if (showForm) {
      return (
        <div className="card bg-dark mt-3 pl-1">
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
    console.log(this.props);

    return (
      <div
        style={{
          marginLeft: "5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* <button
          className="btn btn-secondary btn-sm mt-4"
          onClick={() => this.setState({ showForm: !showForm })}
          style={{
            width: "80%",
            marginLeft: "15%",
          }}
        >
          {showForm ? <i>Close</i> : <i>Add Expense</i>}
        </button> */}
        {showForm ? (
          <button
            className="btn btn-danger btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
            // style={{
            //   width: "80%",
            //   marginLeft: "15%",
            // }}
          >
            Close
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-block mt-4"
            onClick={() => this.setState({ showForm: !showForm })}
            // style={{
            //   width: "80%",
            //   marginLeft: "15%",
            // }}
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

  //   return [{ collection: "users", doc: props.uid, subcollections: [{ collection: "tasks" }], storeAs: `${props.uid}-tasks` }];

  connect(({ firestore: { data } }, props) => ({
    expenses: data.expenses,
    friends: data.friends,
    trips: data[`${props.uid}-trips`],
  }))
  // export default compose(
  //   firestoreConnect([{ collection: "expenses" }, { collection: "friends" }]),

  //   connect((state, props) => ({
  //     expenses: state.firestore.ordered.expenses,
  //     friends: state.firestore.ordered.friends,
  //   }))
)(AddNewTrip);
