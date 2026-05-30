/**
 * Countdown Timer Controller
 * Calculates time remaining until the Wedding Ceremony on December 3, 2026,
 * and updates UI elements dynamically every second.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Target date: December 3, 2026, at 1:30 AM
  const targetDate = new Date('December 3, 2026 01:30:00').getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownContainer = document.getElementById('countdownRow');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining < 0) {
      // If the date has passed
      if (countdownContainer) {
        countdownContainer.innerHTML = `<div class="wedding-started-msg">We are Married! 🌸</div>`;
      }
      return;
    }

    // Time calculations
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Update UI elements with leading zero format
    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
  }

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  // Initial update
  updateCountdown();

  // Run update loop every second
  setInterval(updateCountdown, 1000);
});
