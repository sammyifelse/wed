/**
 * Sticky Navigation, Active Scroll Tracking & Mobile Menu Drawer Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const navLinksContainer = nav ? nav.querySelector('.nav-links') : null;
  const navLinks = nav ? nav.querySelectorAll('.nav-links a') : [];
  const sections = document.querySelectorAll('section');
  
  if (!nav) return;

  // 1. Mobile Menu Drawer Toggle
  // Create hamburger button dynamically if it does not exist in HTML
  let navToggle = nav.querySelector('.nav-toggle');
  if (!navToggle) {
    navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    nav.querySelector('.nav-inner').appendChild(navToggle);
  }

  // Toggle Drawer
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navToggle.classList.toggle('open');
    if (navLinksContainer) navLinksContainer.classList.toggle('open');
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navLinksContainer && navLinksContainer.classList.contains('open')) {
      if (!navLinksContainer.contains(e.target) && e.target !== navToggle) {
        navToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      }
    }
  });

  // Close menu drawer when clicking a navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      if (navLinksContainer) navLinksContainer.classList.remove('open');
    });
  });

  // 2. Sticky Nav Bar Scroll Style Toggle
  function handleScrollEffects() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // 3. Active Link Scroll Tracking
    let currentActiveId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const navbarHeight = nav.offsetHeight;
      
      // Determine active section (offset by nav height + margin)
      if (scrollY >= sectionTop - navbarHeight - 120) {
        currentActiveId = section.getAttribute('id');
      }
    });

    // Special case for top of page / Hero
    if (scrollY < 100) {
      currentActiveId = 'home';
    }

    // Set active link class
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentActiveId}`) {
        link.classList.add('active');
      }
    });
  }

  // Bind scroll handler
  window.addEventListener('scroll', handleScrollEffects);
  
  // Run once initially to set correct state
  handleScrollEffects();
});
