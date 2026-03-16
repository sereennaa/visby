/**
 * Centralized copy for empty states, buttons, errors, and success messages.
 * Use these keys in EmptyState, ErrorState, toasts, and forms for consistent tone.
 */
export const copy = {
  /** Empty state titles and subtitles */
  empty: {
    noStamps: {
      title: 'No stamps yet!',
      subtitle: "Add your first stamp from a place you've been — or explore the map to discover spots.",
    },
    noBites: {
      title: 'No bites yet!',
      subtitle: 'Log something yummy you tried — it helps you remember and share your food adventures.',
    },
    noActivityYet: {
      title: 'Your adventure is just beginning',
      subtitle: 'Go explore! Visit the map, collect a stamp, or start learning.',
    },
    noQuests: {
      title: 'No quests right now',
      subtitle: 'Check back soon or explore the world to unlock new quests.',
    },
    noFriends: {
      title: 'No friends yet',
      subtitle: 'Add friends to see their stamps and share your adventures.',
    },
    noDiscoveryLog: {
      title: 'Nothing discovered yet',
      subtitle: 'Explore countries and places to fill your discovery log.',
    },
    noInbox: {
      title: 'All caught up!',
      subtitle: "Your adventure is just beginning. Go explore!",
    },
    noWardrobe: {
      title: 'Your wardrobe is empty',
      subtitle: 'Visit the shop to find outfits and accessories for your Visby.',
    },
    noPlacesOnMap: {
      title: 'No places nearby yet',
      subtitle: 'Explore the world map or collect a stamp to see places here.',
    },
    noPlacesFound: {
      title: 'No places found',
      subtitleFilter: 'Try a different search or clear your filters.',
      subtitleCategory: 'Try selecting a different category above.',
    },
    adventureBegins: {
      title: 'Your Adventure Begins',
      subtitle: 'Collect stamps, log bites, and explore to see your stats here.',
    },
  },

  /** Treasure Hunt: picker, modes, wrong tap, reveal, completion, buttons */
  treasureHunt: {
    title: 'Treasure Hunt',
    taglineRoom: 'Find hidden treasures in rooms around the world.',
    taglineLocation: 'Match clues to real places.',
    modeRoom: 'Room Hunt',
    modeRoomDesc: 'Find items in a room using clues!',
    modeLocation: 'Location Hunt',
    modeLocationDesc: 'Match the clue to the right place — real photos from the country.',
    wrongTap: 'Not quite — use the clue!',
    revealNext: 'Next',
    revealFinish: 'Finish',
    completeRoom: 'All treasures found!',
    completeTitleFlawless: 'Flawless hunt!',
    completeTitleGreat: 'Treasure master!',
    completeTitleExplored: 'Well explored!',
    completeTimeLightning: 'Lightning fast!',
    completeTimePhrase: 'in {time}',
    completeLocation: 'All places matched!',
    revealVisbyLine: 'Visby spotted it too!',
    completeSubtitleRoom: 'You explored {roomName} in {countryName} and found every treasure.',
    completeSubtitleLocation: 'You matched every place in {countryName}.',
    exploreAnotherRoom: 'Explore another room',
    pickAnotherCountry: 'Pick another country',
    surpriseMe: 'Surprise me',
    back: 'Back',
    noCountriesLocation: 'No countries with enough locations for this mode. Try Room Hunt!',
    preparingHunt: 'Preparing your hunt…',
    missionRoom: 'Find {count} hidden treasures in {roomName}! Use the clues to discover each one.',
    missionLocation: 'Match {count} places in {countryName}! Read the clue and tap the right photo.',
    startHunt: 'Start hunt',
  },

  /** Generic UI copy */
  comingSoon: 'Coming soon',

  /** Primary action button labels */
  actions: {
    collectStamp: 'Collect a Stamp',
    addFirstStamp: 'Add your first stamp',
    logBite: 'Log a Bite',
    addFirstBite: 'Log your first bite',
    startLearning: 'Start Learning',
    exploreNearby: 'Explore nearby',
    seeAll: 'See all',
    tryAgain: 'Try again',
    playAgain: 'Play Again',
    goHome: 'Go to Home',
    addFriend: 'Add Friend',
    goToShop: 'Go to Shop',
    exploreWorld: 'Visit World',
    resetFilters: 'Reset filters',
  },

  /** Error messages (user-friendly) */
  errors: {
    generic: "Something went wrong. Please try again.",
    saveFailed: "Couldn't save — check your connection and try again.",
    loadFailed: "Couldn't load. Tap below to try again.",
    connection: "Check your connection and try again.",
    formValidation: {
      locationRequired: 'Please enter a location name.',
    },
  },

  /** Success messages (for toasts) */
  success: {
    stampCollected: 'Stamp collected!',
    biteLogged: 'Bite logged!',
    profileSaved: 'Profile saved!',
    friendRequestSent: 'Friend request sent!',
  },

  /** Profile screen: hero, sections, empty state, next level */
  profile: {
    heroGreeting: 'Your journey so far',
    levelTitleSubtitle: 'Every path starts with a single step',
    sections: {
      gameStats: {
        title: 'Game Stats',
        caption: 'Tiny victories, big heart',
      },
      skills: {
        title: 'Skills',
        caption: 'Your explorer soul',
        emptyHint: 'Complete lessons and explore to grow your skills.',
        cta: 'Start learning',
      },
      growthStage: {
        title: 'Growth Stage',
        caption: 'How far you\'ve grown',
      },
      menu: {
        title: 'More',
        caption: 'Settings, wardrobe, and more',
      },
    },
    emptyStats: {
      title: 'Your Adventure Begins',
      subtitle: 'Your first stamp is waiting out there. Explore the map, try a lesson, or log a bite!',
      cta: 'Explore the map',
    },
    nextLevelTease: 'Next: {title} at {aura} Aura',
    statNotYet: 'Not yet',
    streakKeepGoing: 'Keep exploring to maintain your streak',
    stageMaxReached: 'Max stage reached! You are legendary!',
    stageCarePointsToNext: '{count} more care points to become {stage}!',
  },
} as const;
