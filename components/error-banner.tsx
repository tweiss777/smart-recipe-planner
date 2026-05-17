import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
      <ThemedText style={[styles.message, { color: colors.error }]}>{message}</ThemedText>
      {onDismiss ? (
        <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss error">
          <ThemedText style={[styles.dismiss, { color: colors.error }]}>Dismiss</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  dismiss: {
    fontSize: 14,
    fontWeight: '600',
  },
});
