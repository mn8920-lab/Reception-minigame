// 2_rules.js — PROCESSING layer: manages game state, check-in steps, rating, and revenue

const gameState = {
  rating: HOTEL_CONFIG.startingRating,
  revenue: 0,
  occupiedRooms: 0,
  currentGuestIndex: 0,
  step: "greet", // "greet" -> "clipboard" -> "key" -> "leaving" -> "shift-complete" | "game-over"
  isGameOver: false
};

function getCurrentGuest() {
  return GUEST_QUEUE[gameState.currentGuestIndex] || null;
}

function adjustRating(delta) {
  gameState.rating = Math.max(0, Math.min(5.0, +(gameState.rating + delta).toFixed(1)));
  if (gameState.rating <= 1.0) {
    gameState.isGameOver = true;
    gameState.step = "game-over";
  }
}

// Step 1: Greet the customer using a dialogue option
function handleGreeting(isPolite) {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "greet") return null;

  if (isPolite) {
    gameState.step = "clipboard";
    return {
      speaker: guest.name,
      message: guest.partyLine,
      statusText: "Step 2: Mark the guest's party size on your clipboard."
    };
  } else {
    adjustRating(-1.5);
    if (gameState.isGameOver) {
      return {
        speaker: "Management",
        message: "Too many guests complained about rude service! Your hotel rating crashed and the lobby is closed.",
        statusText: "Shift Terminated — Rating too low."
      };
    }
    gameState.step = "clipboard";
    return {
      speaker: guest.name,
      message: `${guest.angryReply} ${guest.partyLine}`,
      statusText: "Careful! Rude service dropped your rating. Now mark their party size on the clipboard."
    };
  }
}

// Step 2 & 3: Mark Single, Duo, or Multi-group on the clipboard
function handleClipboardChoice(selectedCategory) {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "clipboard") return null;

  if (selectedCategory === guest.category) {
    gameState.step = "key";
    return {
      speaker: guest.name,
      message: "Great, that matches our reservation! Can we get our room key?",
      statusText: "Step 3: Hand over the room key to complete check-in."
    };
  } else {
    adjustRating(-0.5);
    if (gameState.isGameOver) {
      return {
        speaker: "Management",
        message: "Repeated check-in mistakes ruined the hotel's reputation. Shift over!",
        statusText: "Shift Terminated — Rating too low."
      };
    }
    return {
      speaker: guest.name,
      message: `Actually, that's the wrong room size for ${guest.partySize} ${guest.partySize === 1 ? "person" : "people"}. Could you double-check your clipboard?`,
      statusText: "Wrong category! Check their party size and try again."
    };
  }
}

// Step 4: Hand over the room key and send guest to their room on the left
function handleGiveKey() {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "key") return null;

  if (gameState.occupiedRooms >= HOTEL_CONFIG.maxRooms) {
    return {
      speaker: "Front Desk Alert",
      message: "The hotel is at full capacity! No rooms left to assign.",
      statusText: "Hotel Full (10/10 Rooms Occupied)."
    };
  }

  gameState.occupiedRooms += 1;
  gameState.revenue += guest.rate;
  adjustRating(0.2);
  gameState.step = "leaving";

  return {
    speaker: guest.name,
    message: "Thank you so much! Heading down the hall to our room on the left now.",
    statusText: `${guest.name} checked in (+$${guest.rate})! Heading to rooms on the left...`
  };
}

// Advance to the next arriving guest
function advanceToNextGuest() {
  gameState.currentGuestIndex += 1;
  const nextGuest = getCurrentGuest();

  if (!nextGuest) {
    gameState.step = "shift-complete";
    return null;
  }

  gameState.step = "greet";
  return nextGuest;
}
