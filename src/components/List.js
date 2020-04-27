import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../actions/index.js";
import ListItem from "./ListItem";

class List extends Component {
  state = {
    showForm: false,
    formValue: "",
  };

  inputChange = (e) => {
    this.setState({ formValue: e.target.value });
  };

  formSubmit = (e) => {
    const { formValue } = this.state;
    const { addFriend } = this.props;
    e.preventDefault();
    addFriend({ name: formValue });
    this.setState({ formValue: "" });
  };

  renderForm = () => {
    const { showForm, formValue } = this.state;
    if (showForm) {
      return (
        <div>
          <form onSubmit={this.formSubmit}>
            <div>
              <i>add</i>
              <input
                value={formValue}
                onChange={this.inputChange}
                id="friendNext"
                type="text"
              />
              <label htmlFor="friendNext">Who Next?</label>
            </div>
            <input type="submit" value="Submit" />
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
        <h4>You have no more things friends!</h4>
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
          {this.renderForm()}
          {this.renderFriend()}
        </div>
        <div>
          <button onClick={() => this.setState({ showForm: !showForm })}>
            {showForm ? <i>Close</i> : <i>Add</i>}
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
