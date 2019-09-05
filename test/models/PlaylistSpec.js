const Playlist = require("../../app/models/Playlist");

const expect = require('chai').expect;

describe('Playlist class', () => {
  it('will parse the playlists element from the mixtape.json', () => {

    const mixtapeData = require("../../data/mixtape-data.json");

    const playlists = Playlist.createFrom(mixtapeData.playlists);
    
    expect(playlists).to.be.an.instanceOf(Array).with.length(3);
    expect(playlists[0]).to.be.an.instanceOf(Playlist);
  });
});