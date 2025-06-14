import OpenAI from 'openai';
import { DecisionAnalysis } from '@/entities/decision';
import { IOpenAIService } from './interfaces/openaiService.interface';
import { DatabaseError } from '@/shared/errors/domain.error';

const SYSTEM_PROMPT = `
You are "Decision Mentor" a warm, encouraging coach who blends solid decision-science with a human touch. Be supportive, understanding, honest.

Tone & Style Rules
1. Sound like a supportive human mentor—positive, clear, empathetic.
2. Use everyday language; skip academic jargon, use simple words and phrases.
4. Bias gatekeeper: include a bias only if evidence exists and probability ≥ 0.7. 
5. Max 2 alternative decisions to keep them feasible for THIS situation. At least 150 characters for each alternative decision description.
7. Output **nothing except** the JSON block.
8. Think step-by-step internally, dive deep into the situation and decision and never reveal chain-of-thought.
9. Add an question in the end of the bias evidence so person might ask to themselves to check if they have this bias (e.g "Could that be that you are looking for a fast solution rather than addressing root cause issues gradually?")
10. Talk to person in first person, make sure to use "you" and "your" when addressing the person. Refer to the personas from the situation when elaborating the bias or alternative decisions. Instead of "the person" use "you" and "your". Instead of "the situation" use "your situation". Instead of "each other's" use "you and your partner".
11. Use simple words and phrases, avoid complex sentences. (e.g avoid "You might be favoring information that confirms your pre-existing belief that a mix of immediate emotional gestures and long-term therapeutic intervention is the best way to improve your relationship. This could mean overlooking other equally valid or simpler solutions.")
11. Your responses should show that you are a human, not a robot. 
12. Your responses should show that you relate to the person and their situation. 

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
  ]
}

Any output that violates the schema or adds extra text will be rejected.`;

export class OpenAIService implements IOpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    this.client = new OpenAI({ apiKey });
  }

  private buildPrompt(situation: string, decision: string, reasoning?: string): string {
    return `Please analyze my decision:
    Situation: ${situation}
    Decision: ${decision}
    ${reasoning ? `Reasoning: ${reasoning}` : ''}
    Return your analysis in the JSON schema you know.`;
  }

  private validateAnalysis(analysis: Partial<DecisionAnalysis>): DecisionAnalysis {
    if (!analysis.category || !analysis.biases || !analysis.alternatives) {
      console.error('Invalid analysis format:', analysis);
      throw new DatabaseError('Invalid analysis format from OpenAI');
    }

    if (!Array.isArray(analysis.biases) || !Array.isArray(analysis.alternatives)) {
      console.error('Invalid analysis arrays:', analysis);
      throw new DatabaseError('Invalid analysis arrays');
    }

    analysis.biases.forEach(bias => {
      if (!bias.name || !bias.description) {
        console.error('Invalid bias format:', bias);
        throw new DatabaseError('Invalid bias format: missing name or description');
      }
    });

    return {
      title: analysis.title!,
      category: analysis.category,
      biases: analysis.biases,
      alternatives: analysis.alternatives,
    };
  }

  async analyzeDecision(
    situation: string,
    decision: string,
    reasoning?: string
  ): Promise<DecisionAnalysis> {
    console.log('Starting decision analysis');
    try {
      const prompt = this.buildPrompt(situation, decision, reasoning);
      
      console.log('Sending request to OpenAI with prompt:', {
        situationLength: situation.length,
        decisionLength: decision.length,
        reasoningLength: reasoning?.length || 0
      });

      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
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
        throw new DatabaseError('No content in OpenAI response');
      }

      console.log('Parsing OpenAI response');
      const analysis = JSON.parse(response.choices[0].message.content);
      console.log('Successfully parsed analysis');
      
      return this.validateAnalysis(analysis);
    } catch (error) {
      console.error('OpenAI service error:', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      });
      
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to analyze decision');
    }
  }
}

const openAIService = new OpenAIService();
export const analyzeDecision = openAIService.analyzeDecision.bind(openAIService);