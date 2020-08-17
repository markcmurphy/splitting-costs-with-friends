import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useFirestoreConnect([
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "contacts" }],
      storeAs: "myContacts",
    },
    {
      collection: "trips",
      doc: props.tripId,
      //   subcollections: [{ collection: "contacts" }],
      //   where: [["tripOwner", "==", props.uid]],
      storeAs: "friendsOnTrip",
    },
  ]);

  const myContacts = useSelector((state) => state.firestore.ordered.myContacts);

  const friendsOnTrip = useSelector(
    (state) => state.firestore.ordered.friendsOnTrip
  );

  if (friendsOnTrip) {
    console.log(friendsOnTrip[0].friendsInvolved);
  }
  console.log(myContacts);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  //   const handleAllRight = () => {
  //     setRight(right.concat(left));
  //     setLeft([]);
  //   };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  //   const handleAllLeft = () => {
  //     setLeft(left.concat(right));
  //     setRight([]);
  //   };

  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {_.map(items, (value, key) => {
          const labelId = `transfer-list-item-${key}-label`;
          //   console.log(value, key);

          return (
            <ListItem
              key={key}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.firstName} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>{customList(myContacts)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          {/* <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button> */}
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          {/* <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button> */}
        </Grid>
      </Grid>
      <Grid item>{customList(friendsOnTrip)}</Grid>
    </Grid>
  );
}
