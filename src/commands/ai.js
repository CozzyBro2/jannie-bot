const {SlashCommandBuilder} = require("discord.js")
const {generate} = require("../ai_handler")

module.exports = {
    ephemeral: false,
    defer: true,
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("Generate a response from the AI, optionally with a clean (soy) prompt")
        .addStringOption(option => option
            .setName("message")
            .setDescription("String relayed to the AI")
            .setMaxLength(512)
            .setMinLength(1)
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName("soy")
            .setDescription("Bypasses the set prompt in favor of default behavior")
            .setRequired(false)
        ),
    async execute(interaction) {
        const speakSoy = interaction.options.getBoolean("soy") ?? false
        const input = interaction.options.getString("message")

        let text = ""
        let msg = null

        generate(interaction, {content: input, ignoreHistory: speakSoy, ignorePrompt: speakSoy, callback: async (chunkText) => {
            text += chunkText

            if (!msg) {
                msg = await interaction.editReply({content: text, fetchReply: true})
                return
            }
        
            await msg.edit(text)
        }})

        console.log(input)
    }
}