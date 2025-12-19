const bgm = new Audio("assets/02. Sensei's Dojo.mp3");
bgm.autoplay = true;
bgm.muted = true; // Start muted to bypass autoplay restrictions

bgm.addEventListener('canplaythrough', () => {
  bgm.muted = false; // Unmute after the audio is ready to play
  bgm.play().catch((error) => {
    console.log("Autoplay was prevented. User interaction is required to play the audio.");
    document.addEventListener('click', playBGMOnce);
    document.addEventListener('touchstart', playBGMOnce);
  });
});

function playBGMOnce() {
  bgm.play().then(() => {
    document.removeEventListener('click', playBGMOnce);
    document.removeEventListener('touchstart', playBGMOnce);
  });
}

const score1 = sessionStorage.getItem("score") || 0;
const timePlayed1 = sessionStorage.getItem("timePlayed") || 0;
const missedFruits1 = sessionStorage.getItem("missedFruits") || 0;

console.log("Score:", score1);
console.log("Time Played:", timePlayed1);
console.log("Missed Fruits:", missedFruits1);

document.getElementById("finalTime").innerText = `Time Played: ${timePlayed1}s`;
document.getElementById("finalScore").innerText = `Score: ${score1}`;
document.getElementById("missedFruits").innerText = `Missed Fruits: ${missedFruits1}`;


