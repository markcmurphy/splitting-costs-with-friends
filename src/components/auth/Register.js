import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import { notifyUser } from "../../actions/notifyActions";
import Alert from "../layout/Alert";
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Input from "@material-ui/core/Input";

import { Face, Fingerprint } from "@material-ui/icons";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(),
  },
});

class Register extends Component {
  state = {
    email: "",
    password: "",
    displayName: "",
  };

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
                .catch(function (e) {
                  console.log(e);
                });
            } else {
              //user has not set displayName
              alert("no displayName");
            }
          }
        });
      })
      .then(this.props.history.push("/"));
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { message, messageType } = this.props.notify;
    const { classes } = this.props;
    return (
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          {message ? (
            <Alert message={message} messageType={messageType} />
          ) : null}
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Face />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <Input
                  id="username"
                  label="username"
                  name="displayName"
                  type="username"
                  value={this.state.displayName}
                  onChange={this.onChange}
                  placeholder="Username"
                  fullWidth
                  autoFocus
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <ContactMailIcon />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <Input
                  id="email"
                  label="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onChange}
                  fullWidth
                  autoFocus
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  name="password"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Grid item>
                <Button
                  disableFocusRipple
                  disableRipple
                  style={{ textTransform: "none" }}
                  variant="text"
                  color="primary"
                >
                  Forgot password ?
                </Button>
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                style={{ textTransform: "none" }}
              >
                Login
              </Button>
            </Grid>
          </form>
        </div>
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles),

  firebaseConnect(),
  firestoreConnect(),
  connect(
    (state, props) => ({
      notify: state.notify,
    }),
    { notifyUser }
  )
)(Register);
