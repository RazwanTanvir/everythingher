const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const revealSound = document.getElementById('revealSound');

let auraFullyRevealed = false;

// Responsive canvas sizing
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 80;

const auraImage = new Image();
auraImage.src = 'face.jpg'; // replace with her image

// Paddle – representing the viewer’s focus
const focusBar = {
  width: 300,
  height: 15,
  radius: 5,
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  speed: 18,
  dx: 0
};

// Ball – her essence in motion
const essence = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 30,
  speed: 8,
  dx: 4,
  dy: -4
};

// Traits that define her aura
const traits = [
  'Her eyes', 'Her smile', 'Her voice', 'Her hair', 'Her face', 'Her lips', 'Her nose', 'Her cheeks', 'Her neck', 'Her skin',
  'Her hands', 'Her fingers', 'Her toes', 'Her thighs', 'Her walk', 'Her elegance', 'Her grace', 'Her presence', 'Her glow', 'Her laughter',
  'Her kindness', 'Her gentleness', 'Her strength', 'Her courage', 'Her confidence', 'Her honesty', 'Her wisdom', 'Her compassion', 'Her loyalty', 'Her patience',
  'Her intelligence', 'Her creativity', 'Her ambition', 'Her goals', 'Her dreams', 'Her determination', 'Her vision', 'Her aim', 'Her clarity', 'Her values',
  'Her nurturing', 'Her passion', 'Her softness', 'Her warmth', 'Her hugs', 'Her kisses', 'Her giggles', 'Her intuition', 'Her curiosity', 'Her empathy',
  'Her resilience', 'Her focus', 'Her support', 'Her humor', 'Her priorities', 'Her beliefs', 'Her discipline', 'Her spirituality', 'Her uniqueness', 'Her soul'
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/*
// Traits display layout
const traitRowCount = 6;
const traitColumnCount = 10;
const traitWidth = 125;
const traitHeight = 50;
const traitPadding = 10;
const traitOffsetTop = 100;
const traitOffsetLeft = 250;
*/
// Calculate trait dimensions based on canvas size
const traitColumnCount = 10;
const traitRowCount = 6;
const traitPadding = canvas.width * 0.01; // 1% of canvas width




const traitHeight = canvas.height * 0.05; // 5% of canvas height
const traitOffsetTop = canvas.height * 0.15; // 15% from top
const traitOffsetLeft = canvas.width * 0.15; // 5% margin on both sides


const totalHorizontalPadding = (traitColumnCount - 1) * traitPadding;
const availableWidth = canvas.width - 2 * traitOffsetLeft - totalHorizontalPadding;
const traitWidth = availableWidth / traitColumnCount;


const qualities = [];
shuffleArray(traits);

for (let r = 0; r < traitRowCount; r++) {
  for (let c = 0; c < traitColumnCount; c++) {
    const index = r * traitColumnCount + c;
    if (index < traits.length) {
      qualities.push({
        x: c * (traitWidth + traitPadding) + traitOffsetLeft,
        y: r * (traitHeight + traitPadding) + traitOffsetTop,
        status: 1,
        label: traits[index]
      });
    }
  }
}

function drawFocusBar() {
  ctx.fillStyle = '#bf0a67';
  ctx.fillRect(focusBar.x, focusBar.y, focusBar.width, focusBar.height, focusBar.radius);
}

function drawEssence() {
  const radius = essence.radius;
  const centerX = essence.x;
  const centerY = essence.y;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(auraImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawTraits() {
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  qualities.forEach(trait => {
    if (trait.status === 1) {
      ctx.fillStyle = '#56cc75';
      ctx.fillRect(trait.x, trait.y, traitWidth, traitHeight);
      ctx.fillStyle = '#fff';
      ctx.fillText(trait.label, trait.x + traitWidth / 2, trait.y + traitHeight / 2);
    }
  });
}

function drawTitle() {
  ctx.font = '44px "Pacifico", cursive';
  ctx.fillStyle = '#bf0a67';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('60 Shades of Her', canvas.width / 2, 10);
}

function moveFocusBar() {
  focusBar.x += focusBar.dx;
  if (focusBar.x < 0) focusBar.x = 0;
  if (focusBar.x + focusBar.width > canvas.width) focusBar.x = canvas.width - focusBar.width;
}

function moveEssence() {
  essence.x += essence.dx;
  essence.y += essence.dy;

  if (essence.x + essence.radius > canvas.width || essence.x - essence.radius < 0) essence.dx *= -1;
  if (essence.y - essence.radius < 0) essence.dy *= -1;

  if (
    essence.x > focusBar.x &&
    essence.x < focusBar.x + focusBar.width &&
    essence.y + essence.radius > focusBar.y
  ) {
    essence.dy = -essence.speed;
  }

  if (essence.y + essence.radius > canvas.height) {
    essence.x = canvas.width / 2;
    essence.y = canvas.height - 30;
    essence.dx = 4;
    essence.dy = -4;
  }

  qualities.forEach(trait => {
    if (trait.status === 1) {
      if (
        essence.x > trait.x &&
        essence.x < trait.x + traitWidth &&
        essence.y > trait.y &&
        essence.y < trait.y + traitHeight
      ) {
        essence.dy *= -1;
        trait.status = 0;

        if (revealSound) {
          revealSound.currentTime = 0;
          revealSound.play();
        }
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTitle();
  drawFocusBar();
  drawEssence();
  drawTraits();
}

function update() {
  moveFocusBar();
  moveEssence();
  draw();

  if (qualities.every(q => q.status === 0)) {
    auraFullyRevealed = true;
    showTributeScreen();
    return;
  }
  requestAnimationFrame(update);
}

function showTributeScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.font = 'bold 30px "Courier New", cursive';
  ctx.textAlign = 'center';

  const lines = [
    "Each hit was a praise,",
    "Each bounce was a heartbeat.",
    "And with every smash, I’m reminded:",
    "She’s not just the game —",
    "She’s the entire universe I want to play in.",
	  "❤️"
  ];

  const startY = canvas.height / 2 - (lines.length * 25) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * 30);
  });
}

// Controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') focusBar.dx = -focusBar.speed;
  else if (e.key === 'ArrowRight') focusBar.dx = focusBar.speed;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') focusBar.dx = 0;
});

// Touch controls
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchmove', e => {
  const touchEndX = e.touches[0].clientX;
  if (touchEndX < touchStartX) {
    focusBar.dx = -focusBar.speed;
  } else if (touchEndX > touchStartX) {
    focusBar.dx = focusBar.speed;
  }
});
document.addEventListener('touchend', () => {
  focusBar.dx = 0;
});

// Game starts on image load
auraImage.onload = () => {
  update();
};
