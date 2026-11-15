const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (line.includes('"name":"edit_file"') || line.includes('"name":"write_file"')) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'edit_file' || tc.name === 'write_file') {
            console.log(`Line ${lineNum} (step ${parsed.step_index}): ${tc.name} on ${tc.args?.Path}`);
          }
        }
      }
    } catch (e) {}
  }
});
