import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const client = new OpenAI({ 
      apiKey: "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"
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