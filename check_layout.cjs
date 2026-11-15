const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/bhema/.gemini/antigravity/brain/b1e7bb30-74dd-49fb-84eb-4f5c91688965/.system_generated/logs/transcript_full.jsonl')
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (lineNum === 372) {
    const parsed = JSON.parse(line);
    const call = parsed.tool_calls[0];
    console.log('TARGET in layout.css edit:');
    console.log(call.args.Target);
    console.log('REPLACEMENT in layout.css edit:');
    console.log(call.args.Replacement);
  }
});
