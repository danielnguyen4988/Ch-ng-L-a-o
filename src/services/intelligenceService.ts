import { FraudIntelligenceEntry, FraudTargetType } from '../types';

export interface IntelligenceMatch {
  entry: FraudIntelligenceEntry;
  reason: 'exact' | 'normalized' | 'contains';
}

export function normalizePhone(value: string): string {
  return value.trim().replace(/[^\d+]/g, '');
}

export function normalizeBank(value: string): string {
  return value.trim().replace(/\D/g, '');
}

export function normalizeLink(value: string): string {
  const clean = value.trim().toLowerCase();

  try {
    const url = /^https?:\/\//i.test(clean)
      ? new URL(clean)
      : new URL(`https://${clean}`);

    return url.hostname.replace(/^www\./, '');
  } catch {
    return clean
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .trim();
  }
}

export function normalizeGeneric(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeIntelligenceKey(
  type: FraudTargetType,
  value: string
): string {
  switch (type) {
    case 'phone':
      return normalizePhone(value);

    case 'bank':
      return normalizeBank(value);

    case 'link':
      return normalizeLink(value);

    default:
      return normalizeGeneric(value);
  }
}

export function queryIntelligence(
  entries: Record<string, FraudIntelligenceEntry>,
  type: FraudTargetType,
  value: string
): IntelligenceMatch[] {
  if (!value.trim()) return [];

  const normalizedInput = normalizeIntelligenceKey(type, value);
  if (!normalizedInput) return [];

  const exactMatches: IntelligenceMatch[] = [];
  const normalizedMatches: IntelligenceMatch[] = [];
  const containsMatches: IntelligenceMatch[] = [];

  for (const entry of Object.values(entries)) {
    if (entry.targetType !== type) continue;

    const normalizedEntry = normalizeIntelligenceKey(
      entry.targetType,
      entry.targetValue
    );

    if (!normalizedEntry) continue;

    if (normalizedEntry === normalizedInput) {
      exactMatches.push({
        entry,
        reason: 'exact',
      });
      continue;
    }

    if (entry.normalizedKey === normalizedInput) {
      normalizedMatches.push({
        entry,
        reason: 'normalized',
      });
      continue;
    }

    if (
      normalizedEntry.includes(normalizedInput) ||
      normalizedInput.includes(normalizedEntry)
    ) {
      containsMatches.push({
        entry,
        reason: 'contains',
      });
    }
  }

  const sortMatches = (
    a: IntelligenceMatch,
    b: IntelligenceMatch
  ): number => {
    return (
      b.entry.threatScore - a.entry.threatScore ||
      b.entry.reportsCount - a.entry.reportsCount
    );
  };

  exactMatches.sort(sortMatches);
  normalizedMatches.sort(sortMatches);
  containsMatches.sort(sortMatches);

  return [
    ...exactMatches,
    ...normalizedMatches,
    ...containsMatches,
  ];
}

export function findIntelligenceMatch(
  entries: Record<string, FraudIntelligenceEntry>,
  type: FraudTargetType,
  value: string
): IntelligenceMatch | null {
  const matches = queryIntelligence(entries, type, value);

  return matches[0] ?? null;
}