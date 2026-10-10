import { test } from 'node:test';
import assert from 'node:assert';

function calculateLineTotal(quantity, unitPriceMinor) {
  // deterministic rounding
  return Math.round(quantity * unitPriceMinor);
}

function calculateInvoice(items, discountMinor = 0, taxRate = 0) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += calculateLineTotal(item.quantity, item.unitPriceMinor);
  }
  const taxableAmount = Math.max(0, subtotal - discountMinor);
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;
  return { subtotal, tax, total };
}

test('Quantity = 1', () => {
  assert.strictEqual(calculateLineTotal(1, 10050), 10050); // $100.50
});

test('Quantity = 2.5', () => {
  assert.strictEqual(calculateLineTotal(2.5, 10050), 25125); // $251.25
});

test('Quantity = 0.5', () => {
  assert.strictEqual(calculateLineTotal(0.5, 9999), 5000); // $49.995 rounds to $50.00
});

test('Tax and Discount Order', () => {
  const items = [{ quantity: 2, unitPriceMinor: 5000 }]; // $100.00
  const discount = 2000; // $20.00
  const taxRate = 0.1; // 10%
  const res = calculateInvoice(items, discount, taxRate);
  
  assert.strictEqual(res.subtotal, 10000);
  assert.strictEqual(res.tax, 800); // 10% of $80
  assert.strictEqual(res.total, 8800); // $88
});

console.log('Financial integrity mathematical tests passed.');
