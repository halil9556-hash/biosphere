import { useState, useMemo, useEffect } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, Scale, Check, Bookmark,
  Utensils, MapPin, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { type Organism, IUCN_LABELS, FALLBACK_IMAGE } from '../types';
import { getDangerBadgeColor, getIucnBadgeColor } from '../organismHelpers';

const ITEMS_PER_PAGE = 12;

interface EncyclopediaViewProps {
  kingdom: 'animals' | 'plants' | 'fungi';
  organisms: Organism[];
  wikiImages: { [key: string]: string };
  compareIds: string[];
  favoriteIds: string[];
  onToggleCompare: (id: string, e?: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onSelectOrganism: (org: Organism) => void;
  onVisibleOrganismsChange: (visible: Organism[]) => void;
}

export function EncyclopediaView({
  kingdom,
  organisms,
  wikiImages,
  compareIds,
  favoriteIds,
  onToggleCompare,
  onToggleFavorite,
  onSelectOrganism,
  onVisibleOrganismsChange,
}: EncyclopediaViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [onlyHighRisk, setOnlyHighRisk] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedCategory('Tümü');
    setSelectedStatus('Tümü');
    setSearchQuery('');
    setOnlyHighRisk(false);
    setCurrentPage(1);
  }, [kingdom]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, onlyHighRisk]);

  const currentCategories = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(organisms.map((item) => item.category)))];
  }, [organisms]);

  const availableStatuses = useMemo(() => {
    const uniqueStatuses = new Set(organisms.map((item) => item.conservation_status));
    if (kingdom === 'fungi') return Array.from(uniqueStatuses);
    const orderedIucn = ['CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'];
    return orderedIucn.filter((code) => uniqueStatuses.has(code));
  }, [organisms, kingdom]);

  const filteredOrganisms = useMemo(() => {
    return organisms.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.common_name.toLowerCase().includes(q) ||
        item.scientific_name.toLowerCase().includes(q) ||
        item.diseases.some((d) => d.toLowerCase().includes(q)) ||
        (item.nutrition_type && item.nutrition_type.toLowerCase().includes(q)) ||
        (item.interactions && item.interactions.some((i) => i.toLowerCase().includes(q)));
      const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'Tümü' ||
        (selectedStatus === 'THREATENED'
          ? ['CR', 'EN', 'VU'].includes(item.conservation_status)
          : item.conservation_status === selectedStatus);
      const matchesRisk = !onlyHighRisk || item.danger_level.toLowerCase().includes('yüksek');
      return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
    });
  }, [organisms, searchQuery, selectedCategory, selectedStatus, onlyHighRisk]);

  const totalPages = Math.max(1, Math.ceil(filteredOrganisms.length / ITEMS_PER_PAGE));

  const paginatedOrganisms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrganisms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrganisms, currentPage]);

  useEffect(() => {
    onVisibleOrganismsChange(paginatedOrganisms);
  }, [paginatedOrganisms, onVisibleOrganismsChange]);

  const getActiveFilterColor = () => {
    if (kingdom === 'plants') return 'bg-lime-400 text-lime-950 font-semibold';
    if (kingdom === 'fungi') return 'bg-amber-500 text-amber-950 font-semibold';
    return 'bg-emerald-500 text-emerald-950 font-semibold';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('Tümü');
    setSelectedStatus('Tümü');
    setOnlyHighRisk(false);
    setSearchQuery('');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500/70" />
            <input
              type="text"
              placeholder={
                kingdom === 'plants'
                  ? 'Bitki adı, Latince isim, beslenme tipi veya toksin ara...'
                  : kingdom === 'fungi'
                  ? 'Mantar adı, Latince isim, beslenme veya toksin ara...'
                  : 'Hayvan adı, Latince isim, av-avcı veya hastalık ara...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/60 bg-emerald-950/40 py-2.5 pl-11 pr-4 text-sm text-white placeholder-emerald-500/50 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <ShieldCheck className="pointer-events-none absolute left-3 h-4 w-4 text-emerald-400" />
              <select
                aria-label="IUCN Koruma Statüsü Filtresi"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="cursor-pointer rounded-xl border border-emerald-800/70 bg-emerald-950/60 py-2.5 pl-9 pr-8 text-xs sm:text-sm font-medium text-emerald-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Tümü">
                  {kingdom === 'fungi' ? 'Özellik: Tümü' : 'IUCN Statüsü: Tümü'}
                </option>
                {kingdom !== 'fungi' && (
                  <option value="THREATENED">⚠️ Tehdit Altındakiler (CR + EN + VU)</option>
                )}
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {kingdom === 'fungi' ? status : IUCN_LABELS[status] || status}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3.5 py-2.5 text-xs sm:text-sm text-rose-200 select-none">
              <input
                type="checkbox"
                checked={onlyHighRisk}
                onChange={(e) => setOnlyHighRisk(e.target.checked)}
                className="h-4 w-4 rounded accent-rose-500"
              />
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Yüksek Risk
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {currentCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? getActiveFilterColor()
                    : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-400/70">
            {(selectedCategory !== 'Tümü' || selectedStatus !== 'Tümü' || onlyHighRisk || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-amber-300 underline hover:text-amber-200"
              >
                Filtreleri Sıfırla
              </button>
            )}
            <span>
              Toplam <strong className="text-emerald-300">{filteredOrganisms.length}</strong> tür listeleniyor
            </span>
          </div>
        </div>
      </div>

      {paginatedOrganisms.length === 0 ? (
        <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-12 text-center space-y-3">
          <p className="text-emerald-300">Seçili filtrelere uygun tür bulunamadı.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            Tüm Türleri Göster
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedOrganisms.map((item) => {
              const isCompared = compareIds.includes(item.id);
              const isFavorite = favoriteIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectOrganism(item)}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border bg-[#0c1613] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    kingdom === 'plants'
                      ? 'border-lime-900/50 hover:border-lime-400/60 hover:shadow-lime-950/40'
                      : kingdom === 'fungi'
                      ? 'border-amber-900/50 hover:border-amber-500/60 hover:shadow-amber-950/40'
                      : 'border-emerald-900/60 hover:border-emerald-500/60 hover:shadow-emerald-950/50'
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-emerald-950">
                    <img
                      src={wikiImages[item.id] || item.image_url || FALLBACK_IMAGE}
                      alt={item.common_name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => onToggleCompare(item.id, e)}
                        title={isCompared ? 'Karşılaştırmadan çıkar' : 'Karşılaştırma listesine ekle'}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold backdrop-blur-md transition-all ${
                          isCompared
                            ? 'bg-cyan-500 text-cyan-950 shadow-md'
                            : 'bg-black/65 text-emerald-200 border border-white/15 hover:bg-cyan-600 hover:text-white'
                        }`}
                      >
                        {isCompared ? <Check className="h-3 w-3" /> : <Scale className="h-3 w-3" />}
                        {isCompared ? 'Seçildi' : 'Kıyasla'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onToggleFavorite(item.id, e)}
                        title={isFavorite ? 'Saha defterinden çıkar' : 'Saha defterime kaydet'}
                        className={`flex items-center justify-center rounded-lg p-1.5 backdrop-blur-md transition-all ${
                          isFavorite
                            ? 'bg-amber-400 text-amber-950 shadow-md'
                            : 'bg-black/65 text-amber-200 border border-white/15 hover:bg-amber-500 hover:text-amber-950'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <span
                      className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold backdrop-blur-sm border ${
                        kingdom === 'fungi'
                          ? 'bg-black/75 text-amber-300 border-amber-500/30'
                          : getIucnBadgeColor(item.conservation_status)
                      }`}
                    >
                      {kingdom === 'fungi' ? item.conservation_status : `IUCN: ${item.conservation_status}`}
                    </span>
                    <span className="absolute left-3 bottom-3 rounded-md bg-emerald-950/90 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-700/50">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3
                      className={`text-lg font-bold text-white transition-colors ${
                        kingdom === 'plants'
                          ? 'group-hover:text-lime-400'
                          : kingdom === 'fungi'
                          ? 'group-hover:text-amber-400'
                          : 'group-hover:text-emerald-400'
                      }`}
                    >
                      {item.common_name}
                    </h3>
                    <p className="mb-3 text-xs italic text-emerald-400/80">{item.scientific_name}</p>

                    {item.nutrition_type && (
                      <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium text-teal-300/90">
                        <Utensils className="h-3 w-3 shrink-0 text-teal-400" />
                        <span className="truncate">{item.nutrition_type}</span>
                      </div>
                    )}

                    <div className="mb-4 flex items-start gap-1.5 text-xs text-emerald-200/70">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="line-clamp-1">{item.habitat}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-emerald-900/50">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getDangerBadgeColor(item.danger_level)}`}>
                        {item.danger_level}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <Eye className="h-3.5 w-3.5" /> İncele
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-emerald-900/50 pt-6 sm:flex-row">
              <p className="text-xs text-emerald-400/80">
                Sayfa <strong className="text-white">{currentPage}</strong> / {totalPages} (
                {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrganisms.length)} arası)
              </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-xs font-medium text-emerald-200 hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Önceki
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-9 w-9 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === page
                        ? getActiveFilterColor()
                        : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-xs font-medium text-emerald-200 hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sonraki <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}