import React from "react";
import { Card } from "rimble-ui";
import ConnectButton from "./ConnectButton";
import SmartContractControls from "./SmartContractControls";

class PrimaryCard extends React.Component {
  render() {
    return (
      <Card width={"400px"} mx={"auto"} px={4}>
        {!this.props.account ? (
          <ConnectButton
            initAccount={this.props.initAccount}
            account={this.props.account}
          />
        ) : (
          <SmartContractControls
            contract={this.props.contract}
            account={this.props.account}
            initContract={this.props.initContract}
            contractMethodSendWrapper={this.props.contractMethodSendWrapper}
          />
        )}
      </Card>
    );
  }
}

export default PrimaryCard;
