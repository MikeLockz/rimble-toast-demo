import React from "react";
import { Flex, Heading, MetaMaskButton } from "rimble-ui";

class ConnectButton extends React.Component {
  render() {
    return (
      <Flex flexDirection="column" alignItems="center" p={5}>
        <Heading.h2 textAlign="center" pb={4}>
          Connect with MetaMask to try out the demo
        </Heading.h2>

        <MetaMaskButton
          size={"medium"}
          mx="auto"
          onClick={this.props.initAccount}
          disabled={this.props.account}
        >
          Connect with MetaMask
        </MetaMaskButton>
      </Flex>
    );
  }
}

export default ConnectButton;
