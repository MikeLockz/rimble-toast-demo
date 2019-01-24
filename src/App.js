import React, { Component } from 'react';
import './App.css';
import { Card, Heading, Box, Button, OutlineButton, Text, Flex, ToastMessage } from 'rimble-ui'
import Web3 from 'web3' // uses latest 1.x.x version
import TransactionList from './TransactionList' // uses latest 1.x.x version
import RimbleWeb3Transaction from './RimbleWeb3Transaction'

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
        this.setState({ value })
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

  addTransaction = (incomingTransaction) => {
    let transaction = {}
    transaction.lastUpdated = Date.now()
    transaction = {...transaction, ...incomingTransaction}

    this.state.transactionList.push(transaction)
    this.setState({
      transactionList: this.state.transactionList
    })

    let toastMeta = this.getTransactionToastMeta(transaction)
    window.toastProvider.addMessage('Not sure where this appears...', toastMeta)
  }

  getTransactionToastMeta = (transaction) => {
    let transactionToastMeta = {}
    let status = transaction.status
    let transactionHash = transaction.transactionHash

    switch (status) {
      case 'started':
        transactionToastMeta = {
          message: 'Started a new transaction',
          actionHref: '',
          actionText: '',
          variant: 'default',
          icon: 'InfoOutline',
        }
        break;
      case 'pending':
        transactionToastMeta = {
          message: 'Transaction is pending',
          actionHref: '',
          actionText: '',
          variant: 'processing',
        }
        break;
      case 'confirmed':
        transactionToastMeta = {
          message: 'Transaction is confirmed',
          actionHref: 'https://rinkeby.etherscan.io/tx/' + transactionHash,
          actionText: 'View on Etherscan',
          variant: 'success',
        }
        break;
      case 'success':
        transactionToastMeta = {
          message: 'Transaction completed successfully',
          actionHref: 'https://etherscan.io/tx/' + transactionHash,
          actionText: 'View on Etherscan',
          variant: 'success',
        }
        break;
      case 'error':
        transactionToastMeta = {
          message: 'Error',
          actionHref: 'https://etherscan.io/tx/' + transactionHash,
          actionText: 'View on Etherscan',
          variant: 'failure',
        }
        break;
      default:
        break;
    }
    return transactionToastMeta
  }

  contractMethodSendWrapper = (contractMethod) => {
    let transaction = {}
    transaction.created = Date.now();
    
    // Show toast for starting transaction
    console.log("Starting Transaction");
    transaction.status = 'started'
    this.addTransaction(transaction)

    const { contract, account } = this.state

    contract.methods[contractMethod]().send({ from: account })
      .on('transactionHash', (hash) => {
        // Submitted to block and received transaction hash
        console.log("Transaction sent to block successfully. Result pending.");
        transaction.status = 'pending'
        this.addTransaction(transaction)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        
        // Somehow determine if this is an already confirmed tx?
        if (confirmationNumber > 0) {
          return;
        }

        console.log("receipt: ", receipt)
        
        // Update transaction with receipt details
        transaction = { ...transaction, ...receipt }
        
        // Confirmed with receipt
        console.log("Transaction confirmed.");
        transaction.status = "confirmed"
        
        this.addTransaction(transaction)

        // check the status from result
        if (receipt.status === true) {
          console.log("Transaction completed successfully!");
          transaction.status = 'success'
        } else if (receipt.status === false) {
          console.log("Transaction reverted due to error.");
          transaction.status = 'error'
        }

        this.addTransaction(transaction)

        
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
                {/* <OutlineButton size={'medium'} onClick={this.resetCounter} mr={4}>Reset</OutlineButton> */}
                <OutlineButton size={'medium'} onClick={this.incrementCounter} mr={4}>Increment</OutlineButton>
                <OutlineButton size={'medium'} onClick={this.decrementCounter}>Decrement</OutlineButton>
              </Flex>
              {/* <Flex mt={4} justifyContent='flex-end'>

                <Button size={'medium'} onClick={this.getNumber}>Get Number</Button>
              </Flex> */}
            </Box>
          </Card>

          <Card width={'400px'} mx={'auto'} px={4}>
            <Box>
              <p>Instructions:</p>
              <ul>
                <li>Make sure MetaMask is working in your browser</li>
                <li>Set the network to Rinkeby Test Network</li>
                <li>You'll need a little bit of eth for gas fees</li>
              </ul>
              
              <p>About</p>
              <p>This is an example of a webapp that interacts with a Smart Contract. This demo is using Web3.js and Rimble UI Components to show the status of a Smart Contract transaction. </p>

            </Box>
          </Card>

          <ToastMessage.Container ref={(toastProvider) => { window.toastProvider = toastProvider }}>

          </ToastMessage.Container>
        </Box>
      </div>
    );
  }
}

export default App;
