import { GoogleGenerativeAI } from "@google/generative-ai"
import { HfInference } from "@huggingface/inference"
import SYSTEM_PROMPT from "./prompt"

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
}

export async function getResponseFromGemini(userPrompt) {
	try {
		const chatSession = model.startChat({
			generationConfig,
		})

		const prompt = `${SYSTEM_PROMPT}\n\nUser Input: ${userPrompt}`

		const result = await chatSession.sendMessage(prompt)
		return result.response.text()
	} catch (error) {
		console.error("Error in run function:", error)
		return "An error occurred."
	}
}

const client = new HfInference(import.meta.env.VITE_HF_API_KEY)

export async function getResponseFromHF(userPrompt) {
	const chatCompletion = await client.chatCompletion({
		model: "microsoft/Phi-3-mini-4k-instruct",
		messages: [
			{
				role: "user",
				content: `${SYSTEM_PROMPT}\n\nUser Input: ${userPrompt}`,
			},
		],
		max_tokens: 1024,
	})

	return chatCompletion.choices[0].message
}