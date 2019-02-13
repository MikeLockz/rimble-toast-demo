import React from "react";
import { Card, Heading } from "rimble-ui";

class TransactionsCard extends React.Component {
  render() {
    return (
      <Card width={"600px"} mx={"auto"} px={4}>
        <Heading.h2 fontSize={3} textAlign={"center"} px={4} mb={5}>
          Transactions
        </Heading.h2>
        <ul>
          {!this.props.transactions ? (
            <li>No recent transactions</li>
          ) : (
            Object.keys(this.props.transactions).map((keyName, keyIndex) => (
              <li key={keyIndex}>
                {keyName} - {keyIndex}
              </li>
            ))
          )}
        </ul>
      </Card>
    );
  }
}

export default TransactionsCard;
