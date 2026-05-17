import { File } from 'expo-file-system';

import { ingredientsSchema } from '@/lib/schemas/recipe';
import { createChatCompletion, parseJsonContent } from '@/services/openai';

async function readImageAsBase64(imageUri: string): Promise<string> {
  const file = new File(imageUri);
  return file.base64();
}

function getMimeType(imageUri: string): string {
  const extension = imageUri.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  return 'image/jpeg';
}

export async function analyzeIngredients(imageUri: string): Promise<string[]> {
  const base64 = await readImageAsBase64(imageUri);
  const mimeType = getMimeType(imageUri);

  const content = await createChatCompletion({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You identify food ingredients visible in photos. Respond with JSON only: {"ingredients": ["ingredient1", "ingredient2"]}. Use common lowercase ingredient names. Include only ingredients you can clearly see.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'List every food ingredient you can see in this image.',
          },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
        ],
      },
    ],
  });

  const parsed = parseJsonContent<{ ingredients: string[] }>(content);
  const validated = ingredientsSchema.parse(parsed.ingredients);
  return validated;
}
