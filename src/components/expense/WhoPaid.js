import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

export default function WhoPaid(friendId) {
  useFirestoreConnect(() => [{ collection: "friends", doc: friendId }]);
  const friend = useSelector(
    ({ firestore: { data } }) => data.friends && data.friends[friendId]
  );
  return friend;
}
