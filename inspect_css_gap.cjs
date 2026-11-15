const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lastCallWasCss = false;
let lineNum = 0;
const fileLines = {};

rl.on('line', (line) => {
  lineNum++;
  if (lastCallWasCss) {
    lastCallWasCss = false;
    const parsed = JSON.parse(line);
    const content = parsed.content || '';
    const lines = content.split(/\r?\n/);
    for (const l of lines) {
      const m = l.match(/^(\d+): (.*)$/);
      if (m) {
        fileLines[parseInt(m[1])] = m[2];
      } else {
        const mEmpty = l.match(/^(\d+):$/);
        if (mEmpty) {
          fileLines[parseInt(mEmpty[1])] = '';
        }
      }
    }
  }

  if (line.includes('location-finder.css') && line.includes('read_file') && lineNum < 482) {
    lastCallWasCss = true;
  }
});

rl.on('close', () => {
  console.log('Lines 140 to 164:');
  for (let i = 140; i <= 164; i++) {
    console.log(`${i}: ${fileLines[i]}`);
  }
  console.log('Lines 200 to 220:');
  for (let i = 200; i <= 220; i++) {
    console.log(`${i}: ${fileLines[i]}`);
  }
});
