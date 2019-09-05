class Playlist {
  static createFrom(playlistData) {
    let playlists = new Array();

    if (Array.isArray(playlistData)) {
      for(let i = 0; i < playlistData.length; i++) {
        const newPlaylist = new Playlist(playlistData[i].id, playlistData[i].user_id, playlistData[i].song_ids);
        playlists.push(newPlaylist);
      }
    }
    
    return playlists;
  }

  constructor(id, user_id, song_ids) {
    // TODO: add validation
    this.id = id;
    this.user_id = user_id;
    this.song_ids = song_ids;
  }
}

module.exports = Playlist;