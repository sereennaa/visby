/**
 * Centralized copy for empty states, buttons, errors, and success messages.
 * Use these keys in EmptyState, ErrorState, toasts, and forms for consistent tone.
 */
export const copy = {
  /** Stamps = dreamy travel passport (whimsical, stunning tone) */
  stamps: {
    definition: "Your journey through the world—stamps earned by learning and exploring.",
    emptyTitle: 'Start your journey',
    emptySubtitle: "Learn about countries to earn stamps, or log a place you've visited in real life!",
    mapHint: 'Find a place you visited and log it to your passport.',
    samplePlacesNotice: 'Places you can visit. Tap one to log your visit.',
    collectScreenTitle: 'Log a Visit',
    collectScreenSubtitle: 'Record a place you visited',
    youAreAdding: 'This place is waiting for you',
    youAreHere: 'You are here',
    giveItAName: 'Give it a name',
    giveItANamePlaceholder: 'e.g. Secret garden, Sunset beach…',
    whatKindOfPlace: 'What kind of place?',
    captureTheMoment: 'Capture the moment',
    addAPhoto: 'Add a photo',
    notesPlaceholder: 'What makes this place magical?',
    addToPassportCta: 'Log visit',
    addPlaceCta: 'Log this place',
    successTitle: "Visit logged!",
    successFirstStamp: 'Your very first visit—how exciting!',
    successCountrySet: "You've completed the {country} set—stunning!",
    successKeepDreaming: 'Keep exploring',
    successAura: '+{aura} Aura',
  },

  /** Empty state titles and subtitles */
  empty: {
    noStamps: {
      title: 'Start your journey',
      subtitle: "Learn about countries to earn stamps, or log places you've visited!",
    },
    noBites: {
      title: 'Your Taste Atlas is empty',
      subtitle: 'Discover dishes from around the world to learn food stories, recipes, and culture.',
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
      title: 'Your Visby\'s closet is waiting for adventure',
      subtitle: 'Find outfits and accessories in the Shop to make your Visby one of a kind.',
    },
    noWardrobeOutfit: {
      title: 'No outfits yet',
      subtitle: 'Your first outfit is in the Shop — grab something cozy or bold and come back to dress up your Visby.',
    },
    noWardrobeHat: {
      title: 'No hats yet',
      subtitle: 'Find crowns, helmets, and more in the Shop to top off your Visby\'s look.',
    },
    noWardrobeShoes: {
      title: 'No shoes yet',
      subtitle: 'From sandals to moon boots — the Shop has the perfect pair for every adventure.',
    },
    noWardrobeBackpack: {
      title: 'No packs yet',
      subtitle: 'Backpacks, satchels, and jetpacks await in the Shop. Your Visby deserves a great bag!',
    },
    noWardrobeAccessory: {
      title: 'No accessories yet',
      subtitle: 'Swords, scarves, wands, and more — discover fun items in the Shop.',
    },
    noWardrobeCompanion: {
      title: 'No pets yet',
      subtitle: 'Find a furry (or scaly) friend in the Shop to join your Visby on every journey.',
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
      subtitle: 'Collect stamps, discover dishes, and explore to see your stats here.',
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
    collectStamp: 'Log a visit',
    addFirstStamp: 'Start learning',
    logBite: 'Discover a Dish',
    addFirstBite: 'Discover your first dish',
    startLearning: 'Start Learning',
    exploreNearby: 'Explore nearby',
    exploreMap: 'Explore map',
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
    stampCollected: 'Another piece of the world, saved.',
    biteLogged: 'Dish discovered!',
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
        tapHint: 'Tap a skill to see how to improve',
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
      subtitle: 'Your first stamp is waiting out there. Add a place from the map, try a lesson, or discover a dish!',
      cta: 'Explore the map',
    },
    nextLevelTease: 'Next: {title} at {aura} Aura',
    statNotYet: 'Not yet',
    streakKeepGoing: 'Keep exploring to maintain your streak',
    stageMaxReached: 'Max stage reached! You are legendary!',
    stageCarePointsToNext: '{count} more care points to become {stage}!',
    skillDetail: {
      yourScore: 'Your score',
      howToImprove: 'How to improve',
      whatsNext: "What's next",
      actionsTitle: 'Actions to do next',
      nextMilestone: 'Reach {next} for your next milestone.',
      keepGoing: "You're at {score} — try one more activity to level up.",
      maxScore: "You've maxed this skill! Keep playing to stay sharp.",
    },
  },
} as const;
