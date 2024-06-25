const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const crypto = require('crypto')

class AuctionManager {
  constructor(dbPath) {
    this.core = new Hypercore(dbPath)
    this.db = new Hyperbee(this.core, { keyEncoding: 'utf-8', valueEncoding: 'json' })
  }

  async init() {
    await this.db.ready()
  }

  async createAuction(id, item, startingBid) {
    const auction = {
      id,
      item,
      startingBid,
      bids: []
    }
    await this.db.put(id, auction)
  }

  async placeBid(id, bidder, amount) {
    const auction = await this.db.get(id)
    if (auction) {
      auction.value.bids.push({ bidder, amount })
      await this.db.put(id, auction.value)
    }
  }

  async closeAuction(id) {
    const auction = await this.db.get(id)
    if (auction) {
      auction.value.closed = true
      await this.db.put(id, auction.value)
      return auction.value
    }
    return null
  }

  async getAuction(id) {
    const auction = await this.db.get(id)
    return auction ? auction.value : null
  }
}

module.exports = AuctionManager
