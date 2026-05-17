import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface IngredientCaptureProps {
  imageUri: string | null;
  isLoading: boolean;
  onImageSelected: (uri: string) => void;
}

export function IngredientCapture({ imageUri, isLoading, onImageSelected }: IngredientCaptureProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  async function pickImage(useCamera: boolean) {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        `Please allow ${useCamera ? 'camera' : 'photo library'} access in Settings to scan ingredients.`
      );
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          allowsEditing: true,
          aspect: [4, 3],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          allowsEditing: true,
          aspect: [4, 3],
        });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.preview,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={48} color={colors.muted} />
            <ThemedText style={[styles.placeholderText, { color: colors.muted }]}>
              Snap or choose a photo of your ingredients
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.buttons}>
        <CaptureButton
          label="Take Photo"
          icon="camera"
          colors={colors}
          disabled={isLoading}
          onPress={() => pickImage(true)}
        />
        <CaptureButton
          label="Choose from Library"
          icon="images"
          colors={colors}
          disabled={isLoading}
          outline
          onPress={() => pickImage(false)}
        />
      </View>
    </View>
  );
}

function CaptureButton({
  label,
  icon,
  colors,
  disabled,
  outline,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: (typeof Colors)['light'];
  disabled: boolean;
  outline?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline
          ? { backgroundColor: 'transparent', borderColor: colors.tint, borderWidth: 2 }
          : { backgroundColor: colors.tint },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Ionicons name={icon} size={20} color={outline ? colors.tint : '#FFFFFF'} />
      <ThemedText
        style={[styles.buttonText, { color: outline ? colors.tint : '#FFFFFF' }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  preview: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  placeholderText: {
    fontSize: 15,
    textAlign: 'center',
  },
  buttons: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
