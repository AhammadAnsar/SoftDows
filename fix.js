const fs = require('fs');
const path = require('path');
function fix(dir, replaceFn) {
  const files = fs.readdirSync(dir, {withFileTypes: true});
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) fix(p, replaceFn);
    else if (p.endsWith('.astro')) {
      let c = fs.readFileSync(p, 'utf8');
      c = replaceFn(c);
      fs.writeFileSync(p, c);
    }
  }
}

fix('src/pages/admin/website', c => c.replace(/ currentPath="[^"]+"/g, ''));
fix('src/pages/services', c => c.replace(/variant="white"/g, 'variant="default"').replace(/size="lg"/g, 'size="large"').replace(/description=\{([^}]+)\}/g, 'description={$1 || undefined}'));
fix('src/pages/products', c => c.replace(/variant="white"/g, 'variant="default"').replace(/description=\{([^}]+)\}/g, 'description={$1 || undefined}'));
fix('src/pages/ventures', c => c.replace(/variant="white"/g, 'variant="default"').replace(/description=\{([^}]+)\}/g, 'description={$1 || undefined}'));
fix('src/pages/team', c => c.replace(/variant="white"/g, 'variant="default"').replace(/description=\{([^}]+)\}/g, 'description={$1 || undefined}'));
