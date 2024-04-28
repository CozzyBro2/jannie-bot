const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {setPrompt} = require("../ai_handler")

module.exports = {
    ephemeral: true,
    defer: true,
    data: new SlashCommandBuilder()
        .setName("manage_ai")
        .setDescription("Manage the AI")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(command => command
            .setName("prompt")
            .setDescription("Change the AI prompt")
            .addStringOption(option => option
                .setName("new_prompt")
                .setDescription("New prompt for the AI")
                .setMaxLength(1024)
                .setMinLength(2)
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "prompt") {
            const input = interaction.options.getString("new_prompt")

            setPrompt(input)

            interaction.editReply(`Prompt set to:\n\`\`\`${input}\`\`\``)
        }
    }
}