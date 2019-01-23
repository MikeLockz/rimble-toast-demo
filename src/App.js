import React, { Component } from 'react';
import './App.css';
import { Card, Heading, Box, Button, OutlineButton, Text, Flex } from 'rimble-ui'
import Web3 from 'web3' // uses latest 1.x.x version

class App extends Component {
  state = {
    contract: {},
    account: {},
    value: 0,
    error: null,
    transactionList: [],
  }

  initContract = () => {
    // Instantiate provider (like metamask)
    const web3 = new Web3(window.web3.currentProvider)

    // // Address of the deployed smart contract (from etherscan)
    const address = "0x0f69f0ac4b92bf0d101b5747eed3fa6b653a36f8"

    // Copied from remix ide
    var abi = [
      {
        "constant": false,
        "inputs": [],
        "name": "decrementCounter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "incrementCounter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getCounter",
        "outputs": [
          {
            "name": "",
            "type": "int256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    console.log('creating contract')
    const contract = new web3.eth.Contract(abi, address)
    console.log(contract)
    this.setState({ contract }, () => {
      // Wait for setState to finish
      web3.eth.getAccounts()
        .then((accounts) => {
          this.setState({ account: accounts[0] }, () => {
            // Wait for setState to finish
            console.log(this.state)
            
            // Get initial number
            this.getNumber()
          })
        })
    })
  }

  // gets the number stored in smart contract storage
  getNumber = () => {
    const { contract, account } = this.state;
    contract.methods.getCounter().call()
      .then(value => {
        value = Number(value.toString())
        this.setState({value})
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  resetCounter = () => {
    this.contractMethodSendWrapper('reset')
  }
  incrementCounter = () => {
    this.contractMethodSendWrapper('incrementCounter')
  }
  decrementCounter = () => {
    this.contractMethodSendWrapper('decrementCounter')
  }

  addTransaction = (transaction) => {
    this.setState({
      transactionList: [...this.state.transactionList, transaction]
    })
  }

  contractMethodSendWrapper = (contractMethod) => {
    // Show toast for starting transaction
    console.log("Starting Transaction");
    
    const { contract, account } = this.state
    
    contract.methods[contractMethod]().send({ from: account })
      .on('transactionHash', (hash) => {
        // Submitted to block and received transaction hash
        console.log(hash);
        console.log("Transaction sent to block successfully. Result pending.");
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        // Confirmed with receipt
        console.log("confirmation #: ", confirmationNumber, "receipt from confirm: ", receipt);
        console.log("Transaction confirmed.");

        // check the status from result
        if (receipt.status === true) {
          console.log("Transaction completed successfully!");
        } else if (receipt.status === false) {
          console.log("Transaction reverted due to error.");
        }
      })
      .on('receipt', (receipt) => {
        // Received receipt
        console.log("receipt: ", receipt);

        // Update value
        this.getNumber();
      })
      .on('error', (error) => {
        // Errored out
        console.log(error);
      })
}

  componentDidMount() {
    this.initContract()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>

        <Box my={'auto'}>
          <Card width={'400px'} mx={'auto'} px={4}>
            <Heading.h1 fontSize={5} textAlign={'center'} px={4} mb={5}>Smart Contract Toast Example</Heading.h1>
            <Box>
              <Box py={4}>
                <Text mb={2} fontSize={3}>
                  Value from smart contract: 
                </Text>
                <Text fontSize={6} textAlign={'center'}>{this.state.value}</Text>
              </Box>

              <Flex px={0} pt={4} borderTop={1} borderColor={'#E8E8E8'} justifyContent='space-between'>
                <OutlineButton size={'medium'} onClick={this.resetCounter} mr={4}>Reset</OutlineButton>
                <OutlineButton size={'medium'} onClick={this.incrementCounter} mr={4}>Increment</OutlineButton>
                <OutlineButton size={'medium'} onClick={this.decrementCounter}>Decrement</OutlineButton>
              </Flex>
              <Flex mt={4} justifyContent='flex-end'>
                
                <Button size={'medium'} onClick={this.getNumber}>Get Number</Button>
              </Flex>

              <Box>
                {/* <TransactionList transactionList={transactionList}></TransactionList> */}
              </Box>
            </Box>
          </Card>
        </Box>
      </div>
    );
  }
}

export default App;
