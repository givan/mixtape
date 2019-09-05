const path = require('path');
const Mixtape = require("./models/Mixtape");
const MixtapeProcessor = require("./operations/MixtapeChanges");

const inputArgs = process.argv.slice(2);

if (inputArgs.length < 3) {
  console.error(`Need to specify 3 params: <input-file> <changes-file> <output-file>`);
  return;
}

let mixTapeFilePath = inputArgs[0];
mixTapeFilePath = path.resolve(mixTapeFilePath);

const changesFilePath = inputArgs[1];
const outputMixtapeFilePath = inputArgs[2];

const mixtape = new Mixtape();
if (!mixtape.loadFrom(mixTapeFilePath))
{
  console.log(`Coudn't load from file: ${mixTapeFilePath}`);
}

111console.log(`myArgs: ${inputArgs}`);

