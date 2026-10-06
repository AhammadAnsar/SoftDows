const fs = require('fs');

const files = [
  'src/layouts/MainLayout.astro',
  'src/layouts/AdminLayout.astro',
  'src/layouts/PortalLayout.astro',
  'src/layouts/AuthLayout.astro'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/>/g, '<link rel="icon" type="image/png" href="/favicon.png" />');
    c = c.replace(/<link\s+rel="icon"\s+href="\/favicon\.svg"\s*\/>/g, '<link rel="icon" type="image/png" href="/favicon.png" />');
    fs.writeFileSync(file, c);
  }
});
