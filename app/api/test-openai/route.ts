import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const client = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: "Say hello"
        }
      ],
      max_tokens: 10
    });

    return NextResponse.json({
      success: true,
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    }, { status: 500 });
  }
} 