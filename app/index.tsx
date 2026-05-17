import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/components/error-banner';
import { IngredientCapture } from '@/components/ingredient-capture';
import { IngredientChips } from '@/components/ingredient-chips';
import { LoadingState } from '@/components/loading-state';
import { RecipeList } from '@/components/recipe-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useRecipePlanner } from '@/context/recipe-planner-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Recipe } from '@/types/recipe';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    imageUri,
    ingredients,
    recipes,
    phase,
    error,
    isLoading,
    canRefresh,
    hasApiKey,
    processImage,
    refreshRecipes,
    clearError,
  } = useRecipePlanner();

  function handleRecipePress(recipe: Recipe) {
    router.push(`/recipe/${recipe.id}`);
  }

  const isAnalyzing = phase === 'analyzing';
  const isGenerating = phase === 'generating';

  const loadingMessage = isAnalyzing
    ? 'Analyzing your ingredients...'
    : 'Finding recipes for you...';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Smart Recipe Planner
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
              Snap your ingredients, discover what you can cook
            </ThemedText>
          </View>

          {!hasApiKey ? (
            <ErrorBanner message="Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file (see .env.example), then restart Expo." />
          ) : null}

          <IngredientCapture
            imageUri={imageUri}
            isLoading={isLoading}
            onImageSelected={processImage}
          />

          {error ? <ErrorBanner message={error} onDismiss={clearError} /> : null}

          {ingredients.length > 0 && !isAnalyzing ? (
            <IngredientChips ingredients={ingredients} />
          ) : null}
          {recipes.length > 0 ? (
            <>
              <RecipeList recipes={recipes} onRecipePress={handleRecipePress} />
              <Pressable
                onPress={refreshRecipes}
                disabled={!canRefresh || isLoading}
                style={({ pressed }) => [
                  styles.refreshButton,
                  { borderColor: colors.tint },
                  (!canRefresh || isLoading) && styles.refreshDisabled,
                  pressed && canRefresh && styles.refreshPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Show 5 more recipes">
                <ThemedText style={[styles.refreshText, { color: colors.tint }]}>
                  {canRefresh ? 'Show 5 more recipes' : 'No more unique recipes for these ingredients'}
                </ThemedText>
              </Pressable>
            </>
          ) : null}
          {isAnalyzing || isGenerating ? <LoadingState message={loadingMessage} /> : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  refreshButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
  },
  refreshDisabled: {
    opacity: 0.5,
  },
  refreshPressed: {
    opacity: 0.85,
  },
});
