const {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} = require("@google/generative-ai")
let prompt = process.env.GOOGLEAI_PROMPT

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

        var input = ""

        if (!ignorePrompt) {
            input += `Your prompt: ${prompt}`
        }

        if (!ignoreHistory) {
            input += `\nPrevious messages addressed to you: ${dumpHistory()}`
        }

        // TODO: Implement awareness of discord environment here

        input += `\nNow, ${content}`
        const result = await model.generateContentStream(input)

        for await (const chunk of result.stream) {
            var chunkText = chunk.text()

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