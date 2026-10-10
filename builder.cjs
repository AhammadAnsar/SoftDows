const fs = require('fs');
const path = require('path');
const pagesDir = './src/pages/admin';
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
ensureDir(pagesDir + '/projects');
fs.writeFileSync(pagesDir + '/projects/index.astro', '--- \n// Projects stub \n--- \n<div>Projects</div>');
