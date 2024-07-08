import OpenAI from "openai";
import { StreamingTextResponse, generateText, OpenAIStream } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const prompt = `
      Create a list of three open-ended and engaging questions formatted as a single string. 
      Each question should be separated by '||'. These questions are for an anonymous social messaging platform, 
      like Qooh.me, and should be suitable for a diverse audience. 
      Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
      For example, your output should be structured like this: 
      'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
      Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    `;

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      stream: true,
      max_tokens: 400,
      temperature: 1,
      prompt,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.error();
  }
}
