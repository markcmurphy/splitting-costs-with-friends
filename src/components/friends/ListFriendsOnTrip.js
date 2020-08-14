import React, { useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import _ from "lodash";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

export default function ListFriendsOnTrip(props) {
  useFirestoreConnect([
    {
      collection: "users",
      //   doc: props.id,
      where: [["onTrips", "array-contains", props.id]],

      //   subcollections: [{ collection: "friendsInvolved" }],
      //   where: [["tripOwner", "==", props.uid]],
      storeAs: "tripFriendIDs",
    },
    // {
    //   collection: "trips",
    //   where: [["friendsInvolved", "array-contains", props.uid]],
    //   storeAs: "tripsNotOwned",
    // },
  ]);

  const tripFriendIDs = useSelector(
    (state) => state.firestore.ordered.tripFriendIDs
  );

  if (tripFriendIDs) {
    console.log(tripFriendIDs);
  }
  console.log(props.id);
  //    const tripsNotOwned = useSelector(
  //      (state) => state.firestore.ordered.tripsNotOwned
  //    );

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }));

  const classes = useStyles();

  const renderFriend = (props) => {
    const friendsList = _.map(tripFriendIDs, (value, key) => {
      return (
        <ListItem key={value.id}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          {/* <Link
                        to={{
                          pathname: `/trip/${item.id}`,
                          // tripProps: {
                          //   uid: "uid",
                          // },
                        }}
                        style={{ textDecoration: "none" }}
                      > */}
          <ListItemText
            primary={value.label}
            // secondary="Jan 7, 2014"
          />
          {/* </Link> */}
        </ListItem>
      );
    });

    if (tripFriendIDs) {
      return friendsList;
    } else {
      return <CircularProgress />;
    }
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        Friends on Trip
      </Typography>
      <List>{renderFriend()}</List>
    </>
  );
}
