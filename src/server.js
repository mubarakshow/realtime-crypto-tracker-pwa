import express from 'express';
import path from 'path';
import Pusher from 'pusher'
import cors from 'cors'
import dotenv from 'dotenv';
// import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

const pusher = new Pusher({
  appId: "1041069",
  key: "fbdb000f40418e6a59bb",
  secret: "af27f63638d18d8d92c1",
  cluster: "eu",
  encrypted: true
})

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// app.use('/prices/new', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));

app.get('/', (req, res) => {
  res.send('Welcome to PusherCoins PWA')
})

app.post('/prices/new', (req, res) => {
  pusher.trigger('coin-prices', 'prices', {
    prices: req.body.prices
  })
  res.sendStatus(200)
})

app.listen(5000, () => {
  console.log(`PusherCoin started on port 5000`)
})
