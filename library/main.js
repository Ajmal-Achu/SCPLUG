/* 

 - BASE ORI FAUZIDEV
 - ORI SCRIPT BY FAUZIDEV

*/


const { default: Fauzidev,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC, 
  jidNormalizedUser 
} = require("@whiskeysockets/baileys")

const readline = require("readline")
const fs = require("fs")
const pino = require("pino")
const NodeCache = require("node-cache")
const chalk = require("chalk")

const db = require('./database/index.js')
const { 
  phoneNumber,
  pairingCode,
  useMobile,
  question,
  logger, 
  store,
  rl
} = require('./events/optionSocket.js')
const { connectionUpdate } = require('./events/connection.js')
const { Serialize } = require('./lib/myfunc.js')
const { onMessageUpsert } = require('./messages/msg.js')

async function WAConnection() {
  var { state, saveCreds } = await useMultiFileAuthState("./library/database/sessions")
  var msgRetryCounterCache = new NodeCache()
  var connectionOptions = {
  printQRInTerminal: !pairingCode,
  logger: pino({
    level: "silent"
  }),
  browser: ["chrome (linux)", "", ""],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })), 
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (key) => {
    let jid = jidNormalizedUser(key.remoteJid)
    let msg = await store.loadMessage(jid, key.id)
    return msg?.message || ""
  },
  msgRetryCounterCache,
  defaultQueryTimeoutMs: undefined,
  }
  
  global.conn = Fauzidev(connectionOptions)
  
  store?.bind(conn.ev)
  
  if(pairingCode && !conn.authState.creds.registered) {
    if(useMobile) throw new Error('Cannot use pairing code with mobile api')
    let phoneNumber
    if(!!phoneNumber) {
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
      if(!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.bgBlack(chalk.redBright(`Start with country code of your WhatsApp Number, example: +dtb.config?.pairingNumber[0]`)))
        process.exit(0)
      }
    } else {
      phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
      if(!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.bgBlack(chalk.redBright(`Start with country code of your WhatsApp Number, example: +dtb.config?.pairingNumber[0]`)))
        phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number \nFor example: +dtb.config?.pairingNumber[0] : `)))
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        rl.close()
      }
    }
    setTimeout(async () => {
      let code = await conn.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
    }, 3000)
  }
  
  conn.ev.process(async (events) => {
    if(events['messages.upsert']) {
      const chatUpdate = events['messages.upsert']
      if (!chatUpdate.messages) return;
      let m = chatUpdate.messages[0] || chatUpdate.messages[chatUpdate.messages.length - 1]
      if (!m.message) return
      if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
      m = await Serialize(conn, m, store) 
      onMessageUpsert(conn, m, chatUpdate,store)
    } 
    if(events["creds.update"]) {
      await saveCreds()
    }
    if(events["connection.update"]) {
      const update = events["connection.update"];
      const { connection } = update;
      connectionUpdate(update, WAConnection)
    }
  })
}
WAConnection()