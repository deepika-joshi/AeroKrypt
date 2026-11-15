const fs = require('fs');
const edits = JSON.parse(fs.readFileSync('C:/Users/bhema/Downloads/AeroKrypt-main/AeroKrypt/all_edits.json', 'utf8'));

for (let i = 0; i < edits.length; i++) {
  const e = edits[i];
  console.log(`Edit #${i+1}: ${e.name} on ${e.path}`);
  if (e.name === 'edit_file') {
    console.log(`  Target length: ${e.target.length}, Replacement length: ${e.replacement.length}`);
  } else if (e.name === 'write_file') {
    console.log(`  Write file on ${e.path}`);
  }
}
