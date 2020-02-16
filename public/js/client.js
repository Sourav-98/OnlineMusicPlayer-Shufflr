
const loadDoc = function(){
    const Http = new XMLHttpRequest();
    const url='https://5dd1894f15bbc2001448d28e.mockapi.io/playlist';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if(Http.readyState === 4){
            window.songList = JSON.parse(Http.responseText);
            window.songList.splice(songList.length-1, 1);
            console.log('API data received!');
            loadplayer();
        }  // to simulate network lag
    }
}

const shuffle = function(arg){
    return arg[Math.floor(Math.random() * arg.length)];
}

const shuffleNext = function(current){
    var nextList = songList.filter(s => s.id != current);
    console.log(nextList, current);
    var nextsong =  shuffle(nextList);
    loadmusic(nextsong.id);
}

const showplaylist = function(){
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
}

const loadcontroller = function(){
    var song = shuffle(songList);
    $("#main-player").append(`
        <img src="${song.albumCover}" alt="Artwork"><br>
        <div>----------Song Seeker----------</div><br>
        <div>----------Song Controls----------</div>
        <button onclick="shuffleNext(${song.id})">Shuffle Next Song</button>
    `);
}

const loadmusic = function(track_id){
    // $("#main-player").append(`
    //     <img src="${window.songList[track_id].albumCover}" alt="Artwork"><br>
    //     <div>----------Song Seeker----------</div><br>
    //     <div>----------Song Controls----------</div>
    // `);
    var song = window.songList.filter( s => s.id==track_id );
    console.log(song);
    $("#main-player > img").attr("src", song[0].albumCover);
    $("#main-player > button").attr("onclick", `shuffleNext(${song[0].id})`);
}

const loadplayer = function(){
    $("#player-preloader").remove();
    $("#player-box").append(`
        <div id="main-player" class="main-player">
        </div>
        <div id="playlist" class="playlist">
        </div>
    `);
    showplaylist();
    loadcontroller();
}



document.onload = loadDoc();
