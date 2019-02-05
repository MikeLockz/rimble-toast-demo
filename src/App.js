import React, { Component } from "react";
import { Box, ToastMessage } from "rimble-ui";
import SmartContractCard from "./SmartContractCard";
import RimbleTransaction from "./RimbleTransaction";
import InstructionsCard from "./InstructionsCard";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Box my={"auto"}>
          <RimbleTransaction>
            {/* Render Props pattern */}
            {({ contractMethodSendWrapper, contract, account }) => (
              <SmartContractCard
                contractMethodSendWrapper={contractMethodSendWrapper}
                contract={contract}
                account={account}
              />
            )}
          </RimbleTransaction>
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        </Box>

        <InstructionsCard />
      </div>
    );
  }
}

export default App;
