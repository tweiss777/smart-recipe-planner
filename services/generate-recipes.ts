import { slugify } from '@/lib/slugify';
import { recipeBatchSchema } from '@/lib/schemas/recipe';
import type { Recipe } from '@/types/recipe';
import { createChatCompletion, parseJsonContent } from '@/services/openai';

interface GenerateRecipesParams {
  ingredients: string[];
  excludeTitles: string[];
}

interface RawRecipe {
  title: string;
  summary: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredientsUsed: string[];
  ingredients: { item: string; amount: string }[];
  steps: { order: number; instruction: string }[];
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function dedupeByTitle(recipes: Recipe[], excludeTitles: string[]): Recipe[] {
  const excluded = new Set(excludeTitles.map(normalizeTitle));
  const seen = new Set<string>();
  const unique: Recipe[] = [];

  for (const recipe of recipes) {
    const key = normalizeTitle(recipe.title);
    if (excluded.has(key) || seen.has(key)) continue;
    seen.add(key);
    unique.push(recipe);
  }

  return unique;
}

function assignIds(recipes: RawRecipe[]): Recipe[] {
  const usedIds = new Set<string>();

  return recipes.map((recipe) => {
    let id = slugify(recipe.title);
    let suffix = 1;
    while (usedIds.has(id)) {
      id = `${slugify(recipe.title)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    return { ...recipe, id };
  });
}

export async function generateRecipes({
  ingredients,
  excludeTitles,
}: GenerateRecipesParams): Promise<Recipe[]> {
  const excludeList =
    excludeTitles.length > 0
      ? `Do NOT suggest any of these recipes (already shown): ${excludeTitles.join(', ')}.`
      : '';

  const content = await createChatCompletion({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a recipe planner. Generate exactly 5 distinct, realistic recipes using the user's ingredients.
Pantry staples (oil, salt, pepper, water, butter) are allowed.
${excludeList}
Respond with JSON only in this shape:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "summary": "One sentence description",
      "prepMinutes": 10,
      "cookMinutes": 20,
      "servings": 4,
      "ingredientsUsed": ["tomato", "onion"],
      "ingredients": [{"item": "tomato", "amount": "2 medium"}],
      "steps": [{"order": 1, "instruction": "Step text"}]
    }
  ]
}
Each recipe needs 4-8 ingredients and 4-8 numbered steps.`,
      },
      {
        role: 'user',
        content: `Create 5 recipes using these ingredients: ${ingredients.join(', ')}.`,
      },
    ],
  });

  const parsed = parseJsonContent<{ recipes: RawRecipe[] }>(content);
  const withIds = assignIds(parsed.recipes);
  const validated = recipeBatchSchema.safeParse({ recipes: withIds });
  if (!validated.success) {
    throw new Error('Received invalid recipe data from OpenAI. Please try again.');
  }
  const unique = dedupeByTitle(validated.data.recipes, excludeTitles);

  if (unique.length < 5) {
    throw new Error(
      unique.length === 0
        ? 'No more unique recipes for these ingredients. Try a new photo.'
        : `Only found ${unique.length} new unique recipes. Try a new photo for more variety.`
    );
  }

  return unique.slice(0, 5);
}
