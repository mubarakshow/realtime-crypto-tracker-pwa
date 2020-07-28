import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import './Today.css';
import dotenv from 'dotenv'

dotenv.config();

class Today extends Component {
  constructor() {
    super();
    this.state = {
      btcprice: '',
      ltcprice: '',
      ethprice: ''
    }
    this.cryptoCoins = ['BTC', 'ETH', 'LTC']
    this.url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD'
  }
  
  sendPricePusher (data) {
    axios.post('http://localhost:5000/prices/new',  {
      prices: data
    })
    .then(response => {
      console.log(response) 
    })
    .catch(error => {
      console.log('error occured', error)
    })
  }
  
  componentWillMount () {
    // establish connection to Pusher
    this.pusher = new Pusher("fbdb000f40418e6a59bb", {
      cluster: "eu",
      encrypted: true
    });
    // subscribe to the 'coin-prices' channel
    this.prices = this.pusher.subscribe('coin-prices');
    // hit the API endpoint every 10 seconds 
    // let coins = ['BTC', 'ETH', 'LTC'] 
    // // axios.get(this.url)
    //   .then(response => {
    //     Object.keys(this.state).map((crypto, i) => {
    //       this.setState({ [crypto]: response.data[coins[i]]['USD'] })
    //     })
    //   })
    //   .catch(error => {
    //     console.log('error occured:', error)
    //   })
  }

  componentDidMount () {
    setInterval(() => {
      axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
        .then(response => {
          // console.log('today-js respones', response.data)
          this.sendPricePusher(response.data)
        })
        .catch(error => {
          console.log("error sending data to pusher")
        })
    }, 10000);

    /*
    bind to the 'prices' event and use the data in it 
    to update the state values in Realtime 
    */
   this.prices
    .bind("prices", price => {
      Object.keys(this.state).map((key, i) => {
        this.setState({ [key]: price.prices[this.cryptoCoins[i]]['USD'] })
      })
    }, this)
    .bind('error', (err) => {
      if(err.error.data.code !== 200) {
        console.log('>>>>> error binding data', err);
      }
    })
  }

  render() {
    return (
      <div className="today--section container">
        <h2>Current Price</h2>
        <div className="columns today--section__box">
          <div className="column btc--section">
            <h5>${this.state.btcprice}</h5>
            <p>1 BTC</p>
          </div>
          <div className="column eth--section">
            <h5>${this.state.ethprice}</h5>
            <p>1 ETH</p>
          </div>
          <div className="column ltc--section">
            <h5>${this.state.ltcprice}</h5>
            <p>1 LTC</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Today;