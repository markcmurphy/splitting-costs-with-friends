import React, { Component } from "react";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import { compose } from "redux";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

import Navbar from "./components/layout/Navbar";
import AllTrips from "./components/trips/AllTrips";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/loading/LoadingSpinner";
import { queryAllByAltText } from "@testing-library/react";
import Trip from "./components/trips/Trip";
import Sidebar from "./components/layout/Sidebar";
import RenderExpenseList from "./components/expense/RenderExpenseList";
import AddNewTrip from "./components/trips/AddNewTrip";
import ListTrips from "./components/trips/ListTrips";
import RenderMaterialTable from "./components/expense/RenderMaterialTable";
import MaterialSideBar from "./components/layout/MaterialSidebar";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { green } from "@material-ui/core/colors";

import {
  makeStyles,
  useTheme,
  withTheme,
  withStyles,
} from "@material-ui/core/styles";

const drawerWidth = 200;

// const theme = withTheme();

// console.log(<Theme />);

// const Nested = withStyles({
//   root: {}, // a style rule
//   label: {}, // a nested style rule
// })(({ classes }) => (
//   <button className={classes.root}>
//     <span className={classes.label}> // 'jss2 my-label' Nested</span>
//   </button>
// ));

// const useStyles = withStyles((theme) => ({
//   root: {
//     padding: theme.spacing(1),
//     [theme.breakpoints.down("sm")]: {
//       backgroundColor: theme.palette.secondary.main,
//     },
//     [theme.breakpoints.up("md")]: {
//       backgroundColor: theme.palette.primary.main,
//     },
//     [theme.breakpoints.up("lg")]: {
//       backgroundColor: green[500],
//     },
//   },
// }));

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,

      backgroundColor: "red",
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

const classes = useStyles;

class App2 extends Component {
  state = {
    mobileOpen: false,
    setMobileOpen: false,
  };

  render() {
    // console.log(classes);

    // console.log(classes.appBar);
    console.log(drawerWidth);
    console.log(this.state);

    const handleDrawerToggle = () => {
      this.setState({
        mobileOpen: !this.state.mobileOpen,
      });
    };

    const { window } = this.props;
    console.log(window);

    // const [mobileOpen, setMobileOpen] = React.useState(false);

    const { classes, auth, ...props } = this.props;
    console.log(classes);
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

    const container =
      window !== undefined ? () => window().document.body : undefined;

    // console.log(window.document.body);
    console.log(container);

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className={classes.root}>
          <CssBaseline />
          {/* <div className="App"> */}
          {/* <header>
            <Navbar />
          </header> */}
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Responsive drawer
              </Typography>
            </Toolbar>
          </AppBar>
          {/* <MaterialSideBar /> */}
          <nav className={classes.drawer} aria-label="mailbox folders">
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
                onClose={handleDrawerToggle}
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
  connect((state) => ({
    // tripID: state.id,
    auth: state.firebase.auth,
  })),
  withStyles(useStyles, { withTheme: true })
)(App2);
