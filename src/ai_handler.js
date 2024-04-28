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

module.exports = {
    async generate(input, options) {
        const callback = options.callback
        const ignoreHistory = options.ignoreHistory

        const result = await model.generateContentStream(input)

        for await (const chunk of result.stream) {
            const chunkText = chunk.text()

            callback(chunkText)
        }

        if (!ignoreHistory) {
            history.push({content: input})

            if (history.length > 20 * 2) {
			          history.shift()
            }
        }
    },
    formatHistory: () => {
        let historyStr = ""
        history.map(info => historyStr += `\n ${info.content}`) 
    
        return historyStr
    },
    getHistory: () => {
        return history
    },
}