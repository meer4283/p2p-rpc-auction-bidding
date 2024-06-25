'use strict'

const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')
const crypto = require('crypto')

const setupClient = async (serverPubKeyHex) => {
  const dhtSeed = crypto.randomBytes(32)

  // Start DHT
  const dht = new DHT({
    port: 50001,
    keyPair: DHT.keyPair(dhtSeed),
    bootstrap: [{ host: '127.0.0.1', port: 30001 }]
  })
  await dht.ready()

  // RPC client
  const rpc = new RPC({ dht })
  const serverPubKey = Buffer.from(serverPubKeyHex, 'hex')

  const createAuction = async (id, item, startingBid) => {
    const payload = { id, item, startingBid }
    const payloadRaw = Buffer.from(JSON.stringify(payload), 'utf-8')
    const respRaw = await rpc.request(serverPubKey, 'createAuction', payloadRaw)
    return JSON.parse(respRaw.toString('utf-8'))
  }

  const placeBid = async (id, bidder, amount) => {
    const payload = { id, bidder, amount }
    const payloadRaw = Buffer.from(JSON.stringify(payload), 'utf-8')
    const respRaw = await rpc.request(serverPubKey, 'placeBid', payloadRaw)
    return JSON.parse(respRaw.toString('utf-8'))
  }

  const closeAuction = async (id) => {
    const payload = { id }
    const payloadRaw = Buffer.from(JSON.stringify(payload), 'utf-8')
    const respRaw = await rpc.request(serverPubKey, 'closeAuction', payloadRaw)
    return JSON.parse(respRaw.toString('utf-8'))
  }

  return { createAuction, placeBid, closeAuction }
}

module.exports = setupClient
