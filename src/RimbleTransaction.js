import React from "react";
import Web3 from "web3"; // uses latest 1.x.x version

class RimbleTransaction extends React.Component {
  state = {
    contract: {},
    account: {},
    web3: {}
  };

  initWeb3 = async () => {
    // Instantiate provider (like metamask)
    const web3 = await new Web3(window.web3.currentProvider);
    this.setState({ web3 });
  };

  initContract = () => {
    // Address of the deployed smart contract (from etherscan)
    const address = "0x0f69f0ac4b92bf0d101b5747eed3fa6b653a36f8";

    // Copied from remix ide
    var abi = [
      {
        constant: false,
        inputs: [],
        name: "decrementCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "incrementCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "reset",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        constant: true,
        inputs: [],
        name: "getCounter",
        outputs: [
          {
            name: "",
            type: "int256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ];

    console.log("creating contract");
    const contract = new this.state.web3.eth.Contract(abi, address);
    console.log(contract);
    this.setState({ contract });
  };

  initAccount = () => {
    // Wait for setState to finish
    this.state.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] }, () => {
        // Wait for setState to finish
        console.log(this.state);
      });
    });
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
      this.initContract();
      this.initAccount();
    });
  }

  render() {
    return this.props.children({
      contractMethodSendWrapper: this.contractMethodSendWrapper,
      contract: this.state.contract,
      account: this.state.account
    });
  }
}

export default RimbleTransaction;
