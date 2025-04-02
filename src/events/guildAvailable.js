const {Events} = require("discord.js")
const {addGuild} = require("../guild_manager")

module.exports = {
    name: Events.GuildAvailable,
    async execute(guild) {
        await addGuild(guild)
    }
}