const {SlashCommandBuilder} = require("discord.js")
const {generate, formatHistory} = require("../ai_handler")

let prompt = process.env.GOOGLEAI_PROMPT

module.exports = {
    ephemeral: false,
    defer: true,
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("AI commands")
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
        )
        .setDMPermission(true),
    async execute(interaction) {
        const speakSoy = interaction.options.getBoolean("soy") ?? false
        let input = interaction.options.getString("message")

        if (!speakSoy) {
            input = `
                Your prompt: ${prompt}.
                \n Previous messages addressed to you: ${formatHistory()}
                \n Input: ${input}`
        }

        let text = ""
        let msg = null

        generate(input, {ignoreHistory: speakSoy, callback: async (chunkText) => {
            text += chunkText

            if (!msg) {
                msg = await interaction.editReply({content: text, fetchReply: true})
                return
            }
        
            await msg.edit(text)
        }})
    }
}