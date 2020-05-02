import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";
// import * as actions from "../../actions/index.js";
import FriendDetails from "./FriendDetails";
import Spinner from "../Spinner";
import { FETCH_FRIENDS } from "../../actions";

class Friends extends Component {
  // constructor(props) {
  //   super(props);
  state = {
    showForm: false,
    firstName: "",
  };
  // }

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { firestore } = this.props;
    const { firstName } = this.state;
    // const { addFriend } = this.props;
    firestore.add({ collection: "friends" }, { name: firstName });
    // .then(() => this.props.history.push("/"));
    this.setState({ firstName: "" });
  };

  renderForm = () => {
    const { showForm, firstName } = this.state;
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

  renderFriend = (props) => {
    const { friends } = this.props;
    const friendsList = _.map(friends, (value, key) => {
      console.log(friends);
      console.log(value);

      return (
        <FriendDetails
          // key={key}
          // friendId={key}
          key={value.id}
          friends={value}
        />
      );
    });
    // const friendsList = _.map(friends, (value, key) => {
    //   return <FriendDetails key={key} friends={key} friends={value} />;
    // });
    if (friends) {
      return friendsList;
      // console.log(this.props);
      // console.log(friends);
      // const friendsList = friends.map((friend) => {
      //   console.log(friend);

      //   // <div className="mt-4">
      //   // <li>{friend.name}</li>;
      //   // </div>
      //   return (

      //       <FriendDetails key={friend.id} value={friend} />

      //   );

      //   // return <FriendDetails key={friend.id} />;
      // });
    } else {
      return <Spinner />;
    }
    // else {
    //   return
    //   <div>
    //     <h4 className="mt-4">You have no more friends!</h4>
    //   </div>;
    // }
  };
  //   // return <FriendDetails key={friends.id} />;
  // });
  // if (!_.isEmpty(friendsList)) {
  // }
  // return { friendsList };

  componentWillMount() {}

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

// const mapStateToProps = ({ data }) => {
//   return {
//     data,
//   };
// };

// export default compose(
//   // gets clients from firestore and puts them in the clients prop
//   firestoreConnect((props) => [
//     { collection: "friends", storeAs: "friend", doc: props.match.params.id },
//   ]),
//   connect(({ firestore: { ordered } }, props) => ({
//     friend: ordered.friend && ordered.friend[0],
//   }))
// )(List);

export default compose(
  // gets clients from firestore and puts them in the clients prop
  firestoreConnect([{ collection: "friends" }]),

  connect((state, props) => ({
    friends: state.firestore.ordered.friends,
  }))
  // console.log(this.props)
)(Friends);

// export default compose(
//   firestoreConnect(),
//   connect((state, props) => ({
//     // settings: state.settings,
//   }))
// )(List);
// export default connect(mapStateToProps, actions)(List);
