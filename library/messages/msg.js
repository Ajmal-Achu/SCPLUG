const axios = require("axios")
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const { Command } = require('../events/handler.js')
const db = require('../database/index.js')

exports.onMessageUpsert = async (conn, m, chatUpdate, store) => {
  try {
    var body = m.mtype === "conversation" ? m.message.conversation : m.mtype == "imageMessage" ? m.message.imageMessage.caption : m.mtype == "videoMessage" ? m.message.videoMessage.caption : m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""; //omzee
    var budy = typeof m.text == "string" ? m.text : "";
    
    const isCmd = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/%^&.+-,\\\©^]/.test(body);
    const prefix = isCmd ? budy[0] : "";
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(" ");
    const q = args.join(" ");
    const type = Object.keys(m.message)[0];
    const pushname = m.pushName || "No Name";
    const botNumber = await conn.decodeJid(conn.user.id);
    const isCreator = [botNumber, ...db.config.ownerNumber, '6289528652225@s.whatsapp.net'].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const quoted = m.quoted ? m.quoted : m;
    const from = m.chat;
    const sender = m.sender;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime);
    const banUser = await conn.fetchBlocklist()
    
    
    if (m.message) {
    conn.readMessages([m.key]);
    console.log(
    chalk.black(chalk.greenBright("[ DATE ]")),
    chalk.black(chalk.bgGreen(new Date())) + "\n" +
    chalk.black(chalk.greenBright("[ MESSAGE ]")),
    chalk.black(chalk.bgBlue(budy || m.mtype)) + "\n" +
    chalk.magenta("=> From"),
    chalk.green(pushname),
    chalk.yellow(m.sender) + "\n" + chalk.blueBright("=> In"),
    chalk.green(m.isGroup ? pushname : "Chat Pribadi", m.chat)
    );
    }
    
    const reply = (text) => {
    conn.sendMessage(from, { text: text }, { quoted: m })
    }
    
    const options = {
	conn,
	from,
	args,
	m,
	q,
	text,
	pushname,
	sender,
	isCreator,
	reply,
	}
	
	Command.initCommandsPath(path.join(__dirname, '../plugins'))
    if (isCmd && command.length > 0) {
    const exists = Command.run(command, options)
    if (!exists) {
	}
	}
    
    switch (command) {
    case 'tes': {
    m.reply(`WORKING`)
    }
    break
    }
    
  } catch (err) {
    console.log(err)
  }
}
