# Visby Home & Lock Screen Widgets

The app sends Visby’s mood, needs bars, and alerts (daily mission, adventure) to **home screen** and **lock screen** widgets. This folder contains the native code and setup instructions.

## What the widget shows

- **Visby** in its current mood/state (happy, sleepy, hungry, etc.)
- **Needs bars**: Food, Joy, Energy, Smarts, Social (0–100)
- **Alerts** when something is waiting:
  - Daily mission (e.g. “Collect 1 stamp”) — with completed state
  - Adventure of the day (visit + 2 facts + 1 game) — steps and completion

Tapping the widget opens the Visby app.

## How it works

1. **React Native** (this repo) builds a JSON payload from the Zustand store and calls the widget bridge whenever Visby, daily mission, or adventure state changes.
2. **Widget bridge** (native) writes that JSON to shared storage:
   - **iOS**: App Group `UserDefaults` so the Widget Extension can read it.
   - **Android**: `SharedPreferences` so the App Widget can read it.
3. **Widget** (native) reads the payload and draws the compact UI (mood, needs, alerts).

Data is also written to AsyncStorage under `@visby/widget_data` so you can inspect it; the native widget reads from the shared storage written by the bridge.

---

## Setup (after you have native projects)

You need `ios` and `android` folders (e.g. run `npx expo prebuild` once). Then add the following.

### iOS

1. **App Group**
   - In Xcode, select the **main app target** → Signing & Capabilities → + Capability → **App Groups**.
   - Add a group, e.g. `group.com.yourapp.visby` (replace with your bundle id base).
   - Note this identifier; the widget extension and the bridge must use the same one.

2. **Widget Extension**
   - File → New → Target → **Widget Extension** (e.g. name: `VisbyWidget`).
   - When prompted, leave “Include Configuration App Intent” unchecked if you don’t need it.
   - Add the **same App Group** to the widget extension target.

3. **Native bridge (main app writes to App Group)**
   - Add the `WidgetBridge` module so the JS side can write the payload:
     - Copy or adapt `widgets/ios/WidgetBridge/` into your `ios` project (e.g. as a new group and add the files to the main app target).
     - In Xcode, create a new **Swift file** (or use the one provided) that implements `@objc(WidgetBridge)` and `setWidgetData(_:)` and writes the string to `UserDefaults(suiteName: "group.com.yourapp.visby")?.set(jsonString, forKey: "widget_data")`.
   - Register the module in your `AppDelegate` (or via Expo modules) so `NativeModules.WidgetBridge` is available.

4. **Widget UI**
   - Replace the default widget Swift code with the contents of `widgets/ios/VisbyWidget/VisbyWidget.swift` (or merge the logic into your existing widget). Update the App Group suite name and bundle ids to match your project.

5. **Reload widget**
   - After writing new data, call `WidgetCenter.shared.reloadAllTimelines()` (or the appropriate reload API) from the bridge so the widget refreshes. The provided bridge code can do this after `setWidgetData`.

### Android

1. **Native bridge**
   - Add a module that implements `WidgetBridge.setWidgetData(String json)` and writes to `SharedPreferences`:
     - Use the application context: `getSharedPreferences("visby_widget", Context.MODE_PRIVATE).edit().putString("widget_data", json).apply()`.

2. **App Widget**
   - Add the widget provider and layout as in `widgets/android/`. The widget should read from the same `SharedPreferences("visby_widget")` key `"widget_data"`, parse the JSON, and display mood, needs, and alerts.

3. **Open app on tap**
   - Set the widget’s click intent to launch your main activity (e.g. `Intent(context, MainActivity::class.java)`).

---

## Files in this folder

- **ios/**  
  - Example Swift for the Widget Extension (Visby + needs + alerts).  
  - Example `WidgetBridge` implementation (write to App Group + reload widgets).
- **android/**  
  - `WidgetBridgeModule.kt` – React Native module: implement `setWidgetData(jsonString)` and write to `SharedPreferences("visby_widget")`. Register the module in your React Native package list so `NativeModules.WidgetBridge` is available.
  - `VisbyWidgetProvider.kt` – App Widget provider that reads from the same SharedPreferences and updates the widget.
  - `visby_widget_layout.xml`, `visby_widget_styles.xml`, `visby_progress_bar.xml`, `visby_widget_bg.xml` – Layout and drawables for the widget.
  - `visby_widget_info.xml` – App widget metadata (size, update interval). Reference from the manifest receiver as `android:resource="@xml/visby_widget_info"`.
  - In `AndroidManifest.xml` add:
    ```xml
    <receiver android:name=".VisbyWidgetProvider" android:exported="true">
      <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
      </intent-filter>
      <meta-data android:name="android.appwidget.provider" android:resource="@xml/visby_widget_info" />
    </receiver>
    ```
    Add a string resource `visby_widget_description` (e.g. "Your Visby's mood and needs") in `res/values/strings.xml`.

Use these as templates and adjust bundle IDs, App Group id, and package names to match your project.

---

## Optional: expo-widgets (SDK 55+)

When you upgrade to **Expo SDK 55+**, you can use the official **expo-widgets** and (on iOS) build the widget UI with React components. Until then, the native widget code above is the way to get home and lock screen widgets with the current payload.

---

## Testing without native widgets

The app still writes the payload to **AsyncStorage** under `@visby/widget_data`. You can read it in dev (e.g. via a small debug screen or `readWidgetData()` from `src/services/widgetData.ts`) to confirm mood, needs, daily mission, and adventure are correct. Native widgets will show the same data once the bridge and widget targets are set up.
