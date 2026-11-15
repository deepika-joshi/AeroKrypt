const fs = require('fs');
const readline = require('readline');

const files = [
  'CandidateMatchCard.jsx',
  'EarthGlobe3D.jsx',
  'LocationSidePanel.jsx',
  'LocationFinder.jsx',
  'location-finder.css',
  'layout.css'
];

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript.jsonl')
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  for (const f of files) {
    if (line.includes(f) && (line.includes('read_file') || line.includes('edit_file') || line.includes('write_file'))) {
      const parsed = JSON.parse(line);
      console.log(`Line ${lineNum} (step ${parsed.step_index}): ${parsed.type} ${f}`);
    }
  }
});
