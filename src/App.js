import React, { Component } from "react";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  Link as RouterLink,
} from "react-router-dom";
import Link from "@material-ui/core/Link";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Sidebar from "./components/layout/Sidebar";
import RenderMaterialTable from "./components/expense/RenderMaterialTable";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";

import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";

import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

// const classes = useStyles;

class App extends Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
  };

  handleMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    const { firebase } = this.props;
    firebase.logout().then(this.props.history.push("/login"));
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  };

  container = window !== undefined ? () => window().document.body : undefined;

  render() {
    const { window } = this.props;

    const { classes, auth, ...props } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Switch>
          <Route
            {...props}
            exact
            path="/"
            component={
              (this.UserIsAuthenticated = () =>
                auth.uid ? <Sidebar uid={auth.uid} /> : null)
            }
          />
          <Route
            {...props}
            exact
            path="/trip/:id"
            component={
              (this.UserIsAuthenticated = ({ match }) =>
                auth.uid ? (
                  <Sidebar id={match.params.id} uid={auth.uid} />
                ) : null)
            }
          />
        </Switch>
      </div>
    );

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className={classes.root}>
          <CssBaseline />
          {/* <div className="App"> */}
          {/* <header>
            <Navbar />
          </header> */}
          {/* <MenuAppBar props={this.props} drawerWidth={drawerWidth} /> */}
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Splitting Costs with Friends!
              </Typography>
              {auth.uid ? (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={(e) => this.handleMenu(e)}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose}>{auth.email}</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={this.onLogoutClick}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : null
              // <Typography
              //   style={{ marginLeft: "20px" }}
              //   variant="h6"
              //   className={classes.title}
              // >
              //   <Link
              //     style={{ color: "white" }}
              //     component={RouterLink}
              //     to="/login"
              //   >
              //     Login
              //   </Link>

              //   <Link
              //     style={{ color: "white", marginLeft: "20px" }}
              //     component={RouterLink}
              //     to="/register"
              //   >
              //     Register
              //   </Link>
              // </Typography>
              }
            </Toolbar>
          </AppBar>

          <nav className={classes.drawer}>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={
                  window !== undefined
                    ? () => window().document.body
                    : undefined
                }
                variant="temporary"
                // anchor={theme.direction === "rtl" ? "right" : "left"}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route
                exact
                path="/login"
                component={UserIsNotAuthenticated(Login)}
              />
              <Route
                exact
                path="/register"
                component={UserIsNotAuthenticated(Register)}
              />
              <Route
                exact
                path="/"
                component={UserIsAuthenticated(() => (
                  // <AllTrips uid={auth.uid} />
                  <h1>Select trip from left sidebar</h1>
                ))}
              />
              <Route
                // {...props}
                exact
                path="/trip/:id"
                render={
                  (this.UserIsAuthenticated = ({ match }) =>
                    this.props.auth.uid ? (
                      <RenderMaterialTable
                        tripId={match.params.id}
                        uid={this.props.auth.uid}
                      />
                    ) : // <RenderExpenseList
                    //   tripId={match.params.id}
                    //   uid={this.props.auth.uid}
                    // />
                    //  <Trip id={match.params.id} uid={this.props.auth.uid} />
                    null)
                }
              />
              {/* <Route
                {...props}
                exact
                path="/trip/:id"
                render={
                  (this.UserIsAuthenticated = ({ match, props }) =>
                    this.props.auth.uid ? (
                      <Trip id={match.params.id} uid={this.props.auth.uid} />
                    ) : null)
                }
              /> */}

              <Route exact path="/" component={UserIsNotAuthenticated(Login)} />
            </Switch>
          </main>
          {/* <footer style={{ backgroundColor: "lightGrey" }}>Mark Murphy</footer> */}
        </div>
        {/* </div> */}
      </Router>
    );
  }
}

// export default App;
export default compose(
  withStyles(useStyles, { withTheme: true }),
  firebaseConnect(),
  connect((state) => ({
    // tripID: state.id,
    auth: state.firebase.auth,
  })),
  withRouter
)(App);
