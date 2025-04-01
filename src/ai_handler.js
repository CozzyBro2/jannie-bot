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

const ai = new GoogleGenAI({apiKey: process.env.GOOGLEAI_KEY})

let prompt = process.env.GOOGLEAI_PROMPT
let history = []

function dumpHistory() {
    let historyStr = ""
    history.map(info => historyStr += `\n${info.content}`) 

    return historyStr
}

function wipeHistory() {
    history = []
}

module.exports = {
    async generate(content, options) {
        const callback = options.callback
        const ignoreHistory = options.ignoreHistory
        const ignorePrompt = options.ignorePrompt

        var systemPrompt = ""

        if (!ignorePrompt) {
            systemPrompt += `Your prompt: ${prompt}`
        }

        if (!ignoreHistory) {
            systemPrompt += `\nPrevious messages addressed to you: ${dumpHistory()}`
        }

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: content,
            config: {
                safetySettings: safetySettings,
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