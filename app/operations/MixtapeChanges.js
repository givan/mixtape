const fs = require("fs");
const MixtapeOperation = require("./MixstapeOperation");

class MixtapeChanges {
  
  constructor() {
    this._changes = [];
  }

  loadFrom(changesFilePath) {
    let result = false;
    this._changes = [];

    if (fs.existsSync(changesFilePath)) {
      const changesData = require(changesFilePath);
      if (Array.isArray(changesData.operations)) {
        const operationsData = changesData.operations;
        for(let i = 0; i < operationsData.length; i++) {
            this._changes.push(MixtapeOperation.createFrom(operationsData[i]));
        }

        result = true;
      }
    }

    return result;
  }
}

module.exports = MixtapeChanges;