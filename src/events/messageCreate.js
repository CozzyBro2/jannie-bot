const {Events, } = require("discord.js")
const {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} = require("@google/generative-ai")

const generationConfig = {
    temperature: 1,
    topK: 16,
    topP: 1,
    maxOutputTokens: 1512,
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

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_KEY)
const model = genAI.getGenerativeModel({model: "gemini-pro", generationConfig, safetySettings})

let history = []
let prompt = process.env.GOOGLEAI_PROMPT

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str)

function printHistory() {
    let historyStr = ""
    history.map(info => historyStr += `\n ${info.content}`) 

    return historyStr
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.author.bot) {
            const mentioned = message.mentions.users.first()

            if (mentioned && mentioned.id === message.client.user.id) {
                const content = trim(`user ${message.author.username} says: ` + message.content.replace(/<@!?\d+>/g, 'Pineapples,'), 512)

                try {
                    message.channel.sendTyping()

		            const result = await model.generateContentStream(`
			            Your prompt: ${prompt}.
                        \n Previous messages addressed to you: ${printHistory()}
                        \n Now, ${content}`
		            )

                    let text = ""
                    let msg = null

                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text()
                        text += chunkText

                        if (!msg) {
                            msg = await message.reply({content: chunk.text(), fetchReply: true})
                            continue
                        }

                        await msg.edit(text)
                    }

                    history.push({content: content})

                    if (history.length > 20) {
			            history.shift()
                    }
                } catch (err) {
                    console.log(err)
                    await message.reply("Error while generating response")
                }
            }
        }
    }
}
