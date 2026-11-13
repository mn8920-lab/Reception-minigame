// 2_scripts/3_display.js — PRESENTATION layer: renders HUD, center dialogue choices, right-to-left motion, and next-day button

function renderHud() {
  const dayEl = document.getElementById("hotel-day");
  const ratingEl = document.getElementById("hotel-rating");
  const revenueEl = document.getElementById("hotel-revenue");
  const capacityEl = document.getElementById("hotel-capacity");

  dayEl.textContent = `Day ${gameState.currentDay} / ${HOTEL_CONFIG.totalDays}`;
  const fullStars = "★".repeat(Math.round(gameState.rating));
  const emptyStars = "☆".repeat(Math.max(0, 5 - Math.round(gameState.rating)));
  ratingEl.textContent = `${fullStars}${emptyStars} (${gameState.rating.toFixed(1)})`;
  revenueEl.textContent = `$${gameState.revenue}`;
  capacityEl.textContent = `${gameState.dailyCheckedIn} / ${getDailyTargetCount()}`;
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

  // Start the guest offscreen-right, then smoothly glide them in to the center desk
  figureEl.setAttribute("data-state", "offscreen-right");
  avatarEl.textContent = guest.avatar;
  nameEl.textContent = `${guest.name} (${guest.temper})`;
  dialogueTextEl.textContent = `${guest.name}: "${guest.arrivalLine}"`;
  statusEl.textContent = `Day ${gameState.currentDay} — Step 1: Pick a response in the center.`;

  optionsEl.innerHTML = "";
  guest.greetReplies.forEach((reply) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-dialogue";
    btn.textContent = `"${reply.text}"`;
    btn.addEventListener("click", () => onGreetClick(reply.polite));
    optionsEl.appendChild(btn);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      figureEl.setAttribute("data-state", "entering");
    });
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
    restartBtn.textContent = "Restart Week (Day 1)";
    restartBtn.addEventListener("click", () => window.location.reload());
    optionsEl.appendChild(restartBtn);
  }

  setControlsForStep(gameState.step);
  renderHud();
}

function renderGuestLeavingToLeft(result) {
  renderDialogueResponse(result);

  const figureEl = document.getElementById("guest-figure");
  figureEl.setAttribute("data-state", "leaving-left");

  setTimeout(() => {
    const nextGuest = advanceToNextGuest();
    if (nextGuest) {
      renderGuestArrival(nextGuest);
    } else if (gameState.step === "day-complete") {
      renderDayComplete();
    } else {
      renderWeekComplete();
    }
  }, 1100);
}

function renderDayComplete() {
  const figureEl = document.getElementById("guest-figure");
  const avatarEl = document.getElementById("guest-avatar");
  const nameEl = document.getElementById("guest-name");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  const nextDay = gameState.currentDay + 1;
  const nextDayGuests = HOTEL_CONFIG.guestsPerDay[nextDay - 1] || GUEST_QUEUE.length;

  figureEl.setAttribute("data-state", "entering");
  avatarEl.textContent = "🌙";
  nameEl.textContent = `Day ${gameState.currentDay} Complete!`;
  dialogueTextEl.textContent = `All ${getDailyTargetCount()} guests checked in tonight! Tomorrow (Day ${nextDay}) expects ${nextDayGuests} guests.`;
  statusEl.textContent = `Night ${gameState.currentDay} wrapped up — ready for Day ${nextDay}!`;
  optionsEl.innerHTML = "";

  const nextDayBtn = document.createElement("button");
  nextDayBtn.type = "button";
  nextDayBtn.className = "btn-dialogue";
  nextDayBtn.textContent = "Move onto the next day";
  nextDayBtn.addEventListener("click", () => {
    const firstGuestOfNewDay = startDay(nextDay);
    if (firstGuestOfNewDay) {
      renderGuestArrival(firstGuestOfNewDay);
    }
  });
  optionsEl.appendChild(nextDayBtn);

  setControlsForStep("day-complete");
  renderHud();
}

function renderWeekComplete() {
  const figureEl = document.getElementById("guest-figure");
  const avatarEl = document.getElementById("guest-avatar");
  const nameEl = document.getElementById("guest-name");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const optionsEl = document.getElementById("dialogue-options");
  const statusEl = document.getElementById("clipboard-status");

  figureEl.setAttribute("data-state", "entering");
  avatarEl.textContent = "🏆";
  nameEl.textContent = "All 7 Days Complete!";
  dialogueTextEl.textContent = `You hosted ${gameState.totalCheckedIn} guests across 7 nights! Final Rating: ${gameState.rating.toFixed(1)} ★ | Total Revenue: $${gameState.revenue}.`;
  statusEl.textContent = "7-Day Hotel Shift Complete!";
  optionsEl.innerHTML = "";

  const replayBtn = document.createElement("button");
  replayBtn.type = "button";
  replayBtn.className = "btn-dialogue";
  replayBtn.textContent = "Start a New 7-Day Week";
  replayBtn.addEventListener("click", () => window.location.reload());
  optionsEl.appendChild(replayBtn);

  setControlsForStep("week-complete");
  renderHud();
}
