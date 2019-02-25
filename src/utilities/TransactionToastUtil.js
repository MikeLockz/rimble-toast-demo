import React from "react";

import { ToastMessage } from "rimble-ui";

class TransactionToastUtil extends React.Component {
  // Determines if collections are same size
  collectionHasNewObject = (prevCollection, currentCollection) => {
    return (
      typeof prevCollection === "undefined" ||
      Object.keys(prevCollection).length !==
        Object.keys(currentCollection).length
    );
  };

  // Returns object from currentCollection that doesn't exist in prevCollection
  getNewObjectFromCollection = (prevCollection, currentCollection) => {
    if (typeof prevCollection !== "undefined") {
      const objectKey = Object.keys(currentCollection).filter(key => {
        return !Object.keys(prevCollection).includes(key);
      });
      return currentCollection[objectKey];
    } else {
      return Object.keys(currentCollection).map(key => {
        return currentCollection[key];
      });
    }
  };

  // Compare two collections of objects, return single object from current collection that differs from prev collection
  getUpdatedObjectFromCollection = (prevCollection, currentCollection) => {
    const updatedTransaction = Object.keys(prevCollection)
      .map(key => {
        if (
          prevCollection[key].lastUpdated !== currentCollection[key].lastUpdated
        ) {
          return currentCollection[key];
        }
      })
      .filter(object => typeof object !== "undefined");
    return updatedTransaction[0];
  };

  // Returns an object from a collection based on a given identifier
  getObjectFromCollection = (identifier, collection) => {
    const object = collection[`tx${identifier}`];
    return object;
  };

  // Returns either a new object or finds an updated object in a collection against a previous collection
  getUpdatedTransaction = (prevCollection, currentCollection) => {
    let tx = null;
    let currentTx = {};
    let prevTx = {};
    
    if (this.collectionHasNewObject(prevCollection, currentCollection)) {
      tx = this.getNewObjectFromCollection(prevCollection, currentCollection);
    } else {
      currentTx = this.getUpdatedObjectFromCollection(
        prevCollection,
        currentCollection
      );
      prevTx = this.getObjectFromCollection(currentTx.created, prevCollection);

      if (currentTx.status !== prevTx.status) {
        tx = currentTx;
      }
    }
    return tx;
  };

  // Check for updates to the transactions collection
  processTransactionUpdates = prevProps => {
    
    let tx = null;
    if (Object.keys(this.props.transactions).length) {
      tx = this.getUpdatedTransaction(
        prevProps.transactions,
        this.props.transactions
      );
    }

    if (tx !== null && typeof tx !== "undefined") {
      this.showTransactionToast(tx);
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
          secondaryMessage:
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
