
const pino = require('pino')
const NodeCache = require("node-cache")
const readline = require("readline")
const { 
  makeInMemoryStore, 
} = require('@whiskeysockets/baileys')
const db = require('../database/index.js')

const phoneNumber = db.config?.pairingNumber[0]
const pairingCode = !!phoneNumber || process.argv.includes("--code")
const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const logger = pino({ level: "silent", stream: "store" }).child({ level: "silent" })
const store = makeInMemoryStore(logger);

module.exports = {
  phoneNumber,
  pairingCode,
  useMobile,
  question,
  logger, 
  store,
  rl
}
