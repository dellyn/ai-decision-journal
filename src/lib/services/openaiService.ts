import OpenAI from 'openai';
import { DecisionAnalysis, Bias } from '@/entities/decision';

interface OpenAIAnalysisResponse {
  category: 'Emotional' | 'Strategic' | 'Impulsive' | 'Rational';
  biases: Bias[];
  alternatives: string[];
}

function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
console.log('API_KEY',process.env.OPENAI_API_KEY)
  return new OpenAI({ apiKey: "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" });
}

function buildPrompt(situation: string, decision: string, reasoning?: string): string {
  return `Analyze this decision:
Situation: ${situation}
Decision: ${decision}
${reasoning ? `Reasoning: ${reasoning}` : ''}

Provide analysis in the following JSON format:
{
  "category": "Emotional | Strategic | Impulsive | Rational",
  "biases": [
    {
      "name": "bias name",
      "description": "detailed description of how this bias might have influenced the decision"
    }
  ],
  "alternatives": ["list of potential alternatives that weren't considered"]
}`;
}

function validateAnalysis(analysis: OpenAIAnalysisResponse): DecisionAnalysis {
  if (!analysis.category || !analysis.biases || !analysis.alternatives) {
    throw new Error('Invalid analysis format from OpenAI');
  }

  // if (!['Emotional', 'Strategic', 'Impulsive', 'Rational'].includes(analysis.category)) {
  //   throw new Error('Invalid decision category');
  // }

  if (!Array.isArray(analysis.biases) || !Array.isArray(analysis.alternatives)) {
    throw new Error('Invalid analysis arrays');
  }

  // Validate each bias has required fields
  analysis.biases.forEach(bias => {
    if (!bias.name || !bias.description) {
      throw new Error('Invalid bias format: missing name or description');
    }
  });

  return {
    category: analysis.category,
    biases: analysis.biases,
    alternatives: analysis.alternatives
  };
}

export async function analyzeDecision(situation: string, decision: string, reasoning?: string): Promise<DecisionAnalysis> {
  try {
    const client = createOpenAIClient();
    const prompt = buildPrompt(situation, decision, reasoning);
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert decision analyst. Analyze the given decision and provide insights about cognitive biases, alternatives, and categorize the decision type. For each bias, provide a detailed description of how it might have influenced the decision."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log('response', response);
    const analysis = JSON.parse(response.choices[0].message.content) as OpenAIAnalysisResponse;
    return validateAnalysis(analysis);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze decision');
  }
}