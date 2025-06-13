import OpenAI from 'openai';
import { DecisionAnalysis, Bias, DecisionCategory } from '@/entities/decision';

interface OpenAIAnalysisResponse {
  category: DecisionCategory;
  biases: Bias[];
  alternatives: string[];
  suggestions: string[];
}

const systemPrompt = `
You are “Decision Mentor” a warm, encouraging coach who blends solid decision-science with a human touch.

Tone & Style Rules
1. Sound like a supportive human mentor—positive, clear, empathetic.
2. Use everyday language; skip academic jargon, use simple words and phrases.
4. Bias gatekeeper: include a bias only if evidence exists and probability ≥ 0.7. Add an question in the end so person might ask to themselves to check if they have this bias. 
5. Max 2 alternative decisions to keep them feasible for THIS situation. At least 150 characters for each alternative decision description.
7. Output **nothing except** the JSON block.
8. Think step-by-step internally, dive deep into the situation and decision and never reveal chain-of-thought.

You must produce ONLY valid JSON that conforms to this schema:

{
  "category": "concise single word category label you create (e.g., 'Emotional')",
  "biases": [
    {
      "name": "bias name",
      "evidence": "exact phrase(s) or facts from the Situation / Decision / Reasoning that suggest this bias",
      "description": "brief plain-English explanation of HOW that bias might have influenced the choice"
    }
    // 0-3 items, ordered by strongest evidence
  ],
  "alternatives": [
    "realistic option 1 not mentioned by user",
    "realistic option 2"
  ],
  "suggestions": [
    "actionable tip 1",
    "actionable tip 2"
  ]
}

Any output that violates the schema or adds extra text will be rejected.`



function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  return new OpenAI({ apiKey: "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" }); // TODO: rely on env variable
}

function buildPrompt(situation: string, decision: string, reasoning?: string): string {
  return `Please analyze my decision:
Situation: ${situation}
Decision: ${decision}
${reasoning ? `Reasoning: ${reasoning}` : ''}
Return your analysis in the JSON schema you know.`;
}

function validateAnalysis(analysis: OpenAIAnalysisResponse): DecisionAnalysis {
  if (!analysis.category || !analysis.biases || !analysis.alternatives || !analysis.suggestions ) {
    throw new Error('Invalid analysis format from OpenAI');
  }

  if (!Array.isArray(analysis.biases) || !Array.isArray(analysis.alternatives) || !Array.isArray(analysis.suggestions)) {
    throw new Error('Invalid analysis arrays');
  }

  analysis.biases.forEach(bias => {
    if (!bias.name || !bias.description) {
      throw new Error('Invalid bias format: missing name or description');
    }
  });

  return {
    category: analysis.category,
    biases: analysis.biases,
    alternatives: analysis.alternatives,
    suggestions: analysis.suggestions,
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
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }

    const analysis = JSON.parse(response.choices[0].message.content);
    return validateAnalysis(analysis);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze decision');
  }
}