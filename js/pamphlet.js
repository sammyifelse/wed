/**
 * Pamphlet Gatefold Opening Controller
 * Manages initial body scroll locks, click handlers, parting transitions,
 * and triggers hero animations after the card is opened.
 */

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('pamphletOverlay');
  const waxSeal = document.getElementById('waxSeal');
  // Runtime name config (ensure groom appears first)
  const groomName = 'Dhrubajyoti';
  const brideName = 'Nabanita';

  // Ensure flap texts and seal initials reflect desired order at runtime
  const leftNameEl = document.querySelector('.flap-names.left-names');
  const rightNameEl = document.querySelector('.flap-names.right-names');
  const sealInitialsEl = document.querySelector('.seal-initials');
  if (leftNameEl) leftNameEl.textContent = groomName;
  if (rightNameEl) rightNameEl.textContent = `& ${brideName}`;
  if (sealInitialsEl) sealInitialsEl.textContent = `${groomName.charAt(0)} & ${brideName.charAt(0)}`;
  
  if (!overlay) return;

  // 1. Lock scroll on load
  document.body.classList.add('pamphlet-locked');
  document.documentElement.classList.add('pamphlet-locked');

  // 2. Click Handler to Open Pamphlet
  function openPamphlet() {
    overlay.classList.add('open');
    
    // Add opened class to body to trigger sequential entrance animations
    setTimeout(() => {
      document.body.classList.add('pamphlet-opened');
    }, 400);

    // 3. Unlock scroll and hide overlay after transitions complete
    setTimeout(() => {
      document.body.classList.remove('pamphlet-locked');
      document.documentElement.classList.remove('pamphlet-locked');
      overlay.style.display = 'none';
    }, 1500); // 1.5 seconds transition
  }

  overlay.addEventListener('click', openPamphlet);
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid double triggers
      openPamphlet();
    });
  }
});
