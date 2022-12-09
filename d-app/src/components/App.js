import React, { Component } from 'react';
import Web3 from 'web3';
import BelSwap from '../abis/BelSwap.json';
import Token from '../abis/Token.json'

import Navbar from './Navbar';
import Main from './Main';

import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    // Loading connected user info
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })

    // get network ID of connected blockchain network
    const networkId = await web3.eth.net.getId()

    // Load token
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ token })
      this.setState({ tokenBalance: tokenBalance.toString()})
    } else {
      window.alert("Token contract not deployed to detected network")
    }

    // Load BelSwap
    const belSwapData = BelSwap.networks[networkId]
    if (belSwapData) {
      const belSwap = new web3.eth.Contract(Token.abi, belSwapData.address)
      this.setState({ belSwap })
    } else {
      window.alert("BelSwap contract not deployed to detected network")
    }

    this.setState({ loading: false})
  }

  async loadWeb3() {
    // connecting to the application from web browser
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      belSwap: {},
      ethBalance: 0,
      tokenBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id='loader' className='text-cented'>Loading...</p>
    } else {
      content = <Main />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer">
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
