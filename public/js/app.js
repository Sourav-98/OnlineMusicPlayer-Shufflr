window.shuffleState = false;    // by default, shuffle is off
window.repeatState = false;
var lastPlayed = Array();
var currentTrack = -1;
var repeatCurrent = false;

const loadDoc = function(){
    const Http = new XMLHttpRequest();
    // const url='https://5dd1894f15bbc2001448d28e.mockapi.io/playlist';
    const url = "https://shufflr-heroku-api.herokuapp.com/load_playlist";
//     console.log("Initial: "+Http.readyState);
    Http.open("GET", url);
//     console.log("After open(): "+Http.readyState);
    Http.send();
//     console.log("After send(): "+Http.readyState);
    Http.onreadystatechange = (e) => {
//         console.log("before parsing data: "+Http.readyState);
        if(Http.readyState === 4){
            window.songList = JSON.parse(Http.responseText);
            // window.songList.splice(songList.length, 3);
//             console.log('API data received!');
            loadplaylist();
        }
    }
}

// returns a random music
const shuffle = function(arg){
    return arg[Math.floor(Math.random() * arg.length)];
}

// generates a random song file except the current one being played
const shuffleNext = function(current){
//     console.log('Shuffle Next');
    var nextList = songList.filter(s => s.id != current);
    var nextsong =  shuffle(nextList);
    loadmusic(nextsong.id);
}

const shuffleToggle = function(){
    var shuffler = document.getElementById("shuffleOnOff");
    if(window.shuffleState === false){
        window.shuffleState = true;
        shuffler.style.textShadow = "0px 0px 6px white";
    }
    else{
        window.shuffleState = false;
        shuffler.style.textShadow = "0px 0px 0px white";
    }
}

const repeatToggle = function(){
    var repeater = document.getElementById("repeatOnOff");
    if(window.repeatState === false){
        window.repeatState = true;
        repeater.style.textShadow = "0px 0px 6px white";
    }
    else{
        window.repeatState = false;
        repeater.style.textShadow = "0px 0px 0px white";
    }
}

const loadNextTrack = function(){
    var curr = lastPlayed[currentTrack];
    if(repeatState){
        loadmusic(curr);
    }
    else{
        if(shuffleState){
            shuffleNext(curr);
        }
        else{
            var now = songList.findIndex(s => s.id == curr);
            var next = (now+1)%songList.length;
            loadmusic(songList[next].id);
        }
    }
}

document.getElementById('audioplayer').addEventListener('pause', ()=>{
    var playpausebutton = document.getElementById('playpausemusic');
    playpausebutton.setAttribute("class", "controls fa fa-play fa-2x");
    // playpausebutton.setAttribute("class", "controls far fa-play-circle fa-3x");
});

document.getElementById('audioplayer').addEventListener('play', ()=>{
    var playpausebutton = document.getElementById('playpausemusic');
    playpausebutton.setAttribute("class", "controls fa fa-pause fa-2x");
    // playpausebutton.setAttribute("class", "controls far fa-play-circle fa-3x");
});

document.getElementById('audioplayer').addEventListener('ended', ()=>{
    loadNextTrack();
});

const loadPreviousTrack = function(){
    if(!repeatState){
        if(currentTrack==0){
            loadmusic(lastPlayed[currentTrack]);
        }
        else{
            lastPlayed.pop();
            loadmusic(lastPlayed[--currentTrack]);
        }
    }
    else{
        document.getElementById('audioplayer').currentTime=0;
    }
    
}

// takes in the song_id as a parameter and loads the music into the player/controller
const loadmusic = function(song_id){
    var song = window.songList.filter( s => s.id==song_id );
    song = song[0];
    $("#main-player > img").attr("src", song.albumCover);
    // document.getElementById("shuffler").setAttribute("onclick", `shuffleNext(${song.id})`);
    $("#audioplayer").attr("src", song.file);
    document.getElementById("seekbar").setAttribute("value", 0);
    document.getElementById("songName").innerHTML = song.track;
    document.getElementById("artist").innerHTML = song.artist;
    if(lastPlayed[lastPlayed.length - 1] != song.id){
        lastPlayed.push(song.id);  // push the current song loaded to the history
        currentTrack++;   // update the currentPos to the end of the lastPlayed array
    }
    
    var audio = document.getElementById('audioplayer');
    var playpausebutton = document.getElementById('playpausemusic');
//     console.log(audio.paused);
}


const Play = function(){
    // console.log('Play');
    document.getElementById('audioplayer').play();
}

const Pause = function(){
    // console.log('Pause');
    document.getElementById('audioplayer').pause();
}

const PlayPause = function(){
    var audio = document.getElementById('audioplayer');
    var playpausebutton = document.getElementById('playpausemusic');
//     console.log(audio.paused);
    if (audio.paused){
        Play();
        // playpausebutton.setAttribute("class", "controls far fa-pause-circle fa-3x");
    }
    else{
        Pause();
        // playpausebutton.setAttribute("class", "controls far fa-play-circle fa-3x");
    }
}

document.getElementById('audioplayer').addEventListener('timeupdate', function(){
    // console.log(this);
    document.getElementById("seekbar").setAttribute("value", this.currentTime/this.duration);
});

document.getElementById("seekbar").addEventListener("click", function(event){
    var s = document.getElementById("audioplayer");
    var percent = event.offsetX / this.offsetWidth;
    s.currentTime = percent * s.duration;
    document.getElementById("seekbar").setAttribute("value", s.currentTime/s.duration);
});

const loadplaylist = function(){
    $("#player-preloader").remove();
    var playlist = $("#playlist");
    for(var i=0; i<window.songList.length; i++){
        playlist.append(`
            <div id="song${window.songList[i].id}" class="playlist-card blurred-box" onclick="loadmusic(${window.songList[i].id})">
                <img class="playlist-artwork" src="${window.songList[i].albumCover}" alt="Sample Image">
                <div class="playlist-card-meta">
                    <h6>${window.songList[i].track}</h6>
                    <p>${window.songList[i].artist}</p>
                </div>
            </div>
        `);
    }
    var song = shuffle(window.songList);
    loadmusic(song.id);     // load the player with a random music
}

window.onload = loadDoc();    //AJAX request
