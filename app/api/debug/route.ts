import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    hasOpenAIApiKey: hasApiKey,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
} 