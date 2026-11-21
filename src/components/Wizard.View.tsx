import React, { useState, useMemo, useEffect } from 'react';
import {
  HelpCircle, RotateCcw, ArrowRight, MapPin, ChevronLeft,
  ChevronRight, Bookmark
} from 'lucide-react';
import { type Organism, FALLBACK_IMAGE } from '../types';
import { getDangerBadgeColor, getKingdomBadge } from '../organismHelpers';

const WIZARD_HABITATS = [
  { id: 'all', label: 'Tüm Ortamlar', keywords: [] },
  { id: 'forest', label: 'Orman & Ağaçlık Alan', keywords: ['orman', 'ağaç', 'çalılık', 'yaprak', 'gövde', 'kozalak'] },
  { id: 'water', label: 'Deniz, Göl & Akarsu', keywords: ['deniz', 'okyanus', 'göl', 'akarsu', 'nehir', 'sulak', 'kıyı', 'bataklık', 'dere'] },
  { id: 'mountain', label: 'Dağlık, Kayalık & Bozkır', keywords: ['dağ', 'kaya', 'kayalık', 'bozkır', 'step', 'çayır', 'uçurum', 'yayla', 'kurak'] },
  { id: 'urban', label: 'Tarım, Bahçe & Yerleşim Yakını', keywords: ['tarım', 'bahçe', 'yerleşim', 'şehir', 'park', 'yol', 'ev', 'açık alan'] },
];

interface WizardViewProps {
  allOrganisms: Organism[];
  animals: Organism[];
  plants: Organism[];
  fungi: Organism[];
  wikiImages: { [key: string]: string };
  favoriteIds: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onSelectOrganism: (org: Organism) => void;
  onVisibleOrganismsChange: (visible: Organism[]) => void;
}

