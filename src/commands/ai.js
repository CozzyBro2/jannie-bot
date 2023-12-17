const {SlashCommandBuilder} = require("discord.js")
const {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_KEY)
const model = genAI.getGenerativeModel({model: "gemini-pro"})

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

const generationConfig = {
    temperature: 1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1024,
}

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const prompt = process.env.GOOGLEAI_PROMPT
const history = []

const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: history,
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("Test AI Command")
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message the AI")
            .setMaxLength(512)
            .setRequired(true))
        .setDMPermission(true),
    async execute(interaction) {
        const message = interaction.options.getString("message")

        const result = await chat.sendMessageStream(prompt + message)
        let text = ""

        for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            text += chunkText

            if (text.length >= 2000) {
                text = trim(text, 2000)
                await interaction.editReply(text)
                break
            }

            await interaction.editReply(text)
        }

        history.push({role: "user", parts: message})
        history.push({role: "model", parts: text})
    }
}