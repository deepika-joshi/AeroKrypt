const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (line.includes('EarthGlobe3D.jsx') && line.includes('"name":"read_file"')) {
    const parsed = JSON.parse(line);
    console.log(`Line ${lineNum}:`, JSON.stringify(parsed.tool_calls));
  }
});
