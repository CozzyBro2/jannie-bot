const {GoogleGenAI, HarmBlockThreshold, HarmCategory} = require("@google/genai")

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
]

const modelConfig = {
    maxOutputTokens: 100,
    temperature: 1.5, // make him funny
}

const ai = new GoogleGenAI({apiKey: process.env.GOOGLEAI_KEY})

let prompt = process.env.GOOGLEAI_PROMPT
let pressure = 0
let history = []

function dumpHistory() {
    let historyStr = ""
    history.map(info => historyStr += `\n${info.content}`) 

    return historyStr
}

function wipeHistory() {
    history = []
}

function getDiscordPrompt(guild) {
    var usersString = ""

    guild.smallCache.map(member => {
        usersString += `\n{Name: '${member.user.username}', Nickname: '${member.displayName}'}`
    })

    return `You are in a discord server named '${guild.name}'. It is occupied by the following user(s): ${usersString}`
}

function waitUntilAvailable() {
    let delay = null
    pressure += 0.5

    // There is pressure; tack on a delay to help keep the API from exhausting.
    if (pressure > 1) {
        delay = pressure / 2
    }

    setTimeout(() => pressure -= 0.5, 500)

    if (delay) {
        return new Promise(resolve => setTimeout(resolve, delay * 1000))
    }
}

module.exports = {
    async generate(guild, options) {
        await waitUntilAvailable()

        const content = options.content
        const callback = options.callback
        const ignoreHistory = options.ignoreHistory
        const ignorePrompt = options.ignorePrompt
        const ignoreMembers = options.ignoreMembers

        var systemPrompt = ""

        if (!ignoreMembers) {
            systemPrompt += getDiscordPrompt(guild)
        }

        if (!ignoreHistory) {
            systemPrompt += `\n\nPrevious messages addressed to you: ${dumpHistory()}`
        }

        if (!ignorePrompt) {
            systemPrompt += `\n\nYour prompt: ${prompt}`
        }

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: content,
            config: {
                safetySettings: safetySettings,
                config: modelConfig,
                systemInstruction: systemPrompt
            }
        })

        for await (const chunk of stream) {
            var chunkText = chunk.text

            if (chunkText === "") {
                chunkText = "."
            }

            await callback(chunkText)
        }

        if (!ignoreHistory) {
            history.push({content: content})

            if (history.length > 20) {
			    history.shift()
            }
        }

    },
    setPrompt(newPrompt) {
        prompt = newPrompt
    },
    dumpHistory,
    wipeHistory
}