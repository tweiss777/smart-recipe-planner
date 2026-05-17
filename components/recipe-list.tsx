import { StyleSheet, View } from 'react-native';

import { RecipeCard } from '@/components/recipe-card';
import { ThemedText } from '@/components/themed-text';
import type { Recipe } from '@/types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipePress: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onRecipePress }: RecipeListProps) {
  if (recipes.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ThemedText type="subtitle" style={styles.heading}>
        Recipes for you
      </ThemedText>
      <View style={styles.list}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onPress={() => onRecipePress(recipe)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  heading: {
    fontSize: 18,
  },
  list: {
    gap: 12,
  },
});
