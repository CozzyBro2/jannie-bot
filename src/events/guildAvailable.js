const {Events, ChannelType} = require("discord.js")
const {addGuild} = require("../guild_manager")
const {generate} = require("../ai_handler")

const interval = 1000 * 60 * 60 * 22 // 14 hours

async function findGeneral(guild) {
    await guild.channels.fetch()

    return guild.channels.cache.find(channel => channel.name == "general" && channel.type === ChannelType.GuildText)
}

module.exports = {
    name: Events.GuildAvailable,
    async execute(guild) {
        await addGuild(guild)

        const channel = await findGeneral(guild)

        if (!channel) {
            console.log("Couldn't find general")
            return
        }

        async function dailyAnnoyance() {
            if (process.env.AI_ANNOY_SERVERS) {
                var text = ""
 
                await generate(guild, {
                    callback: async (chunkText) => {
                        text += chunkText
                    },
                    ignoreHistory: true,
                    content: process.env.AI_ANNOY_PROMPT
                })

                channel.send(text)
            }

            setInterval(dailyAnnoyance, interval)
        }
        
        setInterval(dailyAnnoyance, interval / 2.5)
    }
}