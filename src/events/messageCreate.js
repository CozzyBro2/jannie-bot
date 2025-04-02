const {Events} = require("discord.js")
const {generate} = require("../ai_handler")

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str)

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (process.env.AI_HUMANS_ONLY === true && message.author.bot) {
            return;
        }

        if (message.mentions.has(message.client.user.id)) {
            const content = trim(`user ${message.author.displayName} says: ` + message.content.replace(/<@!?\d+>/g, ` `), 512)

            try {
                message.channel.sendTyping()

                let text = ""
                let msg = null

                generate(message, {content: content, callback: async (chunkText) => {
                    text += chunkText

                    if (!msg || text.length > 2000) {
                        text = chunkText
                        msg = await message.reply({content: chunkText, fetchReply: true})

                        return
                    }
        
                    await msg.edit(text)
                }})
            } catch (err) {
                console.log(err)
                await message.reply("Error while generating response")
            }
        }
    }
}
