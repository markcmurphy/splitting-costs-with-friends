import React, { Component } from "react";
import Friends from "../friends/Friends.js";
import AddExpense from "../expense/AddExpense.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

// export default class Sidebar extends Component {
//   render() {
//     // console.log(match);
//     // let userId = this.props.match.params.userId;
//     // console.log(userId);
//     return (
//       <div className="nav-wrapper pl-3 pr-2" style={{}} id="sidebar">
//         {this.props.id ? (
//           <>
//             <AddExpense id={this.props.id} uid={this.props.uid} />
//             <Friends id={this.props.id} uid={this.props.uid} />
//           </>
//         ) : (
//           console.log(this.props)
//         )}
//       </div>
//     );
//   }
// }

export default function Sidebar(props) {
  const { id } = useParams();
  // console.log(useParams());
  console.log(id);
  console.log(props);
  return (
    <div>
      <div className="nav-wrapper pl-3 pr-2" style={{}} id="sidebar">
        <>
          Sidebar
          <AddExpense id={id} uid={props.uid} />
          <Friends id={id} uid={props.uid} />
        </>
      </div>
    </div>
  );
}
