// =============================
// CUSTOMIZE THESE VALUES
// =============================
const SECRET_CODE = "010926"; // Change this to your own 4-digit code.
const MESSAGES = [
  "I love how you can make an ordinary day feel special.",
  "I'm proud of the person you are becoming.",
  "Thank you for being someone I can laugh with.",
  "Your smile has a way of making everything feel lighter.",
  "You deserve every beautiful thing that comes your way.",
  "I'm grateful that our story happened at all.",
  "Even the smallest memories with you mean a lot to me."
];

const screens = [...document.querySelectorAll(".screen")];
let current = "opening";

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  current = id;
  window.scrollTo({top:0, behavior:"smooth"});
  if (id !== "lock") document.getElementById("error")?.classList.remove("show");
  if (id === "final") makeConfetti();
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

// Password keypad
let entered = "";
const dots = [...document.querySelectorAll("#dots span")];
const error = document.getElementById("error");

function renderDots() {
  dots.forEach((dot, i) => dot.classList.toggle("filled", i < entered.length));
}

document.querySelectorAll("#keypad button[data-key]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    if (key === "back") entered = entered.slice(0, -1);
    else if (entered.length < 6) entered += key;

    renderDots();

    if (entered.length === 6) {
      setTimeout(() => {
        if (entered === SECRET_CODE) {
          entered = "";
          renderDots();
          showScreen("gift");
        } else {
          error.classList.add("show");
          document.querySelector(".lock-card").animate(
            [{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(-5px)"},{transform:"translateX(0)"}],
            {duration:280}
          );
          entered = "";
          renderDots();
        }
      }, 180);
    }
  });
});

// Gift
const gift = document.getElementById("giftBox");
gift.addEventListener("click", () => {
  if (gift.classList.contains("open")) return;
  gift.classList.add("open");
  setTimeout(() => showScreen("bouquet"), 900);
});

// Playlist interaction
// =============================
// MUSIC PLAYER
// =============================
const audioPlayer = document.getElementById("audioPlayer");
const songs = document.querySelectorAll(".song");

songs.forEach(song => {
  song.addEventListener("click", () => {

    const songFile = song.dataset.song;
    const icon = song.querySelector("i");

    // Kalau lagu yang sama sedang dimainkan → pause
    if (audioPlayer.src.includes(songFile) && !audioPlayer.paused) {
      audioPlayer.pause();
      icon.textContent = "▶";
      song.classList.remove("active");
      return;
    }

    // Reset semua lagu
    songs.forEach(s => {
      s.classList.remove("active");
      s.querySelector("i").textContent = "▶";
    });

    // Pilih lagu
    song.classList.add("active");
    icon.textContent = "❚❚";

    audioPlayer.src = songFile;
    audioPlayer.play().catch(error => {
      console.log("Audio gagal dimainkan:", error);
    });
  });
});

// Ketika lagu selesai
audioPlayer.addEventListener("ended", () => {
  const currentSong = document.querySelector(".song.active");

  if (currentSong) {
    currentSong.classList.remove("active");
    currentSong.querySelector("i").textContent = "▶";
  }
});

// Reasons jar
const message = document.getElementById("message");
const messageBtn = document.getElementById("messageBtn");
messageBtn.addEventListener("click", () => {
  const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  message.textContent = random;
  const jar = document.querySelector(".jar");
  jar.animate(
    [{transform:"rotate(0)"},{transform:"rotate(-8deg)"},{transform:"rotate(8deg)"},{transform:"rotate(-5deg)"},{transform:"rotate(0)"}],
    {duration:550, easing:"ease-in-out"}
  );
});

// Restart
document.getElementById("restart").addEventListener("click", () => {
  gift.classList.remove("open");
  message.textContent = "There are so many reasons. Here's one...";
  showScreen("opening");
});

// Falling petals
function createPetal() {
  const p = document.createElement("div");
  p.className = "petal";
  p.textContent = Math.random() > .5 ? "✿" : "♥";
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (12 + Math.random() * 14) + "px";
  p.style.animationDuration = (6 + Math.random() * 6) + "s";
  document.querySelector(".petals").appendChild(p);
  setTimeout(() => p.remove(), 13000);
}
setInterval(createPetal, 1200);

function makeConfetti() {
  const box = document.querySelector(".confetti");
  box.innerHTML = "";
  for (let i=0;i<45;i++) {
    const p = document.createElement("i");
    p.textContent = Math.random() > .5 ? "✦" : "♥";
    p.style.position = "absolute";
    p.style.left = Math.random()*100+"%";
    p.style.top = "-20px";
    p.style.fontStyle = "normal";
    p.style.fontSize = (10 + Math.random()*13)+"px";
    p.style.opacity = ".65";
    p.style.animation = `fall ${3+Math.random()*4}s linear ${Math.random()*1.5}s forwards`;
    box.appendChild(p);
  }
}
