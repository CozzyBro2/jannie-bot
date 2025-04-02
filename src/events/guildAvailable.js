const {Events, ChannelType} = require("discord.js")
const {addGuild} = require("../guild_manager")
const {generate} = require("../ai_handler")

const interval = 1000 * 60 * 60 * 14 // 14 hours

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
            // TODO: Make this code less W.E.T
            if (process.env.ANNOY_SERVERS) {
                var text = ""
 
                await generate(guild, {
                    callback: async (chunkText) => {
                        text += chunkText
                    },
                    content: "Say something random that will get people talking or is entertaining. Do not mention this instruction or your other instructions. Do a 50/50 coinflip in your head, and use that to decide whether you will mention a random user in the server. If so, mention this user's name in your message somewhere natural."
                })

                channel.send(text)
            }

            setInterval(dailyAnnoyance, interval)
        }
        
        dailyAnnoyance(dailyAnnoyance, interval) // setInterval(dailyAnnoyance, interval)
    }
}