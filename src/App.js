import React, { Component } from "react";
import { ThemeProvider, Box, ToastMessage } from "rimble-ui";
import SmartContractCard from "./components/SmartContractCard";
import RimbleWeb3 from "./components/RimbleWeb3";
import InstructionsCard from "./components/InstructionsCard";
import theme from "./theme"

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme} className="App">
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
                    <SmartContractCard
                      contract={contract}
                      account={account}
                      initContract={initContract}
                      initAccount={initAccount}
                      contractMethodSendWrapper={contractMethodSendWrapper}
                    />
                  ) : (
                    <div>Are you sure you have metamask installed?</div>
                  )}
                </div>
              )}
            </RimbleWeb3.Consumer>
          </RimbleWeb3>
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        <InstructionsCard />
      </ThemeProvider>
    );
  }
}

export default App;
