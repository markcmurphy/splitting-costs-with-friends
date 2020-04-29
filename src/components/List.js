import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../actions/index.js";
import ListItem from "./ListItem";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      firstName: "",
      amount: 0,
    };
  }

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = (e) => {
    const { firstName, amount } = this.state;
    const { addFriend } = this.props;
    e.preventDefault();
    addFriend({ name: firstName, expenseAmount: amount });
    this.setState({ firstName: "", amount: "" });
  };

  renderForm = () => {
    const { showForm, firstName, amount } = this.state;
    if (showForm) {
      return (
        <div className="mt-4">
          <form onSubmit={this.formSubmit}>
            <div>
              <i>Add Friend</i>
              <div className="form-group">
                <input
                  value={firstName}
                  onChange={this.inputChange}
                  id="friendNext"
                  type="text"
                  name="firstName"
                />
              </div>
            </div>
            <input className="btn btn-primary" type="submit" value="Submit" />
          </form>
        </div>
      );
    }
  };

  renderFriend() {
    const { data } = this.props;
    const friends = _.map(data, (value, key) => {
      return <ListItem key={key} friendId={key} friend={value} />;
    });
    if (!_.isEmpty(friends)) {
      return friends;
    }
    return (
      <div>
        <h4 className="mt-4">You have no more friends!</h4>
      </div>
    );
  }
  componentWillMount() {
    this.props.fetchFriends();
  }
  render() {
    const { showForm } = this.state;
    return (
      <div>
        <div>
          {this.renderFriend()}
          {this.renderForm()}
        </div>
        <div>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? <i>Close</i> : <i>Add Friend</i>}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ data }) => {
  return {
    data,
  };
};

export default connect(mapStateToProps, actions)(List);
