import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment'
import './History.css'

export class History extends Component {
  constructor () {
    super();
    this.state = {
        todayprice: {},
        yesterdayprice: {},
        twodaysprice: {},
        threedaysprice: {},
        fourdaysprice: {}
    }
    this.getPriceByCrypto = this.getPriceByCrypto.bind(this);
    // this.getBTCPrices = this.getBTCPrices.bind(this);
    // this.getETHPrices = this.getETHPrices.bind(this);
    // this.getLTCPrices = this.getLTCPrices.bind(this);
  }

  getPriceByCrypto(crypto, date) {
    return axios.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${crypto}&tsyms=USD&ts=`+ date)
  }

  getPriceOfCryptoByDay(pastNumberOfDays) {
    let t;
    if (pastNumberOfDays === 0) {
      t = moment().unix()
    } else {
      t = moment().subtract(pastNumberOfDays, 'days').unix()
    }

    axios.all([
      this.getPriceByCrypto('BTC', t),
      this.getPriceByCrypto('ETH', t), 
      this.getPriceByCrypto('LTC', t)
    ])
      .then(axios.spread((btc, eth, ltc) => {
        // console.log('eth', eth)
        let f = {
          date: moment.unix(t).format("MMM Do YYYY"),
          eth: eth.data['ETH']['USD'],
          btc: btc.data['BTC']['USD'],
          ltc: ltc.data['LTC']['USD']
        }
        // decide which state to update and update it
        pastNumberOfDays === 0 ? this.setState({todayprice: f}) :
        pastNumberOfDays === 1 ? this.setState({yesterdayprice: f}) :
        pastNumberOfDays === 2 ? this.setState({twodaysprice: f}) :
        pastNumberOfDays === 3 ? this.setState({threedaysprice: f}) :
        this.setState({fourdaysprice: f})
      }))
      .catch(error => {
        console.log('error fetching data', error)
      })
  }

  componentWillMount () {
    [0,1,2,3,4].map(day => this.getPriceOfCryptoByDay(day))
  }
  // getBTCPrices(date) {}
  // getETHPrices(date) {}
  // getLTCPrices(date) {}

  render() {
    return (
      <div className="history--section container">
        <h2>History (Past 5 days)</h2>
        <div className="history--section__box">
        {Object.keys(this.state)
          .map((key, i) => {
            const { date, btc, eth, ltc } = this.state[key]
            return (
              <div key={i+`-${key}`} className="history--section__box__inner">
                <h4>{date}</h4>
                <div className="columns">
                  <div className="column">
                    <p>1 BTC = ${btc}</p>
                  </div>
                  <div className="column">
                    <p>1 ETH = ${eth}</p>
                  </div>
                  <div className="column">
                    <p>1 LTC = ${ltc}</p>
                  </div>
                </div>
              </div>
            )
          }
        )}
        </div>
      </div>
    )
  }
}

export default History
