// Visby Home & Lock Screen Widget (iOS)
// Add this to your Widget Extension target. Use the same App Group as the main app.

import WidgetKit
import SwiftUI

// MARK: - Data model (must match JS WidgetPayload)

struct WidgetNeeds: Codable {
    let hunger: Int
    let happiness: Int
    let energy: Int
    let knowledge: Int
    let socialBattery: Int
}

struct WidgetDailyMission: Codable {
    let label: String
    let completed: Bool
    let progress: Int
    let target: Int
}

struct WidgetAdventure: Codable {
    let step1: Bool
    let step2: Bool
    let step3: Bool
    let completed: Bool
    let rewardAura: Int
}

struct WidgetPayload: Codable {
    let visbyName: String
    let mood: String
    let needs: WidgetNeeds
    let growthStage: String
    let dailyMission: WidgetDailyMission?
    let adventure: WidgetAdventure
    let alertLine: String?
    let updatedAt: String
}

// MARK: - Load from App Group

let appGroupId = "group.com.yourapp.visby" // CHANGE to your App Group id

func loadWidgetPayload() -> WidgetPayload? {
    guard let defaults = UserDefaults(suiteName: appGroupId),
          let data = defaults.string(forKey: "widget_data")?.data(using: .utf8) else { return nil }
    return try? JSONDecoder().decode(WidgetPayload.self, from: data)
}

// MARK: - Mood to SF Symbol

func moodSFSymbol(_ mood: String) -> String {
    switch mood {
    case "happy": return "face.smiling"
    case "excited": return "star.fill"
    case "sleepy": return "moon.zzz.fill"
    case "hungry": return "fork.knife"
    case "bored": return "ellipsis.circle"
    case "lonely": return "heart"
    case "sick": return "cross.case"
    case "confused": return "questionmark.circle"
    case "curious", "proud", "adventurous", "cozy": return "sparkles"
    default: return "face.smiling"
    }
}

// MARK: - Need bar view

struct NeedBar: View {
    let value: Int
    let color: Color
    var body: some View {
        GeometryReader { g in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 2)
                    .fill(color.opacity(0.25))
                    .frame(height: 4)
                RoundedRectangle(cornerRadius: 2)
                    .fill(color)
                    .frame(width: max(0, g.size.width * CGFloat(value) / 100), height: 4)
            }
        }
        .frame(height: 4)
    }
}

// MARK: - Widget views

struct VisbyWidgetEntry: TimelineEntry {
    let date: Date
    let payload: WidgetPayload?
}

struct VisbyWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> VisbyWidgetEntry {
        VisbyWidgetEntry(date: Date(), payload: nil)
    }
    func getSnapshot(in context: Context, completion: @escaping (VisbyWidgetEntry) -> ()) {
        completion(VisbyWidgetEntry(date: Date(), payload: loadWidgetPayload()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<VisbyWidgetEntry>) -> ()) {
        let payload = loadWidgetPayload()
        let entry = VisbyWidgetEntry(date: Date(), payload: payload)
        let next = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}

struct VisbyWidgetView: View {
    var entry: VisbyWidgetEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        if let p = entry.payload {
            content(payload: p)
        } else {
            placeholderView
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Visby")
                .font(.headline)
            Text("Open the app to see your buddy")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }

    private func content(payload: WidgetPayload) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Image(systemName: moodSFSymbol(payload.mood))
                    .font(family == .systemSmall ? .title2 : .title)
                    .foregroundColor(.purple)
                Text(payload.visbyName)
                    .font(.headline)
                Spacer()
            }
            needsBars(payload.needs)
            if let alert = payload.alertLine, !alert.isEmpty {
                Text(alert)
                    .font(.caption2)
                    .foregroundColor(.orange)
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .widgetURL(URL(string: "visby://home"))
    }

    private func needsBars(_ n: WidgetNeeds) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            NeedBar(value: n.hunger, color: Color(red: 0.98, green: 0.76, blue: 0.68))
            NeedBar(value: n.happiness, color: Color(red: 0.98, green: 0.47, blue: 0.45))
            NeedBar(value: n.energy, color: Color(red: 0.4, green: 0.7, blue: 0.95))
            NeedBar(value: n.knowledge, color: Color(red: 0.58, green: 0.45, blue: 0.78))
            NeedBar(value: n.socialBattery, color: Color(red: 0.95, green: 0.5, blue: 0.6))
        }
    }
}

// Lock screen (compact)

struct VisbyLockScreenView: View {
    var entry: VisbyWidgetEntry
    var body: some View {
        if let p = entry.payload {
            VStack(alignment: .leading, spacing: 2) {
                Text(moodDisplay(p.mood) + " " + p.visbyName)
                    .font(.caption)
                if let alert = p.alertLine {
                    Text(alert)
                        .font(.caption2)
                        .foregroundColor(.orange)
                }
            }
            .widgetURL(URL(string: "visby://home"))
        } else {
            Text("Visby")
                .font(.caption)
                .widgetURL(URL(string: "visby://home"))
        }
    }
}

// MARK: - Widget definitions (Home + Lock Screen)

struct VisbyHomeWidget: Widget {
    let kind = "VisbyWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VisbyWidgetProvider()) { entry in
            VisbyWidgetView(entry: entry)
        }
        .configurationDisplayName("Visby")
        .description("Your Visby's mood, needs, and daily mission.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct VisbyLockScreenWidget: Widget {
    let kind = "VisbyLockScreen"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VisbyWidgetProvider()) { entry in
            VisbyLockScreenView(entry: entry)
        }
        .configurationDisplayName("Visby")
        .description("Quick glance at your buddy and alerts.")
        .supportedFamilies([.accessoryRectangular, .accessoryCircular])
    }
}

@main
struct VisbyWidgetBundle: WidgetBundle {
    var body: some Widget {
        VisbyHomeWidget()
        VisbyLockScreenWidget()
    }
}

// MARK: - Preview

#Preview {
    VisbyWidgetView(entry: VisbyWidgetEntry(date: Date(), payload: nil))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
}
