import "dotenv/config"
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { sendEmail } from "./src/mail.service.js";
import * as z from "zod";

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send an email",
        schema: z.object({
            to: z.string().describe("The recipient's email address"),
            html: z.string().describe("The HTML content of the email"),
            subject: z.string().describe("The subject of the email"),
        })
    }
)



const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const agent = createReactAgent({
    llm: model,
    tools: [ emailTool ]
})



async function startChat() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const messages = []

    while (true) {
        const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")

        if (userInput.toLowerCase() === "exit") {
            rl.close();
            break;
        }

        messages.push(new HumanMessage(userInput))

        const response = await agent.invoke({
            messages
        })

        messages.push(response.messages[ response.messages.length - 1 ])

        console.log(`\x1b[34m[AI]\x1b[0m ${response.messages[ response.messages.length - 1 ].content}`)
    }
}


if (process.argv.includes("--chat")) {
    startChat();
}
