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
            <RimbleTransaction.Consumer>
              {({
                web3,
                contract,
                account,
                initContract,
                initAccount,
                contractMethodSendWrapper
              }) => (
                <div>
                  {/* Conditionally render the comonents dependent on web3 being loaded */}
                  {web3 ? (
                    <SmartContractCard
                      web3={web3}
                      contract={contract}
                      account={account}
                      initContract={initContract}
                      initAccount={initAccount}
                      contractMethodSendWrapper={contractMethodSendWrapper}
                    />
                  ) : null}
                </div>
              )}
            </RimbleTransaction.Consumer>
          </RimbleTransaction>
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        </Box>

        <InstructionsCard />
      </div>
    );
  }
}

export default App;
