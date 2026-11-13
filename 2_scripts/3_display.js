// 3_display.js — PRESENTATION layer: updates the HUD, guest figure, dialogue box, and desk controls

function renderHud() {
  const ratingEl = document.getElementById("hotel-rating");
  const revenueEl = document.getElementById("hotel-revenue");
  const capacityEl = document.getElementById("hotel-capacity");

  const fullStars = "★".repeat(Math.round(gameState.rating));
  const emptyStars = "☆".repeat(Math.max(0, 5 - Math.round(gameState.rating)));
  ratingEl.textContent = `${fullStars}${emptyStars} (${gameState.rating.toFixed(1)})`;
  revenueEl.textContent = `$${gameState.revenue}`;
  capacityEl.textContent = `${gameState.occupiedRooms} / ${HOTEL_CONFIG.maxRooms}`;
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
  nameEl.textContent = guest.name;
  dialogueTextEl.textContent = `${guest.name}: "${guest.arrivalLine}"`;
  statusEl.textContent = "Step 1: Greet the guest using a dialogue option.";

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
  renderHud();
}

function renderGuestLeavingToLeft(result) {
  renderDialogueResponse(result);

  const figureEl = document.getElementById("guest-figure");
  const hallwayEl = document.getElementById("room-hallway");
  const guest = getCurrentGuest();

  figureEl.setAttribute("data-state", "leaving-left");
  if (guest) {
    hallwayEl.textContent = guest.avatar;
  }

  setTimeout(() => {
    const nextGuest = advanceToNextGuest();
    if (nextGuest) {
      renderGuestArrival(nextGuest);
    } else {
      renderShiftComplete();
    }
  }, 1400);
}

function renderShiftComplete() {
  const avatarEl = document.getElementById("guest-avatar");
  const nameEl = document.getElementById("guest-name");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  avatarEl.textContent = "🏆";
  nameEl.textContent = "Shift Complete!";
  dialogueTextEl.textContent = `Great job at the front desk! Final Rating: ${gameState.rating.toFixed(1)} ★ | Revenue Earned: $${gameState.revenue}`;
  statusEl.textContent = "All arriving guests have been checked into their rooms.";
  optionsEl.innerHTML = "";

  const replayBtn = document.createElement("button");
  replayBtn.type = "button";
  replayBtn.className = "btn-dialogue";
  replayBtn.textContent = "Play Another Shift";
  replayBtn.addEventListener("click", () => window.location.reload());
  optionsEl.appendChild(replayBtn);

  setControlsForStep("shift-complete");
  renderHud();
}
