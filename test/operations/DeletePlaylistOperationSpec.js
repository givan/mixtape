const AddNewPlaylistOperation = require("../../app/operations/AddNewPlaylistOperation");
const DeletePlaylistOperation = require("../../app/operations/DeletePlaylistOperation");
const Playlist = require("../../app/models/Playlist");
const Mixtape = require("../../app/models/Mixtape");

const expect = require('chai').expect;

describe('DeletePlaylistOperation class', () => {
  it('will delete an existing playlist', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let newPlaylist = new Playlist(Date.now(), mixtape.playlists[0].user_id, [mixtape.playlists[0].song_ids[0]]);

    const addPlaylistOp = new AddNewPlaylistOperation(newPlaylist, mixtape);
    addPlaylistOp.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.true;

      let deletePlaylist = new DeletePlaylistOperation(newPlaylist, mixtape);

      deletePlaylist.execute((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.true;

        let foundNewPlaylist = false;
        let playlists = mixtape.playlists;
        for (let i = 0; i < playlists.length; i++) {
          if (playlists[i].id === newPlaylist.id) {

            foundNewPlaylist = true;
            break;
          }
        }

        expect(foundNewPlaylist).to.be.false;
        done();
      });
    })

  });

  it('will return false if the playlist does not exist', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    let nonExistingPlaylist = new Playlist(-1, mixtape.playlists[0].user_id, mixtape.playlists[0].song_ids);

    let deletePlaylist = new DeletePlaylistOperation(nonExistingPlaylist, mixtape);

    deletePlaylist.execute((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.false;
      done();
    });
  });

  it('will parse op data from changes.json and create a new op', () => {
    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    const changesJsonFile = require("path").resolve("./data/changes.json");
    const changesData = require(changesJsonFile);
    const deletePlaylistData = changesData.operations[2];
    expect(deletePlaylistData.type).to.be.equal("deletePlaylist");
    
    const op = DeletePlaylistOperation.createFrom(deletePlaylistData, mixtape);
    expect(op).to.not.be.null;
    expect(op).to.be.an.instanceOf(DeletePlaylistOperation);
  })
});