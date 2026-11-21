import React, { useState, useMemo } from 'react';
import {
  BarChart3, Scale, Search, Trash2, Utensils, Clock,
  MapPin, Leaf, Network, ExternalLink, ShieldAlert
} from 'lucide-react';
import { type Organism, FALLBACK_IMAGE } from '../types';
import {
  getDangerBadgeColor,
  getKingdomBadge,
  findInteractionLinkedOrganism
} from '../organismHelpers';

interface CompareViewProps {
  allOrganisms: Organism[];
  animalsCount: number;
  plantsCount: number;
  fungiCount: number;
  compareIds: string[];
  wikiImages: { [key: string]: string };
  onToggleCompare: (id: string, e?: React.MouseEvent) => void;
  onSelectOrganism: (org: Organism) => void;
}

export function CompareView({
  allOrganisms,
  animalsCount,
  plantsCount,
  fungiCount,
  compareIds,
  wikiImages,
  onToggleCompare,
  onSelectOrganism,
}: CompareViewProps) {
  const [compareSearch, setCompareSearch] = useState('');

  const ecosystemStats = useMemo(() => {
    const total = allOrganisms.length || 1;
    const endangered = allOrganisms.filter((o) =>
      ['CR', 'EN', 'VU'].includes(o.conservation_status)
    );
    const highRisk = allOrganisms.filter((o) =>
      o.danger_level.toLowerCase().includes('yüksek')
    );
    const totalCategories = new Set(allOrganisms.map((o) => o.category)).size;

    return {
      total: allOrganisms.length,
      animalsPct: Math.round((animalsCount / total) * 100),
      plantsPct: Math.round((plantsCount / total) * 100),
      fungiPct: Math.round((fungiCount / total) * 100),
      endangeredCount: endangered.length,
      highRiskCount: highRisk.length,
      totalCategories,
    };
  }, [allOrganisms, animalsCount, plantsCount, fungiCount]);

  const compareList = useMemo(() => {
    return compareIds
      .map((id) => allOrganisms.find((item) => item.id === id))
      .filter((item): item is Organism => Boolean(item));
  }, [compareIds, allOrganisms]);

  const compareSearchResults = useMemo(() => {
    const q = compareSearch.trim().toLowerCase();
    if (!q) return [];
    return allOrganisms
      .filter(
        (item) =>
          !compareIds.includes(item.id) &&
          (item.common_name.toLowerCase().includes(q) ||
            item.scientific_name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [compareSearch, allOrganisms, compareIds]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-cyan-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Biyoçeşitlilik & Ekosistem Analizi</h2>
            <p className="text-xs text-emerald-400/80">
              Veritabanındaki {ecosystemStats.total} tür ve {ecosystemStats.totalCategories} farklı taksonomik sınıfın dağılımı
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-emerald-800/60 bg-[#0c1613] p-5">
            <p className="text-xs font-medium text-emerald-400">Kayıtlı Toplam Tür</p>
            <p className="mt-1 text-3xl font-bold text-white">{ecosystemStats.total}</p>
            <p className="mt-2 text-xs text-emerald-300/70">
              {ecosystemStats.totalCategories} alt biyolojik kategori
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-[#0c1613] p-5">
            <p className="text-xs font-medium text-amber-300">Tehdit Altındaki Türler (CR / EN / VU)</p>
            <p className="mt-1 text-3xl font-bold text-amber-400">{ecosystemStats.endangeredCount}</p>
            <p className="mt-2 text-xs text-amber-200/70">
              Küresel koruma önceliği yüksek türler
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-[#0c1613] p-5">
            <p className="text-xs font-medium text-rose-300">Yüksek Biyolojik / Toksik Risk</p>
            <p className="mt-1 text-3xl font-bold text-rose-400">{ecosystemStats.highRiskCount}</p>
            <p className="mt-2 text-xs text-rose-200/70">
              Güçlü nörotoksin, alkaloid veya vektör
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-[#0c1613] p-5 space-y-2.5">
            <p className="text-xs font-medium text-cyan-300">Alemler Arası Dağılım</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-300">Hayvanlar ({animalsCount})</span>
                <span className="font-semibold text-white">%{ecosystemStats.animalsPct}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
                <div className="h-full bg-emerald-500" style={{ width: `${ecosystemStats.animalsPct}%` }} />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-lime-300">Bitkiler ({plantsCount})</span>
                <span className="font-semibold text-white">%{ecosystemStats.plantsPct}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
                <div className="h-full bg-lime-400" style={{ width: `${ecosystemStats.plantsPct}%` }} />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-amber-300">Mantarlar ({fungiCount})</span>
                <span className="font-semibold text-white">%{ecosystemStats.fungiPct}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
                <div className="h-full bg-amber-500" style={{ width: `${ecosystemStats.fungiPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Yan Yana Tür Karşılaştırma Stüdyosu</h2>
              <p className="text-xs text-emerald-400/80">
                Farklı alemlerden en fazla 3 türü aynı anda ekolojik, biyolojik ve risk ölçütleriyle kıyasla
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Kıyaslamak için tür ekle (örn: Kobra, Sığla)..."
              value={compareSearch}
              onChange={(e) => setCompareSearch(e.target.value)}
              className="w-full rounded-xl border border-cyan-800/60 bg-[#0c1613] py-2.5 pl-9 pr-4 text-xs text-white placeholder-emerald-500/50 focus:border-cyan-400 focus:outline-none"
            />

            {compareSearchResults.length > 0 && (
              <div className="absolute right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-xl border border-cyan-700/60 bg-[#0c1613] shadow-2xl">
                {compareSearchResults.map((resItem) => (
                  <button
                    key={resItem.id}
                    type="button"
                    onClick={() => {
                      onToggleCompare(resItem.id);
                      setCompareSearch('');
                    }}
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs hover:bg-cyan-950/60 border-b border-emerald-900/40 last:border-none"
                  >
                    <div>
                      <p className="font-semibold text-white">{resItem.common_name}</p>
                      <p className="text-[11px] italic text-emerald-400">{resItem.scientific_name}</p>
                    </div>
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                      + Ekle
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-800/60 bg-[#0c1613]/60 p-12 text-center space-y-2">
            <p className="text-sm font-medium text-cyan-200">Karşılaştırma listeniz şu an boş.</p>
            <p className="text-xs text-emerald-400/70">
              Yukarıdaki arama kutusundan tür arayabilir veya ansiklopedi kartlarının sol üstündeki "Kıyasla" butonuna tıklayabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {compareList.map((item) => {
              const kingdom = getKingdomBadge(item.id);

              return (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-cyan-800/50 bg-[#0c1613] shadow-xl"
                >
                  <div className="relative h-48 w-full bg-emerald-950">
                    <img
                      src={wikiImages[item.id] || item.image_url || FALLBACK_IMAGE}
                      alt={item.common_name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onToggleCompare(item.id)}
                      className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Kaldır
                    </button>
                    <span className={`absolute left-3 bottom-3 rounded-md border px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${kingdom.style}`}>
                      {kingdom.label} • {item.category}
                    </span>
                  </div>

                  <div className="flex-1 divide-y divide-emerald-900/50 p-5 text-xs">
                    <div className="pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-white">{item.common_name}</h3>
                        <span className="rounded bg-emerald-950 border border-emerald-700/50 px-2 py-0.5 font-bold text-emerald-300">
                          {item.conservation_status}
                        </span>
                      </div>
                      <p className="italic text-emerald-400">{item.scientific_name}</p>
                    </div>

                    <div className="py-3">
                      <p className="font-semibold text-teal-300 mb-1 flex items-center gap-1.5">
                        <Utensils className="h-3.5 w-3.5" /> Beslenme / Enerji Tipi
                      </p>
                      <p className="text-emerald-100">{item.nutrition_type || 'Belirtilmemiş'}</p>
                    </div>

                    <div className="py-3">
                      <p className="font-semibold text-sky-300 mb-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Ortalama Ömür / Döngü
                      </p>
                      <p className="text-emerald-100">{item.lifespan || 'Belirtilmemiş'}</p>
                    </div>

                    <div className="py-3">
                      <p className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> Yaşam Alanı
                      </p>
                      <p className="text-emerald-100/90 leading-relaxed">{item.habitat}</p>
                    </div>

                    <div className="py-3">
                      <p className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <Leaf className="h-3.5 w-3.5" /> Ekolojik Sistemdeki Rolü
                      </p>
                      <p className="text-emerald-100/90 leading-relaxed">{item.ecological_role}</p>
                    </div>

                    {item.interactions && item.interactions.length > 0 && (
                      <div className="py-3">
                        <p className="font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                          <Network className="h-3.5 w-3.5" /> Ekosistem Etkileşimleri
                        </p>
                        <ul className="space-y-1 text-amber-100/90">
                          {item.interactions.map((inter, i) => {
                            const linked = findInteractionLinkedOrganism(allOrganisms, inter, item.id);
                            return (
                              <li key={i}>
                                {linked ? (
                                  <button
                                    type="button"
                                    onClick={() => onSelectOrganism(linked)}
                                    className="flex w-full items-center justify-between rounded bg-amber-950/50 px-2 py-1 text-left border border-amber-500/40 hover:bg-amber-500/20 transition-colors"
                                  >
                                    <span>{inter}</span>
                                    <ExternalLink className="h-3 w-3 text-amber-300 shrink-0" />
                                  </button>
                                ) : (
                                  <div className="rounded bg-amber-950/30 px-2 py-1 border border-amber-500/20">
                                    {inter}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5" /> Biyolojik Risk & Toksin
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${getDangerBadgeColor(item.danger_level)}`}>
                          {item.danger_level}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.diseases.map((d, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-rose-500/30 bg-rose-950/40 px-2 py-0.5 text-[11px] text-rose-200"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}