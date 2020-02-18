window.shuffleState = false;    // by default, shuffle is off


const loadDoc = function(){
    const Http = new XMLHttpRequest();
    const url='https://5dd1894f15bbc2001448d28e.mockapi.io/playlist';
    console.log("Initial: "+Http.readyState);
    Http.open("GET", url);
    console.log("After open(): "+Http.readyState);
    Http.send();
    console.log("After send(): "+Http.readyState);
    Http.onreadystatechange = (e) => {
        console.log("before parsing data: "+Http.readyState);
        if(Http.readyState === 4){
            window.songList = JSON.parse(Http.responseText);
            window.songList.splice(songList.length-1, 1);
            console.log('API data received!');
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
    console.log('Shuffle Next');
    var nextList = songList.filter(s => s.id != current);
    var nextsong =  shuffle(nextList);
    loadmusic(nextsong.id);
}

// takes in the song_id as a parameter and loads the music into the player/controller
const loadmusic = function(song_id){
    var song = window.songList.filter( s => s.id==song_id );
    song = song[0];
    $("#main-player > img").attr("src", song.albumCover);
    document.getElementById("shuffler").setAttribute("onclick", `shuffleNext(${song.id})`);
    $("#audioplayer").attr("src", song.file);
    document.getElementById("seekbar").setAttribute("value", 0);
    document.getElementById("songName").innerHTML = song.track;
    document.getElementById("artist").innerHTML = song.artist;
    // Play();
}

const Play = function(){
    console.log('Play');
    document.getElementById('audioplayer').play();
}

const Pause = function(){
    $("#audioplayer").trigger('pause');
}

var s = document.getElementById('audioplayer');

document.getElementById('audioplayer').addEventListener('timeupdate', function(){
    document.getElementById("seekbar").setAttribute("value", s.currentTime/s.duration);
});

document.getElementById("seekbar").addEventListener("click", function(event){
    var percent = event.offsetX / this.offsetWidth;
    s.currentTime = percent * s.duration;
    document.getElementById("seekbar").setAttribute("value", s.currentTime/s.duration);
});

const loadplaylist = function(){
    $("#player-preloader").remove();
    var playlist = $("#playlist");
    for(var i=0; i<window.songList.length; i++){
        playlist.append(`
            <div id="song${window.songList[i].id}" class="playlist-card" onclick="loadmusic(${window.songList[i].id})">
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
