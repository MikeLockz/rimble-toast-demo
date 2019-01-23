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

  addTransaction = (transaction) => {
    this.setState({
      transactionList: [...this.state.transactionList, transaction]
    })
  }

  componentDidMount() {
    // console.log('mounted')
    this.initContract()

    // this.getNumber()
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
          <Card width={'420px'} mx={'auto'} px={4}>
            <Heading.h1>Smart Contract Flow</Heading.h1>
            <Box>
              <Box pb={4}>
                <Text mb={4} fontSize={3}>
                  Smart contract value: {this.state.value}
            </Text>
                <Text fontSize={6} textAlign={'center'}></Text>
              </Box>

              <Flex px={0} pt={4} borderTop={1} borderColor={'#E8E8E8'} justifyContent='space-between'>
                <OutlineButton size={'medium'} onClick={this.addOne} mr={4}>Reset</OutlineButton>
                <OutlineButton size={'medium'} onClick={this.addOne} mr={4}>Increment</OutlineButton>
                <OutlineButton size={'medium'} onClick={this.addOne}>Decrement</OutlineButton>
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
