const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export function getOpenAiApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY;
}

export function assertOpenAiApiKey(): string {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_OPENAI_API_KEY. Copy .env.example to .env and add your OpenAI API key.'
    );
  }
  return apiKey;
}

interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user';
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
  }>;
  response_format?: { type: 'json_object' };
  temperature?: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<string> {
  const apiKey = assertOpenAiApiKey();

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  return content;
}

export function parseJsonContent<T>(content: string): T {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : trimmed;
  return JSON.parse(jsonString) as T;
}
