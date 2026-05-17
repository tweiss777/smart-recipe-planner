import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface IngredientChipsProps {
  ingredients: string[];
}

export function IngredientChips({ ingredients }: IngredientChipsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  if (ingredients.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ThemedText type="subtitle" style={styles.heading}>
        Detected ingredients
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {ingredients.map((ingredient) => (
          <View
            key={ingredient}
            style={[styles.chip, { backgroundColor: colors.accent + '55', borderColor: colors.tint }]}>
            <ThemedText style={styles.chipText}>{ingredient}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  heading: {
    fontSize: 18,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
