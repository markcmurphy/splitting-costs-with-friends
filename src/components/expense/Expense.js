import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../actions/index.js";
import ExpenseList from "./ExpenseList";
import WhoPaid from "./WhoPaid.js";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      expense: "",
      amount: 0,
      friendsInvolved: [],
      whoPaid: "",
      total: 0,
    };
  }

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addTotalExpenses = () => {
    const { expenseData } = this.props;
    let newTotal = 0;
    for (let x in expenseData) {
      newTotal += Number(expenseData[x].expenseAmount);
    }
    return newTotal;
  };

  renderFriend() {
    const { data } = this.props;
    const friends = (
      <select
        multiple={false}
        value={this.state.whoPaid}
        onChange={this.inputChange}
        id="whoPaid"
        type="text"
        name="whoPaid"
      >
        {_.map(data, (value, key) => {
          return <WhoPaid key={key} friendId={key} friend={value} />;
        })}
      </select>
    );

    return <div>{friends}</div>;
  }

  formSubmit = (e) => {
    const { expense, amount, friendsInvolved, whoPaid } = this.state;
    const { addExpense, addPaidToFriend } = this.props;
    e.preventDefault();

    addExpense({
      name: expense,
      expenseAmount: amount,
      // friendsInvolved: { friendsInvolved },
      whoPaid: whoPaid,
    });

    // addPaidToFriend({
    //   expenseAmount: amount,
    // });

    this.setState({
      expense: "",
      amount: 0,
      friendsInvolved: [],
      whoPaid: "",
    });
  };

  renderForm = () => {
    const { showForm, expense, amount, friendsInvolved } = this.state;
    if (showForm) {
      return (
        <div className="mt-4">
          <form onSubmit={this.formSubmit}>
            <div>
              <i>Add Expense</i>
              {/* Cost */}
              <div className="form-group">
                <label>
                  Cost
                  <input
                    value={expense}
                    onChange={this.inputChange}
                    id="friendNext"
                    type="text"
                    name="expense"
                  />
                </label>
              </div>
              {/* Amount */}
              <div className="form-group">
                <label>
                  Amount
                  <input
                    value={amount}
                    onChange={this.inputChange}
                    type="number"
                    id="amount"
                    name="amount"
                  />
                </label>
              </div>
              {/* People involved */}
              <div className="form-group">
                <label>
                  Friends Involved
                  <input
                    value={friendsInvolved}
                    onChange={this.inputChange}
                    id="friendsInvolved"
                    type="text"
                    name="friendsInvolved"
                  />
                </label>
              </div>
              {/* Who Paid */}
              <div className="form-group">
                <label>Who Paid</label>
                {this.renderFriend()}
              </div>
            </div>
            <input className="btn btn-primary" type="submit" value="Submit" />
          </form>
        </div>
      );
    }
  };

  renderExpense() {
    const { expenseData } = this.props;

    const expenses = _.map(expenseData, (value, key) => {
      return <ExpenseList key={key} expenseId={key} expense={value} />;
    });
    if (!_.isEmpty(expenses)) {
      return expenses;
    }
    return (
      <div>
        <h4 className="mt-4">You have no expenses logged!</h4>
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchExpenses();
    this.props.fetchFriends();
  }

  render() {
    const { showForm } = this.state;
    return (
      <div>
        <div>
          {this.renderExpense()}
          <hr />
          <p>Total = ${this.addTotalExpenses()}</p>
          {this.renderForm()}
        </div>
        <div>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? <i>Close</i> : <i>Add Expense</i>}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ expenseData, data }) => {
  return {
    expenseData,
    data,
  };
};

export default connect(mapStateToProps, actions)(Expense);
