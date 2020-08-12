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

import _ from "lodash";

export default function TripList(props) {
  const [showForm, setShowForm] = useState(false);

  useFirestoreConnect([
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: "trips",
    },
  ]);

  const trips = useSelector((state) => state.firestore.ordered.trips);

  function RenderList() {
    if (!showForm) {
      return (
        <List>
          {_.map(trips, (item) => {
            return (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <Link
                  style={{ textDecoration: "none" }}
                  component={RouterLink}
                  to={{
                    pathname: `/trip/${item.id}`,
                  }}
                >
                  <ListItemText
                    primary={item.tripName}
                    secondary="Jan 7, 2014"
                  />
                </Link>
              </ListItem>
            );
          })}
        </List>
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
      <List>{RenderList()}</List>
    </>
  );
}
