import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import LoadingSpinner from "../loading/LoadingSpinner";
import FriendsInvolved from "./FriendsInvolved";

class EditExpense extends Component {
  constructor(props) {
    super(props);

    // Create refs
    this.nameInput = React.createRef();
    this.amountInput = React.createRef();
    this.friendsInvolvedInput = React.createRef();
    this.whoPaidInput = React.createRef();
  }

  renderFriend() {
    const { friends, expense } = this.props;

    const friendSelect = (
      <select
        multiple={false}
        defaultValue={expense.whoPaid}
        // onChange={this.inputChange}
        className="form-control"
        id="whoPaid"
        type="text"
        name="whoPaid"
      >
        <option value="">Select Option</option>
        {_.map(friends, (value, key) => {
          return <option value={value.id}>{value.firstName}</option>;
        })}
      </select>
    );

    return friendSelect;
  }

  inputChangeMultiple = (e) => {
    this.setState({
      friendsInvolvedInput: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });
  };

  renderFriendsInvolved() {
    const { friends, expense } = this.props;
    // const { friendsInvolved } = this.state;
    const friendSelectMultiple = (
      <select
        multiple={true}
        defaultValue={expense.friendsInvolved}
        // onChange={this.inputChangeMultiple}
        ref={this.friendsInvolved}
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

    const { firestore, expense } = this.props;

    // Update expense
    const updExpense = {
      name: this.nameInput.current.value,
      expenseAmount: Number(this.amountInput.current.value),
      // friendsInvolved: this.friendsInvolvedInput.current.value,
      // whoPaid: this.whoPaidInput.current.value,
    };

    // update expense in firestore
    firestore.update({ collection: "expenses", doc: expense.id }, updExpense);
  };

  render() {
    const { expense } = this.props;
    console.log(expense);
    if (this.props) {
      return (
        <div>
          <div className="card mb-4 mt-4 bg-dark">
            <div className="card-header">Edit Expense</div>
            <div className="card-body">
              <form onSubmit={this.formSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Expense Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="expense name"
                    minLength="2"
                    required
                    ref={this.nameInput}
                    defaultValue={expense.name}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expenseAmount">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    // minLength="1"
                    required
                    ref={this.amountInput}
                    defaultValue={expense.expenseAmount}
                  />
                </div>

                {/* <div className="form-group">
                  <div className="form-group">
                    <label>Friends Involved {""}</label>
                    {this.renderFriendsInvolved()}
                  </div>
                </div>

                <div className="form-group">
                  <label>Who Paid</label>
                  {this.renderFriend()}
                </div> */}

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}

export default compose(
  // gets expenses from firestore and puts them in the expenses prop
  firestoreConnect((props) => [
    {
      collection: "expenses",
      storeAs: "expense",
      doc: props.id,
    },
  ]),
  connect(({ firestore: { data } }, props) => ({
    expense: data.expense && data.expense[props.id],
  }))
)(EditExpense);

// export default compose(
//   firestoreConnect([{ collection: "expenses" }, { collection: "friends" }]),

//   connect((state, props) => ({
//     expenses: state.firestore.data.expenses,
//     friends: state.firestore.data.friends,
//   }))
// )(EditExpense);
