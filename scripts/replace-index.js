// This script replaces the default index.html with our clean version
const fs = require('fs');
const path = require('path');

// Paths
const cleanIndexPath = path.join(__dirname, '../public/clean-index.html');
const indexPath = path.join(__dirname, '../index.html');

// Read the clean index.html
const cleanIndex = fs.readFileSync(cleanIndexPath, 'utf8');

// Write it to the main index.html
fs.writeFileSync(indexPath, cleanIndex);

console.log('Successfully replaced index.html with clean version');
