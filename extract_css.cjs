const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lineNum = 0;
const chunks = [];

rl.on('line', (line) => {
  lineNum++;
  if ([329, 331, 333, 335, 337, 339].includes(lineNum)) {
    const parsed = JSON.parse(line);
    chunks.push({ lineNum, content: parsed.content });
    console.log(`Line ${lineNum}: content length = ${parsed.content?.length}`);
  }
});

rl.on('close', () => {
  console.log(`Read ${chunks.length} chunks for location-finder.css`);
  fs.writeFileSync('C:/Users/bhema/Downloads/AeroKrypt-main/AeroKrypt/css_chunks.json', JSON.stringify(chunks, null, 2));
});
