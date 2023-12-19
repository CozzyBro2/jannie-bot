const {Events, } = require("discord.js")
const {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_KEY)
const model = genAI.getGenerativeModel({model: "gemini-pro"})

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

const generationConfig = {
    temperature: 0,
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
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.author.bot) {
            const mentioned = message.mentions.users.first()

            if (mentioned && mentioned.id === message.client.user.id) {
                const content = `(${message.author.username}) says:` + message.content.replace(/<@!?\d+>/g, '');

                if (message.author.id === process.env.OWNER_ID && content.includes("dump your history")) {
                    let historyStr = ""
                    history.map(info => historyStr += `\n \*\*${info.role}\*\*: \`${info.parts}\``)
                    await message.reply(trim(historyStr, 1024))
                    return
                }

                try {
                    const result = await chat.sendMessageStream(prompt + content)

                    let text = ""
                    let msg = null
    
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text()
                        text += chunkText
    
                        if (!msg) {
                            msg = await message.reply({content: chunk.text(), fetchReply: true})
                            return
                        }

                        await msg.edit(text)
                    }

                    history.push({role: "user", parts: content})
                    history.push({role: "model", parts: text})
                } catch (err) {
                    await message.reply("Error while generating response")
                }
            }
        }
    }
}