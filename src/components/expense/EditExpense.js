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

  state = {
    friendsInvolved: this.props.friendsInvolved,
  };

  renderFriend() {
    const { friends, whoPaid } = this.props;

    const friendSelect = (
      <select
        multiple={false}
        defaultValue={whoPaid}
        className="form-control"
        id="whoPaid"
        type="text"
        name="whoPaid"
        ref={this.whoPaidInput}
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
    console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
    });

    const optionValues = _.map(e.target.selectedOptions, (value, key) => {
      return value.value;
    });

    // this.setState({
    //   friendsInvolved: optionValues,
    // });
  };

  renderFriendsInvolved() {
    const { friendsInvolved, friends } = this.props;
    console.log(this.props);
    const friendSelectMultiple = (
      <select
        multiple={true}
        // multiple
        // defaultValue={_.map(friends, (value, key) => {
        //   // if (friendsInvolved.includes(value.id)) {
        //   return <FriendsInvolved key={value.id} friends={value} />;
        //   // }
        // })}

        defaultValue={friendsInvolved}
        //   {
        //     _.map(friendsInvolved, (value, key) => {
        //     return <FriendsInvolved key={value.id} friends={value} />;
        //   })
        // }
        onChange={this.inputChangeMultiple}
        className="form-control"
        id="friendsInvolved"
        type="text"
      >
        {_.map(friends, (value, key) => {
          // console.log(defaultFriends);
          // if (friendsInvolved.includes(value.id)) {
          return <FriendsInvolved key={value.id} friends={value} />;
          // }
        })}
      </select>
    );
    return <div>{friendSelectMultiple}</div>;
  }

  formSubmit = (e) => {
    e.preventDefault();

    const { firestore, tripId, expenseId } = this.props;

    // Update expense
    const updExpense = {
      name: this.nameInput.current.value,
      expenseAmount: Number(this.amountInput.current.value),
      friendsInvolved: this.state.friendsInvolved,
      whoPaid: this.whoPaidInput.current.value,
    };

    // update expense in firestore
    firestore.update(
      {
        collection: "users",
        doc: "mmurphy",
        storeAs: `${tripId}-expense`,
        subcollections: [
          { collection: "trips", doc: tripId },
          { collection: "expenses", doc: expenseId },
        ],
      },
      updExpense
    );
  };

  render() {
    const { expense, amount } = this.props;
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
                    defaultValue={expense}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expenseAmount">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    minLength="1"
                    required
                    ref={this.amountInput}
                    defaultValue={amount}
                  />
                </div>

                <div className="form-group">
                  <label>Friends Involved {""}</label>
                  {this.renderFriendsInvolved()}
                </div>

                <div className="form-group">
                  <label>Who Paid</label>
                  {this.renderFriend()}
                </div>

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

// export default compose(
export default EditExpense;
// gets expenses from firestore and puts them in the expenses prop
//   firestoreConnect((props) => [
//     {
//       // collection: "expenses",
//       // storeAs: "expense",
//       // doc: props.id,
//       collection: "users",
//       doc: "mmurphy",
//       // storeAs: `${props.tripId}-expenses`,
//       storeAs: "expense",
//       subcollections: [
//         { collection: "trips", doc: props.tripId },
//         { collection: "expenses", doc: props.id },
//       ],
//     },
//     {
//       // collection: "friends",
//       // storeAs: "friend",
//       // doc: props.id,
//       collection: "users",
//       doc: "mmurphy",
//       // storeAs: `${props.tripId}-friends`,
//       storeAs: "friend",
//       subcollections: [
//         { collection: "trips", doc: props.tripId },
//         { collection: "friends", doc: props.id },
//       ],
//     },
//   ]),
//   connect(({ firestore: { data } }, props) => ({
//     expense: data.expense && data.expense[props.id],
//     friend: data.friend && data.friend[props.id],
//   }))
// )(EditExpense);

// export default compose(
//   firestoreConnect([{ collection: "expenses" }, { collection: "friends" }]),

//   connect((state, props) => ({
//     expenses: state.firestore.data.expenses,
//     friends: state.firestore.data.friends,
//   }))
// )(EditExpense);
