// 1_data.js — DATA layer: holds 7-day shift schedule and 10 varied-temper customer profiles

const HOTEL_CONFIG = {
  totalDays: 7,
  startingRating: 5.0,
  // Guest count grows across all 7 days: Day 1 (3) -> Day 7 (10)
  guestsPerDay: [3, 4, 5, 6, 7, 8, 10]
};

const GUEST_QUEUE = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "🧳",
    temper: "Calm",
    partySize: 1,
    category: "single",
    rate: 120,
    arrivalLine: "Hi there! Just flew in for a solo conference trip. Reservation is under Rivera.",
    greetReplies: [
      { text: "Welcome to the Grand Lounge! Let's get you settled—just one guest tonight?", polite: true },
      { text: "ID and headcount. Keep the line moving.", polite: false }
    ],
    partyLine: "Yep, just me—one guest for tonight.",
    angryReply: "Whoa, rough day? No need to snap—I'm just checking in."
  },
  {
    id: 2,
    name: "Maya & Sam Chen",
    avatar: "👫",
    temper: "Cheerful",
    partySize: 2,
    category: "duo",
    rate: 180,
    arrivalLine: "Good afternoon! We're celebrating our anniversary on a coastal road trip!",
    greetReplies: [
      { text: "Happy anniversary! We're thrilled to host you two—is it a duo stay?", polite: true },
      { text: "Great, congrats. How many beds do you actually need?", polite: false }
    ],
    partyLine: "Yes, just the two of us!",
    angryReply: "Ouch, that's a pretty cold welcome for our anniversary..."
  },
  {
    id: 3,
    name: "Marcus Vance",
    avatar: "😤",
    temper: "Impatient",
    partySize: 1,
    category: "single",
    rate: 130,
    arrivalLine: "Look, my flight was delayed three hours and I have a call in ten minutes. Is my room ready?",
    greetReplies: [
      { text: "I hear you—travel delays are exhausting. I'll make this fast: just you tonight?", polite: true },
      { text: "Not my fault your flight was late. Wait your turn like everyone else.", polite: false }
    ],
    partyLine: "Thank you for moving quick. Yes, single traveler—just me.",
    angryReply: "Unbelievable attitude! I'm still taking the room, so hurry it up."
  },
  {
    id: 4,
    name: "The Miller Family",
    avatar: "👨‍👩‍👧‍👦",
    temper: "Frazzled",
    partySize: 4,
    category: "multi",
    rate: 260,
    arrivalLine: "Whew! Six hours in the minivan with two hungry kids—please tell me you have space!",
    greetReplies: [
      { text: "Take a breath, you made it! Welcome in—how many guests are in your family group?", polite: true },
      { text: "Keep the kids quiet in the lounge and tell me how many people.", polite: false }
    ],
    partyLine: "You're a lifesaver! There are four of us altogether.",
    angryReply: "Excuse me?! We're paying guests, not a nuisance!"
  },
  {
    id: 5,
    name: "Evelyn Sterling",
    avatar: "🧐",
    temper: "Picky",
    partySize: 1,
    category: "single",
    rate: 140,
    arrivalLine: "Good evening. I specifically requested a quiet room away from the elevator.",
    greetReplies: [
      { text: "Of course, Ms. Sterling—we'll set you up in a quiet wing. Boarding solo tonight?", polite: true },
      { text: "You get whatever room is open on my clipboard. One person?", polite: false }
    ],
    partyLine: "How thoughtful. Yes, it is only myself.",
    angryReply: "Charming customer service. Just put down one guest and give me the key."
  },
  {
    id: 6,
    name: "Devon & Tariq",
    avatar: "🎸",
    temper: "Tired",
    partySize: 2,
    category: "duo",
    rate: 175,
    arrivalLine: "Hey... we just finished a late gig two towns over and need to crash.",
    greetReplies: [
      { text: "Welcome in! Sounds like a long night—is it just the two of you checking in?", polite: true },
      { text: "No loud music in the rooms. How many people?", polite: false }
    ],
    partyLine: "Appreciate it! Yeah, just the two of us.",
    angryReply: "Man, we didn't even unpack yet. Just two guests."
  },
  {
    id: 7,
    name: "Arthur Pendelton",
    avatar: "😠",
    temper: "Grumpy",
    partySize: 2,
    category: "duo",
    rate: 190,
    arrivalLine: "Your parking lot signage is terrible! I nearly missed the turnoff in the dark.",
    greetReplies: [
      { text: "I'm sorry about the signage—glad you arrived safely! Is it two guests tonight?", polite: true },
      { text: "Everyone else found the driveway fine. How many in your party?", polite: false }
    ],
    partyLine: "Hmph. Well, at least someone here is polite. Two of us—my wife and I.",
    angryReply: "Don't smart-talk me! Mark down two guests before I call corporate."
  },
  {
    id: 8,
    name: "Coach Morales & Crew",
    avatar: "🏀",
    temper: "Rowdy",
    partySize: 5,
    category: "multi",
    rate: 290,
    arrivalLine: "Evening! Tournament bus just pulled in—we're ready to drop bags and grab dinner!",
    greetReplies: [
      { text: "Welcome team! Good luck at the tournament—how many guests are in your group?", polite: true },
      { text: "Whoa, slow down. Don't crowd my desk. Headcount?", polite: false }
    ],
    partyLine: "Thanks! Five of us in this group.",
    angryReply: "Hey, no need to bark at us—we're five guests total."
  },
  {
    id: 9,
    name: "Sonia & Leo",
    avatar: "🌧️",
    temper: "Stressed",
    partySize: 2,
    category: "duo",
    rate: 185,
    arrivalLine: "Our car overheated on the highway and we got soaked waiting for the tow truck...",
    greetReplies: [
      { text: "Oh no, let's get you two warm and dry right away! Just the two of you tonight?", polite: true },
      { text: "Don't drip water on the lounge rug. How many people?", polite: false }
    ],
    partyLine: "Thank you so much for being so kind. Yes, just the two of us.",
    angryReply: "Seriously?! We're having the worst night and you care about the rug?!"
  },
  {
    id: 10,
    name: "Victor Kane",
    avatar: "🤬",
    temper: "Fiery",
    partySize: 3,
    category: "multi",
    rate: 250,
    arrivalLine: "I've been driving since 5 AM and my online booking glitched! Fix this right now!",
    greetReplies: [
      { text: "I completely understand why you're frustrated—I've got you covered. Three in your group?", polite: true },
      { text: "Lower your voice or take your business down the highway. How many?", polite: false }
    ],
    partyLine: "Alright... sorry for yelling. Yes, three of us total. Thanks for helping.",
    angryReply: "I'm furious, but I'm too tired to drive! Put down three guests and hand over the key!"
  }
];
