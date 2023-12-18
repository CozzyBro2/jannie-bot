const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    defer: true,
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("AI commands")
        .setDMPermission(true),
    async execute(interaction) {
        interaction.editReply({content: "Disabled for now", ephemeral: true})
    }
}