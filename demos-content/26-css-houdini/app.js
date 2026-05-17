// CSS Houdini Animation App

document.addEventListener('DOMContentLoaded', () => {
  // Register Paint Worklets (if supported)
  if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('worklet.js').catch(e => {
      console.log('Worklet registration deferred for cross-origin');
    });
  }

  // Scroll-driven animation
  setupScrollAnimation();

  // Morphing shapes
  setupMorphingShapes();

  // Progress bar demo
  setupProgressBar();
});

// Scroll Animation
function setupScrollAnimation() {
  const scene = document.getElementById('scrollScene');
  const card = document.getElementById('floatingCard');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const layer1 = document.getElementById('layer1');
  const layer2 = document.getElementById('layer2');

  // Simulate scroll progress with scroll event
  let scrollProgress = 0;
  let isScrolling = false;
  let scrollTimeout;

  function animateScroll() {
    // Floating card animation based on scroll
    const cardY = scrollProgress * 200 - 50;
    const cardRotate = scrollProgress * 30 - 15;
    const cardScale = 1 + scrollProgress * 0.5;
    
    card.style.transform = `translate(-50%, ${cardY}px) rotate(${cardRotate}deg) scale(${cardScale})`;
    card.style.opacity = 1 - scrollProgress * 0.5;

    // Parallax layers
    const layer1Y = scrollProgress * -80;
    const layer2Y = scrollProgress * -160;
    layer1.style.transform = `translateY(${layer1Y}px)`;
    layer2.style.transform = `translateY(${layer2Y}px)`;

    // Progress bar
    progressBar.style.width = `${scrollProgress * 100}%`;
    progressText.textContent = `${Math.round(scrollProgress * 100)}%`;

    // Background color shift
    const hue = scrollProgress * 60;
    scene.style.background = `linear-gradient(${180 + hue}deg, #12122a 0%, hsl(${240 + hue}, 30%, 12%) 100%)`;

    requestAnimationFrame(animateScroll);
  }

  // Scroll simulation - auto scroll the scene
  let autoScrollInterval;
  let manualScrollTimeout;

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      if (scrollProgress < 1) {
        scrollProgress += 0.005;
        if (scrollProgress > 1) scrollProgress = 1;
      }
    }, 16);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Mouse interaction
  scene.addEventListener('mouseenter', startAutoScroll);
  scene.addEventListener('mouseleave', () => {
    stopAutoScroll();
    scrollProgress = Math.max(0, scrollProgress - 0.02);
  });

  // Click to reset
  scene.addEventListener('click', () => {
    scrollProgress = 0;
  });

  animateScroll();
}

// Morphing Shapes
function setupMorphingShapes() {
  const path = document.getElementById('morphPath');
  const btn = document.getElementById('morphBtn');
  
  const shapes = [
    'M100,20 L180,80 L160,180 L40,180 L20,80 Z',           // Pentagon
    'M100,20 C160,20 190,60 190,100 C190,160 150,190 100,190 C50,190 10,160 10,100 C10,40 40,20 100,20 Z',  // Circle-ish
    'M20,100 L80,20 L180,20 L180,100 L100,190 L20,100 Z',   // Hexagon
    'M100,10 L190,80 L150,190 L50,190 L10,80 Z',            // Diamond
    'M100,20 Q180,50 180,100 Q180,150 100,180 Q20,150 20,100 Q20,50 100,20 Z', // Rounded
  ];

  let currentShape = 0;

  btn.addEventListener('click', () => {
    currentShape = (currentShape + 1) % shapes.length;
    path.style.d = shapes[currentShape];
    
    // Add a bounce effect
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => btn.style.transform = '', 200);
  });

  // Auto morph every 3 seconds
  setInterval(() => {
    currentShape = (currentShape + 1) % shapes.length;
    path.style.d = shapes[currentShape];
  }, 3000);
}

// Progress Bar Demo
function setupProgressBar() {
  const fill = document.querySelector('.progress-fill');
  const label = document.querySelector('.progress-label');
  const startBtn = document.getElementById('startProgress');
  const resetBtn = document.getElementById('resetProgress');

  let progress = 0;
  let animationId = null;
  let direction = 1;

  function animate() {
    progress += 0.5 * direction;
    
    if (progress >= 100) {
      progress = 100;
      direction = -1;
      label.textContent = '完成! 🎉';
    } else if (progress <= 0) {
      progress = 0;
      direction = 1;
      label.textContent = '加载中...';
    } else {
      label.textContent = `${Math.round(progress)}%`;
    }

    fill.style.width = `${progress}%`;

    if (progress > 0 && progress < 100) {
      animationId = requestAnimationFrame(animate);
    }
  }

  startBtn.addEventListener('click', () => {
    if (animationId) return;
    direction = progress < 100 ? 1 : -1;
    label.textContent = '进行中...';
    animate();
  });

  resetBtn.addEventListener('click', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    progress = 0;
    direction = 1;
    fill.style.width = '0%';
    label.textContent = '重置';
  });

  // Initial auto animation
  setTimeout(() => startBtn.click(), 500);
}

// CSS Custom Properties @property registration
if (CSS.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--gradient-start',
      syntax: '<color>',
      inherits: false,
      initialValue: '#ff6b6b'
    });
    
    CSS.registerProperty({
      name: '--gradient-end',
      syntax: '<color>',
      inherits: false,
      initialValue: '#4ecdc4'
    });

    CSS.registerProperty({
      name: '--clip-level',
      syntax: '<percentage>',
      inherits: false,
      initialValue: '0%'
    });
  } catch (e) {
    console.log('@property registration skipped');
  }
}

// Dynamic gradient animation
const gradientBox = document.getElementById('gradientBox');
let gradientHue = 0;

function animateGradient() {
  gradientHue = (gradientHue + 1) % 360;
  gradientBox.style.background = `linear-gradient(135deg, 
    hsl(${gradientHue}, 70%, 60%), 
    hsl(${(gradientHue + 60) % 360}, 70%, 60%)
  )`;
  requestAnimationFrame(animateGradient);
}
animateGradient();

// Clip path animation
const clipBox = document.getElementById('clipBox');
let clipLevel = 0;
let clipDirection = 1;

function animateClip() {
  clipLevel += 0.3 * clipDirection;
  if (clipLevel >= 50) clipDirection = -1;
  if (clipLevel <= 0) clipDirection = 1;
  clipBox.style.setProperty('--clip-level', `${clipLevel}%`);
  requestAnimationFrame(animateClip);
}
animateClip();

console.log('App initialized');