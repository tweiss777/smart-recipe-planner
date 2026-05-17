import { ThemeProvider, DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { RecipePlannerProvider } from '@/context/recipe-planner-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

const AvocadoLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const AvocadoDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <RecipePlannerProvider>
      <ThemeProvider value={colorScheme === 'dark' ? AvocadoDarkTheme : AvocadoLightTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="recipe/[id]"
            options={{
              title: 'Recipe',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RecipePlannerProvider>
  );
}
