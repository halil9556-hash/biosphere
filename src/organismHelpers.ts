import type { Organism } from './types';

export function getDangerBadgeColor(level: string): string {
  if (level.toLowerCase().includes('yüksek')) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (level.toLowerCase().includes('orta')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
}

export function getIucnBadgeColor(status: string): string {
  if (status === 'CR') return 'bg-red-600/85 text-white border-red-400/50';
  if (status === 'EN') return 'bg-orange-600/85 text-white border-orange-400/50';
  if (status === 'VU') return 'bg-amber-500/85 text-amber-950 border-amber-300/60';
  if (status === 'NT') return 'bg-yellow-500/30 text-yellow-200 border-yellow-500/40';
  return 'bg-black/75 text-emerald-300 border-emerald-500/30';
}

export function getKingdomBadge(id: string) {
  if (id.startsWith('p-')) return { label: 'Bitkiler Alemi', style: 'bg-lime-500/20 text-lime-300 border-lime-500/40' };
  if (id.startsWith('f-')) return { label: 'Mantarlar Alemi', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  return { label: 'Hayvanlar Alemi', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
}

export function findMatchingOrganism(
  allOrganisms: Organism[],
  text: string,
  explicitId?: string
): Organism | undefined {
  if (explicitId) {
    const byId = allOrganisms.find((o) => o.id === explicitId);
    if (byId) return byId;
  }
  const clean = text.trim().toLowerCase();
  if (!clean) return undefined;
  return allOrganisms.find(
    (o) =>
      clean.includes(o.scientific_name.toLowerCase()) ||
      clean.includes(o.common_name.toLowerCase()) ||
      `${o.scientific_name.toLowerCase()} (${o.common_name.toLowerCase()})` === clean
  );
}

export function findInteractionLinkedOrganism(
  allOrganisms: Organism[],
  interactionText: string,
  currentOrganismId: string
): Organism | undefined {
  const cleanText = interactionText.toLocaleLowerCase('tr-TR');
  const sortedCandidates = [...allOrganisms]
    .filter((o) => o.id !== currentOrganismId)
    .sort((a, b) => b.common_name.length - a.common_name.length);

  return sortedCandidates.find((candidate) => {
    const commonLower = candidate.common_name.toLocaleLowerCase('tr-TR');
    const sciLower = candidate.scientific_name.toLowerCase();
    if (commonLower.length >= 4 && cleanText.includes(commonLower)) return true;
    if (sciLower.length >= 5 && cleanText.includes(sciLower)) return true;
    return false;
  });
}

export function getAutocompleteMatches(allOrganisms: Organism[], query: string): Organism[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return allOrganisms
    .filter(
      (o) =>
        o.common_name.toLowerCase().includes(q) ||
        o.scientific_name.toLowerCase().includes(q)
    )
    .slice(0, 5);
}