let notify = false;

// document.onload = function() {console.log("document")}
window.onload = function() {init()}

function requestNotification() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    return;
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // Notifications have already been granted
  }
  else if (Notification.permission !== 'denied') {
    // If the permission has also not been set to denied, request permission
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        // The user is allowing notifications
        notify = true;
      } else {
        // User disallows notifications, inform user of limited us of page 
        // without notifications

        notify = false; // just in case
        const diniedAlert = document.createElement("div");
        diniedAlert.classList.add("warning");
        diniedAlert.innerHTML = "<p>This website's funtions are quite limited without notifications</p>";
        document.body.appendChild(diniedAlert);
      }
    });
  }
  return;
}
function notifyTimesUp(event) {
  // Depending on the event have a certain notification message
  var notification = new Notification("Times Up, take a small break");
  // notification.onclick = function() {console.log("notification accepted")};
}


/********
 Start pomodoro timer code
 ********/

// Create global variables 
// tijd in seconden 
let timeLeft = 5; // 25 * 60;
// verlopen tijd 
let time = 0;

document.querySelector(".start").addEventListener("click", () => startTimer());
document.querySelector(".stop").addEventListener("click", () => resetTimer());
document.querySelector(".pauze").addEventListener("click", () => pauseTimer());

function init() {
  updateDOM();
  requestNotification();
}

function calcTime() {
  var minutes = Math.floor(timeLeft / 60);
  var seconds = Math.round((timeLeft/60 - minutes) * 60);
  seconds < 10? seconds = `0${seconds}`: seconds = seconds;
  console.log(`calcTime ${minutes}, ${seconds}`);
  return [minutes, seconds];
}
function startTimer() {
  // Setup time interval to fire every second to reduce the 
  // alotted time by one second and call the dom update function

  timer = window.setInterval(() => {
    timeLeft--;
    updateDOM();
    console.log(timeLeft);
    if(timeLeft === 0) {
      if(!notify) {
        notifyTimesUp();
      }
      resetTimer();
    }
  }, 1000)
}
function resetTimer() {
  clearInterval(timer);
  // timeLeft = 0;
}
function pauseTimer() {
  clearInterval(timer);
}
function updateDOM() {
  // update the time string in the dom
  const timeEl = document.querySelector(".time");
  const time = calcTime();
  console.log(time);
  timeEl.textContent = `${time[0]} : ${time[1]}`;
}