const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.debug("gemeni api key" + process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

async function generateResponse(prompt) {
    const result = await model.generateContent(prompt);
    console.debug(result)
    return result.response.text()
}

module.exports = {
    generateResponse
};