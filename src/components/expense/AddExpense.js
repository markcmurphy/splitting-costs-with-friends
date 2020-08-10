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

class AddExpense extends Component {
  state = {
    showForm: false,
    expense: "",
    amount: 0,
    friendsInvolved: [""],
    whoPaid: "",
    total: 0,
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
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

  renderFriend() {
    const { friends } = this.props;
    const friendSelect = (
      <select
        multiple={false}
        value={this.state.whoPaid}
        onChange={this.inputChange}
        className="form-control"
        id="whoPaid"
        type="text"
        name="whoPaid"
      >
        <option value="">Select Option</option>
        {_.map(friends, (value, key) => {
          return (
            <option key={key} value={value.id}>
              {value.firstName}
            </option>
          );
        })}
      </select>
    );

    return friendSelect;
  }

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;

    const friendSelectMultiple = (
      <select
        multiple={true}
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        className="form-control"
        id="friendsInvolved"
        type="text"
      >
        {_.map(friends, (value, key) => {
          return <FriendsInvolved key={value.id} friends={value} />;
        })}
      </select>
    );

    return <div>{friendSelectMultiple}</div>;
  }

  formSubmit = (e) => {
    e.preventDefault();
    const { expense, amount, friendsInvolved, whoPaid } = this.state;
    const { firestore, uid } = this.props;

    firestore
      .add(
        {
          collection: "users",
          doc: uid,
          subcollections: [
            { collection: "trips", doc: this.props.id },
            { collection: "expenses" },
          ],
        },
        {
          name: expense,
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
    // if (showForm) {
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
            <div className="form-group">
              <TextField
                autoFocus
                margin="dense"
                id="friendNext"
                label="Expense Name"
                type="text"
                name="expense"
                value={expense}
                // className="form-control"
                onChange={this.inputChange}
                fullWidth
              />
              {/* <label>Expense Name</label> */}
              {/* <input
                value={expense}
                className="form-control"
                onChange={this.inputChange}
                id="friendNext"
                type="text"
                name="expense"
              /> */}
            </div>

            <div className="form-group">
              <Input
                // autoFocus
                margin="dense"
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
              {/* <label>Amount</label>
              <input
                value={amount}
                onChange={this.inputChange}
                className="form-control"
                type="number"
                id="amount"
                name="amount"
              /> */}
            </div>
            {/* Friends involved */}
            <div className="form-group">
              <label>Friends Involved {""}</label>
              {this.renderFriendsInvolved()}
            </div>
            {/* Who Paid */}
            <div className="form-group">
              <label>Who Paid</label>
              {this.renderFriend()}
            </div>

            <input
              type="submit"
              value="Submit"
              className="btn btn-success btn-block"
              onClick={() => this.closeForm()}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeForm()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      // <div className="card mt-3 pl-1">
      //   <div className="card-header">Add Expense</div>
      //   <div className="card-body">
      //     <form onSubmit={this.formSubmit}>
      //       <div className="form-group">
      //         <label>Expense Name</label>
      //         <input
      //           value={expense}
      //           className="form-control"
      //           onChange={this.inputChange}
      //           id="friendNext"
      //           type="text"
      //           name="expense"
      //         />
      //       </div>

      //       <div className="form-group">
      //         <label>Amount</label>
      //         <input
      //           value={amount}
      //           onChange={this.inputChange}
      //           className="form-control"
      //           type="number"
      //           id="amount"
      //           name="amount"
      //         />
      //       </div>
      //       {/* Friends involved */}
      //       <div className="form-group">
      //         <label>Friends Involved {""}</label>
      //         {this.renderFriendsInvolved()}
      //       </div>
      //       {/* Who Paid */}
      //       <div className="form-group">
      //         <label>Who Paid</label>
      //         {this.renderFriend()}
      //       </div>

      //       <input
      //         type="submit"
      //         value="Submit"
      //         className="btn btn-success btn-block"
      //       />
      //     </form>
      //   </div>
      // </div>
    );
    // }
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
          //   className="btn btn-danger btn-block mt-4"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close
          // </button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Add Expense{" "}
          </Button>
          // <button
          //   className="btn btn-secondary btn-block mt-4"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Add Expense{" "}
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
