import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";

class MaterialAddNewTrip extends Component {
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
      showForm: false,
    });
  };

  closeForm = () => {
    const { showForm } = this.state;

    this.setState({
      showForm: false,
    });
  };

  renderForm = () => {
    const { showForm, tripName } = this.state;
    const marginBottom = "15px";

    if (showForm) {
      return (
        <Dialog
          open={showForm}
          onClose={() => this.closeForm()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Trip</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your new trip details here!
            </DialogContentText>
            <form onSubmit={this.formSubmit} id="newTripForm">
              <FormGroup>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Trip Name</InputLabel>
                  <Input
                    autoFocus
                    // margin="dense"
                    id="tripName"
                    //   label="Expense Name"
                    type="text"
                    name="tripName"
                    value={tripName}
                    // className="form-control"
                    onChange={this.inputChange}
                    fullWidth
                  />
                  {/* {console.log(this.state.expense)} */}
                </FormControl>
                <Button
                  type="submit"
                  //   value="Submit"
                  //   onClick={() => this.closeForm()}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "30px" }}
                  form="newTripForm"
                >
                  Submit{" "}
                </Button>
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.closeForm()} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  };

  render() {
    const { showForm } = this.state;

    return (
      <div>
        {showForm ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close
          </Button>
        ) : (
          // <button
          //   className="btn btn-danger btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close
          // </button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Add Trip
          </Button>
          // <button
          //   className="btn btn-secondary btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Add Trip{" "}
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
)(MaterialAddNewTrip);
