import fs from 'fs';
let content = fs.readFileSync('src/pages/api/portal/support/create.ts', 'utf8');
content = content.replace(/db\.insert\(supportTickets\)\.values\(\{ \/\/ @ts-ignore\n/g, 'db.insert(supportTickets).values({ // @ts-ignore\n');
content = content.replace(/db\.insert\(supportTickets\)\.values/g, '// @ts-ignore\n    db.insert(supportTickets).values');
fs.writeFileSync('src/pages/api/portal/support/create.ts', content);
