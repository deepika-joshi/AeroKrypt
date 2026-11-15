const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (lineNum === 297) {
    const parsed = JSON.parse(line);
    console.log('Sample read output (first 500 chars):');
    console.log(parsed.content.substring(0, 500));
  }
});
