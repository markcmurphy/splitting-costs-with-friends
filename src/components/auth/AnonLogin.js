import React, { Component } from "react";
import { Paper, withStyles, Grid, Button } from "@material-ui/core";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import { notifyUser } from "../../actions/notifyActions";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(),
  },
});

class AnonLogin extends Component {
  onSubmit = (e) => {
    e.preventDefault();

    const { firebase, notifyUser, firestore } = this.props;

    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in.
            firestore
              .set(
                { collection: "users", doc: user.uid },
                {
                  username: "Anon",
                },
                { merge: true }
              )
              .catch(function (e) {
                console.log(e);
              });
          }
        });
      });
  };

  //   onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          <form onSubmit={this.onSubmit}>
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
)(AnonLogin);
