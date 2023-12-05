const {Events} = require("discord.js")

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        console.log(`Logged in as ${bot.user.tag}`)
    }
}