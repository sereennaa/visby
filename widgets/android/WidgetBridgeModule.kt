// WidgetBridge: Native module for the main app to write widget data for the Android App Widget.
// Register this module in your React Native / Expo native Android project so NativeModules.WidgetBridge is available.

package com.yourapp.visby  // CHANGE to your package

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.Intent
import android.appwidget.AppWidgetManager

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WidgetBridge"

    companion object {
        const val PREFS_NAME = "visby_widget"
        const val KEY_DATA = "widget_data"
    }

    @ReactMethod
    fun setWidgetData(jsonString: String) {
        reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_DATA, jsonString)
            .apply()
        // Notify widget to refresh
        val intent = Intent(reactApplicationContext, VisbyWidgetProvider::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        }
        reactApplicationContext.sendBroadcast(intent)
    }
}
