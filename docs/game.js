var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

let totalGamesPlayed = 0;
const MAX_GAMES = 4;

let currentPlayer = "Host"; // "Host" or "Her"

let password = "redshift_password"


function getPlaybackSpeed() {
  if (level < 5) return 600;
  if (level < 9) return 450;
  if (level < 13) return 300;
  return 200;
}


function startGame() {
  if (started) return;

  started = true;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];

  $("#level-title").text(`🎮 ${currentPlayer}'s Game`);
  setTimeout(nextSequence, 600);
}

$("#level-title").click(startGame);


$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function getPlaybackSpeed() {
  if (level < 5) return 600;
  if (level < 9) return 450;
  if (level < 13) return 300;
  return 200;
}


function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    totalGamesPlayed++;

    // 🎉 AFTER 4 GAMES — FINAL SCREEN
    if (totalGamesPlayed >= MAX_GAMES) {
      showFinalWinScreen();
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === "Host" ? "Her" : "Host";

    // Reset Simon state
    startOver();

    $("#level-title").text(
      `😄 Nice try! Next up: ${currentPlayer} (tap to start)`
    );
  }

}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  const speed = getPlaybackSpeed();

  $("#" + randomChosenColour)
    .fadeIn(speed / 2)
    .fadeOut(speed / 2)
    .fadeIn(speed / 2);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

function showFinalWinScreen() {
  started = false;

  $("body").removeClass("game-over");

  // Clear buttons
  $(".container").html("");

  // Add confetti canvas
  $("body").append(`<canvas id="confetti-canvas"></canvas>`);

  // Typing text container
  $("#level-title").html(`<span id="typed-text"></span>`);

  const message = 
    "🏆 I WIN!!! 🏆\n\n" +
    "That was SO fun 😄\n" +
    "You did amazing!\n\n" +
    "As a prize for the host...\n" +
    "👉 I need your phone number 📱✨";

  typeText("typed-text", message, 45, showPhoneInput);

  startConfetti();
}

function showPhoneInput() {
  $(".container").html(`
    <div style="margin-top: 30px;">
      <input
        type="tel"
        id="phone-input"
        placeholder="📱 Your phone number"
      />
      <br>
      <button id="submit-number">
        Claim Prize 🎁
      </button>
    </div>
  `);

  $("#submit-number").click(function () {
    const number = $("#phone-input").val();
    if (!number) {
      alert("😄 You gotta enter it to claim the prize!");
      return;
    }

    alert("Prize received 😌✨");
    console.log("PHONE NUMBER:", number);
  });
}


function typeText(elementId, text, speed, callback) {
  let i = 0;
  const el = document.getElementById(elementId);
  el.innerHTML = "";

  const interval = setInterval(() => {
    el.innerHTML += text[i] === "\n" ? "<br>" : text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) setTimeout(callback, 600);
    }
  }, speed);
}


function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];

  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      tilt: Math.random() * 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    update();
    requestAnimationFrame(draw);
  }

  function update() {
    confetti.forEach((c) => {
      c.y += c.d;
      c.x += Math.sin(c.tilt);

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  draw();
}
