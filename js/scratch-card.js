/**
 * Scratch-to-reveal date coins.
 * Each canvas is independent so the day, month, and year reveal separately.
 */
document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.scratch-date');
  const coins = card ? [...card.querySelectorAll('.scratch-coin')] : [];

  if (!card || !coins.length) return;

  coins.forEach((coin) => {
    const canvas = coin.querySelector('.scratch-canvas');
    const context = canvas.getContext('2d');
    let isScratching = false;
    let lastPoint = null;

    function resizeCanvas() {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = bounds.width * pixelRatio;
      canvas.height = bounds.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      paintCover(bounds.width, bounds.height);
    }

    function paintCover(width, height) {
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#cbb16d');
      gradient.addColorStop(0.48, '#f1dfaa');
      gradient.addColorStop(1, '#a88742');
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.fillStyle = 'rgba(255, 255, 255, 0.16)';
      for (let x = 10; x < width; x += 13) {
        for (let y = 8; y < height; y += 13) {
          context.fillRect(x, y, 1.5, 1.5);
        }
      }

      context.fillStyle = 'rgba(76, 54, 17, 0.66)';
      context.font = '600 8px Jost, sans-serif';
      context.textAlign = 'center';
      context.fillText('SCRATCH', width / 2, height / 2 + 3);
    }

    function getPoint(event) {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      };
    }

    function scratch(point) {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 22;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      if (lastPoint) {
        context.moveTo(lastPoint.x, lastPoint.y);
      } else {
        context.moveTo(point.x, point.y);
      }
      context.lineTo(point.x, point.y);
      context.stroke();
      lastPoint = point;
    }

    function stopScratching() {
      isScratching = false;
      lastPoint = null;
    }

    canvas.addEventListener('pointerdown', (event) => {
      isScratching = true;
      canvas.setPointerCapture(event.pointerId);
      scratch(getPoint(event));
    });
    canvas.addEventListener('pointermove', (event) => {
      if (isScratching) scratch(getPoint(event));
    });
    canvas.addEventListener('pointerup', stopScratching);
    canvas.addEventListener('pointercancel', stopScratching);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  });
});