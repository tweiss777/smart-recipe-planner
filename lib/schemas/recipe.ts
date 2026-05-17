import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  item: z.string().min(1),
  amount: z.string().min(1),
});

export const recipeStepSchema = z.object({
  order: z.number().int().positive(),
  instruction: z.string().min(1),
});

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  prepMinutes: z.number().int().nonnegative(),
  cookMinutes: z.number().int().nonnegative(),
  servings: z.number().int().positive(),
  ingredientsUsed: z.array(z.string()),
  ingredients: z.array(recipeIngredientSchema).min(1),
  steps: z.array(recipeStepSchema).min(1),
});

export const recipeBatchSchema = z.object({
  recipes: z.array(recipeSchema).length(5),
});

export const ingredientsSchema = z.array(z.string().min(1)).min(1);
