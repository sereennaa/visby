# Visby: Deep Plan to Be the Best Game Ever

A living roadmap to take Visby from “great learning + care companion” to a best-in-class game: sticky, social, deep, and delightful.

---

## North Star

**Visby = the game where kids (and curious adults) care for a creature, explore the world, learn by doing, and hang out with friends—all in one place.**

“Best game ever” means:
- **Daily habit** — Can’t wait to open the app (Visby, streaks, surprises, friends).
- **Real connection** — With Visby (memory, affirmations) and with other players (live presence, chat, co-op).
- **Meaningful learning** — Feels like play; progress is visible and rewarded.
- **World that breathes** — Seasons, events, story, “something new” often.
- **Polish that shows** — Onboarding, feedback, accessibility, and “wow” moments.

---

## Phase 1: Make It Stick (Retention & Daily Hook)

**Goal:** From “nice to open” to “have to open.”

| Initiative | What | Why |
|------------|------|-----|
| **Push notifications** | Streak reminder (“Don’t lose your 5-day streak!”), “Visby misses you,” “New lesson in Japan,” optional “Friend is online.” | Brings them back; industry standard for retention. |
| **Daily mission / quest** | One simple mission per day: “Collect 1 stamp,” “Play 1 mini-game,” “Chat with Visby,” “Read 2 country facts.” Reward: bonus Aura + “Mission complete!” moment. | Clear daily goal beyond check-in; small win every day. |
| **Streak recovery** | One “freeze” per month (or per streak tier): miss a day without losing the streak. Unlock via Aura or membership. | Reduces frustration; increases long-term retention. |
| **Surprise moments** | Random “Visby found a gift” (small Aura), “Double Aura hour” (short window), or “Friend left you a note” when they open the app. | Delight and unpredictability; shareable moments. |
| **Inbox that matters** | Turn Inbox into “activity + actions”: friend requests, “X visited your house,” “New badge unlocked,” “Mission ready.” Tap to jump to the right screen. | Makes Inbox a destination, not a dead tab. |

**Outcome:** Higher D1/D7/D30 retention, clear “reason to open today.”

---

## Phase 2: Make It Social (Live Presence & Place Chat)

**Goal:** “I’m in Paris with my Visby and I can see who else is here and chat.”

| Initiative | What | Why |
|------------|------|-----|
| **Friends on the backend** | Wire `friend_requests` and `friends` to Supabase; sync across devices; real send/accept/reject. | Friends today are demo-only; real social requires real data. |
| **Presence** | When user is in a country room (or place street), upsert `presence` (user_id, place_type, country_id, room_id, label). Use Supabase Realtime or polling to list “Who’s here.” | Foundation for “see your friends” and place chat. |
| **Place chat (Club Penguin–style)** | In CountryRoomScreen (and optionally PlaceStreetScreen): “Chat in [Room Name]” — send/receive messages in `place_chat_messages` (channel = room/place), show last N messages, input at bottom. | The “hang out and talk” moment; fills social battery. |
| **“Who’s here” strip** | In country room: “In this room: You, Alice, Bob.” Avatars or names; tap to open profile or invite to chat. | Makes the world feel alive; encourages return visits. |
| **Charge social battery in place chat** | When user sends a message in place chat (or is in a room with others), call `chargeSocialBattery(amount)`. | Ties social mechanics to Visby’s needs. |

**Outcome:** Real friends, live “who’s here,” and chat in the world—the core of “best game” socially.

---

## Phase 3: Make Learning a Journey (Path & Depth)

**Goal:** Learning feels like a path, not a menu.

| Initiative | What | Why |
|------------|------|-----|
| **Learning path / curriculum** | Define a sequence: e.g. “Welcome” → “Japan intro” → “Greetings” → “Japan room quiz” → “Food” → “Cooking game.” Unlock next step by completing previous (or by visiting the country). | Clear progression; “what to do next.” |
| **Link places to lessons** | E.g. “Complete ‘Greetings’ lesson to unlock the Greetings flashcard deck in Japan.” Or: country quiz only after N facts read in that country. | Learning and world exploration reinforce each other. |
| **Spaced repetition** | For flashcards (and optionally quiz): “Review” deck of due cards; next review date per card. | Better long-term retention; one more daily hook. |
| **Skill tree or long-term goals** | Visible “Language,” “Geography,” “Culture” (or per-country) progress; milestones and small rewards. | Big picture; sense of mastery. |
| **Difficulty / adaptation** | Quiz: easy / medium / hard by correctness; or “Practice mode” vs “Challenge mode” with different Aura. | Keeps challenge right for the player. |

**Outcome:** Learning has a path, is tied to the world, and has visible long-term progress.

---

## Phase 4: Make the World Breathe (Story, Events, Seasons)

