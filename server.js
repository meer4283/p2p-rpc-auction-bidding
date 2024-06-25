'use strict'

const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')
const AuctionManager = require('./auctionManager')
const crypto = require('crypto')

const setupServer = async () => {
  const auctionManager = new AuctionManager('./db/rpc-server')
  await auctionManager.init()


  const dhtSeed = crypto.randomBytes(32)
  const rpcSeed = crypto.randomBytes(32)


  const dht = new DHT({
    port: 40001,
    keyPair: DHT.keyPair(dhtSeed),
    bootstrap: [{ host: '127.0.0.1', port: 30001 }]
  })
  await dht.ready()

  // Setup RPC server
  const rpc = new RPC({ seed: rpcSeed, dht })
  const rpcServer = rpc.createServer()
  await rpcServer.listen()
  console.log('RPC server listening on public key:', rpcServer.publicKey.toString('hex'))

  // Handlers for auction actions
  rpcServer.respond('createAuction', async (reqRaw) => {
    const req = JSON.parse(reqRaw.toString('utf-8'))
    await auctionManager.createAuction(req.id, req.item, req.startingBid)
    return Buffer.from(JSON.stringify({ success: true }), 'utf-8')
  })

  rpcServer.respond('placeBid', async (reqRaw) => {
    const req = JSON.parse(reqRaw.toString('utf-8'))
    await auctionManager.placeBid(req.id, req.bidder, req.amount)
    return Buffer.from(JSON.stringify({ success: true }), 'utf-8')
  })

rpcServer.respond('closeAuction', async (reqRaw) => {
    const req = JSON.parse(reqRaw.toString('utf-8'))
    const auction = await auctionManager.closeAuction(req.id)
    // Find the highest bid
    let winningBid = null;
    if (auction && auction.bids.length > 0) {
      winningBid = auction.bids.reduce((prev, curr) => {
        return (curr.amount > prev.amount) ? curr : prev;
      });
    }
  
    return Buffer.from(JSON.stringify({ success: true, auction, winningBid }), 'utf-8');
  });
  
}

setupServer().catch(console.error)