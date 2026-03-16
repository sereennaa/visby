// WidgetBridge: Native module for the main app to write widget data to App Group.
// Add this file to your main app target (not the widget extension). Expose to React Native via a bridge or Expo module.

import Foundation
import WidgetKit

private let appGroupId = "group.com.yourapp.visby" // MUST match widget and entitlements

@objc(WidgetBridge)
class WidgetBridge: NSObject {

    @objc static func requiresMainQueueSetup() -> Bool { false }

    @objc func setWidgetData(_ jsonString: String) {
        guard let defaults = UserDefaults(suiteName: appGroupId) else { return }
        defaults.set(jsonString, forKey: "widget_data")
        defaults.synchronize()
        reloadWidgets()
    }

    private func reloadWidgets() {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
}
