const fs = require("fs");
const async = require("async");
const Mixtape = require("../models/Mixtape");
const AddNewPlaylistOperation = require("./AddNewPlaylistOperation");
const DeletePlaylistOperation = require("./DeletePlaylistOperation");
const AddSongToPlaylistOperation = require("./AddSongToPlaylistOperation");

// This is the factory for the possible operations. Bsed on the specified type in the changes.json, this class will instantiate 
// the appropriate command to handle the mixtape operation
class MixtapeChanges {

  constructor(mixtape) {
    if (mixtape === undefined || !(mixtape instanceof Mixtape))
      throw new Error("mixtape must be a valid Mixtape object");

    this._mixtape = mixtape;
    this._changes = [];
  }

  loadFrom(changesFilePath, cb) {
    const CREATE_NEW_PLAYLIST = "createNewPlaylist";
    const DELETE_PLAYLIST = "deletePlaylist";
    const ADD_SONG_TO_PLAYLIST = "addSongToPlaylist";

    this._changes = [];

    if (fs.existsSync(changesFilePath)) {
      fs.readFile(changesFilePath, (err, data) => {

        if (data !== undefined) {
          try {
            let changesData = JSON.parse(data);

            if (Array.isArray(changesData.operations)) {
              const operationsData = changesData.operations;
              for (let i = 0; i < operationsData.length; i++) {
                let op = null;

                switch (operationsData[i].type) {
                  case CREATE_NEW_PLAYLIST:
                    op = AddNewPlaylistOperation.createFrom(operationsData[i], this._mixtape);
                    break;

                  case DELETE_PLAYLIST:
                    op = DeletePlaylistOperation.createFrom(operationsData[i], this._mixtape);
                    break;

                  case ADD_SONG_TO_PLAYLIST:
                    op = AddSongToPlaylistOperation.createFrom(operationsData[i], this._mixtape);
                    break;

                  default:
                    console.error(`Unknown playlist operation[${i}]: ${operationsData[i].type}`);
                    break;
                }

                if (op !== null) {
                  this._changes.push(op);
                } else {
                  console.error(`Skipping playlist operation[${i}] since no operation object was created`);
                }
              }

              cb(null, this._changes.length > 0); // if we have at least one valid operation we consider successful loading of the changes file
            }
          }
          catch (err) {
            cb(err);
          }
        } else {
          cb(new Error(`Error reading the changes file: ${changesFilePath}`));
        }
      });
    } else {
      cb(new Error(`Changes file doesn't exist: ${changesFilePath}`)); // the changes file doesn't exist
    }
  }

  execute(cb) {
    if (this._changes.length > 0) {
      // build an array of all the functions that will execute each operatoin one by one 
      // call async with waterfall model since the operations may have interdepencies among them
      // we want to save the file only once and not after every operation (to save on disk writes and reads)
      // further, all of all op execute() methods are not returning errors even if there failures;
      // that's on purpose to be able to not stop the async.waterfall() - we want to execute as many ops as we think are needed
      // future extension here will be have a way to inject state from one operatoin to another - hence I left the "result" element
      // in the changes.json for each operation
      let asyncChangesFuncs = [];
      for (let i = 0; i < this._changes.length; i++) {

        const mixtapeOperation = this._changes[i];
        
        const executeMixtapeOperation = (mixtapeCallback) => {
          mixtapeOperation.execute((err, result) => {          
            if (err) {
              mixtapeCallback(null, err);
              return;
            }

            mixtapeCallback(null, result);
          });
        }

        asyncChangesFuncs.push(executeMixtapeOperation);
      }

      // use series of operations - one after another (serial execution)
      // if one calls with err, the rest are not called; that's the reason why I implemented the 
      // operation's execute() methods to not return Errors in the callback when say a playlist is not found but 
      // rather use the boolean as a result of the operation 
      async.series(asyncChangesFuncs, (err, results) => {
        if (err) {
          console.error(`failed executing mixtape changes: ${err}`);
          return;
        }

        // all operations return a boolean if it was successfully completed
        // so for us, if at least one of them was successful, the whole batch is successful
        // we want to support partial execution of the commands
        // another way will to be in a transaction - if any of them fail, rollback the previous commands; 
        // this could be future enhancement if there is business need for it
        let isCompletedSuccessfully = false;
        if (Array.isArray(results)) {
          for(let i = 0; i < results.length; i++) {
            if (results[i]) {
              isCompletedSuccessfully = true;
              break;
            }
          } 
        } else {
          isCompletedSuccessfully = results; // this is the case with 1 op where results is a single element
        }
        
        cb(null, isCompletedSuccessfully);
      });
    } else {
      cb(new Error("No loaded changes to execute on the mixtape"));
    }
  }
}

module.exports = MixtapeChanges;