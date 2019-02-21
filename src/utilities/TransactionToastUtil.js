import React from "react";

import { ToastMessage } from "rimble-ui";

class TransactionToastUtil extends React.Component {
  // Check for updates to the transactions collection
  processTransactionUpdates = prevProps => {
    let updatedTransaction = {};
    let transaction = {};

    // Only run this if there's something different
    if (
      prevProps &&
      prevProps.transactions !== this.props.transactions &&
      Object.keys(prevProps.transactions).length > 0
    ) {
      // Get the updated transaction object
      updatedTransaction = Object.keys(this.props.transactions).map(key => {
        return prevProps.transactions[key].status ===
          this.props.transactions[key].status
          ? this.props.transactions[key]
          : null;
      });
      transaction = updatedTransaction[0];
    }

    // Process different transaction status'
    if (updatedTransaction.length > 0) {
      console.log("Checking process status", transaction.status);
      switch (transaction.status) {
        case "started":
          // Why does this never fire?
          console.log("Inside and started.");
          this.showTransactionToast(transaction);
          break;
        case "pending":
          this.showTransactionToast(transaction);
          break;
        case "confirmed":
          // this.showTransactionToast(transaction);
          break;
        case "success":
          // How to honor the count to verify here?
          if (transaction.confirmationCount === 3)
            this.showTransactionToast(transaction);
          break;
        default:
          break;
      }
    }
  };

  showTransactionToast = transaction => {
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
          actionHref: "",
          actionText: "",
          variant: "failure"
        };
        break;
      default:
        break;
    }
    return transactionToastMeta;
  };

  componentDidUpdate(prevProps, prevState) {
    this.processTransactionUpdates(prevProps);
  }

  render() {
    return (
      <div>
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
      </div>
    );
  }
}

export default TransactionToastUtil;
