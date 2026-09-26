const fs = require('fs');

function replaceFile(p, replacer) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, replacer(fs.readFileSync(p, 'utf8')));
  }
}

replaceFile('./src/pages/admin/projects/index.astro', c => {
  let text = c.replace(/import \{ getDb \} from '.*?lib\/db';/, "import { getDb } from '../../../lib/db';");
  text = text.replace(/p => \(/, "(p: any) => (");
  return text;
});

replaceFile('./src/pages/admin/projects/new.astro', c => {
  let text = c.replace(/import \{ getDb \} from '.*?lib\/db';/, "import { getDb } from '../../../lib/db';");
  text = text.replace(/c => </, "(c: any) => <");
  return text;
});

console.log('Fixed typings');
