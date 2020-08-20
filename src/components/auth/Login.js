import React, { Component } from "react";
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { notifyUser } from "../../actions/notifyActions";
import Input from "@material-ui/core/Input";

import Alert from "../layout/Alert";
import { Face, Fingerprint } from "@material-ui/icons";
import ContactMailIcon from "@material-ui/icons/ContactMail";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(),
  },
});

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { firebase, notifyUser } = this.props;
    const { email, password } = this.state;

    firebase
      .login({
        email,
        password,
      })
      .catch((err) => notifyUser("Invalid Login Info", "error"))
      .then(this.props.history.push("/"));
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          <form onSubmit={this.onSubmit}>
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
                  value={email}
                  onChange={this.onChange}
                  placeholder="Email"
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
                  value={password}
                  onChange={this.onChange}
                  name="password"
                  placeholder="Password"
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
  connect(
    (state, props) => ({
      notify: state.notify,
    }),
    { notifyUser }
  )
)(Login);
