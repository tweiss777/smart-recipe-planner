import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { RecipeMeta } from '@/components/recipe-meta';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View recipe: ${recipe.title}`}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {recipe.title}
        </ThemedText>
        <Ionicons name="chevron-forward" size={20} color={colors.tint} />
      </View>
      <ThemedText style={[styles.summary, { color: colors.muted }]} numberOfLines={2}>
        {recipe.summary}
      </ThemedText>
      <RecipeMeta
        prepMinutes={recipe.prepMinutes}
        cookMinutes={recipe.cookMinutes}
        servings={recipe.servings}
        compact
      />
      {recipe.ingredientsUsed.length > 0 ? (
        <View style={styles.usedRow}>
          <ThemedText style={[styles.usedLabel, { color: colors.muted }]}>Uses: </ThemedText>
          <ThemedText style={styles.usedItems} numberOfLines={1}>
            {recipe.ingredientsUsed.join(', ')}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  usedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usedLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  usedItems: {
    flex: 1,
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
