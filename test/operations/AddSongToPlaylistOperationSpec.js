const AddNewPlaylistOperation = require("../../app/operations/AddNewPlaylistOperation");
const AddSongToPlaylistOperation = require("../../app/operations/AddSongToPlaylistOperation");
const Playlist = require("../../app/models/Playlist");
const Song = require("../../app/models/Song");
const Mixtape = require("../../app/models/Mixtape");

const expect = require('chai').expect;

describe('AddSongToPlaylistOperation class', () => {
  it('will add an existing song to an existing playlist', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), mixtape.playlists[0].user_id, [mixtape.playlists[0].song_ids[0]]);

    const addPlaylistOp = new AddNewPlaylistOperation(newPlaylist, mixtape);
    addPlaylistOp.execute((err, res) => {
      const newSongId = mixtape.playlists[0].song_ids[1];
      const song = new Song(newSongId, "artist", "title");

      let addSongToPlaylist = new AddSongToPlaylistOperation(song, newPlaylist, mixtape);

      addSongToPlaylist.execute((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.true;

        let foundPlaylistWithTheNewSong = false;
        let playlists = mixtape.playlists;
        for (let i = 0; i < playlists.length; i++) {
          if (playlists[i].id === newPlaylist.id) {

            // now try to find the new song inside the matched playlist
            let playlistSongs = playlists[i].song_ids;
            for (let j = 0; j < playlistSongs.length; j++) {
              if (playlistSongs[j] === newSongId) {
                foundPlaylistWithTheNewSong = true;
                break;
              }
            }
          }
        }

        expect(foundPlaylistWithTheNewSong).to.be.true;
        done();
      });
    })


  });

  it('will NOT add the song if not a valid song_id', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), -1, mixtape.playlists[0].song_ids);

    const nonExistingSong = new Song(-1, "arist", "title");
    let addSongToPlaylist = new AddSongToPlaylistOperation(nonExistingSong, mixtape.playlists[0], mixtape);

    addSongToPlaylist.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.false;
      done();
    });
  });

  it('will NOT add song if the playlist does not exist', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let nonExistingPlaylist = new Playlist(-1, mixtape.playlists[0].user_id, mixtape.playlists[0].song_ids);

    const newSongId = mixtape.playlists[0].song_ids[0];
    const song = new Song(newSongId, "artist", "title");
    let addSongToPlaylist = new AddSongToPlaylistOperation(song, nonExistingPlaylist, mixtape);

    addSongToPlaylist.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.false;
      done();
    });
  });

  it('wil parse op data from changes.json and construct a new instance', ()=> {
    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    const changesJsonFile = require("path").resolve("./data/changes.json");
    const changesData = require(changesJsonFile);
    const addSongToPlaylistData = changesData.operations[1];
    expect(addSongToPlaylistData.type).to.be.equal("addSongToPlaylist");
    
    const op = AddSongToPlaylistOperation.createFrom(addSongToPlaylistData, mixtape);
    expect(op).to.not.be.null;
    expect(op).to.be.an.instanceOf(AddSongToPlaylistOperation);
  });
});