const TransactionToastMessages = {
  started: {
    message: "Change submitted",
    secondaryMessage: "Confirm in MetaMask",
    actionHref: "",
    actionText: "",
    variant: "default",
    icon: "InfoOutline"
  },
  pending: {
    message: "Processing change...",
    secondaryMessage: "This may take a few minutes",
    actionHref: "",
    actionText: "",
    variant: "processing"
  },
  confirmed: {
    message: "First block confirmed",
    secondaryMessage: "Your change is in progress",
    actionHref: "",
    actionText: "",
    variant: "processing"
  },
  success: {
    message: "Smart contract value changed",
    variant: "success"
  },
  error: {
    message: "Value change failed",
    secondaryMessage: "Make sure you have enough Ether (ETH) and try again",
    actionHref: "",
    actionText: "",
    variant: "failure"
  }
};

export default TransactionToastMessages;
