const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('Replies with websocket heartbeat & roundtrip ping'),

    async execute(interaction) {
        const client = interaction.client
        const author = interaction.user

        const pinger = await interaction.reply({content: "Pinging...", fetchReply: true})

        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setFooter({text: `Requested by ${author.username}`, iconURL: author.avatarURL()})
            .setTimestamp()
            .setFields(
                {name: "Message ping:", value: `${pinger.createdTimestamp - interaction.createdTimestamp}ms`},
                {name: "Bot ping:", value: `${client.ws.ping}ms`},
            )

        await interaction.editReply({content: "", embeds: [embed]})
    }
}