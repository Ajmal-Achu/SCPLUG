

const { Command } = require('../../events/handler.js')

Command.create({
	name: 'tesplug',
	run({ conn, from, m }) {
		conn.sendMessage(from, {
			text: `Command Plugins Ok`
		}, { quoted: m })
	}
})
