const fs = require('fs');

const files = [
  'src/layouts/AdminLayout.astro',
  'src/layouts/PortalLayout.astro',
  'src/layouts/AuthLayout.astro'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    if (!c.includes('<link rel="icon"')) {
      c = c.replace(/<title>/, '<link rel="icon" type="image/png" href="/favicon.png" />\n  <title>');
      fs.writeFileSync(file, c);
    }
  }
});
