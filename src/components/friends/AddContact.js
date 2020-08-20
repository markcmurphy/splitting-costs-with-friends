import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect, useFirestore } from "react-redux-firebase";
import "firebase/firestore";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2, 0, 2),
    },
  },
}));

export default function AddContact(props) {
  const [showForm, setForm] = useState(false);
  const [emailMatch, setEmailMatch] = useState("");

  const classes = useStyles();

  // sync /users from firebase into redux
  useFirestoreConnect([
    {
      collection: "users",
    },
  ]);

  const firestore = useFirestore();

  //* Connect to redux state using selector hook
  ////   const users = useSelector((state) => state.firestore.data.users);

  const users = useSelector(({ firestore: { data } }) => data.users);

  const inputChangeEmail = (e) => {
    setEmailMatch(e.target.value);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const { uid, id } = props;

    let userDoc = undefined;
    let userID = undefined;

    firestore
      .collection("users")
      .where("email", "==", emailMatch)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          userDoc = doc.data();
          userID = doc.id;
        });
      })

      .then((doc) => {
        firestore.set(
          {
            collection: "users",
            doc: userID,
          },
          {
            contactOf: firestore.FieldValue.arrayUnion(uid),
          },
          { merge: true }
        );
      });
    setEmailMatch("");
    setForm(false);
  };

  function renderForm() {
    const marginBottom = "15px";

    if (showForm) {
      return (
        <Dialog
          open={showForm}
          onClose={() => setForm(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Contact</DialogTitle>
          <DialogContent>
            {/* <div className={classes.root}> */}
            <Alert severity="info">
              Contact must already be registered - use mark@murphymark.me as
              example
            </Alert>
            {/* </div> */}
            {/* <DialogContentText>Enter your friends here!</DialogContentText> */}

            <form onSubmit={formSubmit} id="newFriendForm">
              {" "}
              <FormGroup>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Email Address</InputLabel>
                  <Input
                    autoFocus
                    id="emailNext"
                    type="text"
                    name="emailAddress"
                    value={emailMatch}
                    onChange={inputChangeEmail}
                    fullWidth
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "30px" }}
                >
                  Submit{" "}
                </Button>
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForm(false)} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }

  return (
    <>
      <div
        // variant="contained"
        // color="primary"
        onClick={() => setForm(!showForm)}
        // style={{ marginTop: "5px" }}
      >
        Add Contact
      </div>
      {renderForm()}
    </>
  );
}
