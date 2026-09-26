const fs = require('fs');

const f1 = 'src/pages/admin/users/[id]/index.astro';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/<AdminLayout.*?>/g, '<AdminLayout title={`User Details: ${targetUser.name}`} user={currentUser}>');
fs.writeFileSync(f1, c1);

['src/pages/api/admin/users/create.ts', 'src/pages/api/admin/users/[id]/role.ts', 'src/pages/api/admin/users/[id]/status.ts'].forEach(f => {
  let c2 = fs.readFileSync(f, 'utf8');
  c2 = c2.replace(/const body = \(await request\.json\(\)\) as any;/g, 'const body: any = await request.json();');
  c2 = c2.replace(/const body = await request\.json\(\);/g, 'const body: any = await request.json();');
  fs.writeFileSync(f, c2);
});
