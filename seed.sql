-- Seed Test Data
INSERT INTO clients (id, name, status, created_at, updated_at) VALUES ('client_1', 'Acme Corp', 'active', unixepoch(), unixepoch());

INSERT INTO invoices (id, invoice_number, client_id, total, currency, status, issue_date, due_date, created_at, updated_at) VALUES ('invoice_1', 'INV-001', 'client_1', 500000, 'USD', 'issued', unixepoch(), unixepoch() + 86400, unixepoch(), unixepoch());

-- Note: prior to 0006, payments does not have client_id
INSERT INTO payments (id, invoice_id, amount, currency, payment_date, payment_method, status, created_at, updated_at) VALUES ('payment_1', 'invoice_1', 100000, 'USD', unixepoch(), 'Bank Transfer', 'completed', unixepoch(), unixepoch());

-- Note: prior to 0007, support_tickets does not have ticket_number or description
INSERT INTO support_tickets (id, client_id, subject, status, created_at, updated_at) VALUES ('ticket_1', 'client_1', 'Help me', 'open', unixepoch(), unixepoch());

INSERT INTO support_messages (id, ticket_id, message, created_at, updated_at) VALUES ('msg_1', 'ticket_1', 'Initial description body', unixepoch(), unixepoch());
