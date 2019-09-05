const Mixtape = require("../../app/models/Mixtape");
const Playlist = require("../../app/models/Playlist");

const expect = require('chai').expect;

describe('Mixtape class', () => {
  it('will parse the mixtape.json', () => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    expect(mixtape).to.have.property("users").with.instanceOf(Array).with.length(7);
    expect(mixtape).to.have.property("playlists").with.instanceOf(Array).with.length(3);
    expect(mixtape).to.have.property("songs").with.instanceOf(Array).with.length(40);
  });

  it('will save to a new output.json', (done) => {

    let mixtape = new Mixtape();
    mixtape.loadFrom(require("path").resolve("./data/mixtape-data.json"));

    mixtape.playlists[0].user_id;

    const newPlaylist = new Playlist(Date.now(), mixtape.playlists[0].user_id, mixtape.playlists[0].song_ids);
    mixtape.playlists.push(newPlaylist);

    const outputFilePath = require("path").resolve(`./data/output-${newPlaylist.id}.json`);
    mixtape.saveTo(outputFilePath, (err, res) => {
      expect(err).to.be.null;

      mixtape.loadFrom(outputFilePath);

      let foundPlaylist = false;

      const mixtapePlaylists = mixtape.playlists;
      for(let i = 0; i < mixtapePlaylists.length; i++) {
        if (mixtapePlaylists[i].id === newPlaylist.id) {
          foundPlaylist = true;
          break;
        }
      }

      expect(foundPlaylist).to.be.true;
      done();
    });
  });
});