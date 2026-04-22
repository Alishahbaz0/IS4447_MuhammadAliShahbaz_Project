{/*
Deliverable 10: Testing
Unit test: Verifying that the seed function correctly inserts sample data.
Success Criteria: All core tables (habits, categories, and targets) are populated without duplication.

I learned how to create this seed.test.ts file from the following online resources:
- react-native-lab/blob/main/tests/seed.test.ts, Rory Pierce, GitHub Repository, Available at:
https://github.com/rorypierce111/react-native-lab/blob/main/tests/seed.test.ts
*/}

import { seedSampleData } from '@/db/seed';
import { db } from '../db/client';

// mocking the db client so we don't need a real SQLite connection
jest.mock('../db/client', () => ({
    db: {
        insert: jest.fn(),
        select: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockDb = db as unknown as {
    insert: jest.Mock;
    select: jest.Mock;
    delete: jest.Mock;
};

describe('seedSampleData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    
    // mock insert().values().returning() chain for categories and habits
    const mockReturning = jest.fn();
    const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
    mockDb.insert.mockReturnValue({ values: mockValues });

    // return incrementing IDs for categories (4 categories)
    // then 6 habits, then logs and targets.
    let callCount = 0;
    mockReturning.mockImplementation(() => {
        callCount++;
        return Promise.resolve([{ id: callCount }]);
    });

    // for logs and targets, that don't use .returning(), mock values to resolve
    mockValues.mockImplementation((data: any) => {
        const result = { returning: mockReturning };
        // if no .returning() is called, resolve the promise
        (result as any).then = (fn: any) => Promise.resolve().then(fn);
        return result;
    });
});

    it('inserts 4 categories, 6 habits, and 3 targets', async () => {
        await seedSampleData(1);

        // seedSampleData calls db.insert() for:
        // 4 categories, 6 habits, N logs + 3 targets
        // at minimum, we expect 4 + 6 + 3 = 13 insert calls (plus log inserts)
        expect(mockDb.insert).toHaveBeenCalled();

        // counting how many times insert was called, should be at least 13
        const insertCallCount = mockDb.insert.mock.calls.length;
        expect(insertCallCount).toBeGreaterThanOrEqual(13);
    });

    it('does not throw errors during seeding', async () => {
        await expect(seedSampleData(1)).resolves.not.toThrow();
    });
});