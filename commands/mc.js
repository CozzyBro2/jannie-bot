const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Returns information about the specified Minecraft server"),
    async execute(interaction) {
        await interaction.reply("Hello")
    }
}