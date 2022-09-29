async function data() {
  const client = await contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "0mo2y3oy5gd8",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "N1jooGmW9nzzaqiYWEmPomstZwjuHf0HU0jHiq1uxBs",
  });
  console.log(client);
  var content = await client.getEntries({
    content_type: "netvoices",
  });
  var list = content.items;
  music_list = list;
  loadTrack(track_index, music_list);
  console.log(content.items[0].fields.music.fields.file.url);
  console.log(content.items[0].fields.img.fields.file);
}
data();
// real project
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let wave = document.getElementById("wave");
let randomIcon = document.querySelector(".fa-random");
let curr_track = document.createElement("audio");
let musicReal = document.getElementsByClassName("music-list");
let mufirst = musicReal.textContent;

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

// const music_list = [
//     {
//         img : './images/stay.png',
//         name : 'Stay',
//         artist : 'The Kid LAROI, Justin Bieber',
//         music : './music/music_stay.mp3'
//     },
//     {
//         img : 'images/fallingdown.jpg',
//         name : 'Falling Down',
//         artist : 'Wid Cards',
//         music : 'music/music_fallingdown.mp3'
//     },
//     {
//         img : 'images/faded.png',
//         name : 'Faded',
//         artist : 'Alan Walker',
//         music : 'music/music_Faded.mp3'
//     },
//     {
//         img : 'images/ratherbe.jpg',
//         name : 'Rather Be',
//         artist : 'Clean Bandit',
//         music : 'music/music_Rather Be.mp3'
//     }
// ];

var music_list;

document
  .getElementById("search-setting")
  .addEventListener("input", () => onSearch(event, music_list));
document
  .querySelector(".prev-track")
  .addEventListener("click", () => prevTrack(music_list, track_index));
document
  .querySelector(".next-track")
  .addEventListener("click", () => nextTrack(music_list, track_index));
// var element = document.querySelectorAll(".music-list");
// element.forEach(element => {
//     element.addEventListener("click", function(e){
//         var muset = e.target.innerText;
//         console.log(muset);
//         let musec = music_list.map(e => e.name).indexOf(muset);
//         track_index = musec;
//         loadTrack(track_index,music_list)
//         playTrack();
//     });
// });
document
  .getElementById("download-btn")
  .addEventListener("click", () => download(music_list));
console.log(track_index);

function download(music_list) {
  sos = music_list[track_index].fields.music.fields.file.url;
  namee = music_list[track_index].fields.name;
  // const fileName = sos.split("/").pop();
  var el = document.createElement("a");
  el.setAttribute("href", sos);
  el.setAttribute("download", namee);
  document.getElementById("download-btn").appendChild(el);
  el.click();
}

function loadTrack(track_index, music_list) {
  clearInterval(updateTimer);
  reset();
  //curr_track.load();
  console.log(music_list[track_index]);
  curr_track.src = music_list[track_index].fields.music.fields.file.url;
  curr_track.load();

  track_art.style.backgroundImage =
    "url(" + music_list[track_index].fields.img.fields.file.url + ")";
  track_name.textContent = music_list[track_index].fields.name;
  track_artist.textContent = music_list[track_index].fields.artist;
  //now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

  updateTimer = setInterval(setUpdate, 1000);

  curr_track.addEventListener("ended", () => nextTrack(music_list));
  random_bg_color();
}

function random_bg_color() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let a;

  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a += y;
    }
    return a;
  }
  let Color1 = populate("#");
  let Color2 = populate("#");
  var angle = "to right";

  let gradient =
    "linear-gradient(" + angle + "," + Color1 + ", " + Color2 + ")";
  document.body.style.background = gradient;
}
function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}
function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}
function playRandom() {
  isRandom = true;
  randomIcon.classList.add("randomActive");
}
function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove("randomActive");
}
function repeatTrack() {
  // let current_index = track_index;
  // console.log(track_index);
  loadTrack(track_index, music_list);
  playTrack();
}
function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
  curr_track.play();
  isPlaying = true;
  // track_art.classList.add("rotate");
  // wave.classList.add("loader");
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  track_art.classList.remove("rotate");
  wave.classList.remove("loader");
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(music_list) {
  console.log(track_index);
  if (track_index < music_list.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  console.log(track_index);
  loadTrack(track_index, music_list);
  playTrack();
}
function prevTrack(music_list) {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = music_list.length - 1;
  }
  loadTrack(track_index, music_list);
  playTrack();
}

function onSearch(event, music_list) {
  console.log(music_list);
  var eve = event.target.value;
  console.log(eve);
  var filtered = music_list.filter((robs) => {
    return robs.fields.name.toLowerCase().includes(eve.toLowerCase());
  });
  var result = "";
  filtered.forEach((robs) => {
    result += `<div class="music-list">${robs.fields.name}</div>`;
  });
  document.getElementById("list-scroll").innerHTML = result;
  var element = document.querySelectorAll(".music-list");
  element.forEach((element) => {
    element.addEventListener("click", function (e) {
      var muset = e.target.innerText;
      console.log(muset);
      let musec = music_list.map((e) => e.fields.name).indexOf(muset);
      track_index = musec;
      loadTrack(track_index, music_list);
      playTrack();
    });
  });
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}
function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}
function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
