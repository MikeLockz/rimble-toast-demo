import React from "react";
import { Box, Heading, Text } from "rimble-ui";

class InstructionsCard extends React.Component {
  render() {
    return (
      <Box width={"600px"} mx="auto" mt={4}>
        <Heading.h3>Instructions:</Heading.h3>
        <ol>
          <li><Text p={1}>Make sure MetaMask is working in your browser</Text></li>
          <li><Text p={1}>Set the network to Rinkeby Test Network</Text></li>
          <li><Text p={1}>You'll need a little bit of eth for gas fees</Text></li>
        </ol>
      </Box>
    );
  }
}

export default InstructionsCard;
