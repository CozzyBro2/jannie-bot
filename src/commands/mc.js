const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const {request} = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Returns information about the specified Minecraft server")
        .addStringOption(option => option
            .setName("address")
            .setDescription("The address of the Minecraft server")
            .setRequired(false))
        .setDMPermission(false),
    async execute(interaction) {
        const address = interaction.options.getString("address") ?? "mc.hashg.xyz"
        const embed = new EmbedBuilder()

        const api = await request(`https://api.mcsrvstat.us/3/${address}`)
        const {hostname, debug, online, players, motd, version, port} = await api.body.json()

        embed.setColor(0x0099FF)
        embed.setAuthor({
            name: `${hostname ?? address}`,
            iconURL: "https://mcsrvstat.us/img/minecraft.png",
            url: `https://api.mcsrvstat.us/3/${address}`
        })
        embed.setFooter({text: `Can refresh in: ${debug.cacheexpire - Math.floor(Date.now() / 1000)}(s)`})
        embed.setTimestamp()

        if (online) {
            const playing = players.list
    
            embed.setTitle("Online")
            embed.addFields({name: "Players", value: `${players.online} / ${players.max}`})
            embed.setDescription(`\`\`\`${motd.clean}\`\`\``)
    
            if (playing) {
                let playerStr = ""
                playing.map(plr => playerStr += `\n* ${plr.name}`)
    
                embed.addFields(
                    {name: "Playing", value: `${playerStr}`},
                )
            }

            embed.addFields(
                {name: "Version", value: `${version}`, inline: true},
                {name: "Port", value: `${port}`, inline: true},
            )
        } else {
            embed.setTitle(`No server online at this address`)
        }

        await interaction.editReply({embeds: [embed]})
    }
}