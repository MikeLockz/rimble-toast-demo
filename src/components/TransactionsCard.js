import React from "react";
import { Card, Heading } from "rimble-ui";

class TransactionsCard extends React.Component {
  render() {
    return (
      <Card width={"400px"} mx={"auto"} px={4}>
        <Heading.h2 fontSize={3} textAlign={"center"} px={4} mb={5}>
          Transactions
        </Heading.h2>
        <ul>
          {!this.props.transactions ? (
            <li>No recent transactions</li>
          ) : (
            Object.keys(this.props.transactions).map((keyName, keyIndex) => {
              let txHash = "";
              if (this.props.transactions[keyName].transactionHash) {
                txHash = this.props.transactions[
                  keyName
                ].transactionHash.toString();
                const txStart = txHash.substr(0, 5);
                const txEnd = txHash.substr(txHash.length - 4);
                txHash = txStart + "..." + txEnd;
              }

              return (
                <li key={keyIndex}>
                  Hash: {txHash} | Status:{" "}
                  {this.props.transactions[keyName].status} | Confirmation
                  Count: {this.props.transactions[keyName].confirmationCount}
                </li>
              );
            })
          )}
        </ul>
      </Card>
    );
  }
}

export default TransactionsCard;
