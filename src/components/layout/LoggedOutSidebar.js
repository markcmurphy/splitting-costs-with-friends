import React from "react";
import ListFriends from "../friends/ListFriends.js";
import AddExpense from "../expense/AddExpense.js";
import { Route, useParams } from "react-router-dom";
import AddNewTrip from "../trips/AddNewTrip";
import TripList from "../trips/TripList";
import Divider from "@material-ui/core/Divider";
import AddContact from "../friends/AddContact";
import ListFriendsOnTrip from "../friends/ListFriendsOnTrip.js";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Link as RouterLink,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function LoggedOutSidebar(props) {
  const { id } = useParams();
  const classes = useStyles();

  return (
    <div>
      {/* <div className="alert alert-info mt-4" role="alert">
        Add friend or friends prior to adding expense!
      </div> */}

      <>
        <div className={classes.root} style={{ paddingLeft: "10%" }}>
          <ButtonGroup
            variant="contained"
            aria-label="contained  button group"
            style={{ marginLeft: "20px" }}
          >
            <Button>
              <Link
                style={{ color: "#3f51b5", textDecoration: "none" }}
                component={RouterLink}
                to="/login"
              >
                Login
              </Link>
            </Button>
            <Button>
              <Link
                style={{ color: "#3f51b5", textDecoration: "none" }}
                component={RouterLink}
                to="/AnonLogin"
              >
                Anon Login
              </Link>
            </Button>
            <Button>
              <Link
                style={{ color: "#3f51b5", textDecoration: "none" }}
                component={RouterLink}
                to="/register"
              >
                Register
              </Link>
            </Button>
          </ButtonGroup>
        </div>
      </>
    </div>
  );
}
