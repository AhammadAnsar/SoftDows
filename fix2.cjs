const fs = require('fs');
const path = require('path');
function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) filelist = walkSync(dirFile, filelist);
    else filelist.push(dirFile);
  });
  return filelist;
}
const files = walkSync('./src/pages/admin/projects');

files.forEach(f => {
  if (f.endsWith('.astro')) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import \{ db \} from '.*?lib\/db';/g, "import { getDb } from '../../../../lib/db';");
    
    // Fix imports - paths might be wrong depending on depth
    const depth = f.split(path.sep).length - 4; // src/pages/admin/projects/index.astro -> 5 -> depth 1
    const up = '../'.repeat(depth + 2);
    content = content.replace(/import \{ projects, clients \} from '.*?lib\/db\/schema';/, `import { projects } from '${up}lib/db/schema/agency'; import { clients } from '${up}lib/db/schema/crm';`);
    content = content.replace(/import \{ projects, clients, user \} from '.*?lib\/db\/schema';/, `import { projects } from '${up}lib/db/schema/agency'; import { clients } from '${up}lib/db/schema/crm'; import { user } from '${up}lib/db/schema/auth';`);
    content = content.replace(/import \{ projects, clients, projectMilestones, projectMembers, user \} from '.*?lib\/db\/schema';/, `import { projects, projectMilestones, projectMembers } from '${up}lib/db/schema/agency'; import { clients } from '${up}lib/db/schema/crm'; import { user } from '${up}lib/db/schema/auth';`);
    content = content.replace(/import \{ getAuth \} from '.*?lib\/auth';/, `import { getAuth } from '${up}lib/auth';`);
    content = content.replace(/import \{ requirePermission \} from '.*?lib\/auth\/authorization';/, `import { requirePermission } from '${up}lib/auth/authorization';`);

    content = content.replace(/const items = await db/g, "const db = getDb((env as any).DB);\nconst items = await db");
    content = content.replace(/const allProjects = await db/g, "const db = getDb((env as any).DB);\nconst allProjects = await db");
    content = content.replace(/const allClients = await db/g, "const db = getDb((env as any).DB);\nconst allClients = await db");
    content = content.replace(/const clientCheck = await db/g, "const db = getDb((env as any).DB);\nconst clientCheck = await db");
    content = content.replace(/if \(action === 'add_milestone'\) \{/g, "const db = getDb((env as any).DB);\nif (action === 'add_milestone') {");
    content = content.replace(/const project = await db/g, "const db = getDb((env as any).DB);\nconst project = await db");
    content = content.replace(/user=\{session\.user\}/g, "user={session.user as any}");
    content = content.replace(/\.includes\(session\.user\.role\)/g, ".includes(session.user.role as any)");
    
    fs.writeFileSync(f, content);
  }
});

// Also remove the old bad generated files from the previous step just in case they are failing check
try { fs.unlinkSync('src/pages/admin/services/index.astro'); } catch(e){}
try { fs.unlinkSync('src/pages/admin/team/index.astro'); } catch(e){}
try { fs.unlinkSync('src/pages/admin/work/index.astro'); } catch(e){}
try { fs.unlinkSync('src/pages/admin/insights/index.astro'); } catch(e){}

console.log('Fixed projects files');
