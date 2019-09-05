const AddNewPlaylistOperation = require("../../app/operations/AddNewPlaylistOperation");
const Playlist = require("../../app/models/Playlist");
const Mixtape = require("../../app/models/Mixtape");

const expect = require('chai').expect;

describe('AddNewPlaylistOperation class', () => {
  it('will create a new playlist and add it into the mixtape', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), mixtape.playlists[0].user_id, mixtape.playlists[0].song_ids);

    let addPlaylistOp = new AddNewPlaylistOperation(newPlaylist, mixtape);
    addPlaylistOp.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.true;
    
      let foundPlaylist = null;
      let playlists = mixtape.playlists;
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === newPlaylist.id) {
          foundPlaylist = playlists[i];
          break;
        }
      }
      
      expect(foundPlaylist).to.not.be.null;
      done();
    });
  });

  it('will NOT create a new playlist if not a valid user_id', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), -1, mixtape.playlists[0].song_ids);

    let addPlaylistOp = new AddNewPlaylistOperation(newPlaylist, mixtape);
    addPlaylistOp.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.false;
    
      let foundPlaylist = null;
      let playlists = mixtape.playlists;
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === newPlaylist.id) {
          foundPlaylist = playlists[i];
          break;
        }
      }
      
      expect(foundPlaylist).to.be.null;
      done();
    });
  });

  it('will NOT create a new playlist if not a existing song id', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), mixtape.playlists[0].user_id, [-1]);

    let addPlaylistOp = new AddNewPlaylistOperation(newPlaylist, mixtape);
    addPlaylistOp.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.false;
    
      let foundPlaylist = null;
      let playlists = mixtape.playlists;
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === newPlaylist.id) {
          foundPlaylist = playlists[i];
          break;
        }
      }
      
      expect(foundPlaylist).to.be.null;
      done();
    });
  });
});