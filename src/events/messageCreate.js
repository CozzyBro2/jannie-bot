const { Events, ThreadChannel } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,

	async execute(message) {
		if (message.author.bot) {return}

		if (message.content == "12") {
			await message.reply("reminds me of someone")
		}
	},
};