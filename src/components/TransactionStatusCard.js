import React from "react";
import { Card, Pill, Flex } from "rimble-ui";

class TransactionStatusCard extends React.Component {
  render() {
    return (
      <Card>
        <Flex
          px={0}
          pt={4}
          borderTop={1}
          borderColor={"#E8E8E8"}
          justifyContent="space-between"
        >
          <div>
            Transaction Status: <Pill color={"gray"}>unknown</Pill>
          </div>
        </Flex>
      </Card>
    );
  }
}

export default TransactionStatusCard;
