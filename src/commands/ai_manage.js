const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {setPrompt, dumpHistory, wipeHistory} = require("../ai_handler")

module.exports = {
    ephemeral: true,
    defer: true,
    data: new SlashCommandBuilder()
        .setName("manage_ai")
        .setDescription("Manage the AI")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        )
        .addSubcommand(command => command
            .setName("wipe")
            .setDescription("Wipes the AI conversation history")
        )
        .addSubcommand(command => command
            .setName("history")
            .setDescription("Replies with the AI conversation history")
        ),
    async execute(interaction) {
        const cmd = interaction.options.getSubcommand()

        if (cmd === "prompt") {
            const input = interaction.options.getString("new_prompt")

            setPrompt(input)

            interaction.editReply(`Prompt set to:\n\`\`\`${input}\`\`\``)
        } else if (cmd == "wipe") {
            wipeHistory()

            interaction.editReply("Wiped 👍")
        } else if (cmd == "history") {
            const hist = dumpHistory()

            interaction.editReply(`Conversation history:\n\`\`\`${hist}\`\`\``)
        }
    }
}