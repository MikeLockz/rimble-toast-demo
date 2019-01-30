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
  }

  initContract = () => {
    // Instantiate provider (like metamask)
    // const web3 = new Web3(window.web3.currentProvider) // 1.0.0 way
    if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentProvider);
     } else {
      // set the provider you want from Web3.providers
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
     }
     

    // Address of the deployed smart contract (from etherscan)
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

    const bncAssistConfig = {
      dappId: "2163fd61f5792c8a221d",
      networkId: 4,
      web3: window.web3
    };
    
    const assistInstance = window.assist.init(bncAssistConfig);

    assistInstance.onboard()
      .then(function(success) {
        // User has been successfully onboarded and is ready to transact
      })
      .catch(function(error) {
        // The user exited onboarding before completion
        // Will let you know what stage of onboarding the user was up to when they exited
        console.log(error.msg);
      })

    let myContract = new window.web3.eth.Contract(abi, address);
    console.log('contract: ', myContract)
    
    let myDecoratedContract = assistInstance.Contract(myContract)
    console.log('myDecoratedContract: ', myDecoratedContract)
    
    this.setState({ contract: myDecoratedContract })

    assistInstance.getState()
      .then(function(state) {
        console.log('state: ', state)
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
                <OutlineButton size={'medium'} onClick={this.resetCounter} mr={4}>Reset</OutlineButton>
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
              <p>This is an example of a webapp that interacts with a Smart Contract. The demo uses Web3.js and Rimble UI Components to show the status of a Smart Contract transaction via toast messages. </p>

            </Box>
          </Card>

          <ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />
        </Box>
      </div>
    );
  }
}

export default App;
