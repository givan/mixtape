const User = require("../../app/models/User");

const expect = require('chai').expect;

describe('User class', () => {
  it('will parse the users element from the mixtape.json', () => {

    const mixtapeData = require("../../data/mixtape-data.json");

    const users = User.createFrom(mixtapeData.users);
    
    expect(users).to.be.an.instanceOf(Array).with.length(7);
    expect(users[0]).to.be.an.instanceOf(User);
  });
});