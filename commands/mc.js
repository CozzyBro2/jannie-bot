const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const axios = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Returns information about the specified Minecraft server")
        .addStringOption(option => 
            option
                .setName("address")
                .setDescription("The address of the Minecraft server")
                .setRequired(false))
        .setDMPermission(false),
    async execute(interaction) {
        const address = interaction.options.getString("address") ?? "mc.hashg.xyz"

        try {
            const res = await axios.get(`https://api.mcsrvstat.us/3/${address}`)
            const data = res.data

            if (data.online) {
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Server Report")
                    .setDescription(`Version: ${data.version}`)
                    .setAuthor({name: address, iconURL: "https://mcsrvstat.us/img/minecraft.png", url: `https://api.mcsrvstat.us/3/${address}`})
                    .setTimestamp()
                    .setThumbnail(data.favicon)

                await interaction.reply({embeds: [embed]})
            } else {
                await interaction.reply("No online server at this address")
            }
        } catch(err) {
            console.error(`Could not check mc server status ${err}`)
        }
    }
}