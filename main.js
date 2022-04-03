const wrapper = document.querySelector("#wrapper"),
  musicImg = document.querySelector("#music-img"),
  musicName = document.querySelector("#song-name"),
  musicArtist = document.querySelector("#song-auth"),
  mainAudio = document.querySelector("#main-audio"),
  btnPlayPause = document.querySelector("#btn-play"),
  prevButton = document.querySelector("#btn-back"),
  nextButton = document.querySelector("#btn-next"),
  progressBar = document.querySelector('#progress-bar'),
  progressDetail = document.querySelector('#progress-detail'),
  nowTxt = document.querySelector('#now-txt'),
  btnResize = document.querySelector('#resize-btn'),
  imgBox = document.querySelector('.imgBx'),
  volumeRange = document.querySelector('#volume-range'),
  volumeIcon = document.querySelector('#volume-icon');

let musicIndex = Math.floor(Math.random() * allMusic.length);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

btnResize.addEventListener('click', () => {
  imgBox.classList.toggle('show');
  btnResize.classList.toggle('expanded');
});

function loadMusic(indexNumber) {
  musicName.innerHTML = allMusic[indexNumber].name;
  musicArtist.innerHTML = allMusic[indexNumber].artist;
  musicImg.src = `./assets/imgs/${allMusic[indexNumber].img}.jpg`;
  mainAudio.src = `./assets/songs/${allMusic[indexNumber].src}.mp3`;
  playingNow();
}

//Play Pause Music
function playMusic() {
  wrapper.classList.add("paused");
  btnPlayPause.innerHTML = '<ion-icon name="pause"></ion-icon>';
  btnPlayPause.style.paddingLeft = "1px";
  nowTxt.style.display = 'block'
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  btnPlayPause.innerHTML = '<ion-icon name="play"></ion-icon>';
  btnPlayPause.style.paddingLeft = "3px";
  nowTxt.style.display = 'none'
  mainAudio.pause();
}

btnPlayPause.addEventListener("click", () => {
  let isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

//Next And Previous Button
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length - 1
    ? (musicIndex = 0)
    : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 0
    ? (musicIndex = allMusic.length - 1)
    : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

nextButton.addEventListener("click", () => {
  nextMusic();
});

prevButton.addEventListener("click", () => {
  prevMusic();
});

//Set Progress Bar
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressDetail.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('#song-current-time');
    let musicDuration = wrapper.querySelector('#song-duration');

    mainAudio.addEventListener('loadeddata', () => {
        //update total song duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalMin < 10) {
            totalMin = `0${totalMin}`;
        } 
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        } 
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentMin < 10) {
        currentMin = `0${currentMin}`;
    } 
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//update playing song current time according to the progress bar width
progressBar.addEventListener('click', (e) => {
    let progressWidthhval = progressBar.clientWidth; //Get current width progress bar
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthhval) * songDuration;
});

//repeat song when click button repeat
const repeatBtn = wrapper.querySelector('#repeat-btn');
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Song looped');
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Playback shuffle');
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Playlist looped');
            break;
    }
});

//after the song ended wil do according repeat button status
mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
      case 'repeat':
          nextMusic();
          break;
      case 'repeat_one':
          mainAudio.currentTime = 0;
          loadMusic(musicIndex);
          playMusic();
          break;
      case 'shuffle':
          let randIndex = Math.floor(Math.random() * allMusic.length);
          do {
              randIndex = Math.floor(Math.random() * allMusic.length);
          }
          while (musicIndex == randIndex);
          musicIndex = randIndex;
          loadMusic(musicIndex);
          playMusic();
          break;
    }
});

//Set event list song show or hidden
const btnListSong = wrapper.querySelector('#list-song-btn');
const listMusic = wrapper.querySelector('#list-music');
const btnListSongClose = wrapper.querySelector('#btn-close-list');

btnListSong.addEventListener('click', () => {
  listMusic.classList.add('show');
});

btnListSongClose.addEventListener('click', () => {
  listMusic.classList.remove('show');
});

//create li according to the array music
const ulTag = listMusic.querySelector('#list');

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i}">
                <div>
                    <div class="music-name">${allMusic[i].name}</div>
                    <div class="music-artist">${allMusic[i].artist}</div>
                </div>    
                <audio class="audio-${i}" src="./assets/songs/${allMusic[i].src}.mp3"></audio>                
                <div id="audio-${i}" class="music-duration"></div>
              </li>`
  ulTag.insertAdjacentHTML('beforeend', liTag)

  let liAudioDuration = ulTag.querySelector(`#audio-${i}`);
  let liAudioTag = ulTag.querySelector(`.audio-${i}`);

  liAudioTag.addEventListener('loadeddata', () => {
    let audioDuration = liAudioTag.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalMin < 10) {
          totalMin = `0${totalMin}`;
      } 
      if (totalSec < 10) {
          totalSec = `0${totalSec}`;
      } 
      liAudioDuration.innerText = `${totalMin}:${totalSec}`;
      liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
  });
}

//play particular song on click
const allLiTags = ulTag.querySelectorAll('li');
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector('.music-duration');

    if (allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing');
      audioTag.innerHTML = audioTag.getAttribute('t-duration');
    }

    if (allLiTags[j].getAttribute('li-index') == musicIndex) {
      allLiTags[j].classList.add('playing');
      audioTag.innerHTML = 'Playing';
    }
  
    allLiTags[j].setAttribute('onclick', 'clicked(this)');
  }
}

//play song on li click
function clicked(element) {
  let getLiIndex = element.getAttribute('li-index');
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//change volume audio when change value of range and set icon according value of volume
volumeRange.addEventListener('input', () => {
  let value = volumeRange.value / 100;
  mainAudio.volume = value;
  console.log(value);
  setIconVolume(value);
});

function setIconVolume(value) {
  if (value == 0) {
    volumeIcon.setAttribute('name', 'volume-mute');
  }
  if (value <= 0.15 && value > 0) {
    volumeIcon.setAttribute('name', 'volume-off');
  }
  if (value > 0.15 && value <= 0.6) {
    volumeIcon.setAttribute('name', 'volume-low');
  }
  if (value > 0.6) {
    volumeIcon.setAttribute('name', 'volume-high');
  }
} 