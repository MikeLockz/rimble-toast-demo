import React, { Component } from "react";
import { Box, ToastMessage } from "rimble-ui";
import SmartContractCard from "./components/SmartContractCard";
import RimbleWeb3 from "./components/RimbleWeb3";
import InstructionsCard from "./components/InstructionsCard";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Box my={"auto"}>
          <RimbleWeb3>
            <RimbleWeb3.Consumer>
              {({
                web3,
                contract,
                account,
                initContract,
                initAccount,
                contractMethodSendWrapper
              }) => (
                <div>
                  {/* Conditionally render child comonents dependent on web3 being loaded */}
                  {web3 ? (
                    <div>
                      <SmartContractCard
                        contract={contract}
                        account={account}
                        initContract={initContract}
                        initAccount={initAccount}
                        contractMethodSendWrapper={contractMethodSendWrapper}
                      />
                      {/* FUTURE: We need to make sure multiple components can consume a transaction's status */}
                      {/* <TransactionStatusCard /> */}
                    </div>
                  ) : null}
                </div>
              )}
            </RimbleWeb3.Consumer>
          </RimbleWeb3>
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        </Box>

        <InstructionsCard />
      </div>
    );
  }
}

export default App;
