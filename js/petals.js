/**
 * Petals & Gold Confetti Canvas Animation
 * High-performance, responsive canvas particle animation with mouse interaction.
 */

(function () {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Performance-aware Particle Settings
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 600;
  const maxPetals = isSmallScreen || isTouch ? 18 : 45;
  const petals = [];
  const mouse = { x: -1000, y: -1000, radius: isSmallScreen ? 80 : 150 };

  // Track mouse coordinates (disabled on touch devices to reduce work)
  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Petal {
    constructor() {
      this.reset();
      // Start randomly at different heights on initial load
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 8 + 6; // 6 to 14
      // Determine type: 75% Rose Petal, 25% Gold leaf confetti
      this.type = Math.random() > 0.35 ? 'petal' : 'gold';
      
      this.speedY = Math.random() * 1.2 + 0.8; // Falling speed
      this.speedX = Math.random() * 0.8 - 0.4; // Base wind draft
      this.oscillationSpeed = Math.random() * 0.02 + 0.01; // Swing rate
      this.oscillationDistance = Math.random() * 30 + 10; // Swing range
      this.oscillationAngle = Math.random() * Math.PI * 2;
      
      // 3D rotation settings
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.scaleY = Math.random() * 0.6 + 0.4;
      this.scaleYSpeed = Math.random() * 0.02 + 0.005;
      
      // Rose petal visual properties
      if (this.type === 'petal') {
        const pinks = [
          'rgba(255, 192, 203, 0.65)',  // Soft pink
          'rgba(255, 218, 224, 0.70)',  // Soft blush pink
          'rgba(255, 240, 245, 0.65)',  // Lavender blush
          'rgba(250, 240, 230, 0.75)'   // Soft linen cream
        ];
        this.color = pinks[Math.floor(Math.random() * pinks.length)];
      } else {
        // Gold confetti properties
        this.color = `rgba(${Math.floor(Math.random() * 40 + 215)}, ${Math.floor(Math.random() * 30 + 175)}, 55, ${Math.random() * 0.5 + 0.4})`;
      }
    }

    update() {
      // Fall down
      this.y += this.speedY;
      
      // Swing side to side
      this.oscillationAngle += this.oscillationSpeed;
      let wave = Math.sin(this.oscillationAngle) * this.oscillationDistance * 0.03;
      this.x += this.speedX + wave;
      
      // Rotate
      this.rotation += this.rotationSpeed;
      this.scaleY = Math.sin(this.oscillationAngle) * 0.5 + 0.5;

      // Mouse interactive push effect
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const pushX = (dx / distance) * force * 3;
        const pushY = (dy / distance) * force * 1.5;
        this.x += pushX;
        this.y += pushY;
      }

      // Reset when particle goes off screen
      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, this.scaleY);

      if (this.type === 'petal') {
        // Drawing a smooth curved organic rose petal shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Left side curve
        ctx.bezierCurveTo(-this.size * 1.2, -this.size * 0.5, -this.size * 0.8, this.size * 1.2, 0, this.size * 1.5);
        // Right side curve
        ctx.bezierCurveTo(this.size * 0.8, this.size * 1.2, this.size * 1.2, -this.size * 0.5, 0, 0);
        ctx.closePath();
        ctx.fill();

        // Highlighting vein detail inside petal
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-this.size * 0.1, this.size * 0.6, 0, this.size * 1.2);
        ctx.stroke();
      } else {
        // Drawing shiny gold square/diamond leaf confetti
        ctx.fillStyle = this.color;
        // Adding metallic border/glow look
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = 4;
        
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, -this.size * 0.4);
        ctx.lineTo(this.size * 0.6, this.size / 2);
        ctx.lineTo(-this.size * 0.4, this.size * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Initialize petals array
  for (let i = 0; i < maxPetals; i++) {
    petals.push(new Petal());
  }

  // Animation Loop with throttling and visibility handling
  let running = true;
  let lastFrame = performance.now();
  const fps = isSmallScreen || isTouch ? 30 : 60;
  const frameInterval = 1000 / fps;

  function animate(now) {
    if (!running) return;

    const elapsed = now - lastFrame;
    if (elapsed < frameInterval) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrame = now - (elapsed % frameInterval);

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    requestAnimationFrame(animate);
  }

  // Pause when tab is hidden to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else {
      if (!running) {
        running = true;
        lastFrame = performance.now();
        requestAnimationFrame(animate);
      }
    }
  });

  // Start animation loop
  requestAnimationFrame(animate);
})();
