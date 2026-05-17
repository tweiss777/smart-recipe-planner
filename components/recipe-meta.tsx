import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface RecipeMetaProps {
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  compact?: boolean;
}

export function RecipeMeta({ prepMinutes, cookMinutes, servings, compact }: RecipeMetaProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, compact && styles.compact]}>
      <MetaItem label="Prep" value={`${prepMinutes}m`} colors={colors} />
      <MetaItem label="Cook" value={`${cookMinutes}m`} colors={colors} />
      <MetaItem label="Serves" value={`${servings}`} colors={colors} />
    </View>
  );
}

function MetaItem({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <ThemedText style={[styles.label, { color: colors.muted }]}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  compact: {
    marginTop: 4,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
});
