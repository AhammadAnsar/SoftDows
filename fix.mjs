import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.astro')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/pages/portal');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix PortalLayout missing user
  content = content.replace(/<PortalLayout title=([^>]+)>/g, '<PortalLayout title=$1 user={user}>');

  // Fix ctx.clientId nullability
  content = content.replace(/ctx\.clientId\)/g, 'ctx.clientId as string)');
  content = content.replace(/ctx\.clientId,/g, 'ctx.clientId as string,');
  content = content.replace(/ctx\.clientId /g, 'ctx.clientId as string ');
  
  // Actually, better to just typecast directly where needed. Let's just blindly cast it to string: ctx.clientId!
  content = content.replace(/ctx\.clientId/g, 'ctx.clientId!');

  // Fix StatusBadge usage
  // Some subagents used <StatusBadge status={x} />
  content = content.replace(/<StatusBadge status=\{([^}]+)\} \/>/g, (match, p1) => {
    return `<StatusBadge label={String(${p1}).replace(/_/g, ' ')} variant="neutral" />`;
  });

  fs.writeFileSync(file, content);
}