**Goal:** “Something new” often; the world feels alive.

| Initiative | What | Why |
|------------|------|-----|
| **Light narrative** | Short story arc: “Visby wants to see the world with you.” Unlock story beats by visiting countries or hitting milestones. Optional: a “guide” character (NPC) in the world. | Emotional pull; “we’re on a journey.” |
| **Seasons / calendar** | Themed seasons (e.g. “Harvest,” “Winter Lights”): special cosmetics, furniture, or a seasonal country. Calendar highlights: real holidays, in-world “Visby Day.” | Fresh content; FOMO and comeback moments. |
| **Limited-time events** | “This week: double Aura in France,” “New mini-game: Word Hunt in Japan,” “Weekend challenge: collect 3 stamps.” | Urgency and variety. |
| **Discovery narrative in rooms** | “You discovered a new fact!” with a small animation; “Room complete” when facts + quiz + games done. | Room exploration feels like discovery. |

**Outcome:** World that changes over time; reasons to return and to share.

---

## Phase 5: Polish & Trust (Onboarding, Feedback, Accessibility)

**Goal:** First 10 minutes and every minute after feel intentional and inclusive.

| Initiative | What | Why |
|------------|------|-----|
| **Progressive onboarding** | After egg hatch: short “First stamp,” “First bite,” “First lesson,” “First chat with Visby” prompts with one-tap actions. Don’t dump everything at once. | Better activation and feature discovery. |
| **Empty states** | “No stamps yet — tap here to add your first!” with illustration and CTA. Same for bites, friends, badges. | Every screen has a next step. |
| **In-app feedback** | “Send feedback” in Settings or after key flows; optional screenshot + short text. Backend or email. | Improves product and shows you care. |
| **Accessibility pass** | Screen reader labels on all interactive elements; focus order; contrast and touch targets. Optional: reduce motion, font size. | Inclusive and store/compliance friendly. |
| **Error and edge cases** | Offline message, “Something went wrong” with retry, and clear “Demo mode” vs “Signed in” so behavior is predictable. | Trust and fewer support issues. |

**Outcome:** Higher activation, trust, and accessibility; fewer drop-offs.

---

## Phase 6: Sustainable Best Game (Monetization & Ops)

**Goal:** Best game that can run and improve for years.

| Initiative | What | Why |
|------------|------|-----|
| **IAP for Aura & membership** | Replace “Coming soon” with real purchases: Aura packs (one-time), optional membership (recurring) with perks (exclusive cosmetics, streak freeze, extra Aura). | Revenue to support content and servers. |
| **Analytics (privacy-first)** | Events: screen views, key actions (stamp, lesson, chat, place chat), retention, funnel (onboarding → first stamp → first lesson). No PII in events; comply with age/COPPA if needed. | Know what works; tune retention and economy. |
| **Remote config** | Aura rewards, mission definitions, “double Aura” windows, feature flags (e.g. place chat rollout). | Tune economy and run experiments without app release. |
| **Backend content (optional)** | Use `content.ts` (or similar) to load countries, lessons, quiz, cosmetics from Supabase so new content can ship without app update. | Faster content cadence; seasonal/event content. |
| **Moderation for place chat** | Profanity filter, report button, and optional moderation queue for place chat before going global. | Safe social is non-negotiable. |

**Outcome:** Revenue, data to improve, and ability to ship content and balance quickly.

---

## Optional Stretch (Differentiation)

- **Visby AI chat** — Replace or augment rule-based replies with a small LLM (e.g. your backend or partner API), same memory + affirmation personality; optional for cost/control.
- **Co-op activities** — “Play this quiz with a friend” or “Treasure hunt together in Japan”; shared Aura or badge. |
- **Sharing** — “Share your stamp card” or “Share your room” as image or link; optional referral reward.
- **AR / device features** — “Take a photo with your Visby” or “Visby in your room” for phones that support it; increases shareability and wow.

---

## How to Use This Plan

1. **Pick one phase** (e.g. Phase 2: Social) and one initiative (e.g. Friends on backend + place chat).
2. **Break it into 2–4 week milestones** (e.g. “Supabase friends CRUD” → “Presence upsert on room enter” → “Place chat UI + send” → “Who’s here strip”).
3. **Ship and measure** — Retention, time in app, “place chat messages per session,” etc.
4. **Then** add the next initiative (e.g. daily mission, or learning path) so the product compounds.

You already have: a full single-player loop, Visby with needs + social battery + check-in chat, friends UI + visit house, and a world with rooms, furniture, and learning. The plan above is how to keep going and make Visby the best game ever: **stickier, more social, deeper to learn, alive with story and events, polished and accessible, and sustainable.**

---

*Last updated from codebase exploration; adjust dates and priorities to your team and users.*
