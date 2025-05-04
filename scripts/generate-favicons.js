const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if Inkscape is installed
try {
  execSync('inkscape --version', { stdio: 'ignore' });
  console.log('Inkscape is installed, proceeding with favicon generation...');
} catch (error) {
  console.error('Inkscape is not installed. Please install Inkscape to generate favicons.');
  process.exit(1);
}

const svgPath = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

// Define the sizes to generate
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

// Check if the SVG file exists
if (!fs.existsSync(svgPath)) {
  console.error(`SVG file not found: ${svgPath}`);
  process.exit(1);
}

// Generate PNGs for each size
sizes.forEach(({ name, size }) => {
  const outputPath = path.join(outputDir, name);
  const command = `inkscape --export-filename=${outputPath} -w ${size} -h ${size} ${svgPath}`;
  
  try {
    console.log(`Generating ${name}...`);
    execSync(command);
    console.log(`Generated ${name} successfully.`);
  } catch (error) {
    console.error(`Failed to generate ${name}:`, error.message);
  }
});

console.log('Favicon generation complete!');
