const Mixtape = require("../../app/models/Mixtape");
const MixtapeChanges = require("../../app/operations/MixtapeChanges");
const AddNewPlaylistOperation = require("../../app/operations/AddNewPlaylistOperation");
const AddSongToPlaylistOperation = require("../../app/operations/AddSongToPlaylistOperation");
const DeletePlaylistOperation = require("../../app/operations/DeletePlaylistOperation");

const expect = require("chai").expect;

describe('MixtapeChanges class', () => {
  it('will parse the changes.json', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));
    let mixtapeChanges = new MixtapeChanges(mixtape);

    const changesJsonFile = require("path").resolve("./data/changes.json");
    mixtapeChanges.loadFrom(changesJsonFile, (err, isLoaded) => {
      expect(err).to.be.null;
      expect(isLoaded).to.be.true;
      expect(mixtapeChanges).to.have.property("_changes").with.instanceOf(Array).with.length(3);
      done();
    });
  });

  it("will apply the changes on the mixtape - create a new playlist", (done) => {
    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));
    let mixtapeChanges = new MixtapeChanges(mixtape);

    const changesJsonFile = require("path").resolve("./test/data/changes-addnewplaylist.json");
    mixtapeChanges.loadFrom(changesJsonFile, (err, isLoaded) => {

      // init the playlist list
      expect(mixtapeChanges._changes[0]).to.be.an.instanceOf(AddNewPlaylistOperation);
      const newPlaylistId = Date.now();
      mixtapeChanges._changes[0]._playlist.id = newPlaylistId;

      mixtapeChanges.execute((err, result) => {
        expect(err).to.be.null;
        expect(result).to.be.true;

        // verify if hte new playlist is in the mixtape
        let isFound = false;
        for (let i = 0; i < mixtape.playlists.length; i++) {
          if (mixtape.playlists[i].id === newPlaylistId) {
            isFound = true;
            break;
          }
        }

        expect(isFound).to.be.true;
        done();
      })
    });
  })

  it("will apply the changes on the mixtape - create a new playlist and add a song to it", (done) => {
    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));
    let mixtapeChanges = new MixtapeChanges(mixtape);

    const changesJsonFile = require("path").resolve("./test/data/changes-addnewplaylist-addsong.json");
    mixtapeChanges.loadFrom(changesJsonFile, (err, isLoaded) => {

      // init the playlist list
      expect(mixtapeChanges._changes[0]).to.be.an.instanceOf(AddNewPlaylistOperation);
      const newPlaylistId = Date.now();
      mixtapeChanges._changes[0]._playlist.id = newPlaylistId;

      expect(mixtapeChanges._changes[1]).to.be.an.instanceOf(AddSongToPlaylistOperation);
      const newSongId = "32";
      mixtapeChanges._changes[1].playlist_id = newPlaylistId;
      mixtapeChanges._changes[1].song_id = newSongId;

      mixtapeChanges.execute((err, result) => {
        expect(err).to.be.null;
        expect(result).to.be.true;

        // verify if hte new playlist is in the mixtape
        let isFound = false;
        for (let i = 0; i < mixtape.playlists.length; i++) {
          if (mixtape.playlists[i].id === newPlaylistId) {
            // now check if the new song was added to this playlist
            const songIdx = mixtape.playlists[i].song_ids.indexOf(newSongId);
            isFound = (songIdx != -1);
            break;
          }
        }

        expect(isFound).to.be.true;
        done();
      })
    });
  });

  it("will apply the changes on the mixtape - create a new playlist and delete it", (done) => {
    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));
    let mixtapeChanges = new MixtapeChanges(mixtape);

    const changesJsonFile = require("path").resolve("./test/data/changes-addnewplaylist-delete.json");
    mixtapeChanges.loadFrom(changesJsonFile, (err, isLoaded) => {

      // init the playlist list
      expect(mixtapeChanges._changes[0]).to.be.an.instanceOf(AddNewPlaylistOperation);
      const newPlaylistId = Date.now();
      mixtapeChanges._changes[0]._playlist.id = newPlaylistId;

      expect(mixtapeChanges._changes[1]).to.be.an.instanceOf(DeletePlaylistOperation);
      mixtapeChanges._changes[1].playlist_id = newPlaylistId;

      mixtapeChanges.execute((err, result) => {
        expect(err).to.be.null;
        expect(result).to.be.true;

        // verify if hte new playlist is NOT in the mixtape
        let isFound = false;
        for (let i = 0; i < mixtape.playlists.length; i++) {
          if (mixtape.playlists[i].id === newPlaylistId) {
            // now check if the new song was added to this playlist
            const songIdx = mixtape.playlists[i].song_ids.indexOf(newSongId);
            isFound = (songIdx != -1);
            break;
          }
        }

        expect(isFound).to.be.false;
        done();
      })
    });
  });

});
