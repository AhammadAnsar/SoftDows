const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/projects/new.astro', 'utf8');
const search = `         const newId = crypto.randomUUID();
         await db.insert(projects).values({
           id: newId,
           name,
           clientId,
           projectCode: data.get('projectCode')?.toString() || null,
           description: data.get('description')?.toString() || null,
           status: status as any,
           priority: (data.get('priority')?.toString() || 'medium') as any,
           budget: parseInt(data.get('budget')?.toString() || '0') * 100, // minor units
         });`;

const replace = `         const newId = crypto.randomUUID();
         const pData: any = { id: newId, name, clientId, status: status as any, priority: (data.get('priority')?.toString() || 'medium') as any, budget: parseInt(data.get('budget')?.toString() || '0') * 100 };
         if (data.get('projectCode')) pData.projectCode = data.get('projectCode')?.toString();
         if (data.get('description')) pData.description = data.get('description')?.toString();
         await db.insert(projects).values(pData);`;

c = c.replace(search, replace);
c = c.replace(search.replace(/\r\n/g, '\n'), replace); // fallback

fs.writeFileSync('src/pages/admin/projects/new.astro', c);
