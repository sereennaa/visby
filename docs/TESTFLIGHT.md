# Build and push to TestFlight

You need an **Apple Developer account** ($99/year) and the app created in **App Store Connect** before TestFlight works.

## 1. Install EAS CLI and log in

```bash
npm install -g eas-cli
eas login
```

(Use your Expo account; create one at [expo.dev](https://expo.dev) if needed.)

## 2. Configure the project (first time only)

```bash
eas build:configure
```

This uses the existing `eas.json`. You can skip if you already have it.

## 3. Create the app in App Store Connect (first time only)

1. Go to [App Store Connect](https://appstoreconnect.apple.com) → **My Apps** → **+** → **New App**.
2. Choose **iOS**, name (e.g. **Visby**), primary language, bundle ID **com.visby.app** (must match `app.json`), SKU (e.g. `visby-ios`).
3. Create the app and note the **App ID** (numeric) from the app’s **App Information** page — you’ll use it when submitting.

## 4. Build for iOS (store)

From the project root:

```bash
eas build --platform ios --profile production
```

- Builds run in the cloud; you’ll get a link to the build page.
- First time: EAS will ask for Apple credentials (Apple ID, app-specific password, team) and set up certificates/provisioning.
- Wait for the build to finish (usually 10–20 minutes).

## 5. Submit the build to TestFlight

After the build succeeds:

```bash
eas submit --platform ios --latest --profile production
```

- `--latest` uses the most recent successful iOS build.
- You’ll be prompted for:
  - **Apple ID** (your developer account email)
  - **App-specific password** (create at [appleid.apple.com](https://appleid.apple.com) → Sign-In and Security → App-Specific Passwords)
  - **Asc App ID** (the numeric App ID from App Store Connect)
  - **Apple Team ID** (from [developer.apple.com/account](https://developer.apple.com/account) → Membership)

Alternatively, submit a specific build:

```bash
eas submit --platform ios --id BUILD_ID --profile production
```

(`BUILD_ID` is in the build URL or from `eas build:list`.)

## 6. In App Store Connect

- Open the app → **TestFlight**.
- After processing (a few minutes to an hour), the build appears under **iOS Builds**.
- Add **Internal** or **External** testers and send the invite.

## One-liner (build + submit)

Build, then submit the latest build:

```bash
eas build --platform ios --profile production --non-interactive && eas submit --platform ios --latest --profile production --non-interactive
```

Use `--non-interactive` only if credentials are already saved; otherwise run without it so EAS can prompt.

## Troubleshooting

- **“No builds found”**  
  Run a production iOS build first: `eas build --platform ios --profile production`.

- **Credentials / signing**  
  Run `eas credentials --platform ios` to manage certificates and provisioning profiles.

- **Bundle ID mismatch**  
  Ensure `app.json` → `expo.ios.bundleIdentifier` is exactly **com.visby.app** and matches the app in App Store Connect.

- **Build fails**  
  Check the build log in the Expo dashboard; fix any missing env vars or native config and rebuild.
