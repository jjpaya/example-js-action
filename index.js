const util = require('util');
const core = require('@actions/core');
//const core = {getInput(){return '';},setOutput() {}}
const memeMaker = util.promisify(require('meme-maker'));

let fposit = core.getInput('frase_positiva')+'';
let fnegat = core.getInput('frase_negativa')+'';
const result = core.getInput('resultado_tests')+'';

function splitFrase(f) {
  if (f.indexOf(' y ') !== -1) {
    f = f.split(' y ');
    f[1] = ' y ' + f[1];
  } else {
    f = [f];
  }

  return f;
}

async function makeMeme() {
  console.log(fposit, fnegat, result);
  const ok = result === 'success';
  fposit = splitFrase(fposit);
  fnegat = splitFrase(fnegat);

  try {
    await memeMaker({
      image: 'res/meme-template.png',
      outfile: 'res/meme.png',
      topText: ok ? fposit[0] : fnegat[0],
      bottomText: (ok ? fposit : fnegat)[1] || '',
      font: 'res/impact.ttf'
    });
  } catch (e) {
    console.error(e);
    core.setOutput('result', "Meme NO Añadido al Readme");
    process.exit(1);
  }

  core.setOutput('result', "Meme Añadido al Readme");
}

makeMeme();
