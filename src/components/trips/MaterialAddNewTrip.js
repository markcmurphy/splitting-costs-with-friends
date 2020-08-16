import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import AsyncCreatableSelect from "react-select/async-creatable";

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
    inputValue: "",
    // friendsInvolved: new Array(),
    friendsInvolved: [],
    // tripID: "",
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { tripName, friendsInvolved } = this.state;
    const { firestore, uid, friends, user } = this.props;
    const docRefConfig = {
      collection: "trips",
    };

    const uidArr = [uid];
    const uidFriendsInvolvedConcat = friendsInvolved.concat(uidArr);
    console.log(uidArr);
    console.log(friendsInvolved);
    console.log(friendsInvolved.concat(uidArr));

    // this.setState({
    //   friendsInvolved: uidFriendsInvolvedConcat,
    // });

    const tripInfo = {
      tripName: tripName,
      tripOwner: uid,
      // friendsInvolved: uidArr.concat(friendsInvolved),
      friendsInvolved: uidFriendsInvolvedConcat,
    };

    let tripID = [];

    // batch
    var batch = firestore.batch();

    // set
    // var cityRef = db.collection("cities").doc("BJ");

    // var setWithMerge = cityRef.set(
    //   {
    //     capital: true,
    //   },
    //   { merge: true }
    // );

    firestore
      .add(docRefConfig, tripInfo)
      .then((docRef) => {
        // friendsInvolved.forEach((f) =>
        firestore.set(
          {
            collection: "users",
            doc: uid,
          },
          {
            onTrips: firestore.FieldValue.arrayUnion(docRef.id),
            // onTrips: Boolean(user.onTrips)
            //   ? firestore.FieldValue.arrayUnion(docRef.id)
            //   : [docRef.id],
          },
          { merge: true }
        );
        // );
      })
      .catch("failed");

    this.setState({
      tripName: "",
      showForm: false,
      friendsInvolved: [],
    });

    // console.log(this.state);
  };

  closeForm = () => {
    const { showForm } = this.state;

    this.setState({
      showForm: false,
    });
  };

  inputChangeMultiple = (e) => {
    // console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
      // friendsInvolved: e.target.selectedOptions,
    });
    console.log(this.state.friendsInvolved);
  };

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;

    // const filterColors = (inputValue) => {
    //   console.log(friends);
    //   if (!isEmpty(friends)) {
    //     return friends.filter((i) =>
    //       // (i) => console.log(i)
    //       i.firstName.toLowerCase().includes(inputValue.toLowerCase())
    //     );
    //   }
    // };

    // const loadOptions = (inputValue, callback) => {
    //   setTimeout(() => {
    //     callback(filterColors(inputValue));
    //   }, 1000);
    // };

    // const handleInputChange = (newValue) => {
    //   const inputValue = newValue.replace(/\W/g, "");
    //   this.setState({ inputValue: inputValue });
    //   return inputValue;
    // };
    const friendSelectMultiple = (
      // todo: finish setting up async-creatable select
      // <AsyncCreatableSelect
      //   cacheOptions
      //   isMulti
      //   defaultOptions={friends}
      //   loadOptions={loadOptions}
      //   onInputChange={handleInputChange}
      // />
      <Select
        multiple
        native
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        // className="form-control"
        // id="friendsInvolved"
        // type="text"
        inputProps={{
          id: "select-multiple-native",
        }}
        fullWidth
      >
        {_.map(friends, (value, key) => {
          return (
            <option key={value.uid} value={value.uid}>
              {value.firstName}
            </option>
          );

          // return <FriendsInvolved key={value.id} friends={value} />;
        })}
      </Select>
    );
    return friendSelectMultiple;
  }

  renderForm = () => {
    const { showForm, tripName } = this.state;
    const marginBottom = "15px";
    // console.log(this.props);
    // console.log(this.props);
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
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel shrink htmlFor="select-multiple-native">
                    Friends Involved
                  </InputLabel>

                  {/* <pre>inputValue: "{this.state.inputValue}"</pre> */}
                  {/* <InputLabel>Friends Involved</InputLabel> */}
                  {this.renderFriendsInvolved()}
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
    // if (this.props.user) {
    //   console.log(this.props.user.onTrips);
    //   console.log(Boolean(this.props.user.onTrips));
    // }

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

// export default compose(
//   firestoreConnect((props) => [
//     {
//       collection: "expenses",
//       storeAs: "expense",
//     },
//     {
//       collection: "friends",
//       storeAs: "friend",
//     },
//     {
//       collection: "users",
//       doc: props.uid,
//       subcollections: [{ collection: "trips" }],
//       storeAs: `${props.uid}-trips`,
//     },
//   ]),
//   connect(({ firestore: { data } }, props) => ({
//     expenses: data.expenses,
//     friends: data.friends,
//     trips: data[`${props.uid}-trips`],
//   }))
// )(MaterialAddNewTrip);
export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      storeAs: `${props.id}-contacts`,
      subcollections: [{ collection: "contacts" }],
    },
    {
      collection: "users",
      doc: props.uid,
      storeAs: "user",

      // where: [["tripOwner", "==", props.uid]],

      // doc: props.uid,
      // storeAs: `${props.id}-contacts`,
      // subcollections: [{ collection: "contacts" }],
    },
  ]),

  connect(({ firestore: { ordered, data } }, props) => ({
    friends: ordered[`${props.id}-contacts`],
    user: data["user"],
    // expenses: ordered[`${props.id}-expenses`],
  }))
)(MaterialAddNewTrip);
