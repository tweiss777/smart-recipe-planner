export interface RecipeIngredient {
  item: string;
  amount: string;
}

export interface RecipeStep {
  order: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredientsUsed: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
