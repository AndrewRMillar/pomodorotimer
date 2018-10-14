(function(){

  // timeInt, time and timeEl need to be globals because they need to 
  // be accessed outside of the function scope 

  var amount = 5; // 25 minuter * 60 seconden 
  var timeInt, time = {tot: amount, min: 0, sec: 0}; 
  const timeEl = document.querySelector(".timeleft");
  var session = sessionStorage;
  var denied = document.querySelector(".denied");
  session.setItem("number", 0);
  
  console.log("version 0.8");

  window.onload = function() {init()}
  // window.addEventListener("load", init());

  function requestNotification() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      denied.textContent = "The functionality of this service will be severely limited without notifications";
      return; // no notification option
      
    } else if (Notification.permission === "granted") {
      // Notifications have already been granted, action needed
    } else if (Notification.permission === 'denied') {
      denied.textContent = "The functionality of this service will be severely limited without notifications";
      return;
    } else if (Notification.permission !== 'denied') {
      // If the permission has also not been set to denied, request permission
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          // The user is allowing notifications
          denied.classList.add("hide");
          window.setTimeout(() => denied.style.visibility = "hidden", 500)
        } else {
          // User disallows notifications, highlight limited function
          notify = false; // just in case, not using atm
          denied.textContent = "The functionality of this service will be severely limited without notifications";
        }
      });
    }
    return;
  }

  const init = function() {
    // Initiate the script
    // console.log(amount);

    // update the DOM to the amount of time which is set
    timeEl.innerHTML = timeFormatted();
    requestNotification();
  }

  const incrementSession = function() {
    let number = session.getItem("number");
    number++;
    session.setItem("number", number);
  }
  
  const getSessionVal = function() {
    return session.getItem("number");
  }

  function notifyTimesUp() {
    // Depending on the nuber of pomodoro's return a sertain notification
    if (getSessionVal() % 4 === 0) {
      new Notification("That were 4 pomodoro's take a longer break, say 20 or 30 minutes");
    } else { 
      new Notification("Times Up, take a short break");
    }
  }

  const clear = function(arg = 'nothing') {
    // Clear interval and reset time
    console.log('clear', arg);
    clearInterval(timeInt);
    time.tot = amount;
    timeEl.innerHTML = timeFormatted()
  };

  const timeFormatted = function() {
    // Return a template string with the minutes and seconds still to go
    time.min = Math.floor(time.tot / 60);
    time.sec = time.tot % 60;
    time.sec < 10? time.sec = '0' + time.sec: time.sec = time.sec;
    return `${time.min} : ${time.sec}`;
  }


  const timer = function() {
  // Start timer, only side effects
  // time not set, then set time anew
  !time.tot? time.tot = amount: time.tot = time.tot; 
  // Start time interval
  timeInt = setInterval(() => {
    console.log(`${time.tot}`);          
    // Has time reached 1 reduce time by one, don't let time become negative
    time.tot >= 1? time.tot--: time.tot = 0;
    timeEl.innerHTML = timeFormatted();
    // If time has reached 0, unset the timeinterval, reset the app and alert the user
    if (time.tot <= 0) {
      // timeInt = undefined;
      incrementSession();
      notifyTimesUp(event);
      clear('time end');
    }
  }, 1000);
  }
    
  // Sounds
  function sound(type) {
    var ring = new Audio('ring.mp3');
    var wind = new Audio('wind.mp3');
    type === "ring"? ring.play(): wind.play();
  }
  
  // Event listeners
  document.querySelector(".stop-timer").addEventListener("click", () => {
    sound("ring");
    console.log('Stop time button');
    clearInterval(timeInt);
  });
  document.querySelector(".set-timer").addEventListener("click", () => {
    console.log('Start time button');
    // console.log(time.tot);
    sound("wind")
    timer();
  });
  document.querySelector(".clear-timer").addEventListener("click", () => {
    console.log('Clear button');
    clear('button');
  });

})();