export function WizardView({
  allOrganisms,
  animals,
  plants,
  fungi,
  wikiImages,
  favoriteIds,
  onToggleFavorite,
  onSelectOrganism,
  onVisibleOrganismsChange,
}: WizardViewProps) {
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizardKingdom, setWizardKingdom] = useState<'all' | 'animals' | 'plants' | 'fungi'>('all');
  const [wizardSubCategory, setWizardSubCategory] = useState<string>('Tümü');
  const [wizardHabitat, setWizardHabitat] = useState<string>('all');
  const [wizardRiskFilter, setWizardRiskFilter] = useState<'all' | 'high' | 'low'>('all');
  const [wizardTraitQuery, setWizardTraitQuery] = useState<string>('');

  const wizardSubCategories = useMemo(() => {
    const source =
      wizardKingdom === 'animals'
        ? animals
        : wizardKingdom === 'plants'
        ? plants
        : wizardKingdom === 'fungi'
        ? fungi
        : allOrganisms;
    return ['Tümü', ...Array.from(new Set(source.map((o) => o.category)))];
  }, [wizardKingdom, animals, plants, fungi, allOrganisms]);

  const wizardMatches = useMemo(() => {
    const source =
      wizardKingdom === 'animals'
        ? animals
        : wizardKingdom === 'plants'
        ? plants
        : wizardKingdom === 'fungi'
        ? fungi
        : allOrganisms;

    const selectedHabitatObj = WIZARD_HABITATS.find((h) => h.id === wizardHabitat);
    const traitQ = wizardTraitQuery.trim().toLocaleLowerCase('tr-TR');

    return source.filter((item) => {
      if (wizardSubCategory !== 'Tümü' && item.category !== wizardSubCategory) return false;

      if (selectedHabitatObj && selectedHabitatObj.keywords.length > 0) {
        const habLower = item.habitat.toLocaleLowerCase('tr-TR');
        const hasKeyword = selectedHabitatObj.keywords.some((kw) => habLower.includes(kw));
        if (!hasKeyword) return false;
      }

      if (wizardRiskFilter === 'high' && !item.danger_level.toLowerCase().includes('yüksek')) return false;
      if (wizardRiskFilter === 'low' && !item.danger_level.toLowerCase().includes('düşük')) return false;

      if (traitQ) {
        const blob = `${item.common_name} ${item.scientific_name} ${item.ecological_role} ${item.nutrition_type || ''} ${item.diseases.join(' ')}`.toLocaleLowerCase('tr-TR');
        if (!blob.includes(traitQ)) return false;
      }

      return true;
    });
  }, [wizardKingdom, wizardSubCategory, wizardHabitat, wizardRiskFilter, wizardTraitQuery, animals, plants, fungi, allOrganisms]);

  useEffect(() => {
    onVisibleOrganismsChange(wizardMatches.slice(0, 12));
  }, [wizardMatches, onVisibleOrganismsChange]);

  const resetWizard = () => {
    setWizardStep(1);
    setWizardKingdom('all');
    setWizardSubCategory('Tümü');
    setWizardHabitat('all');
    setWizardRiskFilter('all');
    setWizardTraitQuery('');
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-violet-700/50 bg-gradient-to-r from-[#0c1613] via-violet-950/20 to-[#0c1613] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-0.5 text-xs font-semibold text-violet-300 border border-violet-500/30">
            <HelpCircle className="h-3.5 w-3.5" /> İnteraktif Saha Teşhis Rehberi
          </div>
          <h2 className="text-2xl font-bold text-white">Doğada Ne Gördüm? — Adım Adım Tür Bulucu</h2>
          <p className="text-xs sm:text-sm text-emerald-200/80">
            Adını bilmediğin canlının temel özelliklerini seç, {allOrganisms.length} tür arasından en olası eşleşmeleri daraltalım.
          </p>
        </div>

        <button
          type="button"
          onClick={resetWizard}
          className="flex items-center gap-2 self-start sm:self-center rounded-xl border border-violet-500/40 bg-violet-950/40 px-4 py-2.5 text-xs font-semibold text-violet-200 hover:bg-violet-600 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Seçimleri Sıfırla
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {[
          { step: 1, title: '1. Canlı Grubu & Sınıf', desc: 'Hayvan, bitki veya mantar seçimi' },
          { step: 2, title: '2. Görüldüğü Habitat', desc: 'Orman, su, dağ veya yerleşim' },
          { step: 3, title: '3. Risk & Ayırt Edici Özellik', desc: 'Toksin durumu ve anahtar ipucu' },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setWizardStep(s.step as 1 | 2 | 3)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              wizardStep === s.step
                ? 'border-violet-400 bg-violet-950/40 shadow-lg shadow-violet-950/50'
                : 'border-emerald-900/60 bg-[#0c1613] hover:border-violet-700/60'
            }`}
          >
            <p className={`text-xs sm:text-sm font-bold ${wizardStep === s.step ? 'text-violet-300' : 'text-white'}`}>
              {s.title}
            </p>
            <p className="mt-0.5 hidden sm:block text-[11px] text-emerald-400/75">{s.desc}</p>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-emerald-900/60 bg-[#0c1613] p-6 space-y-6">
        {wizardStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Adım 1: Karşılaştığın canlı hangi biyolojik aleme ait?</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {[
                { id: 'all', label: 'Emin Değilim (Tümü)', count: allOrganisms.length },
                { id: 'animals', label: 'Hayvanlar Alemi', count: animals.length },
                { id: 'plants', label: 'Bitkiler Alemi', count: plants.length },
                { id: 'fungi', label: 'Mantarlar Alemi', count: fungi.length },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setWizardKingdom(opt.id as 'all' | 'animals' | 'plants' | 'fungi');
                    setWizardSubCategory('Tümü');
                  }}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    wizardKingdom === opt.id
                      ? 'border-violet-400 bg-violet-500/20 text-white'
                      : 'border-emerald-800/60 bg-[#070d0b] text-emerald-300 hover:border-violet-500/50'
                  }`}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="mt-1 text-xs text-emerald-400/80">{opt.count} kayıtlı tür</p>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-emerald-300">Alt Sınıf / Kategori Daraltması (İsteğe Bağlı):</p>
              <div className="flex flex-wrap gap-2">
                {wizardSubCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWizardSubCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      wizardSubCategory === cat
                        ? 'bg-violet-500 text-white font-semibold'
                        : 'border border-emerald-800/60 bg-[#070d0b] text-emerald-300 hover:border-violet-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-violet-500"
              >
                Sonraki Adım: Ortam Seçimi <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {wizardStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Adım 2: Bu canlıyı nasıl bir ortamda gördün?</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WIZARD_HABITATS.map((hab) => (
                <button
                  key={hab.id}
                  type="button"
                  onClick={() => setWizardHabitat(hab.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    wizardHabitat === hab.id
                      ? 'border-violet-400 bg-violet-500/20 text-white'
                      : 'border-emerald-800/60 bg-[#070d0b] text-emerald-300 hover:border-violet-500/50'
                  }`}
                >
                  <MapPin className="h-5 w-5 shrink-0 text-violet-400" />
                  <span className="text-sm font-semibold">{hab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-800 px-4 py-2 text-xs font-medium text-emerald-300 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" /> Önceki Adım
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-violet-500"
              >
                Sonraki Adım: Özellik & Risk <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {wizardStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Adım 3: Tehlike / Toksin Durumu ve Belirgin İpucu</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'all', label: 'Tüm Risk Seviyeleri' },
                { id: 'high', label: '⚠️ Yüksek Riskli / Zehirli Olabilir' },
                { id: 'low', label: '✅ Düşük Riskli / Zararsız Görünüyor' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setWizardRiskFilter(r.id as 'all' | 'high' | 'low')}
                  className={`rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-semibold transition-all ${
                    wizardRiskFilter === r.id
                      ? 'border-violet-400 bg-violet-500/20 text-white'
                      : 'border-emerald-800/60 bg-[#070d0b] text-emerald-300 hover:border-violet-500/50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-emerald-300">
                Gördüğün bir özellik yaz (Örn: "gece", "etçil", "zehirli", "kanat", "şapka")
              </label>
              <input
                type="text"
                placeholder="Anahtar kelime gir..."
                value={wizardTraitQuery}
                onChange={(e) => setWizardTraitQuery(e.target.value)}
                className="w-full max-w-md rounded-xl border border-violet-700/60 bg-[#070d0b] px-4 py-2.5 text-sm text-white placeholder-emerald-500/50 focus:border-violet-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-800 px-4 py-2 text-xs font-medium text-emerald-300 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" /> Önceki Adım
              </button>
              <span className="text-xs font-semibold text-violet-300">
                Aşağıda {wizardMatches.length} olası tür eşleşti
              </span>
            </div>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Olası Tür Eşleşmeleri ({wizardMatches.length})
          </h3>
          {wizardMatches.length > 12 && (
            <span className="text-xs text-emerald-400/80">
              İlk 12 sonuç gösteriliyor — daha kesin sonuç için filtreleri daralt
            </span>
          )}
        </div>

        {wizardMatches.length === 0 ? (
          <div className="rounded-2xl border border-emerald-900/60 bg-[#0c1613] p-10 text-center space-y-3">
            <p className="text-sm text-emerald-200">Bu kriterlerin tamamına uyan kayıtlı tür bulunamadı.</p>
            <button
              type="button"
              onClick={resetWizard}
              className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wizardMatches.slice(0, 12).map((item) => {
              const kingdom = getKingdomBadge(item.id);
              const isFavorite = favoriteIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectOrganism(item)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-violet-900/50 bg-[#0c1613] transition-all hover:-translate-y-1 hover:border-violet-400"
                >
                  <div className="relative h-44 w-full bg-emerald-950">
                    <img
                      src={wikiImages[item.id] || item.image_url || FALLBACK_IMAGE}
                      alt={item.common_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      className={`absolute right-3 top-3 rounded-lg p-1.5 backdrop-blur-md transition-all ${
                        isFavorite
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-black/65 text-amber-200 hover:bg-amber-500 hover:text-amber-950'
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <span className={`absolute left-3 bottom-3 rounded-md border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md ${kingdom.style}`}>
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-white group-hover:text-violet-300 transition-colors">
                      {item.common_name}
                    </h4>
                    <p className="text-xs italic text-emerald-400/80 mb-2">{item.scientific_name}</p>
                    <p className="line-clamp-1 text-[11px] text-emerald-200/70 mb-3">{item.habitat}</p>
                    <div className="flex items-center justify-between border-t border-emerald-900/50 pt-2.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] ${getDangerBadgeColor(item.danger_level)}`}>
                        {item.danger_level}
                      </span>
                      <span className="text-xs font-semibold text-violet-300">Künyeyi Aç →</span>
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