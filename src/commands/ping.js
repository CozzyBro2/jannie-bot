const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns latency stats"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        embed.setTitle("Latency")
        embed.setDescription("Pinging...")
        embed.setColor("#ffbb00")
        embed.setTimestamp()

        const sent = await interaction.reply({embeds: [embed], fetchReply: true})

        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp
        const heartbeat = interaction.client.ws.ping

        embed.setDescription("Results")
        embed.addFields({name: "Ping", value: `${roundtrip}ms`}, {name: "Heartbeat", value: `${heartbeat}ms`})
        embed.setTimestamp()

        await interaction.editReply({embeds: [embed]})
    }
}