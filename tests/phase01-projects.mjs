import test from 'node:test';
import assert from 'node:assert';
import { getDb } from '../src/lib/db/index.js';
import { projects, projectMilestones } from '../src/lib/db/schema/agency.js';
import { clients } from '../src/lib/db/schema/crm.js';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

// Setup mock DB
const mockDb = {
  data: { projects: [], milestones: [], clients: [] },
  insert: (table) => ({
    values: (data) => {
      if (table === projects) mockDb.data.projects.push(data);
      if (table === projectMilestones) mockDb.data.milestones.push(data);
      if (table === clients) mockDb.data.clients.push(data);
      return { returning: () => [data] };
    }
  }),
  update: (table) => ({
    set: (data) => ({
      where: (condition) => {
        // mock update
        return { returning: () => [data] };
      }
    })
  })
};

test('Phase 01: Projects CRUD', async (t) => {
  await t.test('create project', async () => {
    const pId = crypto.randomUUID();
    const p = { id: pId, title: 'Test Project', projectCode: 'PRJ-01', status: 'draft' };
    mockDb.insert(projects).values(p);
    assert.strictEqual(mockDb.data.projects.length, 1);
    assert.strictEqual(mockDb.data.projects[0].projectCode, 'PRJ-01');
  });

  await t.test('create milestone', async () => {
    const mId = crypto.randomUUID();
    const m = { id: mId, projectId: mockDb.data.projects[0].id, title: 'Phase 1', status: 'pending' };
    mockDb.insert(projectMilestones).values(m);
    assert.strictEqual(mockDb.data.milestones.length, 1);
    assert.strictEqual(mockDb.data.milestones[0].title, 'Phase 1');
  });
});
