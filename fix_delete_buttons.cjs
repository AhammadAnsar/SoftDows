const fs = require('fs');

function addDeleteButton(entity, filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Add delete form handling
  if (!c.includes(`action === 'delete_${entity}'`)) {
    const search = `if (Astro.request.method === 'POST' && canEdit) {\n  try {\n    const data = await Astro.request.formData();\n    const action = data.get('action')?.toString();`;
    const replace = `if (Astro.request.method === 'POST' && canEdit) {\n  try {\n    const data = await Astro.request.formData();\n    const action = data.get('action')?.toString();\n\n    if (action === 'delete_${entity}') {\n      await db.delete(${entity === 'project' ? 'projects' : entity + 's'}).where(eq(${entity === 'project' ? 'projects' : entity + 's'}.id, id as string));\n      return Astro.redirect('/admin/${entity === 'project' ? 'projects' : entity + 's'}');\n    }`;
    c = c.replace(search, replace);
  }

  // Add delete button UI
  if (!c.includes(`value="delete_${entity}"`)) {
    const uiSearch = `<div class="ml-auto flex items-center gap-3">`;
    const uiReplace = `<div class="ml-auto flex items-center gap-3">\n        <form method="POST" class="inline-block" onsubmit="return confirm('Are you sure you want to delete this ${entity}? This action cannot be undone.');">\n          <input type="hidden" name="action" value="delete_${entity}" />\n          <button type="submit" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">Delete</button>\n        </form>`;
    c = c.replace(uiSearch, uiReplace);
  }

  fs.writeFileSync(filePath, c);
}

addDeleteButton('client', 'src/pages/admin/clients/[id]/index.astro');
addDeleteButton('lead', 'src/pages/admin/leads/[id]/index.astro');
addDeleteButton('project', 'src/pages/admin/projects/[id]/index.astro');
