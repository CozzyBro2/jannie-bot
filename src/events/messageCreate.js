const {Events, } = require("discord.js")
const {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_KEY)
const model = genAI.getGenerativeModel({model: "gemini-pro"})

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str)

const generationConfig = {
    temperature: 0.05,
    topK: 1,
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

let prompt = process.env.GOOGLEAI_PROMPT
let history = []

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
                const content = `user ${message.author.username} says: ` + message.content.replace(/<@!?\d+>/g, '')

                try {
                    if (message.author.id === process.env.OWNER_ID && content.includes("sudo")) {
                        if (content.includes("dump history")) {
                            let historyStr = `History Size: ${history.length} items.\nHistory: `
                            history.map(info => historyStr += `\n \*\*${info.role}\*\*: \`${info.parts}\``)
                            await message.reply(trim(historyStr, 1024))
                        } else if (content.includes("wipe history")) {
                            history = []
                            await message.reply("Lobotomy successful.")
                        } else if (content.includes("change prompt")) {
                            await message.reply("Ping me with the next prompt. I'm waiting")

                            const collectorFilter = m => m.mentions.users.first() && m.mentions.users.first().id === message.client.user.id
                            const collector = message.channel.createMessageCollector({filter: collectorFilter, time: 60000, max: 1})

                            collector.on("collect", m => {
                                prompt = m.content.replace(/<@!?\d+>/g, '')
                                history = []
			                    message.reply("Prompt changed 👍");
                            })
                        } else if (content.includes("say prompt")) {
                            await message.reply(`Here is my prompt as is: ${prompt}`)
                        }

                        return
                    }

                    message.channel.sendTyping()
                    const result = await chat.sendMessageStream(prompt + content)

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

                    history.push({role: "user", parts: content})
                    history.push({role: "model", parts: text})

                    if (history.length > 20) {
                        history.shift()
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