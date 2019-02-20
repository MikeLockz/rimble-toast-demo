import React from "react";
import Web3 from "web3"; // uses latest 1.x.x version

const RimbleTransactionContext = React.createContext({
  contract: {},
  account: {},
  web3: {},
  transactions: {},
  initWeb3: () => {},
  initContract: () => {},
  initAccount: () => {}
});

class RimbleTransaction extends React.Component {
  static Consumer = RimbleTransactionContext.Consumer;

  // Initialize a web3 provider
  initWeb3 = async () => {
    let web3 = {};

    // Check for modern web3 provider
    if (window.ethereum) {
      console.log("Using modern web3 provider.");
      web3 = new Web3(window.ethereum);
    }
    // Legacy dapp browsers, public wallet address always exposed
    else if (window.web3) {
      console.log("Legacy web3 provider. Try updating.");
      web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );

      web3 = false;
    }

    this.setState({ web3 });
  };

  initContract = async (address, abi) => {
    console.log("creating contract");
    // Create contract on initialized web3 provider with given abi and address
    try {
      const contract = await new this.state.web3.eth.Contract(abi, address);
      this.setState({ contract });
    } catch (error) {
      console.log("Could not create contract.");
      window.toastProvider.addMessage("Contract creation failed.", {
        variant: "failure"
      });
    }
  };

  initAccount = async () => {
    try {
      // Request account access if needed
      await window.ethereum.enable().then(wallets => {
        const account = wallets[0];
        this.setState({ account });
        console.log("wallet address:", this.state.account);
      });
    } catch (error) {
      // User denied account access...
      console.log("error:", error);
      window.toastProvider.addMessage("User needs to CONNECT wallet", {
        variant: "failure"
      });
    }
  };

  contractMethodSendWrapper = contractMethod => {
    // Create new tx and add to collection
    let transaction = this.createTransaction();
    this.addTransaction(transaction);

    // Show toast for starting transaction
    console.log("Starting Transaction");
    this.showTransactionToast(transaction);

    const { contract, account } = this.state;

    try {
      contract.methods[contractMethod]()
        .send({ from: account })
        .on("transactionHash", hash => {
          // Submitted to block and received transaction hash
          console.log("Transaction hash generated: ", hash);
          console.log("transactions", transaction);

          // Set properties on the current transaction
          transaction.transactionHash = hash;
          transaction.status = "pending";
          this.updateTransaction(transaction);

          // Show user current status
          this.showTransactionToast(transaction);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // Update
          transaction.confirmationCount += 1;

          // How many confirmations should be received before informing the user
          const confidenceThreshold = 3;

          if (transaction.confirmationCount === 1) {
            // Initial confirmation receipt
            console.log("Transaction confirmed.");
            transaction.status = "confirmed";

            this.showTransactionToast(transaction);
          } else if (transaction.confirmationCount < confidenceThreshold) {
            console.log(
              "Confirmation " +
                transaction.confirmationCount +
                ". Threshold for confidence not met."
            );
            // return;
          } else if (transaction.confirmationCount === confidenceThreshold) {
            console.log("Confidence threshold met.");
            // check the status from result since we are confident in the result
            if (receipt.status) {
              console.log("Transaction completed successfully!");
              transaction.status = "success";
            } else if (!receipt.status) {
              console.log("Transaction reverted due to error.");
              transaction.status = "error";
            }

            this.showTransactionToast(transaction);
            // return;
          } else if (transaction.confirmationCount > confidenceThreshold) {
            console.log(
              "Confirmation " +
                transaction.confirmationCount +
                ". Confidence threshold already met."
            );
          }

          // Update transaction with receipt details
          this.updateTransaction(transaction);
          // this.showTransactionToast(transaction);
        })
        .on("receipt", receipt => {
          // Received receipt
          console.log("receipt: ", receipt);
        })
        .on("error", error => {
          // Errored out
          console.log(error);
          transaction.status = "error";
          this.showTransactionToast(transaction);
        });
    } catch (error) {
      console.log("Error calling method on smart contract.");
      transaction.status = "error";
      this.showTransactionToast(transaction);
    }
  };

  // Create tx
  createTransaction = () => {
    let transaction = {};
    transaction.created = Date.now();
    transaction.status = "started";
    transaction.confirmationCount = 0;

    return transaction;
  };

  addTransaction = transaction => {
    console.log("adding new transaction:", this.state.transactions);
    const transactions = { ...this.state.transactions };
    transactions[`tx${transaction.created}`] = transaction;
    this.setState({ transactions });
  };

  // Add/update transaction in state
  updateTransaction = updatedTransaction => {
    console.log("updating transactions: ", this.state.transactions);
    const transactions = { ...this.state.transactions };
    console.log("Updating transaction: ", updatedTransaction);
    debugger;
    transactions[`tx${updatedTransaction.created}`] = updatedTransaction;
    this.setState({ transactions });
  };

  // Pass transactions to context

  // On all tranasction status changes, run tx through decorator

  // Check the status from receipt of transaction
  determineTransactionStatus = (receipt, transaction) => {
    if (receipt.status === true) {
      console.log("Transaction completed successfully!");
      transaction.status = "success";
    } else if (receipt.status === false) {
      console.log("Transaction reverted due to error.");
      transaction.status = "error";
    }

    this.showTransactionToast(transaction);
  };

  showTransactionToast = incomingTransaction => {
    let transaction = {};
    // Add extra info to transaction
    transaction.lastUpdated = Date.now();
    transaction = { ...transaction, ...incomingTransaction };

    // Get text info for toast
    let toastMeta = this.getTransactionToastMeta(transaction);

    // Show toast
    window.toastProvider.addMessage(".", toastMeta);
  };

  getTransactionToastMeta = transaction => {
    let transactionToastMeta = {};
    let status = transaction.status;
    let transactionHash = transaction.transactionHash;

    switch (status) {
      case "started":
        transactionToastMeta = {
          message: "Change submitted",
          secondaryMessage: "Confirm in MetaMask",
          actionHref: "",
          actionText: "",
          variant: "default",
          icon: "InfoOutline"
        };
        break;
      case "pending":
        transactionToastMeta = {
          message: "Processing change...",
          secondaryMessage: "This may take a few minutes",
          actionHref: "",
          actionText: "",
          variant: "processing"
        };
        break;
      case "confirmed":
        transactionToastMeta = {
          message: "First block confirmed",
          secondaryMessage: "Your change is in progress",
          actionHref: "https://rinkeby.etherscan.io/tx/" + transactionHash,
          actionText: "Check progress",
          variant: "processing"
        };
        break;
      case "success":
        transactionToastMeta = {
          message: "Smart contract value changed",
          variant: "success"
        };
        break;
      case "error":
        transactionToastMeta = {
          message: "Value change failed",
          secondarymessage:
            "Make sure you have enough Ether (ETH) and try again",
          actionHref: "https://rinkeby.etherscan.io/tx/" + transactionHash,
          actionText: "View on Etherscan",
          variant: "failure"
        };
        break;
      default:
        break;
    }
    return transactionToastMeta;
  };

  state = {
    contract: {},
    account: null,
    web3: null,
    transactions: {
      tx1: { transactionHash: 1, status: "pending" },
      tx2: { transactionHash: 2, status: "complete" }
    },
    initWeb3: this.initWeb3,
    initContract: this.initContract,
    initAccount: this.initAccount,
    contractMethodSendWrapper: this.contractMethodSendWrapper
  };

  componentDidMount() {
    this.initWeb3();
  }

  render() {
    return (
      <RimbleTransactionContext.Provider value={this.state} {...this.props} />
    );
  }
}

export default RimbleTransaction;
