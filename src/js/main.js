(function(){
  // Placing code inside self executing function to encapsulate code and not create globals

  // TODO: Add a time for the break, either 5 min of 30 min depending on the number of pomodoro's

  // timeInt, time and timeEl need to be globals because they need to 
  // be accessed outside of the function scope 

  let amount = 1500, // 25 minutes * 60 seconds 
      timeInt, time = {tot: amount, min: 0, sec: 0}, 
      denied = document.querySelector(".denied");
  const timeEl = document.querySelector(".timeleft");
  sessionStorage.setItem("number", 0);
  
  console.log("version 0.95");

  window.onload = function() {init()}
  // window.addEventListener("load", init());

  const requestNotification = function() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      denied.textContent = "Your browser does not support notifications. I advise to install a modern browser like Chrome Firefoz Opera or use Microsoft Edge";
      return; // no notification option
      
    } else if (Notification.permission === "granted") {
      // Notifications have already been granted, remove text
      denied.classList.add("hide");
      window.setTimeout(() => denied.style.visibility = "hidden", 500);
      return;
    } else if (Notification.permission === 'denied') {
      // Notifications have been denied, change text to reflect choice
      denied.textContent = "The functionality of this service will be severely limited without notifications";
      return;
    } else if (Notification.permission !== 'denied') {
      // If the permission has also not been set to denied, request permission
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          // The user is allowing notifications
          denied.classList.add("hide");
          window.setTimeout(() => denied.style.visibility = "hidden", 500);
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
    timeEl.innerHTML = timeFormatted();
    requestNotification();
  }
  
  const getSessionVal = function() {
    // Retrieve the number of pomodoro's already achieved
    return sessionStorage.getItem("number");
  }

  const incrementSession = function() {
    // Increase the number of pomodoro in the browser session
    let number = getSessionVal();
    number++;
    sessionStorage.setItem("number", number);
  }

  const notifyTimesUp = function() {
    // Play the the ring and depending on the nuber of pomodoro's return a sertain notification
    sound("ring");
    if (getSessionVal() % 4 === 0) {
      new Notification("Pomodoro Timer", {body:"That were 4 pomodoro's, take a longer break. About 20 or 30 minutes", icon:"./img/tomato.jpg"});
      return;
    } else if(getSessionVal() % 3 === 0) { 
      new Notification("Pomodoro Timer", {body:"You have completed tree pomodoro's, take a short break", icon:"./img/tomato.jpg"});
      return;
    } else if(getSessionVal() % 2 === 0) { 
      new Notification("Pomodoro Timer", {body:"You have completed two pomodoro's, take a short break", icon:"./img/tomato.jpg"});
      return;
    } else {
      new Notification("Pomodoro Timer", {body:"You have completed a pomodoro, take a short break", icon:"./img/tomato.jpg"});
      return;
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
    time.min = time.min < 10? time.min = `0${time.min}`: time.min;
    time.sec = time.tot % 60;
    time.sec = time.sec < 10? time.sec = `0${time.sec}`: time.sec;
    return `${time.min} : ${time.sec}`;
  }

  // This time using a callibrated setTimeout function
  const doTimer = function(length, oninstance, oncomplete) {
    var steps = length / 1000,
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance() {
      if(count++ == steps * 1000) {
          oncomplete();
      }
      else {
          oninstance(steps, count);
          var diff = (new Date().getTime() - start) - (count * speed);
          timeInt = setTimeout(instance, (speed - diff));
      }
    } 
    window.setTimeout(instance, speed);
  }

  const timer = function() {
    doTimer(time.tot, () => {
      // console.log(time.tot);
      time.tot >= 1? time.tot--: time.tot = 0;
      timeEl.innerHTML = timeFormatted();
    },  () => {
      // console.log('times up');
      incrementSession();
      notifyTimesUp();
      clear('time end');
    });
  }
    
  // Sounds, maybe later
  const sound = function(type) {
    const ring = new Audio('./sounds/ring.mp3');
    const wind = new Audio('./sounds/wind.mp3');
    type === "ring"? ring.play(): wind.play();
  }
  
  // Event listeners
  document.querySelector(".stop-timer").addEventListener("click", () => {
    // console.log('Stop time button');
    clearInterval(timeInt);
  });
  document.querySelector(".set-timer").addEventListener("click", () => {
    // console.log('Start time button');
    sound("wind")
    timer();
  });
  document.querySelector(".clear-timer").addEventListener("click", () => {
    // console.log('Clear button');
    clear('button');
    sound("ring");
  });

})();