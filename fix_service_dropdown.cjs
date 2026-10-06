const fs = require('fs');

function addServiceAdder(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Inject the "Add Service" dropdown next to "Add Item" button
  const addButtonHTML = `<button type="button" id="addItemBtn" class="text-sm text-[#5568d3] font-medium hover:text-[#4557c2] flex items-center gap-1"><AdminIcon name="plus" class="w-4 h-4" /> Add Item</button>`;
  
  const serviceDropdownHTML = `<div class="flex gap-4 items-center">
          <button type="button" id="addItemBtn" class="text-sm text-[#5568d3] font-medium hover:text-[#4557c2] flex items-center gap-1"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add Custom Item</button>
          
          <select id="addServiceSelect" class="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#5568d3]">
            <option value="">+ Add Existing Service</option>
            {servicesData.map((s: any) => <option value={s.title}>{s.title}</option>)}
          </select>
        </div>`;

  if (c.includes(addButtonHTML)) {
    c = c.replace(addButtonHTML, serviceDropdownHTML);
  } else if (c.includes('id="addItemBtn"')) {
    // Fallback if the icon HTML was different
    c = c.replace(/<button[^>]*id="addItemBtn"[^>]*>.*?<\/button>/s, serviceDropdownHTML);
  }

  // Inject the JS to handle the select change
  const scriptInjection = `
  document.getElementById('addServiceSelect')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val) {
      items.push({ description: val, quantity: 1, unitPrice: 0 });
      renderItems();
      e.target.value = ''; // Reset select
    }
  });
  `;

  if (!c.includes("addServiceSelect")) {
    c = c.replace(/(document\.getElementById\('addItemBtn'\)\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{[^}]*\}\);)/, `$1\n${scriptInjection}`);
  }

  fs.writeFileSync(filePath, c);
}

const files = [
  'src/pages/admin/invoices/new.astro',
  'src/pages/admin/quotations/new.astro',
  'src/pages/admin/invoices/[id]/edit.astro',
  'src/pages/admin/quotations/[id]/edit.astro'
];

files.forEach(addServiceAdder);
