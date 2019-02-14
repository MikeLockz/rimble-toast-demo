import React from "react";
import { Card, Box } from "rimble-ui";

class InstructionsCard extends React.Component {
  render() {
    return (
      <Card width={"600px"} mx={"auto"} px={4}>
        <Box>
          <p>Instructions:</p>
          <ul>
            <li>Make sure MetaMask is working in your browser</li>
            <li>Set the network to Rinkeby Test Network</li>
            <li>You'll need a little bit of ETH for gas fees</li>
          </ul>

          <p>About</p>
          <p>
            This is an example of a webapp that interacts with a Smart Contract.
            The demo uses Web3.js and Rimble UI Components to show the status of
            a Smart Contract transaction via toast messages.{" "}
          </p>
        </Box>
      </Card>
    );
  }
}

export default InstructionsCard;
