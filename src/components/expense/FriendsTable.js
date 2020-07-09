// import React, { Component } from "react";
// import _ from "lodash";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

// export class FriendsTable extends Component {
//   renderFriendHeader = (props) => {
//     const { friend } = this.props;

//     const friendsHeader = _.map(friend, (value, key) => {
//       return <Th key={key}>{value.firstName}</Th>;
//     });

//     if (friend) {
//       return friendsHeader;
//     } else {
//       // return <Th>Loading</Th>;
//     }
//   };

//   render() {
//     const { expenses, friend, friendsInvolved } = this.props;

//     if (expenses && friend) {
//       return (
//         <Table>
//           <Thead>
//             <Tr>{this.renderFriendHeader()}</Tr>
//           </Thead>
//           <Tbody>
//             {_.map(friend, (value, key) => {
//               if (friendsInvolved.includes(key)) {
//                 return <Td>X</Td>;
//               } else {
//                 return <Td>$0</Td>;
//               }
//             })}
//           </Tbody>
//         </Table>
//       );
//     } else {
//       return null;
//     }
//   }
// }

// export default FriendsTable;
