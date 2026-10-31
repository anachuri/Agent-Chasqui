import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Día calendario en Argentina (UTC-3).
export const dayKey = (now) => new Date(now.getTime() - 3 * 3600e3).toISOString().slice(0, 10);

export function createMemoryStore() {
  const days = new Map();
  return {
    async spentToday(now) { return days.get(dayKey(now)) ?? 0n; },
    async record(now, cents) { days.set(dayKey(now), (days.get(dayKey(now)) ?? 0n) + cents); },
  };
}

export function createFileStore(path) {
  const load = () => { try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return {}; } };
  return {
    async spentToday(now) { return BigInt(load()[dayKey(now)] ?? '0'); },
    async record(now, cents, hash) {
      const data = load();
      data[dayKey(now)] = (BigInt(data[dayKey(now)] ?? '0') + cents).toString();
      data.last = hash;
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, JSON.stringify(data));
    },
  };
}
