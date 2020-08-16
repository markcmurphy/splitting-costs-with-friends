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

export default function ListFriends(props) {
  useFirestoreConnect([
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "contacts" }],
      //   where: [["tripOwner", "==", props.uid]],
      storeAs: "myContacts",
    },
    // {
    //   collection: "trips",
    //   where: [["friendsInvolved", "array-contains", props.uid]],
    //   storeAs: "tripsNotOwned",
    // },
  ]);

  const myContacts = useSelector((state) => state.firestore.ordered.myContacts);
  // console.log(myContacts);
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
      margin: theme.spacing(2, 0, 1),
    },
  }));

  const classes = useStyles();

  const renderFriend = (props) => {
    const friendsList = _.map(myContacts, (value, key) => {
      return (
        // <ListItem key={value.id} dense={true}>
        <ListItem key={key} dense={true}>
          {/* TODO: reenable avatars */}
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
            primary={value.firstName}
            // TODO: reenable secondary text

            // secondary="Jan 7, 2014"
          />
          {/* </Link> */}
        </ListItem>
      );
    });

    if (myContacts) {
      return friendsList;
    } else {
      return <CircularProgress />;
    }
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        My Contacts
      </Typography>
      <List>{renderFriend()}</List>
    </>
  );
}
