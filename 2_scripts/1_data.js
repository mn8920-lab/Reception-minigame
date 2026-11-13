// 1_data.js — DATA layer: holds guest profiles, party sizes, and dialogue scripts

const HOTEL_CONFIG = {
  maxRooms: 10,
  startingRating: 5.0
};

const GUEST_QUEUE = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "🧳",
    partySize: 1,
    category: "single",
    rate: 120,
    arrivalLine: "Hi there! I just flew in for a solo conference trip and have a reservation under Rivera.",
    greetReplies: [
      { text: "Welcome to the Grand Lobby! How many will be staying with us?", polite: true },
      { text: "Name and headcount. Make it quick.", polite: false }
    ],
    partyLine: "It's just me—one guest for tonight.",
    angryReply: "Whoa, no need to snap at me! I'm just trying to check in."
  },
  {
    id: 2,
    name: "Maya & Sam Chen",
    avatar: "👫",
    partySize: 2,
    category: "duo",
    rate: 180,
    arrivalLine: "Good afternoon! We're celebrating our anniversary here this weekend.",
    greetReplies: [
      { text: "Happy anniversary! Welcome in—is it just the two of you boarding?", polite: true },
      { text: "Yeah, hi. How many people?", polite: false }
    ],
    partyLine: "Yes, just the two of us!",
    angryReply: "Well, that's a chilly welcome for our anniversary..."
  },
  {
    id: 3,
    name: "The Miller Family",
    avatar: "👨‍👩‍👧‍👦",
    partySize: 4,
    category: "multi",
    rate: 260,
    arrivalLine: "Hello! Long road trip with the kids—we're ready to get settled in.",
    greetReplies: [
      { text: "Welcome to the Grand Lobby! How many guests are in your group today?", polite: true },
      { text: "Keep the kids quiet and tell me how many beds you need.", polite: false }
    ],
    partyLine: "There are four of us altogether—two adults and two kids.",
    angryReply: "Excuse me? We're paying guests, not a nuisance!"
  }
];
