const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const brickSound = document.getElementById('brickSound');

let gameWon = false;


// Set the canvas size dynamically for mobile responsiveness
canvas.width = window.innerWidth - 40; // Reduce padding for mobile
canvas.height = window.innerHeight - 80;

const ballImage = new Image();
ballImage.src = 'face.jpg'; // replace with actual path

// Paddle
const paddle = {
  width: 300,
  height: 15,
  radius: 5,
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  speed: 18,
  dx: 0
};

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 30,
  speed: 8,
  dx: 4,
  dy: -4
};

// Emotions (bricks)
const emotions = ['Her eyes', 'Her smile', 'Her voice', 'Her hair', 'Her face', 'Her lips', 'Her nose', 'Her cheeks', 'Her neck', 'Her skin',
'Her hands', 'Her fingers', 'Her toes', 'Her thighs', 'Her walk', 'Her elegance', 'Her grace', 'Her presence', 'Her glow', 'Her laughter',
'Her kindness', 'Her gentleness', 'Her strength', 'Her courage', 'Her confidence', 'Her honesty', 'Her wisdom', 'Her compassion', 'Her loyalty', 'Her patience',
'Her intelligence', 'Her creativity', 'Her ambition', 'Her goals', 'Her dreams', 'Her determination', 'Her vision', 'Her aim', 'Her clarity', 'Her values',
'Her nurturing', 'Her passion', 'Her softness', 'Her warmth', 'Her hugs', 'Her kisses', 'Her giggles', 'Her intuition', 'Her curiosity', 'Her empathy',
'Her resilience', 'Her focus', 'Her support', 'Her humor', 'Her priorities', 'Her beliefs', 'Her discipline', 'Her spirituality', 'Her uniqueness', 'Her soul'
];
/*[
  'Rage', 'Frustration', 'Resentment', 'Wrath', 'Fury', 
  'Irritation', 'Hatred', 'Grief', 'Sorrow', 'Heartbreak', 
  'Misery', 'Despair', 'Melancholy', 'Regret', 'Isolation', 
  'Emptiness', 'Detachment', 'Abandonment', 'Alienation', 
  'Disconnection', 'Anxiety', 'Insecurity', 'Panic', 
  'Apprehension', 'Paranoia', 'Dread', 'Phobia', 
  'Uncertainty', 'Confusion', 'Indecision', 'Hesitation', 
  'Skepticism', 'Ambivalence', 'Distrust'

];*/

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = 125;
const brickHeight = 50;
const brickPadding = 10;
const brickOffsetTop = 100;
const brickOffsetLeft = 250;

const bricks = [];

shuffleArray(emotions);

for (let r = 0; r < brickRowCount; r++) {
  for (let c = 0; c < brickColumnCount; c++) {
    const emotionIndex = r * brickColumnCount + c;
    if (emotionIndex < emotions.length) {
      bricks.push({
        x: c * (brickWidth + brickPadding) + brickOffsetLeft,
        y: r * (brickHeight + brickPadding) + brickOffsetTop,
        status: 1,
        label: emotions[emotionIndex]
      });
    }
  }
}


function drawPaddle() {
  ctx.fillStyle = '#bf0a67';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.radius);
}

function drawBall() {
  //ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, 2 * ball.radius, 2 * ball.radius);
  const radius = ball.radius;
  const centerX = ball.x;
  const centerY = ball.y;

  ctx.save(); // Save current state

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip(); // Anything drawn now will be clipped to the circle

  // Draw the image centered on the ball
  ctx.drawImage(ballImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

  ctx.restore(); // Restore state so the clip doesn't affect other things
}

function drawBricks() {
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  bricks.forEach(brick => {
    if (brick.status === 1) {
      ctx.fillStyle = '#56cc75';
      ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
      ctx.fillStyle = '#fff';
      ctx.fillText(brick.label, brick.x + brickWidth / 2, brick.y + brickHeight / 2);
    }
  });
}

function drawTitle() {
  ctx.font = '44px "Pacifico", cursive';
  ctx.fillStyle = '#bf0a67'; // title color
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('60 Shades of Her', canvas.width / 2, 10);
}

function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Paddle collision
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Bottom collision (game over reset)
  if (ball.y + ball.radius > canvas.height) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 4;
    ball.dy = -4;
  }

  // Brick collision
  bricks.forEach(brick => {
    if (brick.status === 1) {
      if (
        ball.x > brick.x &&
        ball.x < brick.x + brickWidth &&
        ball.y > brick.y &&
        ball.y < brick.y + brickHeight
      ) {
        ball.dy *= -1;
        brick.status = 0;
		
		if(brickSound) {
			brickSound.currentTime = 0; // rewind
			brickSound.play();
		}
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTitle();
  drawPaddle();
  drawBall();
  drawBricks();
}


function update() {
  movePaddle();
  moveBall();
  draw();
  // Check win condition
  if (bricks.every(brick => brick.status === 0)) {
    gameWon = true;
    showWinScreen();
    return;
  }
  requestAnimationFrame(update);
}

/*
function showWinScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('You Win! Emotions Cleared ❤️✨', canvas.width / 2, canvas.height / 2);
}*/

function showWinScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
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


/*
function update() {
  if (gameWon) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();

  movePaddle();
  moveBall();
  checkCollisions();

  // Check win condition
  if (bricks.every(brick => brick.status === 0)) {
    gameWon = true;
    showWinScreen();
    return;
  }

  requestAnimationFrame(update);
}
*/


document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
  else if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') paddle.dx = 0;
});

// Add touch controls for mobile
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchmove', e => {
  const touchEndX = e.touches[0].clientX;
  if (touchEndX < touchStartX) {
    paddle.dx = -paddle.speed;
  } else if (touchEndX > touchStartX) {
    paddle.dx = paddle.speed;
  }
});

document.addEventListener('touchend', () => {
  paddle.dx = 0;
});

ballImage.onload = () => {
  update();
};
