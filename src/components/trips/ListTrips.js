import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import PropTypes from "prop-types";

// import { FixedSizeList } from "react-window";

class ListTrips extends Component {
  state = {
    showForm: false,
    tripID: "",
  };

  renderRow = () => {
    // const { index, style } = props;
    const { trips, index, style } = this.props;
    console.log(this.props);
    trips.map((item) => {
      return (
        <ListItem
          style={style}
          key={index}
          // key={item.id}>
        >
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <Link
            to={{
              pathname: `/trip/${item.id}`,
            }}
            style={{ textDecoration: "none" }}
          >
            <ListItemText primary={item.tripName} secondary="Jan 7, 2014" />
          </Link>
        </ListItem>
      );
    });

    // <ListItem button style={style} key={index}>
    // <ListItemText primary={`Item ${index + 1}`} />
    // </ListItem>
  };

  renderForm = () => {
    const { showForm } = this.state;
    const { trips } = this.props;

    if (!showForm) {
      return (
        <>
          {trips ? (
            // trips.map((item) => {
            // return (
            <FixedSizeList
              height={400}
              width={300}
              itemSize={46}
              itemCount={200}
            >
              {this.renderRow()}
              {/* <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <Link
                      to={{
                        pathname: `/trip/${item.id}`,
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItemText
                        primary={item.tripName}
                        secondary="Jan 7, 2014"
                      />
                    </Link>
                  </ListItem> */}
            </FixedSizeList>
          ) : (
            // );
            // })
            <LoadingSpinner />
          )}
        </>
      );
    }
  };

  render() {
    const { showForm } = this.state;
    // const { trips, uid } = this.props;

    return (
      <div>
        {showForm ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Display All Trips
          </Button>
        ) : (
          // <button
          //   className="btn btn-secondary mt-4 btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Display All Trips
          // </button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close Trip List
          </Button>
          // <button
          //   className="btn btn-danger mt-4 btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close Trip List
          // </button>
        )}
        <div>
          <div className="">{this.renderForm()}</div>
        </div>
      </div>
    );
  }
}

ListTrips.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      subcollections: [{ collection: "trips" }],
      storeAs: `${props.uid}-trips`,
    },
  ]),

  connect(({ firestore: { ordered } }, props) => ({
    trips: ordered[`${props.uid}-trips`],
  }))
)(ListTrips);
