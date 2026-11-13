// 2_scripts/2_rules.js — PROCESSING layer: manages check-in steps, rating, revenue, and Rooms 101-106

const gameState = {
  rating: HOTEL_CONFIG.startingRating,
  revenue: 0,
  currentGuestIndex: 0,
  step: "greet", // "greet" -> "clipboard" -> "key" -> "leaving" -> "shift-complete" | "game-over"
  isGameOver: false,
  rooms: HOTEL_CONFIG.roomNumbers.map((num) => ({
    number: num,
    status: "empty", // "empty" | "occupied" | "checkout"
    guest: null
  }))
};

function getCurrentGuest() {
  return GUEST_QUEUE[gameState.currentGuestIndex] || null;
}

function getOccupiedCount() {
  return gameState.rooms.filter((room) => room.status !== "empty").length;
}

function findEmptyRoom() {
  return gameState.rooms.find((room) => room.status === "empty") || null;
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
        message: "Too many upset guests tanked our motel rating! Your shift has ended.",
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
      statusText: "Step 3: Click 'Hand Over Room Key' to move guest into an open room."
    };
  } else {
    adjustRating(-0.4);
    if (gameState.isGameOver) {
      return {
        speaker: "Management",
        message: "Repeated check-in errors ruined our motel's reputation. Shift over!",
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

// Step 3: Hand over the room key and assign an open motel room (101-106)
function handleGiveKey() {
  const guest = getCurrentGuest();
  if (!guest || gameState.step !== "key") return null;

  const openRoom = findEmptyRoom();
  if (!openRoom) {
    return {
      speaker: "Front Desk Alert",
      message: "All 6 motel rooms are full! Click a green 'Check-Out' room on the left first.",
      statusText: "Motel Full (6/6)! Check out a green room on the left to free space."
    };
  }

  openRoom.status = "occupied";
  openRoom.guest = guest;
  gameState.step = "leaving";

  return {
    roomNumber: openRoom.number,
    speaker: guest.name,
    message: `Thanks! Heading left into Room ${openRoom.number} now.`,
    statusText: `${guest.name} moved into Room ${openRoom.number}!`
  };
}

// Mark a room ready for check-out after stay timer finishes
function markRoomReadyForCheckout(roomNumber) {
  const room = gameState.rooms.find((r) => r.number === roomNumber);
  if (!room || room.status !== "occupied") return false;
  room.status = "checkout";
  return true;
}

// Collect room payment and free the room when clicked
function handleRoomCheckout(roomNumber) {
  const room = gameState.rooms.find((r) => r.number === roomNumber);
  if (!room || room.status !== "checkout" || !room.guest) return null;

  const checkedOutGuest = room.guest;
  gameState.revenue += checkedOutGuest.rate;
  adjustRating(0.1);

  room.status = "empty";
  room.guest = null;

  return {
    roomNumber: room.number,
    guestName: checkedOutGuest.name,
    rate: checkedOutGuest.rate
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
