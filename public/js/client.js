
window.songList = undefined;

const showplaylist = function(){
    var playlist = $("#playlist");
    for(var i=0; i<window.songList.length; i++){
        playlist.append(`
            <div id="song${songList[i].id}" class="playlist-card">
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

}

const loadplayer = function(){
    var mainplayer = $("#player-box");
    $("#player-preloader").remove();
    mainplayer.append(`
        <div id="main-player" class="main-player">
        </div>
        <div id="playlist" class="playlist">
        </div>
    `);
    showplaylist();
}

const loadDoc = function(){
    const Http = new XMLHttpRequest();
    const url='http://5dd1894f15bbc2001448d28e.mockapi.io/playlist';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if(Http.readyState === 4){
            window.songList = JSON.parse(Http.responseText);
            console.log('API data received!');
            loadplayer();
             
        }  // to simulate network lag
    }
}

document.onload = loadDoc();
