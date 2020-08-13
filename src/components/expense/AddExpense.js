import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import FriendsInvolved from "./FriendsInvolved";

// Material-UI components
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

class AddExpense extends Component {
  state = {
    showForm: false,
    expense: "",
    amount: 0,
    friendsInvolved: [""],
    // friendsInvolved: {},
    whoPaid: "",
    total: 0,
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  inputChangeMultiple = (e) => {
    console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
      // friendsInvolved: e.target.selectedOptions,
    });
  };

  renderFriend() {
    const { friends } = this.props;
    const friendSelect = (
      <Select
        // multiple={false}
        value={this.state.whoPaid}
        onChange={this.inputChange}
        // className="form-control"
        id="whoPaid"
        type="text"
        name="whoPaid"
      >
        {/* <MenuItem value="">Select Option</MenuItem> */}
        {_.map(friends, (value, key) => {
          return (
            <MenuItem key={key} value={value.id}>
              {value.firstName}
            </MenuItem>
          );
        })}
      </Select>
    );

    return friendSelect;
  }

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;

    const friendSelectMultiple = (
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
            <option key={key} value={value.id}>
              {value.firstName}
            </option>
          );

          // return <FriendsInvolved key={value.id} friends={value} />;
        })}
      </Select>
    );

    return friendSelectMultiple;
  }

  formSubmit = (e) => {
    e.preventDefault();
    const { expense, amount, friendsInvolved, whoPaid } = this.state;
    const { firestore, uid } = this.props;

    firestore
      .add(
        {
          collection: "expenses",
        },
        {
          expenseName: expense,
          expenseAmount: Number(amount),
          friendsInvolved: friendsInvolved,
          whoPaid: whoPaid,
        }
      )
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });

    this.setState({
      expense: "",
      amount: 0,
      friendsInvolved: [""],
      whoPaid: "",
    });
  };

  closeForm = () => {
    const { showForm } = this.state;

    this.setState({
      showForm: false,
    });
  };

  openForm = () => {
    const { showForm } = this.state;

    this.setState({
      showForm: true,
    });
  };

  renderForm = () => {
    const { showForm, expense, amount } = this.state;
    const marginBottom = "15px";

    return (
      <Dialog
        open={showForm}
        onClose={() => this.closeForm()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your expense details here to split costs with friends!
          </DialogContentText>
          <form onSubmit={this.formSubmit}>
            <FormGroup>
              <FormControl style={{ marginBottom: marginBottom }}>
                <InputLabel>Expense Name</InputLabel>
                <Input
                  autoFocus
                  id="friendNext"
                  label="Expense Name"
                  type="text"
                  name="expense"
                  value={expense}
                  onChange={this.inputChange}
                  fullWidth
                />
              </FormControl>

              <FormControl style={{ marginBottom: marginBottom }}>
                <InputLabel>Expense Amount</InputLabel>

                <Input
                  // autoFocus
                  // margin="dense"
                  id="amount"
                  label="Expense Amount"
                  type="number"
                  name="amount"
                  value={amount}
                  // className="form-control"
                  onChange={this.inputChange}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  fullWidth
                />
              </FormControl>
              <FormControl style={{ marginBottom: marginBottom }}>
                <InputLabel shrink htmlFor="select-multiple-native">
                  Friends Involved
                </InputLabel>
                {this.renderFriendsInvolved()}
              </FormControl>

              {/* Who Paid */}
              <FormControl style={{ marginBottom: marginBottom }}>
                <InputLabel>Who Paid</InputLabel>
                {this.renderFriend()}
              </FormControl>
              <Button
                type="submit"
                value="Submit"
                className="btn btn-success btn-block"
                onClick={() => this.closeForm()}
                variant="contained"
                color="primary"
                style={{ marginTop: "30px" }}
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Add Expense{" "}
          </Button>
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
      storeAs: `${props.id}-expenses`,
      subcollections: [
        { collection: "trips", doc: props.id },
        { collection: "expenses" },
      ],
    },
    {
      collection: "users",
      doc: props.uid,
      storeAs: `${props.id}-friends`,
      subcollections: [
        { collection: "trips", doc: props.id },
        { collection: "friends" },
      ],
    },
  ]),

  connect(({ firestore: { ordered } }, props) => ({
    friends: ordered[`${props.id}-friends`],
    expenses: ordered[`${props.id}-expenses`],
  }))
)(AddExpense);
