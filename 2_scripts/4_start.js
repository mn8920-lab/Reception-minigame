// 2_scripts/4_start.js — START layer: wires up front desk button events and starts Day 1

function onGreetClick(isPolite) {
  const result = handleGreeting(isPolite);
  renderDialogueResponse(result);
}

function onClipboardClick(event) {
  const button = event.currentTarget;
  const selectedCategory = button.getAttribute("data-category");
  const result = handleClipboardChoice(selectedCategory);
  renderDialogueResponse(result);
}

function onGiveKeyClick() {
  const result = handleGiveKey();
  if (!result) return;

  if (gameState.step === "leaving") {
    renderGuestLeavingToLeft(result);
  } else {
    renderDialogueResponse(result);
  }
}

function startShift() {
  const partyButtons = document.querySelectorAll(".btn-party");
  partyButtons.forEach((btn) => {
    btn.addEventListener("click", onClipboardClick);
  });

  const keyButton = document.getElementById("btn-give-key");
  keyButton.addEventListener("click", onGiveKeyClick);

  const firstGuest = startDay(1);
  if (firstGuest) {
    renderGuestArrival(firstGuest);
  }
}

document.addEventListener("DOMContentLoaded", startShift);
