import _ from "lodash";

export default function TotalAmountPaidPerPerson(props) {
  console.log(props);
  const { friends, expenses } = props;
  const friendsObj = {};

  _.map(friends, (value, key) => {
    for (let expense of expenses) {
      if (friendsObj[value.id] && expense.whoPaid.includes(value.id)) {
        let bal = expense.expenseAmount;
        friendsObj[value.id] += bal;
      } else if (!friendsObj[value.id] && expense.whoPaid.includes(value.id)) {
        let bal = expense.expenseAmount;
        friendsObj[value.id] = bal;
      }
    }
  });

  return friendsObj;
}
