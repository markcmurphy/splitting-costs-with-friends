import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { Container } from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

class MatNavBar extends Component {
  state = {
    isAuthenticated: false,
    anchorEl: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;

    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    const { firebase } = this.props;
    firebase.logout();
  };

  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;
    return (
      <Container style={{ flexDirection: "row" }}>
        <Link to="/" className="navbar-brand">
          <Typography variant="h6">Splitting Costs with Friends!</Typography>
        </Link>
        {/* <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}

        {/* <ul className="navbar-nav mr-auto">
              {isAuthenticated ? (
                  <li className="nav-item">
                  <Link to="/" className="nav-link">
                  Dashboard
                  </Link>
                  </li>
                  ) : null}
                </ul> */}
        {isAuthenticated ? (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              //   onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              //   anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              //   open={open}
              //   onClose={handleClose}
            >
              <MenuItem
              //   onClick={handleClose}
              >
                {auth.email}
              </MenuItem>
              <MenuItem onClick={this.onLogoutClick}>logout</MenuItem>
            </Menu>
          </div>
        ) : //   <ul className="navbar-nav ml-auto">
        //     <li className="nav-item">
        //       <a href="#!" className="nav-link">
        //         {auth.email}
        //       </a>
        //     </li>
        //     <li className="nav-item">
        //       <a href="#!" className="nav-link" onClick={this.onLogoutClick}>
        //         Logout
        //       </a>
        //     </li>
        //   </ul>
        null}

        {!isAuthenticated ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </ul>
        ) : null}
      </Container>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
  }))
)(MatNavBar);
