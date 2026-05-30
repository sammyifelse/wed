/**
 * Scroll Reveal & Parallax Animations
 * Leverages IntersectionObserver for entry animations and scroll parallax for visual depth.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for scroll-based reveals
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport fully
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add active class
        entry.target.classList.add('active');
        
        // Handle inline delays if specified
        const delay = entry.target.getAttribute('data-delay');
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
        
        // Unobserve once revealed to keep layout performant
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 2. Stagger elements inside containers (e.g. timeline cards, event cards, gallery images)
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          child.style.transitionDelay = `${index * 150}ms`;
          child.classList.add('active'); // If individual items have reveal styles
        });
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  staggerContainers.forEach(container => {
    staggerObserver.observe(container);
  });

  // 3. Hero section element delays setting (fallback if CSS animations need manual settings)
  const heroAnims = document.querySelectorAll('.hero-content > [data-delay]');
  heroAnims.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) {
      el.style.animationDelay = `${delay}ms`;
    }
  });

  // 4. Parallax Effect on Scroll for Glow Orbs and Hero Section
  const orbs = document.querySelectorAll('.orb');
  const heroContent = document.querySelector('.hero-content');
  
  let lastScrollY = window.scrollY;
  let ticking = false;

  const enableParallax = window.innerWidth > 900 && !( 'ontouchstart' in window || navigator.maxTouchPoints > 0 );

  function updateParallax() {
    const scrollY = window.scrollY;
    
    // Parallax hero text container
    if (heroContent && scrollY < window.innerHeight) {
      const speed = 0.4;
      heroContent.style.transform = `translateY(${scrollY * speed}px)`;
      heroContent.style.opacity = `${1 - (scrollY / (window.innerHeight * 1.2))}`;
    }

    // Parallax background glow elements
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.15;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });

    ticking = false;
  }

  if (enableParallax) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          lastScrollY = window.scrollY;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
