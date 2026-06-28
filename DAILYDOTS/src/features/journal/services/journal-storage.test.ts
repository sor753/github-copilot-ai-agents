import { describe, expect, it } from 'vitest';

import { LocalStorageJournalRepository } from './journal-storage';

interface MemoryStorage {
  data: Map<string, string>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const createMemoryStorage = (): MemoryStorage => {
  const data = new Map<string, string>();

  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
};

describe('LocalStorageJournalRepository', () => {
  it('upsert creates and then updates the same date', async () => {
    const storage = createMemoryStorage();
    const repository = new LocalStorageJournalRepository(storage);

    await repository.upsert({
      date: '2026-06-20',
      mood: 'neutral',
      text: 'first',
    });

    await repository.upsert({
      date: '2026-06-20',
      mood: 'good',
      text: 'updated',
    });

    const entries = await repository.list();
    expect(entries).toHaveLength(1);
    expect(entries[0].mood).toBe('good');
    expect(entries[0].text).toBe('updated');
  });

  it('keeps entries sorted by date desc', async () => {
    const storage = createMemoryStorage();
    const repository = new LocalStorageJournalRepository(storage);

    await repository.upsert({
      date: '2026-06-10',
      mood: 'neutral',
      text: 'older',
    });

    await repository.upsert({
      date: '2026-06-15',
      mood: 'great',
      text: 'newer',
    });

    const entries = await repository.list();
    expect(entries[0].date).toBe('2026-06-15');
    expect(entries[1].date).toBe('2026-06-10');
  });

  it('removeByDate deletes only the target entry', async () => {
    const storage = createMemoryStorage();
    const repository = new LocalStorageJournalRepository(storage);

    await repository.upsert({
      date: '2026-06-10',
      mood: 'neutral',
      text: 'keep',
    });

    await repository.upsert({
      date: '2026-06-11',
      mood: 'bad',
      text: 'remove',
    });

    await repository.removeByDate('2026-06-11');

    const entries = await repository.list();
    expect(entries).toHaveLength(1);
    expect(entries[0].date).toBe('2026-06-10');
  });

  it('counts recent entries including the 7-day boundary date', async () => {
    const storage = createMemoryStorage();
    const repository = new LocalStorageJournalRepository(storage);
    const base = new Date();

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const atOffset = (offset: number): string => {
      const value = new Date(base.getFullYear(), base.getMonth(), base.getDate());
      value.setDate(value.getDate() - offset);
      return formatDate(value);
    };

    await repository.upsert({
      date: atOffset(0),
      mood: 'good',
      text: 'today',
    });
    await repository.upsert({
      date: atOffset(6),
      mood: 'neutral',
      text: 'boundary day',
    });
    await repository.upsert({
      date: atOffset(7),
      mood: 'bad',
      text: 'outside window',
    });

    const summary = await repository.getSummary();
    expect(summary.recentEntries).toBe(2);
  });
});
