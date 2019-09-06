const Mixtape = require("../models/Mixtape");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");

class AddSongToPlaylistOperation {
  static createFrom(operationData, mixtape) {
    /* The schema from the changes.json for this operation:
     { 
      "type": "addSongToPlaylist",
      "input" : {
        "songId" : "1",
        "playlistId": "777"
      }, 
      "config" : {
        "output": "result"
      }
    }
    */

    let op = null;

    if (operationData !== undefined &&
      operationData.input !== undefined &&
      operationData.input.playlist_id !== undefined &&
      operationData.input.song_id !== undefined) {
      const playlistId = operationData.input.playlist_id;
      const songId = operationData.input.song_id;

      const playlist = new Playlist(playlistId);
      const song = new Song(songId);
      op = new AddSongToPlaylistOperation(song, playlist, mixtape);
    }

    return op;
  }

  constructor(song, playlist, mixtape) {
    if (song === undefined || !(song instanceof Song))
      throw new Error("song must be a valid Song object");
    if (playlist == undefined || !(playlist instanceof Playlist))
      throw new Error("playlist must be a valid Playlist object");
    if (mixtape === undefined || !(mixtape instanceof Mixtape))
      throw new Error("mixtape must be a valid Mixtape object");

    this.song_id = song.id;
    this.playlist_id = playlist.id;
    this.mixtape = mixtape;
  }

  execute(cb) {
    // simulate a callback - in the future we want to store the mixtape data into an actual db so we'll do io calls here
    // instead of doing lookups in memory (not what node is meant for)
    setTimeout(() => {
      // Add an existing song to an existing playlist.
      let foundSong = false;
      const mixtapeSongs = this.mixtape.songs;
      for (let i = 0; i < mixtapeSongs.length; i++) {
        if (mixtapeSongs[i].id === this.song_id) {
          foundSong = true;
          break;
        }
      }
  
      let foundPlaylist = null;
      if (foundSong) {
  
        const mixtapePlaylists = this.mixtape.playlists;
        for (let i = 0; i < mixtapePlaylists.length; i++) {
          if (mixtapePlaylists[i].id === this.playlist_id) {
            foundPlaylist = mixtapePlaylists[i];
            break;
          }
        }
  
        if (foundPlaylist != null) {
          foundPlaylist.song_ids.push(this.song_id);
        }
      }
  
      cb(null, foundPlaylist != null);
    }, 10);
  }
}

module.exports = AddSongToPlaylistOperation;