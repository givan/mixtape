class Song {
  static createFrom(songData) {
    let songs = new Array();

    if (Array.isArray(songData)) {
      for(let i = 0; i < songData.length; i++) {
        const newSong = new Song(songData[i].id, songData[i].artist, songData[i].title);
        songs.push(newSong);
      }
    }
    
    return songs;
  }
  
  constructor(id, artist, title) {
    // TODO: add validation
    this.id = id;
    this.artist = artist;
    this.title = title;
  }
}

module.exports = Song;