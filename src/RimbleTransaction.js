import React from "react";
import Web3 from "web3"; // uses latest 1.x.x version

class RimbleTransaction extends React.Component {
  state = {
    contract: {},
    account: {},
    web3: {}
  };

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

  initContract = (address, abi) => {
    console.log("creating contract");

    // this.initWeb3().then(() => {
    //   this.initAccount();
    //   const contract = new this.state.web3.eth.Contract(abi, address);
    //   console.log(contract);
    //   this.setState({ contract });
    // });
    const contract = new this.state.web3.eth.Contract(abi, address);
    console.log(contract);
    this.setState({ contract });
  };

  initAccount = async () => {
    try {
      // Request account access if needed
      await window.ethereum.enable().then(walletAddress => {
        console.log("wallet address:", walletAddress);
        const connected = true;
        // Enable Sign In button
        this.setState({ connected, walletAddress: walletAddress[0] });
      });
      // Acccounts now exposed
      // this.setState({ web3 });
    } catch (error) {
      // User denied account access...
      console.log("error:", error);
    }

    // this.state.web3.eth.getAccounts().then(accounts => {
    //   console.log(accounts);
    //   this.setState({ account: accounts[0] }, () => {
    //     // Wait for setState to finish
    //     console.log("initialized account: ", this.state.account);
    //   });
    // });
  };

  addTransaction = incomingTransaction => {
    let transaction = {};
    transaction.lastUpdated = Date.now();
    transaction = { ...transaction, ...incomingTransaction };

    let toastMeta = this.getTransactionToastMeta(transaction);
    window.toastProvider.addMessage(
      "Not sure where this appears...",
      toastMeta
    );
  };

  getTransactionToastMeta = transaction => {
    let transactionToastMeta = {};
    let status = transaction.status;
    let transactionHash = transaction.transactionHash;

    switch (status) {
      case "started":
        transactionToastMeta = {
          message: "Started a new transaction",
          actionHref: "",
          actionText: "",
          variant: "default",
          icon: "InfoOutline"
        };
        break;
      case "pending":
        transactionToastMeta = {
          message: "Transaction is pending",
          actionHref: "",
          actionText: "",
          variant: "processing"
        };
        break;
      case "confirmed":
        transactionToastMeta = {
          message: "Transaction is confirmed",
          actionHref: "https://rinkeby.etherscan.io/tx/" + transactionHash,
          actionText: "View on Etherscan",
          variant: "success"
        };
        break;
      case "success":
        transactionToastMeta = {
          message: "Transaction completed successfully",
          actionHref: "https://rinkeby.etherscan.io/tx/" + transactionHash,
          actionText: "View on Etherscan",
          variant: "success"
        };
        break;
      case "error":
        transactionToastMeta = {
          message: "Error",
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

  contractMethodSendWrapper = contractMethod => {
    let transaction = {};
    transaction.created = Date.now();

    // Show toast for starting transaction
    console.log("Starting Transaction");
    transaction.status = "started";
    this.addTransaction(transaction);

    const { contract, account } = this.state;

    contract.methods[contractMethod]()
      .send({ from: account })
      .on("transactionHash", hash => {
        // Submitted to block and received transaction hash
        console.log("Transaction sent to block successfully. Result pending.");
        transaction.status = "pending";
        this.addTransaction(transaction);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        // Somehow determine if this is an already confirmed tx?
        if (confirmationNumber > 0) {
          return;
        }

        console.log("receipt: ", receipt);

        // Update transaction with receipt details
        transaction = { ...transaction, ...receipt };

        // Confirmed with receipt
        console.log("Transaction confirmed.");
        transaction.status = "confirmed";

        this.addTransaction(transaction);

        // check the status from result
        if (receipt.status === true) {
          console.log("Transaction completed successfully!");
          transaction.status = "success";
        } else if (receipt.status === false) {
          console.log("Transaction reverted due to error.");
          transaction.status = "error";
        }

        this.addTransaction(transaction);
      })
      .on("receipt", receipt => {
        // Received receipt
        console.log("receipt: ", receipt);
      })
      .on("error", error => {
        // Errored out
        console.log(error);
      });
  };

  componentDidMount() {
    this.initWeb3().then(() => {
      // Do we need to init an account immediately?
      // this.initAccount();
    });
  }

  render() {
    return this.props.children({
      contractMethodSendWrapper: this.contractMethodSendWrapper,
      initAccount: this.initAccount,
      initContract: this.initContract,
      contract: this.state.contract,
      account: this.state.account
    });
  }
}

export default RimbleTransaction;
