const Mixtape = require("../models/Mixtape");
const Playlist = require("../models/Playlist");

class DeletePlaylistOperation {
  constructor(playlist, mixtape) {
    if (playlist == undefined || !(playlist instanceof Playlist))
      throw new Error("playlist must be a valid Playlist object");
    if (mixtape === undefined || !(mixtape instanceof Mixtape))
      throw new Error("mixtape must be a valid Mixtape object");

    this.playlist_id = playlist.id;
    this.mixtape = mixtape;
  }

  execute(cb) {
    // simulate callback - we'll extend this in the future to access some data store for the models (not storing them in memory as it is now)
    setTimeout(() => {
      let playlistDeleted = false;

      // make sure the playlist id is found in the mixtape
      const mixtapePlaylists = this.mixtape.playlists;
      for (let i = 0; i < mixtapePlaylists.length; i++) {
        if (mixtapePlaylists[i].id === this.playlist_id) { // the playlist id is unique so we take the first occurance only
          mixtapePlaylists.splice(i, 1);
          playlistDeleted = true;
          break;
        }
      }

      cb(null, playlistDeleted);
    }, 10);
  }
}

module.exports = DeletePlaylistOperation;