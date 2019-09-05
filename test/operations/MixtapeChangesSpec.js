const MixtapeChanges = require("../../app/operations/MixtapeChanges");

const expect = require('chai').expect;

describe('MixtapeChanges class', () => {
  it('will parse the changes.json', () => {

    let mixtapeChanges = new MixtapeChanges();
    const result = mixtapeChanges.loadFrom(require("path").resolve("./data/changes.json"));
    
    expect(result).to.be.true;
    
    expect(mixtapeChanges).to.have.property("_changes").with.instanceOf(Array).with.length(3);
  });
});