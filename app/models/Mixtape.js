const fs = require("fs");
const User = require('./User');
const Playlist = require('./Playlist');
const Song = require('./Song');

class Mixtape {
  constructor() {
    this._mixtapeData = {};
  }

  loadFrom(filePath) {
    // TODO: depending on the size of the JSON file, we may want to query the input file and load it chunk by chunk
    // for simplicity here, load up the whole JSON into memory; 
    this._mixtapeData = require(filePath);
    this.users = [];
    this.playlists = [];
    this.songs = [];

    if (this._mixtapeData.users !== undefined) {
      // TODO: since node is single threaded not good to put a lot of CPU intestive work 
      // consider doing this in a async way
      this.users = User.createFrom(this._mixtapeData.users);
    }

    if (this._mixtapeData.songs !== undefined) {
      // TODO: since node is single threaded not good to put a lot of CPU intestive work 
      // consider doing this in a async way
      this.songs = Song.createFrom(this._mixtapeData.songs);
    }
    
    if (this._mixtapeData.playlists !== undefined) {
      // TODO: since node is single threaded not good to put a lot of CPU intestive work 
      // consider doing this in a async way
      this.playlists = Playlist.createFrom(this._mixtapeData.playlists);
    }
    
    return true;
  }

  saveTo(outputFilePath, cb) {
    let mixtape = {
      "users": this.users,
      "playlists": this.playlists,
      "songs": this.songs
    };

    let data = JSON.stringify(mixtape, null, 2); // human readable JSON
    fs.writeFile(outputFilePath, data, (err, res) => {
      cb(err, res);
    });
  }
}

module.exports = Mixtape;