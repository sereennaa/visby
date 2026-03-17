// Visby App Widget: reads widget_data from SharedPreferences and updates the widget view.
// Add this and the layout XML to your Android app; register the provider in AndroidManifest.xml.

package com.yourapp.visby  // CHANGE to your package

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONObject

class VisbyWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (id in appWidgetIds) {
            updateWidget(context, appWidgetManager, id)
        }
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        val prefs = context.getSharedPreferences(WidgetBridgeModule.PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(WidgetBridgeModule.KEY_DATA, null)
        val views = RemoteViews(context.packageName, R.layout.visby_widget)
        if (json != null) {
            try {
                val p = JSONObject(json)
                val name = p.optString("visbyName", "Visby")
                val mood = p.optString("mood", "happy")
                val label = moodToLabel(mood)
                views.setTextViewText(R.id.widget_mood, label)
                views.setTextViewText(R.id.widget_name, name)
                val needs = p.getJSONObject("needs")
                setProgress(views, R.id.bar_hunger, needs.optInt("hunger", 80))
                setProgress(views, R.id.bar_happiness, needs.optInt("happiness", 80))
                setProgress(views, R.id.bar_energy, needs.optInt("energy", 80))
                setProgress(views, R.id.bar_knowledge, needs.optInt("knowledge", 50))
                setProgress(views, R.id.bar_social, needs.optInt("socialBattery", 80))
                val alert = p.optString("alertLine", null)
                if (!alert.isNullOrEmpty()) {
                    views.setTextViewText(R.id.widget_alert, alert)
                    views.setViewVisibility(R.id.widget_alert, android.view.View.VISIBLE)
                } else {
                    views.setViewVisibility(R.id.widget_alert, android.view.View.GONE)
                }
            } catch (_: Exception) { }
        }
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName) ?: return
        val pending = PendingIntent.getActivity(context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        views.setOnClickPendingIntent(R.id.widget_root, pending)
        appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    private fun moodToLabel(mood: String): String = when (mood) {
        "happy" -> "Happy"
        "excited" -> "Excited"
        "sleepy" -> "Sleepy"
        "hungry" -> "Hungry"
        "bored" -> "Bored"
        "lonely" -> "Lonely"
        "sick" -> "Sick"
        "confused" -> "Confused"
        else -> "Happy"
    }

    private fun setProgress(views: RemoteViews, id: Int, value: Int) {
        views.setInt(id, "setProgress", value.coerceIn(0, 100))
    }
}
