// This script replaces the default index.html with our clean version
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '..', 'index.html');
const templatePath = path.join(__dirname, '..', 'index.template.html');

try {
  const template = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(indexPath, template);
  console.log('Successfully replaced index.html with template');
} catch (error) {
  console.error('Error replacing index.html:', error);
  process.exit(1);
}
