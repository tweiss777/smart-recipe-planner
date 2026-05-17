import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { analyzeIngredients } from '@/services/analyze-ingredients';
import { generateRecipes } from '@/services/generate-recipes';
import { getOpenAiApiKey } from '@/services/openai';
import type { Recipe } from '@/types/recipe';

type LoadingPhase = 'idle' | 'analyzing' | 'generating';

interface RecipePlannerState {
  imageUri: string | null;
  ingredients: string[];
  recipes: Recipe[];
  excludedTitles: string[];
  phase: LoadingPhase;
  error: string | null;
  canRefresh: boolean;
}

type RecipePlannerAction =
  | { type: 'RESET_SESSION'; imageUri: string }
  | { type: 'SET_INGREDIENTS'; ingredients: string[] }
  | { type: 'SET_RECIPES'; recipes: Recipe[] }
  | { type: 'SET_PHASE'; phase: LoadingPhase }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_CAN_REFRESH'; canRefresh: boolean };

const initialState: RecipePlannerState = {
  imageUri: null,
  ingredients: [],
  recipes: [],
  excludedTitles: [],
  phase: 'idle',
  error: null,
  canRefresh: false,
};

function recipePlannerReducer(
  state: RecipePlannerState,
  action: RecipePlannerAction
): RecipePlannerState {
  switch (action.type) {
    case 'RESET_SESSION':
      return {
        ...initialState,
        imageUri: action.imageUri,
        phase: 'analyzing',
      };
    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.ingredients, phase: 'generating' };
    case 'SET_RECIPES':
      return {
        ...state,
        recipes: action.recipes,
        excludedTitles: [
          ...state.excludedTitles,
          ...action.recipes.map((r) => r.title),
        ],
        phase: 'idle',
        error: null,
        canRefresh: true,
      };
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'SET_ERROR':
      return { ...state, error: action.error, phase: 'idle' };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_CAN_REFRESH':
      return { ...state, canRefresh: action.canRefresh };
    default:
      return state;
  }
}

interface RecipePlannerContextValue extends RecipePlannerState {
  hasApiKey: boolean;
  isLoading: boolean;
  processImage: (imageUri: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  clearError: () => void;
}

const RecipePlannerContext = createContext<RecipePlannerContextValue | null>(null);

export function RecipePlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipePlannerReducer, initialState);
  const hasApiKey = Boolean(getOpenAiApiKey());

  const runGeneration = useCallback(async (ingredients: string[], excludeTitles: string[]) => {
    dispatch({ type: 'SET_PHASE', phase: 'generating' });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const recipes = await generateRecipes({ ingredients, excludeTitles });
      dispatch({ type: 'SET_RECIPES', recipes });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate recipes.';
      dispatch({ type: 'SET_ERROR', error: message });
      if (message.includes('No more unique') || message.includes('Only found')) {
        dispatch({ type: 'SET_CAN_REFRESH', canRefresh: false });
      }
    }
  }, []);

  const processImage = useCallback(
    async (imageUri: string) => {
      dispatch({ type: 'RESET_SESSION', imageUri });

      try {
        const ingredients = await analyzeIngredients(imageUri);
        dispatch({ type: 'SET_INGREDIENTS', ingredients });
        await runGeneration(ingredients, []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to analyze ingredients.';
        dispatch({ type: 'SET_ERROR', error: message });
      }
    },
    [runGeneration]
  );

  const refreshRecipes = useCallback(async () => {
    if (!state.ingredients.length || !state.canRefresh) return;

    dispatch({ type: 'SET_PHASE', phase: 'generating' });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const recipes = await generateRecipes({
        ingredients: state.ingredients,
        excludeTitles: state.excludedTitles,
      });
      dispatch({ type: 'SET_RECIPES', recipes });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh recipes.';
      dispatch({ type: 'SET_ERROR', error: message });
      if (message.includes('No more unique') || message.includes('Only found')) {
        dispatch({ type: 'SET_CAN_REFRESH', canRefresh: false });
      }
    }
  }, [state.ingredients, state.excludedTitles, state.canRefresh]);

  const getRecipeById = useCallback(
    (id: string) => state.recipes.find((recipe) => recipe.id === id),
    [state.recipes]
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hasApiKey,
      isLoading: state.phase !== 'idle',
      processImage,
      refreshRecipes,
      getRecipeById,
      clearError,
    }),
    [state, hasApiKey, processImage, refreshRecipes, getRecipeById, clearError]
  );

  return (
    <RecipePlannerContext.Provider value={value}>{children}</RecipePlannerContext.Provider>
  );
}

export function useRecipePlanner() {
  const context = useContext(RecipePlannerContext);
  if (!context) {
    throw new Error('useRecipePlanner must be used within RecipePlannerProvider');
  }
  return context;
}
