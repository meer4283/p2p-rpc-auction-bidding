// p2p-auction-api/index.js
'use strict';

require('dotenv').config();
const express = require('express');
const setupClient = require('./client'); // Adjust this path as needed
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const serverPublicKey = process.env.SERVER_PUBLIC_KEY;

app.use(bodyParser.json());

// Set up your P2P client
let client;

async function initializeClient() {
  if (!client) {
    client = await setupClient(serverPublicKey);
  }
  return client;
}

// Define API endpoints
app.post('/auctions/:auctionId/create', async (req, res) => {
  const { auctionId } = req.params;
  const { item, startingPrice } = req.body;

  try {
    const p2pClient = await initializeClient();
    await p2pClient.createAuction(auctionId, item, startingPrice);
    res.status(200).json({ message: 'Auction created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

app.post('/auctions/:auctionId/bid', async (req, res) => {
  const { auctionId } = req.params;
  const { bidder, amount } = req.body;

  try {
    const p2pClient = await initializeClient();
    await p2pClient.placeBid(auctionId, bidder, amount);
    res.status(200).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
