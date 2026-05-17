import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { RecipeMeta } from '@/components/recipe-meta';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useRecipePlanner } from '@/context/recipe-planner-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRecipeById } = useRecipePlanner();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const recipe = id ? getRecipeById(id) : undefined;

  useEffect(() => {
    if (!recipe) {
      router.replace('/');
    }
  }, [recipe, router]);

  if (!recipe) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          {recipe.title}
        </ThemedText>
        <ThemedText style={[styles.summary, { color: colors.muted }]}>{recipe.summary}</ThemedText>

        <RecipeMeta
          prepMinutes={recipe.prepMinutes}
          cookMinutes={recipe.cookMinutes}
          servings={recipe.servings}
        />

        <Section title="Ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={`${ingredient.item}-${index}`}
              style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
              <ThemedText style={[styles.amount, { color: colors.tint }]}>{ingredient.amount}</ThemedText>
              <ThemedText style={styles.item}>{ingredient.item}</ThemedText>
            </View>
          ))}
        </Section>

        <Section title="Steps">
          {recipe.steps
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <View key={step.order} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                  <ThemedText style={styles.stepNumberText}>{step.order}</ThemedText>
                </View>
                <ThemedText style={styles.stepInstruction}>{step.instruction}</ThemedText>
              </View>
            ))}
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  amount: {
    width: 90,
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    flex: 1,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepInstruction: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
