# Smart Recipe Planner

A cross-platform mobile app built with [Expo](https://expo.dev) and React Native. Take a photo of ingredients, and the app uses OpenAI Vision to detect what you have, then suggests five structured recipes you can make. Refresh for five more unique recipes, or tap any recipe for full ingredients and step-by-step instructions.

## Features

- **Photo-based ingredient detection** — use your camera or photo library
- **AI-powered recipe suggestions** — five recipes per batch, tailored to detected ingredients
- **Non-repeating refresh** — “Show 5 more recipes” avoids titles you have already seen
- **Structured recipe detail** — prep/cook time, servings, ingredient list, and numbered steps (not a chat UI)
- **Avocado-themed UI** — light and dark mode support

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (included with Node) or [Yarn](https://yarnpkg.com/)
- An [OpenAI API key](https://platform.openai.com/api-keys) with access to `gpt-4o-mini`
- For **iOS**: macOS with [Xcode](https://developer.apple.com/xcode/) (simulator or physical device)
- For **Android**: [Android Studio](https://developer.android.com/studio) with an emulator or a physical device with USB debugging
- For **mobile testing**: [Expo Go](https://expo.dev/go) on your phone, or a [development build](https://docs.expo.dev/develop/development-builds/introduction/) for full camera permission support

## Environment variables

Create a `.env` file in the project root (you can copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | Yes | Your OpenAI API key. Used for ingredient vision analysis and recipe generation. |

Example `.env`:

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

**Important:** Variables prefixed with `EXPO_PUBLIC_` are embedded in the app bundle and are visible to anyone who inspects the client. This is fine for local development and demos; for production, proxy OpenAI requests through your own backend.

After changing `.env`, restart the Expo dev server (`npx expo start`).

## Installation

```bash
git clone <your-repo-url>
cd expo-demo
npm install
```

## Run locally (development server)

Start the Metro bundler:

```bash
npx expo start
```

From the terminal UI you can press:

- `w` — open **web**
- `i` — open **iOS** simulator (macOS only)
- `a` — open **Android** emulator
- Scan the QR code — open on a **physical device** with Expo Go

Or use the npm scripts:

```bash
npm run web      # expo start --web
npm run ios      # expo start --ios
npm run android  # expo start --android
```

---

## Web

1. Complete [Installation](#installation) and [Environment variables](#environment-variables).
2. Run:

   ```bash
   npm run web
   ```

   Or `npx expo start` and press `w`.

3. The app opens in your browser (default: `http://localhost:8081`).

**Notes for web:**

- Use **Choose from Library** to pick an ingredient photo; camera capture depends on browser support.
- You need a valid `EXPO_PUBLIC_OPENAI_API_KEY` and network access to OpenAI.

---

## iOS

### Simulator (macOS + Xcode)

1. Install Xcode from the Mac App Store and open it once to accept the license.
2. Install dependencies and configure `.env` as above.
3. Run:

   ```bash
   npm run ios
   ```

   Or `npx expo start` and press `i`.

The iOS Simulator launches with the app installed via Expo Go or your dev client.

### Physical iPhone

1. Install **Expo Go** from the App Store.
2. On your Mac, run `npx expo start`.
3. Ensure phone and computer are on the same Wi‑Fi network.
4. Scan the QR code in the terminal with the Camera app (or Expo Go).

**Camera permissions:** The first time you tap **Take Photo**, allow camera access. If you use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) instead of Expo Go, create one after adding the `expo-image-picker` plugin:

```bash
npx expo run:ios
```

---

## Android

### Emulator

1. Install [Android Studio](https://developer.android.com/studio).
2. Open **Device Manager** and create a virtual device (e.g. Pixel 6, API 34).
3. Start the emulator.
4. Run:

   ```bash
   npm run android
   ```

   Or `npx expo start` and press `a`.

### Physical Android device

1. Enable **Developer options** and **USB debugging** on the device.
2. Install **Expo Go** from Google Play.
3. Run `npx expo start` on your computer.
4. Scan the QR code with Expo Go (same Wi‑Fi as your computer).

For a development build with native camera permissions:

```bash
npx expo run:android
```

---

## How to use the app

1. Open the app and confirm your API key is configured (a banner appears if it is missing).
2. Tap **Take Photo** or **Choose from Library** and select a picture of your ingredients.
3. Wait while the app analyzes the image, then generates five recipes.
4. Review the recipe cards; tap one to see full details.
5. Tap **Show 5 more recipes** to load another batch (no duplicate titles from earlier batches).
6. Take a new photo anytime to start over with a fresh ingredient set.

## Project structure

```
app/
  index.tsx           # Home screen (capture, list, refresh)
  recipe/[id].tsx     # Recipe detail screen
components/           # UI components (capture, cards, loading, etc.)
context/              # Recipe planner state (React Context + reducer)
services/             # OpenAI integration (vision + recipe generation)
types/                # TypeScript interfaces
lib/schemas/          # Zod validation for API responses
```

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- [expo-image-picker](https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/) — camera and gallery
- [expo-file-system](https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/) — read images for the Vision API
- OpenAI `gpt-4o-mini` — ingredient detection and structured recipe JSON
- TypeScript, React 19, React Native

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run web` | Start and open web |
| `npm run ios` | Start and open iOS simulator |
| `npm run android` | Start and open Android emulator |
| `npm run lint` | Run ESLint |

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| “Missing EXPO_PUBLIC_OPENAI_API_KEY” | Add the key to `.env` and restart `npx expo start`. |
| OpenAI errors (401, 429) | Verify the key, billing, and rate limits in the [OpenAI dashboard](https://platform.openai.com/). |
| Camera / photos not working | Grant permissions in system Settings; on device, prefer a dev build (`npx expo run:ios` / `run:android`). |
| Expo Go can’t connect | Same Wi‑Fi; try `npx expo start --tunnel`. |
| Web can’t use camera | Use **Choose from Library** instead. |

## License

Private project — add your license here if you open-source the repo.
