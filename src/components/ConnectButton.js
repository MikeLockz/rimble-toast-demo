import React from "react";
import { Button } from "rimble-ui";

class ConnectButton extends React.Component {
  render() {
    return (
      <Button
        size={"medium"}
        mr={4}
        onClick={this.props.initAccount}
        disabled={this.props.account}
      >
        Connect
      </Button>
    );
  }
}

export default ConnectButton;
