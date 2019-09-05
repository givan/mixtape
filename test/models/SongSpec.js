const Song = require("../../app/models/Song");

const expect = require('chai').expect;

describe('Song class', () => {
  it('will parse the songs element from the mixtape.json', () => {

    const mixtapeData = require("../../data/mixtape-data.json");

    const songs = Song.createFrom(mixtapeData.songs);
    
    expect(songs).to.be.an.instanceOf(Array).with.length(40);
    expect(songs[0]).to.be.an.instanceOf(Song);
  });
});