const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true; 

window.addEventListener("load", ()=>{
	loadMusic(musicIndex);
	playingSong();
});


function loadMusic(indexNumb) {
	musicName.innerText = allMusic[indexNumb -1].name;
	musicArtist.innerText = allMusic[indexNumb -1].artist;
	musicImg.src=`img/${allMusic[indexNumb - 1].img}.jpg`;
	mainAudio.src=`songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//função de play
function playMusic(){
	wrapper.classList.add("paused");
	playPauseBtn.querySelector("i").innerText = "pause";
	mainAudio.play();
}

//função de pause
function pauseMusic(){
	wrapper.classList.remove("paused");
	playPauseBtn.querySelector("i").innerText = "play_arrow";
	mainAudio.pause();
}

//proxima musica
function nextMusic(){
	musicIndex++;
	musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
	loadMusic(musicIndex);
	playMusic();
}

//musica anterior
function prevMusic(){
	musicIndex--;
	musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
	loadMusic(musicIndex);
	playMusic();
}

//evento de tocar ou pausar musica
playPauseBtn.addEventListener("click", ()=>{
	const isMusicPaused = wrapper.classList.contains("paused");
	isMusicPaused ? pauseMusic() : playMusic();
});

//evento de proxima musica
nextBtn.addEventListener("click", ()=>{
	nextMusic();
});

//evento de musica anterior
prevBtn.addEventListener("click", ()=>{
	prevMusic();
});

//atualiza barra de progresso te acordo com o tempo de musica
mainAudio.addEventListener("timeupdate", (e)=>{
	const currentTime = e.target.currentTime; //pegando tempo corrente da musica tocada
	const duration = e.target.duration; //pegando duração total da musica
	let progressWidth = (currentTime / duration) * 100;
	progressBar.style.width = `${progressWidth}%`;

	let musicCurrentTime = wrapper.querySelector(".current"),
		musicDuration = wrapper.querySelector(".duration");

	mainAudio.addEventListener("loadeddata", ()=>{
		let mainAdDuration = mainAudio.duration;
		let totalMin = Math.floor(mainAdDuration / 60);
		let totalSec = Math.floor(mainAdDuration % 60);
		if(totalSec < 10){
			totalSec = `0${totalSec}`;
		}
		musicDuration.innerText = `${totalMin}:${totalSec}`;
		});

		//atualiza tempo da musica tocada
		let currentMin = Math.floor(currentTime / 60);
		let currentSec = Math.floor(currentTime % 60);
		if(currentSec < 10){
			currentSec = `0${currentSec}`;
		}
		musicCurrentTime.innerText = `${currentMin}:${currentSec}`;	
});

//atualizando tempo corrente da musica de acordo com o widht da barra de progresso
progressArea.addEventListener("click", (e)=>{
	let progressWidthVal = progressArea.clientWidth; //pegando width da barra de progresso
	let clickedOffSetX = e.offsetX; //pegando offset valor
	let songDuration = mainAudio.duration; //pegando duração total da musica

	mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
	playMusic();
	playingSong();
});

//muda icone on click
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
	let getText = repeatBtn.innerText;

	switch(getText){
		case "repeat":
		repeatBtn.innerText = "repeat_one";
		repeatBtn.setAttribute("title", "Song looped");
		break;
		case "repeat_one":
		repeatBtn.innerText = "shuffle";
		repeatBtn.setAttribute("title", "Playback shuffle");
		break;
		case "shuffle":
		repeatBtn.innerText = "repeat";
		repeatBtn.setAttribute("title", "Playlist looped");
		break;
	}
});


//o que fazer quando a musica acaba
mainAudio.addEventListener("ended", ()=>{
	let getText = repeatBtn.innerText;

	switch(getText){
		case "repeat":
		nextMusic();
		break;
		case "repeat_one":
		mainAudio.currentTime = 0; //mudando tempo da musica par 0
		loadMusic(musicIndex);
		playMusic();
		break;
		case "shuffle":
		let randIndex = Math.floor((Math.random() * allMusic.length) +1);
		do{
			randIndex = Math.floor((Math.random() * allMusic.length) +1);
		}while(musicIndex == randIndex);// loop de numero random até não ser igual a numero do music Index
			musicIndex = randIndex;
			loadMusic(musicIndex);
			playMusic();
			playingSong();
		break;
	}
});

showMoreBtn.addEventListener("click", ()=>{
	musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
	showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//cria tags li de acordo com a quantidade de arrays da lista
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserindo tag li dentro da ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
  });
}

//tocar musica de acordo com a lista quando clicada
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //se o index da tag li for igual a do music Index, adiciona a classe playing
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//função de clicar li
function clicked(element){
	let getLiIndex = element.getAttribute("li-index");
	musicIndex = getLiIndex;
	loadMusic(musicIndex);
	playMusic();
	playingSong();
}

