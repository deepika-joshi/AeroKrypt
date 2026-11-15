const fs = require('fs');
const edits = JSON.parse(fs.readFileSync('C:/Users/bhema/Downloads/AeroKrypt-main/AeroKrypt/all_edits.json', 'utf8'));

const byFile = {};
for (const e of edits) {
  const p = e.path.toLowerCase().replace(/\\/g, '/');
  if (!byFile[p]) byFile[p] = [];
  byFile[p].push(e);
}

for (const [f, list] of Object.entries(byFile)) {
  console.log(`File: ${f} (${list.length} ops)`);
  list.forEach((op, i) => {
    console.log(`  [${i+1}] line ${op.lineNum} step ${op.step}: ${op.name}`);
  });
}
