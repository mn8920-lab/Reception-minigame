// 2_scripts/2_rules.js — PROCESSING layer: manages check-in steps, rating, revenue, and guest count

const gameState = {
  rating: HOTEL_CONFIG.startingRating,
  revenue: 0,
  checkedInCount: 0,
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

// Step 1: Greet the guest (calming reply eases tension; blunt reply upsets them)
function handleGreeting(isPolite) {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "greet") return null;

  if (isPolite) {
    adjustRating(0.1);
    gameState.step = "clipboard";
    return {
      speaker: guest.name,
      message: guest.partyLine,
      statusText: `Tension eased! (${guest.temper}) — Step 2: Mark party size on clipboard.`
    };
  } else {
    adjustRating(-1.2);
    if (gameState.isGameOver) {
      return {
        speaker: "Management",
        message: "Too many upset guests tanked our hotel rating! Your shift has ended.",
        statusText: "Shift Terminated — Rating dropped too low."
      };
    }
    gameState.step = "clipboard";
    return {
      speaker: guest.name,
      message: `${guest.angryReply} ${guest.partyLine}`,
      statusText: "Guest upset! Rating dropped. Mark party size on clipboard to finish check-in."
    };
  }
}

// Step 2: Verify Single, Duo, or Multi-group on the clipboard
function handleClipboardChoice(selectedCategory) {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "clipboard") return null;

  if (selectedCategory === guest.category) {
    gameState.step = "key";
    return {
      speaker: guest.name,
      message: "That matches our group size. Ready for our room key!",
      statusText: "Step 3: Click 'Hand Over Room Key' to finish check-in."
    };
  } else {
    adjustRating(-0.4);
    if (gameState.isGameOver) {
      return {
        speaker: "Management",
        message: "Repeated check-in errors ruined our hotel's reputation. Shift over!",
        statusText: "Shift Terminated — Rating dropped too low."
      };
    }
    return {
      speaker: guest.name,
      message: `Wrong room size for ${guest.partySize} ${guest.partySize === 1 ? "person" : "people"}. Check your clipboard again!`,
      statusText: "Wrong category! Pick the matching party size."
    };
  }
}

// Step 3: Hand over the room key so the guest heads left toward their room
function handleGiveKey() {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "key") return null;

  gameState.revenue += guest.rate;
  gameState.checkedInCount += 1;
  gameState.step = "leaving";

  return {
    speaker: guest.name,
    message: "Got our key—thank you! Heading down the hall to our room now.",
    statusText: `${guest.name} checked in (+$${guest.rate}) and headed to their room!`
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
