# 🧭 Visby

A gamified travel and learning app for kids: your customizable Viking explorer (Visby) collects stamps, discovers food, and learns about cultures. **Visit countries and buy houses**—then walk through them like Club Penguin, and learn fun facts while you're there!

![Visby Banner](./assets/banner.png)

## ✨ Features

### 🌍 Visit Countries & Buy Houses (Club Penguin style)
- **Pay Aura to visit** - Spend Aura to travel to a country (Japan, France, Mexico, Italy, UK, Brazil, and more)
- **Buy a house** - Save up Aura to buy a house in a country; then visit anytime for free
- **Walk through your spot** - Move your Visby around a room in that country (left/right walk controls)
- **Learn while you're there** - Tap fun-fact bubbles to read kid-friendly facts about culture, food, language, and nature

### 🗺️ Explore & Collect
- **Stamps** - Collect location-based stamps from cities, parks, beaches, landmarks, and more
- **GPS-verified** - Physical presence required for authentic stamps
- **Fast Travel** - Spend Aura to virtually visit places

### 🍜 Food Discovery
- **Bites** - Log and collect food experiences
- **Recipes** - Save recipes for dishes you've tried
- **Cuisine tracking** - See how many cuisines you've explored

### 📚 Learn
- **Mini lessons** - Language, culture, history, etiquette
- **Flashcards** - Quick review and practice
- **Quizzes** - Test your knowledge and earn Aura

### 🎮 Gamification
- **Aura (XP)** - Earn points for every activity
- **Levels** - Progress from Novice Explorer to Visby Legend
- **Badges** - Unlock achievements and cosmetics
- **Streaks** - Daily check-in bonuses

### 👤 Avatar System
- **Customizable Visby** - Your cute Viking explorer mascot
- **Cosmetics** - Hats, outfits, accessories, companions
- **Unlock rewards** - Earn cosmetics through gameplay

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL) - FREE tier
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **State**: Zustand
- **Navigation**: React Navigation
- **Animations**: React Native Reanimated
- **Location**: expo-location + Nominatim (free geocoding)

## 📱 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/visby.git
   cd visby
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Run the SQL from `DATABASE_SCHEMA.md` in the SQL editor
   - Copy your project URL and anon key

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start the app**
   ```bash
   npx expo start
   ```

6. **Run on device**
   - Scan QR code with Expo Go (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📁 Project Structure

```
visby/
├── App.tsx                 # Entry point
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── avatar/        # Visby character components
│   │   └── collectibles/  # Stamp, Bite, Badge cards
│   ├── screens/
│   │   ├── auth/          # Welcome, Login, SignUp
│   │   ├── home/          # Home dashboard
│   │   ├── explore/       # Map & location screens
│   │   ├── collections/   # Stamps, Bites lists
│   │   ├── learn/         # Learning & quiz screens
│   │   └── profile/       # Profile & settings
│   ├── navigation/        # React Navigation setup
│   ├── services/          # API & business logic
│   ├── store/             # Zustand global state
│   ├── config/            # Constants & configuration
│   ├── theme/             # Colors, typography, spacing
│   └── types/             # TypeScript definitions
├── assets/                # Images, fonts, icons
└── DATABASE_SCHEMA.md     # Supabase schema
```

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Wisteria | `#C7B8EA` | Primary |
| Honeydew | `#DFF5E1` | Success |
| Sky | `#CFE9F7` | Navigation |
| Cream | `#FAF9F6` | Background |
| Peach | `#FFD8A8` | Rewards |

### Typography
- **Headings**: Fredoka (Bold, SemiBold, Medium)
- **Body**: Quicksand (Medium, Bold, Regular)

### Style
- Soft gradients
- Rounded corners (16-32px radius)
- Gentle shadows
- Playful animations

## 🗺️ MVP Roadmap

### Phase 1: Core ✅
- [x] Project setup
- [x] Theme system
- [x] Auth screens
- [x] Basic navigation
- [x] Home screen
- [x] Visby character

### Phase 1.5: Visit World & Houses ✅
- [x] Country list (visit cost / buy house with Aura)
- [x] Pay Aura to visit a country
- [x] Buy house in a country (visit free after)
- [x] Walk-through room (move Visby left/right)
- [x] Learn facts while in the country (kid-friendly)

### Phase 2: Collections
- [ ] Stamp collection flow
- [ ] Location detection
- [ ] Photo upload
- [ ] Bite logging

### Phase 3: Learning
- [ ] Lesson content
- [ ] Quiz system
- [ ] Flashcards
- [ ] Progress tracking

### Phase 4: Gamification
- [ ] Aura transactions
- [ ] Level up system
- [ ] Badge checking
- [ ] Streak system

### Phase 5: Social
- [ ] Public profiles
- [ ] Feed/timeline
- [ ] Likes & comments
- [ ] Postcards

### Phase 6: Polish
- [ ] Avatar customization UI
- [ ] Settings screen
- [ ] Notifications
- [ ] App Store release

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 💜 Made with love for explorers everywhere

---

*"wanderlust, sunshine, fresh air, golden hour, moonlight, safe, hopeful, magical"*
