class Playlist {
  static createFrom(playlistData) {
    let playlist = null;

    if (playlistData.id !== undefined &&
      playlistData.user_id !== undefined &&
      playlistData.song_ids !== undefined &&
      Array.isArray(playlistData.song_ids) &&
      playlistData.song_ids.length > 0) {
      playlist = new Playlist(playlistData.id, playlistData.user_id, playlistData.song_ids);
    }

    return playlist;
  }

  constructor(id, user_id, song_ids) {
    this.id = id;
    this.user_id = user_id;
    this.song_ids = song_ids;
  }
}

module.exports = Playlist;