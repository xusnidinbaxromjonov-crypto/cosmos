// Celamur Cosmic Confession Experience - Sevara Edition

document.addEventListener('DOMContentLoaded', () => {
  const girlName = 'Севара';
  const senderSignature = 'ТВОЙ ЛЮБИМЫЙ ( МУХАМ )💞';
  const secretPassword = 'севара';

  // State
  let currentStep = 1;

  // Love confessions dictionary in multiple languages
  const loveWords = [
    'Севара', 'Севара 🪐', 'Ман сизи реально севаман!', 'Севар',
    'Seni sevaman', 'Севар, севаман', 'Я тебя люблю', 'I love you',
    'Je t\'aime', 'Te amo', 'Ti amo', 'Ich liebe dich', 'Aishiteru',
    'Saranghae', 'Eu te amo', 'Wo ai ni', 'Ya tebya lyublyu',
    'Қалбим', 'Ардоқлайман', 'Ҳурмат қиламан', 'Моя любимая Севара',
    'Фариштам', 'Бахтим', 'Mahal kita', 'Te iubesc', 'Kocham cię',
    'Szeretlek', 'Люблю тебя', 'Моя вселенная', 'Навсегда 🤍'
  ];

  // DOM Elements
  const screens = document.querySelectorAll('.screen');
  const dots = document.querySelectorAll('.dot');
  const secretInput = document.getElementById('secret-input');
  const formPassword = document.getElementById('form-password');
  const btnHint = document.getElementById('btn-hint');
  const btnToGalaxy = document.getElementById('btn-to-galaxy');
  const btnToWordGalaxy = document.getElementById('btn-to-word-galaxy');
  const btnRevealPortrait = document.getElementById('btn-reveal-portrait');

  // Canvases
  const bgCanvas = document.getElementById('space-bg-canvas');
  const galaxyCanvas = document.getElementById('galaxy-hearts-canvas');
  const wordGalaxyCanvas = document.getElementById('word-galaxy-canvas');
  const portraitCanvas = document.getElementById('portrait-canvas');

  // Load Sevara's real photo
  const sevaraImg = new Image();
  sevaraImg.src = 'assets/sevara.png';

  sevaraImg.onload = () => {
    if (currentStep === 5) {
      renderTypographicPortrait();
    }
  };

  // ================= INITIALIZATION =================
  function init() {
    setupEventListeners();
    initBackgroundStars();
    goToStep(1);
  }

  // ================= STEP NAVIGATION =================
  function goToStep(stepNumber) {
    if (stepNumber < 1) stepNumber = 1;
    if (stepNumber > 5) stepNumber = 5;
    currentStep = stepNumber;

    // Update screens
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${stepNumber}`);
    if (target) target.classList.add('active');

    // Update progress dots
    dots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      if (step === stepNumber) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Step-specific activations
    if (stepNumber === 3) {
      startGalaxyHeartsScene();
    } else {
      stopGalaxyHeartsScene();
    }

    if (stepNumber === 4) {
      startWordGalaxyScene();
    } else {
      stopWordGalaxyScene();
    }

    if (stepNumber === 5) {
      renderTypographicPortrait();
    }
  }

  // ================= EVENT LISTENERS =================
  function setupEventListeners() {
    // Step 1: Password
    formPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      checkSecretWord();
    });

    btnHint.addEventListener('click', () => {
      secretInput.value = secretPassword;
    });

    // Step 2 -> 3
    btnToGalaxy.addEventListener('click', () => {
      goToStep(3);
    });

    // Step 3 -> 4
    btnToWordGalaxy.addEventListener('click', () => {
      goToStep(4);
    });

    // Step 4 -> 5 ("Нажми!")
    btnRevealPortrait.addEventListener('click', () => {
      if (window.WordGalaxy) {
        window.WordGalaxy.triggerZoom(() => {
          goToStep(5);
        });
      } else {
        goToStep(5);
      }
    });

    // Step Dots Navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.getAttribute('data-step'), 10);
        goToStep(step);
      });
    });

    // Window Resize
    window.addEventListener('resize', () => {
      resizeCanvas(bgCanvas);
      if (currentStep === 3) resizeCanvas(galaxyCanvas);
      if (currentStep === 4) resizeCanvas(wordGalaxyCanvas);
      if (currentStep === 5) renderTypographicPortrait();
    });
  }

  function checkSecretWord() {
    const val = secretInput.value.trim().toLowerCase();
    const correct = secretPassword.toLowerCase();

    // Friendly matching: accept "севара", "севар", "севаман", "sevara", "люблю"
    if (val === correct || val === 'севара' || val === 'севар' || val === 'севаман' || val === 'sevara' || val === 'люблю' || val.length > 0) {
      goToStep(2);
    } else {
      secretInput.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        secretInput.style.animation = '';
      }, 450);
    }
  }

  function resizeCanvas(canvas) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  // ================= SCENE 0: PERSISTENT BACKGROUND STARS =================
  let bgStars = [];
  let bgShootingStars = [];

  function initBackgroundStars() {
    resizeCanvas(bgCanvas);
    const count = 180;
    const w = window.innerWidth;
    const h = window.innerHeight;

    bgStars = [];
    for (let i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    renderBackgroundStars();
  }

  function renderBackgroundStars() {
    const ctx = bgCanvas.getContext('2d');
    const w = bgCanvas.getBoundingClientRect().width;
    const h = bgCanvas.getBoundingClientRect().height;

    ctx.clearRect(0, 0, w, h);

    // Stars
    for (let star of bgStars) {
      star.twinklePhase += star.twinkleSpeed;
      const currentAlpha = Math.max(0.1, star.alpha + Math.sin(star.twinklePhase) * 0.35);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 240, 255, ${currentAlpha})`;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
      ctx.fill();
    }

    // Occasional shooting star
    if (Math.random() < 0.007 && bgShootingStars.length < 2) {
      bgShootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        life: 1.0
      });
    }

    for (let i = bgShootingStars.length - 1; i >= 0; i--) {
      const s = bgShootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.02;

      if (s.life <= 0) {
        bgShootingStars.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.len * s.life, s.y - Math.sin(s.angle) * s.len * s.life);
      ctx.strokeStyle = `rgba(255, 250, 230, ${s.life * 0.8})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    requestAnimationFrame(renderBackgroundStars);
  }

  // ================= SCENE 3: GALAXY WITH FLOATING HEARTS =================
  let galaxyHeartsAnimId = null;
  let hearts = [];
  let sparkles = [];
  let galaxyAngle = 0;

  function startGalaxyHeartsScene() {
    resizeCanvas(galaxyCanvas);
    const rect = galaxyCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Floating white hearts
    hearts = [
      { x: w * 0.38, y: h * 0.42, baseY: h * 0.42, size: 22, floatOffset: 0.2 },
      { x: w * 0.44, y: h * 0.45, baseY: h * 0.45, size: 20, floatOffset: 1.5 },
      { x: w * 0.52, y: h * 0.48, baseY: h * 0.48, size: 24, floatOffset: 2.8 },
      { x: w * 0.48, y: h * 0.54, baseY: h * 0.54, size: 26, floatOffset: 3.9 },
      { x: w * 0.55, y: h * 0.56, baseY: h * 0.56, size: 22, floatOffset: 4.8 },
      { x: w * 0.32, y: h * 0.58, baseY: h * 0.58, size: 18, floatOffset: 5.6 }
    ];

    // Sparkles
    sparkles = [
      { x: w * 0.46, y: h * 0.30, size: 18, phase: 0 },
      { x: w * 0.42, y: h * 0.50, size: 12, phase: 1.2 },
      { x: w * 0.50, y: h * 0.52, size: 14, phase: 2.1 },
      { x: w * 0.62, y: h * 0.54, size: 15, phase: 3.4 }
    ];

    loopGalaxyHeartsScene();
  }

  function stopGalaxyHeartsScene() {
    if (galaxyHeartsAnimId) {
      cancelAnimationFrame(galaxyHeartsAnimId);
      galaxyHeartsAnimId = null;
    }
  }

  function loopGalaxyHeartsScene() {
    const ctx = galaxyCanvas.getContext('2d');
    const rect = galaxyCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    galaxyAngle += 0.003;

    // Draw spiral galaxy core in background
    drawSpiralGalaxyCore(ctx, w * 0.5, h * 0.42, Math.min(w * 0.22, 140), galaxyAngle);

    // Draw sparkling gold stars ✨
    for (let s of sparkles) {
      s.phase += 0.035;
      const glowScale = Math.sin(s.phase) * 0.4 + 0.8;
      drawFourPointStar(ctx, s.x, s.y, s.size * glowScale, '#ffda79', '#ffffff');
    }

    // Draw floating white hearts 🤍
    const now = Date.now() * 0.002;
    for (let heart of hearts) {
      heart.y = heart.baseY + Math.sin(now + heart.floatOffset) * 6;

      ctx.save();
      ctx.translate(heart.x, heart.y);
      ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 14;
      drawHeartIcon(ctx, 0, 0, heart.size, '#ffffff');
      ctx.restore();
    }

    galaxyHeartsAnimId = requestAnimationFrame(loopGalaxyHeartsScene);
  }

  function drawSpiralGalaxyCore(ctx, cx, cy, radius, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Glowing nebula core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    coreGrad.addColorStop(0.2, 'rgba(210, 220, 255, 0.7)');
    coreGrad.addColorStop(0.5, 'rgba(120, 140, 220, 0.35)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Spiral arms
    const arms = 2;
    const pointsPerArm = 90;
    for (let a = 0; a < arms; a++) {
      const armOffset = a * Math.PI;
      for (let p = 0; p < pointsPerArm; p++) {
        const theta = (p / pointsPerArm) * Math.PI * 3 + armOffset;
        const r = (p / pointsPerArm) * radius * 1.35;
        const x = r * Math.cos(theta);
        const y = (r * Math.sin(theta)) * 0.55;

        const alpha = Math.max(0.1, 1 - (p / pointsPerArm));
        ctx.fillStyle = `rgba(235, 240, 255, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, (1 - p / pointsPerArm) * 2.2 + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawHeartIcon(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function drawFourPointStar(ctx, cx, cy, r, colorOuter, colorCenter) {
    ctx.save();
    ctx.shadowColor = colorOuter;
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx - r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - r);
    ctx.closePath();

    ctx.fillStyle = colorOuter;
    ctx.fill();

    // Bright inner core
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = colorCenter;
    ctx.fill();

    ctx.restore();
  }

  // ================= SCENE 4: GALAXY OF LOVE WORDS =================
  let wordGalaxyAnimId = null;
  let wordParticles = [];
  let isZoomingWarp = false;
  let warpScale = 1;
  let warpSpeed = 0.004;

  function startWordGalaxyScene() {
    resizeCanvas(wordGalaxyCanvas);
    isZoomingWarp = false;
    warpScale = 1;
    generateWordGalaxyParticles();
    loopWordGalaxyScene();
  }

  function stopWordGalaxyScene() {
    if (wordGalaxyAnimId) {
      cancelAnimationFrame(wordGalaxyAnimId);
      wordGalaxyAnimId = null;
    }
  }

  function generateWordGalaxyParticles() {
    const rect = wordGalaxyCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    wordParticles = [];
    const totalWords = Math.min(220, Math.floor(w / 3.8));
    const maxRadius = Math.min(w * 0.48, h * 0.52);

    for (let i = 0; i < totalWords; i++) {
      const arm = i % 3;
      const distRatio = Math.pow(Math.random(), 0.65);
      const angle = (distRatio * Math.PI * 4.2) + (arm * (Math.PI * 2 / 3)) + (Math.random() - 0.5) * 0.45;
      const radius = distRatio * maxRadius;

      const isGirlName = Math.random() < 0.3 || i === 0;
      const wordText = isGirlName ? girlName : loveWords[Math.floor(Math.random() * loveWords.length)];

      wordParticles.push({
        text: wordText,
        arm,
        radius,
        baseAngle: angle,
        currentAngle: angle,
        rotSpeed: 0.0018 + (1 - distRatio) * 0.002,
        distRatio,
        isGirlName,
        fontSize: isGirlName ? Math.floor(Math.random() * 4 + 13) : Math.floor(Math.random() * 5 + 10),
        alpha: Math.random() * 0.5 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  function loopWordGalaxyScene() {
    const ctx = wordGalaxyCanvas.getContext('2d');
    const rect = wordGalaxyCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const centerX = w * 0.5;
    const centerY = h * 0.48;

    ctx.save();
    ctx.translate(centerX, centerY);

    if (isZoomingWarp) {
      warpScale += warpSpeed;
      warpSpeed *= 1.08;
      ctx.scale(warpScale, warpScale);
    }

    // Glowing galactic super-core
    const coreGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, w * 0.35);
    coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    coreGlow.addColorStop(0.18, 'rgba(230, 240, 255, 0.85)');
    coreGlow.addColorStop(0.42, 'rgba(160, 190, 255, 0.4)');
    coreGlow.addColorStop(0.75, 'rgba(90, 110, 210, 0.15)');
    coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.44, w * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render dense word disk in 3D tilted plane
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let p of wordParticles) {
      p.currentAngle += p.rotSpeed;
      p.twinkle += 0.03;

      const x = p.radius * Math.cos(p.currentAngle);
      const y = p.radius * Math.sin(p.currentAngle) * 0.44;

      const depthFactor = (y / (p.radius * 0.44 || 1) + 1) * 0.5;
      const twinkleAlpha = Math.sin(p.twinkle) * 0.2 + 0.8;
      const finalAlpha = Math.min(1, (p.alpha * 0.7 + depthFactor * 0.3) * twinkleAlpha);

      ctx.save();
      ctx.translate(x, y);

      if (p.isGirlName) {
        ctx.font = `700 ${p.fontSize + 3}px "Marck Script", cursive`;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, finalAlpha + 0.25)})`;
        ctx.shadowColor = 'rgba(242, 204, 129, 0.95)';
        ctx.shadowBlur = 12;
      } else {
        ctx.font = `500 ${p.fontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = `rgba(220, 235, 255, ${finalAlpha * 0.9})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 4;
      }

      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }

    // Four point stars
    for (let i = 0; i < 8; i++) {
      const sparkleX = Math.sin(i * 1.5 + Date.now() * 0.001) * (w * 0.35);
      const sparkleY = Math.cos(i * 2.1 + Date.now() * 0.001) * (w * 0.16);
      drawFourPointStar(ctx, sparkleX, sparkleY, 7, '#ffffff', '#ffd782');
    }

    ctx.restore();

    wordGalaxyAnimId = requestAnimationFrame(loopWordGalaxyScene);
  }

  window.WordGalaxy = {
    triggerZoom(callback) {
      isZoomingWarp = true;
      warpSpeed = 0.015;
      setTimeout(() => {
        if (callback) callback();
      }, 750);
    }
  };

  // ================= SCENE 5: HIGH-DEFINITION TYPOGRAPHIC PORTRAIT (SEVARA) =================
  function renderTypographicPortrait() {
    if (!portraitCanvas || !sevaraImg.complete || sevaraImg.naturalWidth === 0) {
      return;
    }

    const container = portraitCanvas.parentElement;
    const w = container.clientWidth || 440;
    const h = container.clientHeight || 580;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    portraitCanvas.width = w * dpr;
    portraitCanvas.height = h * dpr;

    const ctx = portraitCanvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Deep cosmic dark background
    ctx.fillStyle = '#060714';
    ctx.fillRect(0, 0, w, h);

    // Crop centered on Sevara's face (960 x 740)
    const srcW = sevaraImg.naturalWidth;
    const srcH = sevaraImg.naturalHeight;
    const targetAspect = w / h;

    let cropH = srcH * 0.90;
    let cropW = cropH * targetAspect;
    if (cropW > srcW) {
      cropW = srcW;
      cropH = cropW / targetAspect;
    }

    // Precise centering on her facial features (eyes, nose, sweet smile)
    let cropX = (srcW * 0.52) - (cropW * 0.50);
    let cropY = (srcH * 0.44) - (cropH * 0.48);
    cropX = Math.max(0, Math.min(srcW - cropW, cropX));
    cropY = Math.max(0, Math.min(srcH - cropH, cropY));

    // 1. Draw enhanced photographic base layer
    // This gives crystal clear definition to her eyes, eyebrows, lips, tabassum and contours!
    ctx.save();
    ctx.filter = 'grayscale(100%) contrast(165%) brightness(115%)';
    ctx.globalAlpha = 0.55;
    ctx.drawImage(sevaraImg, cropX, cropY, cropW, cropH, 0, 0, w, h);
    ctx.restore();

    // 2. Prepare sample canvas for typography luminance calculation
    const cols = 92;
    const rows = Math.floor(cols * (h / w) * 0.82);

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = cols;
    sampleCanvas.height = rows;
    const sCtx = sampleCanvas.getContext('2d');
    sCtx.filter = 'contrast(150%) brightness(110%)';
    sCtx.drawImage(sevaraImg, cropX, cropY, cropW, cropH, 0, 0, cols, rows);
    const imgData = sCtx.getImageData(0, 0, cols, rows).data;

    // 3. Typographic text settings
    const cellW = w / cols;
    const cellH = h / rows;
    const fontSize = Math.max(5.5, Math.floor(cellH * 1.15));

    ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const textStream = 'I love you  Te amo  Севара  Seni sevaman  Je t\'aime  Ti amo  Ich liebe dich  Ман сизи севаман  Aishiteru  Saranghae  Eu te amo  Wo ai ni  Ya tebya lyublyu  Қалбим  Ардоқлайман  Навсегда  ';
    let charOffset = 0;

    // 4. Render typographic text matrix over the portrait
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const char = textStream[charOffset % textStream.length];
        charOffset++;

        const idx = (r * cols + c) * 4;
        const red = imgData[idx];
        const green = imgData[idx + 1];
        const blue = imgData[idx + 2];

        // Perceptual luminance formula
        const lum = 0.299 * red + 0.587 * green + 0.114 * blue;
        const norm = lum / 255;

        const posX = c * cellW;
        const posY = r * cellH;

        if (norm > 0.48) {
          // Bright highlights: forehead, cheeks, smile, nose bridge
          const alpha = Math.min(1, 0.80 + (norm - 0.48) * 1.6);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.55)';
          ctx.shadowBlur = 2;
          ctx.fillText(char, posX, posY);
        } else if (norm > 0.20) {
          // Midtones: face contours, skin texture
          const alpha = 0.45 + (norm - 0.20) * 1.3;
          ctx.fillStyle = `rgba(215, 228, 255, ${alpha})`;
          ctx.shadowBlur = 0;
          ctx.fillText(char, posX, posY);
        } else {
          // Hair and subtle ambient starlight background
          const alpha = 0.18 + norm * 0.9;
          ctx.fillStyle = `rgba(135, 150, 200, ${alpha})`;
          ctx.shadowBlur = 0;
          ctx.fillText(char, posX, posY);
        }
      }
    }

    // 5. Soft celestial radial vignette to blend shoulders and edges into cosmic space
    const vignette = ctx.createRadialGradient(
      w * 0.5, h * 0.44, Math.min(w, h) * 0.36,
      w * 0.5, h * 0.50, Math.max(w, h) * 0.72
    );
    vignette.addColorStop(0, 'rgba(6, 7, 20, 0)');
    vignette.addColorStop(0.65, 'rgba(6, 7, 20, 0.35)');
    vignette.addColorStop(1, 'rgba(6, 7, 20, 0.95)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  // Kickoff
  init();
});
