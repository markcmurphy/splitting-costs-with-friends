import React, { useState } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import _ from "lodash";

export default function TripList(props) {
  const [showForm, setShowForm] = useState(false);

  // useFirestoreConnect([
  //   {
  //     collection: "users",
  //     doc: props.uid,
  //     subcollections: [{ collection: "trips" }],
  //     storeAs: "trips",
  //   },
  // ]);
  useFirestoreConnect([
    {
      collection: "trips",
      where: [["tripOwner", "==", props.uid]],
      storeAs: "myOwnedTrips",
    },
    {
      collection: "trips",
      where: [["friendsInvolved", "array-contains", props.uid]],
      storeAs: "tripsNotOwned",
    },
  ]);

  const trips = useSelector((state) => state.firestore.ordered.myOwnedTrips);
  const tripsNotOwned = useSelector(
    (state) => state.firestore.ordered.tripsNotOwned
  );

  // console.log(props);
  // console.log(trips);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(2, 0, 1),
    },
  }));

  const classes = useStyles();

  function RenderList() {
    if (!showForm) {
      return (
        <List>
          {_.map(trips, (item) => {
            return (
              <ListItem key={item.id} dense={true}>
                {/* TODO: reenable avatars */}
                {/* <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar> */}
                <Link
                  style={{ textDecoration: "none" }}
                  component={RouterLink}
                  to={{
                    pathname: `/trip/${item.id}`,
                  }}
                >
                  {/* TODO: reenable secondary text */}
                  <ListItemText
                    primary={item.tripName}
                    // secondary="Jan 7, 2014"
                  />
                </Link>
              </ListItem>
            );
          })}
        </List>
      );
    }
  }

  function RenderListTripsNotOwned() {
    if (!showForm) {
      return (
        <>
          {_.map(tripsNotOwned, (item) => {
            return (
              <ListItem key={item.id}>
                {/* <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar> */}
                <Link
                  style={{ textDecoration: "none" }}
                  component={RouterLink}
                  to={{
                    pathname: `/trip/${item.id}`,
                  }}
                >
                  <ListItemText
                    primary={item.tripName}
                    // secondary="Jan 7, 2014"
                  />
                </Link>
              </ListItem>
            );
          })}
        </>
      );
    }
  }

  // return trips ? (
  return (
    <>
      {showForm ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          Display All Trips
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowForm(!showForm)}
        >
          Close Trip List
        </Button>
      )}
      <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
      <Typography variant="h6" className={classes.title}>
        My Owned Trips
      </Typography>
      <List>{RenderList()}</List>
      <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
      <Typography variant="h6" className={classes.title}>
        Trips I'm involved in
      </Typography>
      <List>{RenderListTripsNotOwned()}</List>
    </>
  );
}
