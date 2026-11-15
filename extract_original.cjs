const fs = require('fs');
const readline = require('readline');

// Let's inspect step 295-338 lines in transcript_full.jsonl
const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl')
});

let lineNum = 0;
const results = {};

rl.on('line', (line) => {
  lineNum++;
  if (lineNum >= 290 && lineNum <= 345) {
    try {
      const parsed = JSON.parse(line);
      console.log(`Line ${lineNum}: step ${parsed.step_index}, type=${parsed.type}, source=${parsed.source}`);
      if (parsed.tool_calls) {
        console.log(`   tool_calls:`, JSON.stringify(parsed.tool_calls));
      }
      if (parsed.content && parsed.content.includes('Showing lines')) {
        console.log(`   content header:`, parsed.content.substring(0, 100).replace(/\r?\n/g, ' '));
      }
    } catch (e) {
      console.error(e);
    }
  }
});
