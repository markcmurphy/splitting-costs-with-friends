import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import { notifyUser } from "../../actions/notifyActions";
import Alert from "../layout/Alert";

class Register extends Component {
  state = {
    email: "",
    password: "",
    displayName: "",
  };

  componentWillMount() {
    // const { allowRegistration } = this.props.settings;
    // if (!allowRegistration) {
    //   this.props.history.push("/");
    // }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { firebase, notifyUser, firestore } = this.props;
    const { email, password, displayName } = this.state;

    // Register with firebase
    firebase
      .createUser({ email, password })
      .then(() => {
        firebase.auth().onAuthStateChanged(function (user) {
          //check if user is signed in
          if (user) {
            //user is signed in
            //get user display
            if (user.displayName !== undefined) {
              var username = user.displayName;
              //add displayName to firestore
              firestore
                .set(
                  { collection: "users", doc: user.uid },
                  {
                    username: displayName,
                  },
                  { merge: true }
                )

                // .collection("users")
                // .doc(user.uid)
                // .set(
                //   {
                //     username: displayName,
                //   },
                //   { merge: true }
                // )
                // .then(function () {
                //   alert("displayName added!");
                // })
                .catch(function (e) {
                  //there was an error writing to firestore
                  //check console
                  console.log(e);
                });
            } else {
              //user has not set displayName
              alert("no displayName");
            }
          }
        });
      })
      // .catch((err) => notifyUser("User Already Exists", "error"))
      // .then((user) => {
      //   if (user) {
      //     user.updateProfile({
      //       displayName: displayName,
      //       //  photoURL: // some photo url
      //     });
      //     // .then(
      //     //   (s)=> // perform any other operation
      //     // )
      //   }
      // })

      // .then((userRecord) => {
      //   userRecord.user.updateProfile({
      //     displayName: displayName,
      //     // photoURL: ''
      //   });
      // })
      // .then((userRecord) => {
      //   this.updateUserData(userRecord.user);
      //   resolve(userRecord);
      // })
      .then(this.props.history.push("/"));
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { message, messageType } = this.props.notify;
    return (
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-body">
            {message ? (
              <Alert message={message} messageType={messageType} />
            ) : null}
            <h1 className="text-center pb-4 pt-3">
              <span className="text-primary">
                <i className="fa fa-lock"></i> Register
              </span>
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="displayName">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="displayName"
                  required
                  value={this.state.displayName}
                  onChange={this.onChange}
                />
              </div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                required
                value={this.state.email}
                onChange={this.onChange}
              />
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  required
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>

              <input
                type="submit"
                value="Register"
                className="btn btn-primary btn-block"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(),
  firestoreConnect(),
  connect(
    (state, props) => ({
      notify: state.notify,
    }),
    { notifyUser }
  )
)(Register);
