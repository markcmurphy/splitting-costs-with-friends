import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useFirestoreConnect,
  useFirestore,
  useFirebase,
} from "react-redux-firebase";
import AsyncSelect from "react-select/async";
// import Async, { makeAsyncSelect } from "react-select/async";
import firebase from "firebase";
import { createStore, combineReducers, compose } from "redux";
import "firebase/firestore";

import { Link } from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
// import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
// import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";

export default function AddContact(props) {
  const [showForm, setForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [emailMatch, setEmailMatch] = useState("");
  const [inputValue, setInputValue] = useState("");

  // sync /users from firebase into redux
  useFirestoreConnect([
    {
      collection: "users",
    },
    // {
    //   collection: "users",
    //   where: [["email", "==", emailMatch]],
    //   storeAs: "userEmailMatch",
    // },
  ]);

  const firestore = useFirestore();

  //* Connect to redux state using selector hook
  ////   const users = useSelector((state) => state.firestore.data.users);

  const users = useSelector(({ firestore: { data } }) => data.users);
  // const userEmail = useSelector(
  //   ({ firestore: { data } }) => data.userEmailMatch
  // );

  // console.log(emailMatch);
  // console.log(userEmail);

  // TODO: get UID by email using cloud function instead of searching users
  const getKeyByValue = (value) => {
    for (const prop in users) {
      if (users.hasOwnProperty(prop)) {
        if (users[prop].email === value) {
          return prop;
        }
      }
    }
  };

  //   todo: combine input change methods
  const inputChangeName = (e) => {
    setFirstName(e.target.value);
  };

  const inputChangeEmail = (e) => {
    setEmailMatch(e.target.value);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const { uid, id } = props;

    firestore
      .collection("users")
      .where("email", "==", emailMatch)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    firestore
      .add(
        {
          collection: "users",
          doc: uid,
          subcollections: [{ collection: "contacts" }],
        },
        {
          id: getKeyByValue(emailMatch) ? getKeyByValue(emailMatch) : "",
          firstName: firstName,
        }
      )
      .then((docRef) => {
        firestore.update(
          {
            collection: "users",
            doc: uid,
            subcollections: [
              {
                collection: "contacts",
                doc: docRef.id,
              },
            ],
          },
          {
            uid: docRef.id,
          }
        );
        // console.log("Document written with ID: ", docRef.id);
      });

    setFirstName("");
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
          <DialogTitle id="form-dialog-title">Add New Friend</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter your friends here!</DialogContentText>
            <form onSubmit={formSubmit} id="newFriendForm">
              <FormGroup>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Friend Name</InputLabel>
                  <Input
                    autoFocus
                    id="friendNext"
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={inputChangeName}
                    fullWidth
                  />
                </FormControl>
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
                {/* <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Friend Name</InputLabel>
                  <Input
                    autoFocus
                    id="friendNext"
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={inputChange}
                    fullWidth
                  />
                </FormControl> */}
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

  //   const getKeyByValue = (object, value) => {
  //     for (const prop in object) {
  //       if (object.hasOwnProperty(prop)) {
  //         if (object[prop].email === value) return prop;
  //       }
  //     }
  //   }

  // const filterColors = (inputValue) => {
  //   return colourOptions.filter((i) =>
  //     i.label.toLowerCase().includes(inputValue.toLowerCase())
  //   );
  // };

  //   console.log(inputValue);

  //   const loadOptions = (inputValue, callback) => {
  //     setTimeout(() => {
  //       callback(getKeyByValue(inputValue));
  //     }, 5000);
  //   };

  //   const handleInputChange = (newValue) => {
  //     const cleanValue = newValue.replace(/\W/g, "");
  //     setInputValue(cleanValue);
  //     return inputValue;
  //   };

  return (
    <div>
      {showForm ? (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setForm(!showForm)}
            style={{ marginTop: "5px" }}
          >
            Close
          </Button>
        </>
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setForm(!showForm)}
            style={{ marginTop: "5px" }}
          >
            Add Friend
          </Button>
          {/* <IconButton aria-label="delete" color="primary">
              <PersonAddIcon />
            </IconButton> */}
        </div>
      )}
      {/* <div>
        <pre>inputValue: "{inputValue}"</pre>
        <AsyncSelect
          //   cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          onInputChange={handleInputChange}
        />
      </div> */}
      {renderForm()}
    </div>
  );
}
