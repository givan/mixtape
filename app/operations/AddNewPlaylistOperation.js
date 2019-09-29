const Playlist = require("../models/Playlist");
const Mixtape = require("../models/Mixtape");

class AddNewPlaylistOperation {
  static createFrom(operationData, mixtape) {
    /* The schema from the changes.json for this operation:
    { 
      "type": "createNewPlaylist",
      "input" : {
        "playlist" : {
          "id" : "777",
          "user_id" : "2",
          "song_ids" : [
            "8",
            "32"
          ]
        }
      }, 
      "config" : {
        "output": "$playlistId1"
      }
    }
    */

    let op = null;

    if (operationData !== undefined && operationData.input !== undefined && operationData.input.playlist !== undefined) {
      const playlistData = operationData.input.playlist;

      const playlist = Playlist.createFrom(playlistData);
      if (playlist != null) {
        op = new AddNewPlaylistOperation(playlist, mixtape);
      }
    }

    return op;
  }

  constructor(playlist, mixtape) {
    if (playlist === undefined || !(playlist instanceof Playlist))
      throw new Error("AddNewPlaylistOperation requires a valid Playlist object");

    if (mixtape === undefined || !(mixtape instanceof Mixtape))
      throw new Error("AddNewPlaylistOperation requires a valid Mixtape object");

    this._playlist = playlist;
    this._mixtape = mixtape;
  }

  execute(cb) {
    // we simulate IO here - in the future we will add a DB layer where we'll keep the mixtape and will not be accessing it in memory
    // node is not meant for heavy CPU bound ops
    setTimeout(() => {
      // Add a new playlist for an existing user; the playlist should contain at least one existing song.
      let playlistAdded = false;

      const mixtapePlaylists = this._mixtape.playlists;
      const containsPlaylist = (mixtapePlaylists.find((playlist) => playlist.id === this._playlist.id));
      if (!containsPlaylist) {
        const mixtapeUsers = this._mixtape.users;

        const containsUser = (mixtapeUsers.find((user) => user.id === this._playlist.user_id));
        if (containsUser) {

          const mixtapeSongs = this._mixtape.songs;
          const playlistSongIds = this._playlist.song_ids;

          const hasExistingSong = (playlistSongIds.find((songId) => {
              return mixtapeSongs.find((mixtapeSong) => mixtapeSong.id === songId);
          }));

          if (hasExistingSong) {
            this._mixtape.playlists.push(this._playlist); // we don't generate the ID, we assume the ID exists on this new 
            playlistAdded = true;
          }
        }
      }

      cb(null, playlistAdded);
    }, 10);
  }
}

module.exports = AddNewPlaylistOperation;