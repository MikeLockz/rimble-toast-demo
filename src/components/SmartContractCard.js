import React from "react";
import { Card, Heading, Box, Text, Flex, OutlineButton } from "rimble-ui";
import ConnectButton from "./ConnectButton";

// Address of the deployed smart contract (from etherscan)
const contractAddress = "0x0f69f0ac4b92bf0d101b5747eed3fa6b653a36f8";

// Copied from remix ide
const contractAbi = [
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

class SmartContractCard extends React.Component {
  state = {
    value: 0
  };

  // gets the number stored in smart contract storage
  getNumber = ({ ...props }) => {
    const { contract } = this.props;
    try {
      contract.methods
        .getCounter()
        .call()
        .then(value => {
          value = Number(value.toString());
          this.setState({ value });
        })
        .catch(error => {
          // TODO: pass error back up to RimbleTransaction component?
          console.log(error);
          this.setState({ error });
        });
    } catch (error) {
      // TODO: pass error back up to RimbleTransaction component?
      console.log("error", error);
    }
    console.log("got number", this.state.value);
  };

  resetCounter = () => {
    this.props.contractMethodSendWrapper("reset");
  };
  incrementCounter = () => {
    this.props.contractMethodSendWrapper("incrementCounter");
  };
  decrementCounter = () => {
    this.props.contractMethodSendWrapper("decrementCounter");
  };

  componentDidMount() {
    // Init the contract after the web3 provider has been determined
    this.props.initContract(contractAddress, contractAbi).then(() => {
      // Can finally interact with contract
      this.getNumber();
    });
  }

  render() {
    return (
      <Card width={"600px"} mx={"auto"} px={4}>
        <Heading.h1 fontSize={5} textAlign={"center"} px={4} mb={5}>
          Rimble Smart Contract Example
        </Heading.h1>
        <Box>
          <Box py={4}>
            <Text mb={2} fontSize={3}>
              Value from smart contract:
            </Text>
            <Text fontSize={6} textAlign={"center"}>
              {this.state.value}
            </Text>
          </Box>

          <Flex
            px={0}
            pt={4}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent="space-between"
          >
            <ConnectButton
              initAccount={this.props.initAccount}
              account={this.props.account}
            />

            <OutlineButton
              size={"medium"}
              mr={4}
              onClick={this.resetCounter}
              disabled={!this.props.account}
            >
              Reset
            </OutlineButton>

            <OutlineButton
              size={"medium"}
              mr={4}
              onClick={this.incrementCounter}
              disabled={!this.props.account}
            >
              Increment
            </OutlineButton>

            <OutlineButton
              size={"medium"}
              onClick={this.decrementCounter}
              disabled={!this.props.account}
            >
              Decrement
            </OutlineButton>
          </Flex>
        </Box>
      </Card>
    );
  }
}

export default SmartContractCard;
