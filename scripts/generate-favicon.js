const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a canvas for the favicon
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Create a gradient background
const gradient = ctx.createLinearGradient(0, 0, 32, 32);
gradient.addColorStop(0, '#0EA5E9');
gradient.addColorStop(0.5, '#10B981');
gradient.addColorStop(1, '#8B5CF6');

// Draw rounded rectangle
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.roundRect(0, 0, 32, 32, 8);
ctx.fill();

// Draw CP text
ctx.fillStyle = 'white';
ctx.font = 'bold 18px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('CP', 16, 16);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), buffer);

console.log('Favicon generated successfully!');
