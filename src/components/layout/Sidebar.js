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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Sidebar(props) {
  const { id } = useParams();
  const classes = useStyles();

  return (
    <div>
      {/* <div className="alert alert-info mt-4" role="alert">
        Add friend or friends prior to adding expense!
      </div> */}
      <>
        {props ? (
          <>
            <div className={classes.root} style={{ paddingLeft: "10%" }}>
              <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical contained primary button group"
                variant="contained"
              >
                <Button>
                  <AddNewTrip uid={props.uid} friends={props.friends} />
                </Button>
                <Button>
                  <AddContact uid={props.uid} />
                </Button>
              </ButtonGroup>
            </div>
            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            <div style={{ paddingLeft: "10%" }}>
              <ListFriends id={id} uid={props.uid} />
            </div>
            {/* <Divider style={{ marginTop: "15px", marginBottom: "15px" }} /> */}
            <div style={{ paddingLeft: "10%" }}>
              <TripList
                uid={props.uid}
                id={props.id}
                style={{ paddingLeft: "10%" }}
              />
            </div>
          </>
        ) : null}
      </>

      <Route
        path="/trip/:id"
        render={() => (
          <div>
            {/* <Divider style={{ marginTop: "15px", marginBottom: "15px" }} /> */}
            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            <div style={{ paddingLeft: "10%" }}>
              <ListFriendsOnTrip
                id={id}
                uid={props.uid}
                style={{ paddingLeft: "10%" }}
              />
            </div>
            <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
            <div style={{ paddingLeft: "10%" }}>
              <AddExpense
                id={id}
                uid={props.uid}
                style={{ paddingLeft: "10%" }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
