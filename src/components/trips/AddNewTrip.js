import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";

class AddNewTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      tripName: "",
      inputValue: "",
      friendsInvolved: [],
      newTripID: "",
    };
  }

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { tripName, friendsInvolved } = this.state;
    const { firestore, firebase, uid } = this.props;
    const docRefConfig = {
      collection: "trips",
    };

    const uidArr = [uid];
    const uidFriendsInvolvedConcat = friendsInvolved.concat(uidArr);

    const tripInfo = {
      tripName: tripName,
      tripOwner: uid,
      friendsInvolved: uidFriendsInvolvedConcat,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    firestore
      .add(docRefConfig, {
        tripName: tripName,
        tripOwner: uid,
        friendsInvolved: uidFriendsInvolvedConcat,
        // createdAt:
        //   firebase.firestore.FieldValue.serverTimestamp()
        // ,
        createdAt: Date.now(),
      })
      .then((docRef) => {
        uidFriendsInvolvedConcat.forEach((f) => {
          firestore.set(
            {
              collection: "users",
              doc: f,
            },
            {
              onTrips: firestore.FieldValue.arrayUnion(docRef.id),
            },
            { merge: true }
          );

          firestore.add(
            {
              collection: "trips",
              doc: docRef.id,
              subcollections: [{ collection: "friendsInvolved" }],
            },
            {
              uid: f,
            }
          );
        });
      })
      .catch("failed");

    this.setState({
      tripName: "",
      showForm: false,
      friendsInvolved: [],
    });
  };

  closeForm = () => {
    this.setState({
      showForm: false,
    });
  };

  inputChangeMultiple = (e) => {
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });
  };

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;
    const friendSelectMultiple = (
      // todo: finish setting up async-creatable select
      <Select
        multiple
        native
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        inputProps={{
          id: "select-multiple-native",
        }}
        fullWidth
      >
        {_.map(friends, (value, key) => {
          console.log(value);
          return (
            <option key={key} value={value.id}>
              {value.username}
            </option>
          );
        })}
      </Select>
    );
    return friendSelectMultiple;
  }

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
                    id="tripName"
                    type="text"
                    name="tripName"
                    value={tripName}
                    onChange={this.inputChange}
                    fullWidth
                  />
                </FormControl>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel shrink htmlFor="select-multiple-native">
                    Friends Involved
                  </InputLabel>
                  {this.renderFriendsInvolved()}
                </FormControl>
                <Button
                  type="submit"
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
      <>
        <div onClick={() => this.setState({ showForm: !showForm })}>
          Add Trip
        </div>
        {this.renderForm()}
      </>
    );
  }
}

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      where: [["contactOf", "array-contains", props.uid]],
      storeAs: `${props.id}-contacts`,
    },
    {
      collection: "users",
      doc: props.uid,
      storeAs: "user",
    },
  ]),

  connect(({ firestore: { ordered, data } }, props) => ({
    friends: ordered[`${props.id}-contacts`],
    user: data["user"],
  }))
)(AddNewTrip);
