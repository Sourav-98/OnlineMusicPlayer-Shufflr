


const showplaylist = function(songList){
    var playlist = $("#playlist");
    for(var i=0; i<songList.length; i++){
        playlist.append(`
            <div id="song${songList[i].id}" class="playlist-card">
                <img class="playlist-artwork" src="${songList[i].albumCover}" alt="Sample Image">
                <div class="playlist-card-meta">
                    <h6>${songList[i].track}</h6>
                    <p>${songList[i].artist}</p>
                </div>
            </div>
        `);
    }
}

const loadplayer = function(songList){
    var mainplayer = $("#player-box");
    $("#player-preloader").remove();
    mainplayer.append(`
        <div id="main-player" class="main-player">
        </div>
        <div id="playlist" class="playlist">
        </div>
    `);
    showplaylist(songList);
}

const loadDoc = function(){
    const Http = new XMLHttpRequest();
    const url='http://5dd1894f15bbc2001448d28e.mockapi.io/playlist';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if(Http.readyState === 4){
            var songList = JSON.parse(Http.responseText);
            setTimeout(()=>{
                console.log('API data received!');
                loadplayer(songList);
            }, 2000); 
        }  // to simulate network lag
    }
}

document.onload = loadDoc();
