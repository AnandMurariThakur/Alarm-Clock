//to set the current date and time
const timeDisplay = document.querySelector("#current-time");
const dateDisplay = document.querySelector("#current-date");
// to get the user input for set alarm
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
//render list of alarm
const alarmContainer = document.querySelector("#alarms-container");

// Setting the real time time
window.addEventListener("DOMContentLoaded", (event) => {
  setInterval(getCurrentDateTime, 1000);
  fetchAlarm();
});

// Display current time and date
function getCurrentDateTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if (hh == 0) {
    hh = 12;
  }
  if (hh > 12) {
    hh = hh - 12;
    session = "PM";
  }

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;
  let time = hh + ":" + mm + ":" + ss + " " + session;
  dateDisplay.innerText = new Date().toUTCString().slice(5, 16);
  timeDisplay.innerText = time;
  return time;
}

//fetch the api for quote
fetch("https://api.quotable.io/random")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("quoteText").innerHTML = data.content;
    document.getElementById("quoteAuthor").innerHTML = `- ${data.author}`;
  });

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);
function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value < 10 ? "0" + setHours.value : setHours.value;
  const minuteValue =
    setMinutes.value < 10 ? "0" + setMinutes.value : setMinutes.value;
  const secondValue =
    setSeconds.value < 10 ? "0" + setSeconds.value : setSeconds.value;
  const amPmValue = setAmPm.value;

  if (
    hourValue > 0 &&
    hourValue <= 12 &&
    minuteValue >= 0 &&
    minuteValue < 60 &&
    secondValue >= 0 &&
    secondValue < 60
  ) {
    const alarmTime = convertToTime(
      hourValue,
      minuteValue,
      secondValue,
      amPmValue
    );
    setHours.value = "";
    setMinutes.value = "";
    setSeconds.value = "";
    setAmPm.value = "AM";
    setAlarm(alarmTime);
  } else {
    alert("Please set the Proper timing");
  }
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  let hh = hour.slice(-2);
  let mm = minute.slice(-2);
  let sec = second.slice(-2);
  return `${hh}:${mm}:${sec} ${amPm}`;
}

//check the current time with alarm time also store into local
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time == getCurrentDateTime()) {
      alert("Alarm Ringing");
    }
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm-list");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class=" delete-alarm" data-id=${intervalId}>Delete Alarm</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );

  alarmContainer.prepend(alarm);
}
// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}
// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
