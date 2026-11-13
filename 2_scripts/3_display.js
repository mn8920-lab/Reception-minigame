// 2_scripts/3_display.js — PRESENTATION layer: renders HUD, Rooms 101-106, dialogue, and walk-in motion

function renderHud() {
  const ratingEl = document.getElementById("hotel-rating");
  const revenueEl = document.getElementById("hotel-revenue");
  const capacityEl = document.getElementById("hotel-capacity");

  const fullStars = "★".repeat(Math.round(gameState.rating));
  const emptyStars = "☆".repeat(Math.max(0, 5 - Math.round(gameState.rating)));
  ratingEl.textContent = `${fullStars}${emptyStars} (${gameState.rating.toFixed(1)})`;
  revenueEl.textContent = `$${gameState.revenue}`;
  capacityEl.textContent = `${getOccupiedCount()} / ${HOTEL_CONFIG.totalRooms}`;
}

function renderRooms() {
  const hallwayEl = document.getElementById("room-hallway");
  hallwayEl.innerHTML = "";

  gameState.rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.setAttribute("data-status", room.status);

    let occupantIcon = "🛏️";
    let statusLabel = "Open";

    if (room.status === "occupied" && room.guest) {
      occupantIcon = room.guest.avatar;
      statusLabel = room.guest.name.split(" ")[0];
    } else if (room.status === "checkout" && room.guest) {
      occupantIcon = "🛎️";
      statusLabel = `Check-Out $${room.guest.rate}`;
      card.addEventListener("click", () => onRoomCheckoutClick(room.number));
    }

    card.innerHTML = `
      <div class="room-number">Room ${room.number}</div>
      <div class="room-occupant">${occupantIcon}</div>
      <div class="room-label">${statusLabel}</div>
    `;

    hallwayEl.appendChild(card);
  });
}

function setControlsForStep(step) {
  const partyButtons = document.querySelectorAll(".btn-party");
  const keyButton = document.getElementById("btn-give-key");

  partyButtons.forEach((btn) => {
    btn.disabled = step !== "clipboard";
  });

  keyButton.disabled = step !== "key";
}

function renderGuestArrival(guest) {
  const figureEl = document.getElementById("guest-figure");
  const avatarEl = document.getElementById("guest-avatar");
  const nameEl = document.getElementById("guest-name");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  figureEl.setAttribute("data-state", "entering");
  avatarEl.textContent = guest.avatar;
  nameEl.textContent = `${guest.name} (${guest.temper})`;
  dialogueTextEl.textContent = `${guest.name}: "${guest.arrivalLine}"`;
  statusEl.textContent = "Step 1: Choose a response to ease their tension or push back.";

  optionsEl.innerHTML = "";
  guest.greetReplies.forEach((reply) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-dialogue";
    btn.textContent = `"${reply.text}"`;
    btn.addEventListener("click", () => onGreetClick(reply.polite));
    optionsEl.appendChild(btn);
  });

  setControlsForStep("greet");
  renderRooms();
  renderHud();
}

function renderDialogueResponse(result) {
  if (!result) return;

  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  dialogueTextEl.textContent = `${result.speaker}: "${result.message}"`;
  statusEl.textContent = result.statusText;
  optionsEl.innerHTML = "";

  if (gameState.isGameOver) {
    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "btn-dialogue";
    restartBtn.textContent = "Restart Shift";
    restartBtn.addEventListener("click", () => window.location.reload());
    optionsEl.appendChild(restartBtn);
  }

  setControlsForStep(gameState.step);
  renderRooms();
  renderHud();
}

function renderGuestLeavingToLeft(result) {
  renderDialogueResponse(result);

  const figureEl = document.getElementById("guest-figure");
  figureEl.setAttribute("data-state", "leaving-left");

  // Start stay timer so the room lights up green for check-out
  setTimeout(() => {
    if (markRoomReadyForCheckout(result.roomNumber)) {
      renderRooms();
    }
  }, HOTEL_CONFIG.stayDurationMs);

  setTimeout(() => {
    const nextGuest = advanceToNextGuest();
    if (nextGuest) {
      renderGuestArrival(nextGuest);
    } else {
      renderShiftComplete();
    }
  }, 1300);
}

function renderShiftComplete() {
  const avatarEl = document.getElementById("guest-avatar");
  const nameEl = document.getElementById("guest-name");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  avatarEl.textContent = "🏆";
  nameEl.textContent = "All 10 Guests Checked In!";
  dialogueTextEl.textContent = `Shift complete! Final Rating: ${gameState.rating.toFixed(1)} ★ | Revenue Collected: $${gameState.revenue}. Click any green room on the left to collect remaining check-outs!`;
  statusEl.textContent = "Click green rooms on the left to finish check-outs, or play again.";
  optionsEl.innerHTML = "";

  const replayBtn = document.createElement("button");
  replayBtn.type = "button";
  replayBtn.className = "btn-dialogue";
  replayBtn.textContent = "Play Another Shift";
  replayBtn.addEventListener("click", () => window.location.reload());
  optionsEl.appendChild(replayBtn);

  setControlsForStep("shift-complete");
  renderRooms();
  renderHud();
}
