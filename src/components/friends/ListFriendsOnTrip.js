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
import FriendsInvolved from "../expense/FriendsInvolved";

export default function ListFriendsOnTrip(props) {
  useFirestoreConnect([
    {
      collection: "users",
      where: [["onTrips", "array-contains", props.id]],
      storeAs: "tripFriendIDs",
    },
  ]);

  const tripFriendIDs = useSelector(
    (state) => state.firestore.ordered.tripFriendIDs
  );

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

  const renderFriend = (props) => {
    const friendsList = _.map(tripFriendIDs, (value, key) => {
      return (
        // <ListItem key={value.id} dense={true}>
        <ListItem key={key} dense={true}>
          {/* <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar> */}
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
