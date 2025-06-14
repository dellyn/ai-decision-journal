import OpenAI from 'openai';
import { DecisionAnalysis } from '@/entities/decision';

type OpenAIAnalysisResponse = DecisionAnalysis;

const systemPrompt = `
You are "Decision Mentor" a warm, encouraging coach who blends solid decision-science with a human touch.

Tone & Style Rules
1. Sound like a supportive human mentor—positive, clear, empathetic.
2. Use everyday language; skip academic jargon, use simple words and phrases.
4. Bias gatekeeper: include a bias only if evidence exists and probability ≥ 0.7. Add an question in the end so person might ask to themselves to check if they have this bias. 
5. Max 2 alternative decisions to keep them feasible for THIS situation. At least 150 characters for each alternative decision description.
7. Output **nothing except** the JSON block.
8. Think step-by-step internally, dive deep into the situation and decision and never reveal chain-of-thought.

You must produce ONLY valid JSON that conforms to this schema:

{
  "title": "4 words title of the decision with emojie related to category (e.g., '🤔 Marrying the right person')",
  "category": "concise single word category of the decision type label you create (e.g., 'Emotional')",
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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not defined in environment variables');
    throw new Error('OpenAI API key is not configured');
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
    console.error('Invalid analysis format:', analysis);
    throw new Error('Invalid analysis format from OpenAI');
  }

  if (!Array.isArray(analysis.biases) || !Array.isArray(analysis.alternatives) || !Array.isArray(analysis.suggestions)) {
    console.error('Invalid analysis arrays:', analysis);
    throw new Error('Invalid analysis arrays');
  }

  analysis.biases.forEach(bias => {
    if (!bias.name || !bias.description) {
      console.error('Invalid bias format:', bias);
      throw new Error('Invalid bias format: missing name or description');
    }
  });

  return {
    title: analysis.title,
    category: analysis.category,
    biases: analysis.biases,
    alternatives: analysis.alternatives,
    suggestions: analysis.suggestions,
  };
}

export async function analyzeDecision(situation: string, decision: string, reasoning?: string): Promise<DecisionAnalysis> {
  console.log('Starting decision analysis');
  try {
    const client = createOpenAIClient();
    const prompt = buildPrompt(situation, decision, reasoning);
    
    console.log('Sending request to OpenAI with prompt:', {
      situationLength: situation.length,
      decisionLength: decision.length,
      reasoningLength: reasoning?.length || 0
    });

    try {
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

      console.log('Received raw response from OpenAI:', {
        hasContent: !!response.choices[0].message.content,
        contentLength: response.choices[0].message.content?.length,
        finishReason: response.choices[0].finish_reason
      });

      if (!response.choices[0].message.content) {
        console.error('No content in OpenAI response:', response);
        throw new Error('No content in OpenAI response');
      }

      console.log('Parsing OpenAI response');
      const analysis = JSON.parse(response.choices[0].message.content);
      console.log('Successfully parsed analysis');
      
      return validateAnalysis(analysis);
    } catch (apiError) {
      console.error('OpenAI API call failed:', {
        error: apiError instanceof Error ? {
          name: apiError.name,
          message: apiError.message,
          stack: apiError.stack
        } : apiError,
        prompt: {
          situationLength: situation.length,
          decisionLength: decision.length,
          reasoningLength: reasoning?.length || 0
        }
      });
      throw apiError;
    }
  } catch (error) {
    console.error('OpenAI service error:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
    if (error instanceof Error) {
      throw new Error(`Failed to analyze decision: ${error.message}`);
    }
    throw new Error('Failed to analyze decision');
  }
}