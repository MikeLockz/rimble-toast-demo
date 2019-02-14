import React from "react";
import { MetaMaskButton } from "rimble-ui";

class ConnectButton extends React.Component {
  render() {
    return (
      <MetaMaskButton
        size={"medium"}
        mr={4}
        onClick={this.props.initAccount}
        disabled={this.props.account}
      >
        Connect with MetaMask
      </MetaMaskButton>
    );
  }
}

export default ConnectButton;
