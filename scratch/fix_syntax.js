const fs = require('fs');

const files = [
  'frontend/src/pages/sales/AddLead.jsx',
  'frontend/src/pages/sales/EditLead.jsx',
  'frontend/src/pages/admin/AddLead.jsx',
  'frontend/src/pages/admin/EditLead.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace: combinedNotes = `Looking for: ${customCarName}${combinedNotes ? `\n\n${combinedNotes}` : ''}`;
  content = content.replace(
    /combinedNotes = `Looking for: \$\{customCarName\}\$\{combinedNotes \? `\\n\\n\$\{combinedNotes\}` : ''\}`;/g,
    "combinedNotes = 'Looking for: ' + customCarName + (combinedNotes ? '\\n\\n' + combinedNotes : '');"
  );
  
  // Replace: combinedNotes = `Looking for: ${customCarName}${combinedNotes ? \`\n\n${combinedNotes}\` : ''}`;
  // Sometimes it was written with backslashes
  content = content.replace(
    /combinedNotes = `Looking for: \$\{customCarName\}\$\{combinedNotes \? \\`\\n\\n\$\{combinedNotes\}\\` : ''\}`;/g,
    "combinedNotes = 'Looking for: ' + customCarName + (combinedNotes ? '\\n\\n' + combinedNotes : '');"
  );
  
  // Also fix the EditLead regex replace part if it exists
  // combinedNotes = combinedNotes.replace(/Looking for:\s*(.*?)(?:\n|$)/, `Looking for: ${customCarName}\n`);
  content = content.replace(
    /combinedNotes = combinedNotes\.replace\(\/Looking for:\\s\*\(\.\*\?\)\(\?:\\n\|\$\)\/, `Looking for: \$\{customCarName\}\\n`\);/g,
    "combinedNotes = combinedNotes.replace(/Looking for:\\s*(.*?)(?:\\n|$)/, 'Looking for: ' + customCarName + '\\n');"
  );

  fs.writeFileSync(file, content);
});

console.log('Fixed all files');
