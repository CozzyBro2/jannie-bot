const {Collection} = require("discord.js")

module.exports = {
    async addGuild(guild) {
        var smallCache = new Collection()
        var channelCache = new Collection()

        guild.smallCache = smallCache
        guild.channelCache = channelCache
        guild.client.guildCache.set(guild.id, guild)

        if (process.env.AI_MEMORIZE_MEMBERS) {
            // Ensure members cache
            await guild.members.fetch()

            await guild.roles.fetch()
                .then(roles => {
                    roles.sort((roleA, roleB) => roleB.position - roleA.position)
                    
                    roles.each(role => {
                        role.members.each(member => {
                            if (smallCache.size < 25 && !smallCache.hasAny(member.id))  {
                                smallCache.set(member.id, member)
                            }
                        })
                    })
                })
                .catch(console.error)
        }
    },
}