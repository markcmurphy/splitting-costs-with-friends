import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

class EditTrip extends Component {
  constructor(props) {
    super(props);
    // Create refs
    this.nameInput = React.createRef();
    this.amountInput = React.createRef();
    this.friendsInvolvedInput = React.createRef();
    this.whoPaidInput = React.createRef();
    this.state = {
      friendsInvolved: this.props.friendsinvolved,
      tripName: this.props.tripname,
    };
  }

  inputChangeMultiple = (e) => {
    console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });
  };

  renderFriendsInvolved() {
    const { myContacts, friendsinvolved, friends, uid } = this.props;
    const { friendsInvolved } = this.state;

    const friendSelectMultiple = (
      <Select
        multiple
        native
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        ref={this.friendsInvolvedInput}
        inputProps={{
          id: "select-multiple-native",
        }}
        fullWidth
      >
        {_.map(myContacts, (value, key) => {
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

  formSubmit = (e) => {
    e.preventDefault();

    const { firestore, tripid, uid } = this.props;
    const { friendsInvolved } = this.state;

    const uidArr = [uid];
    const uidFriendsInvolvedConcat = friendsInvolved.concat(uidArr);

    // update trip in firestore
    firestore.update(
      {
        collection: "trips",
        doc: tripid,
      },
      {
        tripName: this.state.tripName,
        friendsInvolved: friendsInvolved,
        tripOwner: this.props.tripowner,
      }
    );

    this.setState({
      tripName: "",
      showForm: false,
      friendsInvolved: [],
    });
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderForm() {
    const { showForm, tripName } = this.state;
    const marginBottom = "15px";

    if (showForm) {
      return (
        <Dialog
          open={showForm}
          onClose={() => this.setState({ showForm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Trip</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit your trip details here!</DialogContentText>
            <form onSubmit={this.formSubmit} id="editTripForm">
              <FormGroup>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Trip Name</InputLabel>
                  <Input
                    id="tripName"
                    type="text"
                    name="tripName"
                    value={tripName}
                    className="MuiInput-formControl"
                    onChange={this.inputChange}
                    ref={this.nameInput}
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
                  form="editTripForm"
                >
                  Submit{" "}
                </Button>
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showForm: !showForm })}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }

  render() {
    const { showForm } = this.state;
    console.log(this.props);
    console.log(this.state.friendsInvolved);

    return (
      <>
        {showForm ? (
          //   <Button
          //     variant="contained"
          //     color="secondary"
          //     onClick={() => this.setState({ showForm: !showForm })}
          //   >
          //     Close
          //   </Button>
          <IconButton>
            <EditIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => this.setState({ showForm: !showForm })}>
            <EditIcon />
          </IconButton>
        )}
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
      storeAs: "myContacts",
    },
  ]),
  connect(({ firestore: { ordered, data } }, props) => ({
    myContacts: ordered["myContacts"],
  }))
)(EditTrip);
