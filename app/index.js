const path = require('path');
const Mixtape = require("./models/Mixtape");
const MixtapeChanges = require("./operations/MixtapeChanges");

const inputArgs = process.argv.slice(2);

if (inputArgs.length < 3) {
  console.error(`Need to specify 3 params: <input-file> <changes-file> <output-file>`);
  return;
}

let mixTapeFilePath = inputArgs[0];
mixTapeFilePath = path.resolve(mixTapeFilePath);

const changesFilePath = path.resolve(inputArgs[1]);
const outputMixtapeFilePath = path.resolve(inputArgs[2]);

const mixtape = new Mixtape();
if (!mixtape.loadFrom(mixTapeFilePath))
{
  console.log(`Coudn't load from mixtape file: ${mixTapeFilePath}`);
  return;
}

let changes = new MixtapeChanges(mixtape);
changes.loadFrom(changesFilePath, (err, isLoaded) => {
  if (err) {
    console.error(err);
    return;
  }

  if (isLoaded) {
    changes.execute((err, areChangesComplete) => {
      if (err) {
        console.error(`Failed when executing changes on the mixtape: ${JSON.stringify(err)}`);
        return;
      }

      if (areChangesComplete) {
        // that is the case when at least 1 operation succeeded
        // we want to save the mixtape
        mixtape.saveTo(outputMixtapeFilePath, (err, isSaved) => {
          if (err) {
            console.error(`Even though changes were applied, there were errors savingn them to the output file: ${outputMixtapeFilePath}: ${JSON.stringify(err)}`);
          }

          console.log(`Successfully saved the changes to the output mixtape: ${outputMixtapeFilePath}`);
        });
      }
    })
  } else {
    console.error(`Failed loading the ${changesFilePath} or there were no valid operations in it.`);
  }
});

