const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lineNum = 0;
const allEdits = [];

rl.on('line', (line) => {
  lineNum++;
  if (lineNum >= 370 && lineNum <= 510) {
    if (line.includes('"name":"edit_file"') || line.includes('"name":"write_file"')) {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'edit_file' || tc.name === 'write_file') {
            allEdits.push({
              lineNum,
              step: parsed.step_index,
              name: tc.name,
              path: tc.args.Path,
              target: tc.args.Target,
              replacement: tc.args.Replacement,
              content: tc.args.Content ? tc.args.Content.substring(0, 100) : undefined
            });
          }
        }
      }
    }
  }
});

rl.on('close', () => {
  console.log(`Found ${allEdits.length} edits/writes.`);
  fs.writeFileSync('C:/Users/bhema/Downloads/AeroKrypt-main/AeroKrypt/all_edits.json', JSON.stringify(allEdits, null, 2));
  console.log('Saved to all_edits.json');
});
