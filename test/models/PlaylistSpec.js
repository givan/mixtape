const Playlist = require("../../app/models/Playlist");

const expect = require('chai').expect;

describe('Playlist class', () => {
  it('will parse the playlists element from the mixtape.json', () => {

    const mixtapeData = require("../../data/mixtape-data.json");

    const playlist = Playlist.createFrom(mixtapeData.playlists[0]);
    
    expect(playlist).to.not.be.null;
    expect(playlist).to.be.an.instanceOf(Playlist);
  });
});