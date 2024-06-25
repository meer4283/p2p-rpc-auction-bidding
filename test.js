'use strict'

require('dotenv').config();

const setupClient = require('./client')
const serverPublicKey = process.env.SERVER_PUBLIC_KEY;

const runDemo = async () => {
    const client = await setupClient(serverPublicKey)
  
    await client.createAuction('auction1', 'Pic#1', 75)
    await client.createAuction('auction2', 'Pic#2', 60)
  
    await client.placeBid('auction1', 'Client#2', 75)
    await client.placeBid('auction1', 'Client#3', 75.5)
    await client.placeBid('auction1', 'Client#2', 80)
  
    const { auction, winningBid } = await client.closeAuction('auction1');
    
    console.log('Auction closed:', auction);
    if (winningBid && winningBid.amount >= auction.startingBid) {
      console.log('Winning bid:', winningBid);
      console.log('Client', winningBid.bidder, 'won the auction.');
    } else {
      console.log('No winning bid. Auction ended without bids or no bid met the reserve price.');
    }
  }
  
  runDemo().catch(console.error);