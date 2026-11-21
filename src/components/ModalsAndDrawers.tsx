import React from 'react';
import {
  Bookmark, X, Scale, Trash2, Utensils, Clock,
  MapPin, Leaf, Network, ExternalLink, ShieldAlert
} from 'lucide-react';
import { type Organism, IUCN_LABELS, FALLBACK_IMAGE } from '../types';
import {
  getDangerBadgeColor,
  getKingdomBadge,
  findInteractionLinkedOrganism
} from '../organismHelpers';

interface NotebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteOrganisms: Organism[];
  compareIds: string[];
  wikiImages: { [key: string]: string };
  onToggleCompare: (id: string, e?: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onSelectOrganism: (org: Organism) => void;
}

export function NotebookDrawer({
  isOpen,
  onClose,
  favoriteOrganisms,
  compareIds,
  wikiImages,
  onToggleCompare,
  onToggleFavorite,
  onSelectOrganism,
}: NotebookDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-emerald-800/70 bg-[#0c1613] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-emerald-900/60 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Bookmark className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kişisel Saha Defterim</h3>
              <p className="text-xs text-emerald-400/80">
                Kaydedilen {favoriteOrganisms.length} tür • Yerel olarak saklanır
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-950 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {favoriteOrganisms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-800/60 p-10 text-center space-y-2">
              <Bookmark className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-200">Saha defterin henüz boş.</p>
              <p className="text-xs text-emerald-400/70">
                Ansiklopedideki tür kartlarının veya künye pencerelerinin üzerindeki yer imi ikonuna tıklayarak türleri buraya kaydedebilirsin.
              </p>
            </div>
          ) : (
            favoriteOrganisms.map((fav) => {
              const kingdom = getKingdomBadge(fav.id);
              const isCompared = compareIds.includes(fav.id);

              return (
                <div
                  key={fav.id}
                  onClick={() => {
                    onClose();
                    onSelectOrganism(fav);
                  }}
                  className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-emerald-900/60 bg-[#070d0b] p-3 hover:border-amber-500/50 transition-all"
                >
                  <img
                    src={wikiImages[fav.id] || fav.image_url || FALLBACK_IMAGE}
                    alt={fav.common_name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover bg-emerald-950"
                  />
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-semibold mb-1 ${kingdom.style}`}>
                      {fav.category}
                    </span>
                    <h4 className="truncate text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {fav.common_name}
                    </h4>
                    <p className="truncate text-[11px] italic text-emerald-400/80">
                      {fav.scientific_name}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => onToggleCompare(fav.id, e)}
                      title={isCompared ? 'Karşılaştırmada' : 'Kıyaslamaya ekle'}
                      className={`rounded-lg p-1.5 text-xs transition-colors ${
                        isCompared
                          ? 'bg-cyan-500 text-cyan-950'
                          : 'border border-cyan-700/50 text-cyan-300 hover:bg-cyan-600 hover:text-white'
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onToggleFavorite(fav.id, e)}
                      title="Defterden çıkar"
                      className="rounded-lg border border-rose-500/30 p-1.5 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}

interface OrganismModalProps {
  organism: Organism | null;
  allOrganisms: Organism[];
  wikiImages: { [key: string]: string };
  favoriteIds: string[];
  compareIds: string[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectOrganism: (org: Organism) => void;
}

export function OrganismDetailModal({
  organism,
  allOrganisms,
  wikiImages,
  favoriteIds,
  compareIds,
  onClose,
  onToggleFavorite,
  onToggleCompare,
  onSelectOrganism,
}: OrganismModalProps) {
  if (!organism) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-700/50 bg-[#0c1613] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-64 w-full overflow-hidden bg-emerald-950">
          <img
            src={wikiImages[organism.id] || organism.image_url || FALLBACK_IMAGE}
            alt={organism.common_name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                  {organism.category}
                </span>
                <span className="rounded-md bg-emerald-950 border border-emerald-700/50 px-2.5 py-0.5 text-xs text-emerald-300">
                  {organism.id.startsWith('f-')
                    ? `Özellik: ${organism.conservation_status}`
                    : `IUCN: ${IUCN_LABELS[organism.conservation_status] || organism.conservation_status}`}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{organism.common_name}</h2>
              <p className="text-sm italic text-emerald-400">{organism.scientific_name}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(organism.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  favoriteIds.includes(organism.id)
                    ? 'bg-amber-400 text-amber-950'
                    : 'border border-amber-500/50 bg-amber-950/30 text-amber-200 hover:bg-amber-500 hover:text-amber-950'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${favoriteIds.includes(organism.id) ? 'fill-current' : ''}`} />
                {favoriteIds.includes(organism.id) ? 'Defterde Kayıtlı' : 'Deftere Kaydet'}
              </button>

              <button
                type="button"
                onClick={() => onToggleCompare(organism.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  compareIds.includes(organism.id)
                    ? 'bg-cyan-500 text-cyan-950'
                    : 'border border-cyan-600/60 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-600 hover:text-white'
                }`}
              >
                <Scale className="h-4 w-4" />
                {compareIds.includes(organism.id) ? 'Kıyaslama Listesinde' : 'Kıyaslamaya Ekle'}
              </button>
            </div>
          </div>

          {(organism.nutrition_type || organism.lifespan) && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {organism.nutrition_type && (
                <div className="flex items-start gap-2.5 rounded-xl border border-teal-500/30 bg-teal-950/30 p-3.5 text-sm">
                  <Utensils className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                  <div>
                    <p className="text-xs font-semibold text-teal-300">Beslenme / Enerji Tipi</p>
                    <p className="text-emerald-100">{organism.nutrition_type}</p>
                  </div>
                </div>
              )}

              {organism.lifespan && (
                <div className="flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-sky-950/30 p-3.5 text-sm">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                  <div>
                    <p className="text-xs font-semibold text-sky-300">Ortalama Ömür / Döngü</p>
                    <p className="text-emerald-100">{organism.lifespan}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-3.5 text-sm text-emerald-100">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-semibold text-emerald-300">Yaşam Alanı: </span>
              {organism.habitat}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Leaf className="h-4 w-4 text-emerald-400" />
              Ekolojik Sistemdeki Yeri
            </div>
            <p className="text-sm leading-relaxed text-emerald-100/90">
              {organism.ecological_role}
            </p>
          </div>

          {organism.interactions && organism.interactions.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Network className="h-4 w-4 text-amber-400" />
                  Besin Zinciri & Ekosistem Etkileşimleri
                </div>
                <span className="text-[11px] text-amber-300/70">
                  Bağlantılı türlere tıklayarak geçiş yapabilirsin
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {organism.interactions.map((interaction, idx) => {
                  const linkedOrganism = findInteractionLinkedOrganism(allOrganisms, interaction, organism.id);

                  if (linkedOrganism) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectOrganism(linkedOrganism)}
                        title={`${linkedOrganism.common_name} künyesine git`}
                        className="group flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-400 hover:text-amber-950 transition-all shadow-sm"
                      >
                        <span>{interaction}</span>
                        <ExternalLink className="h-3 w-3 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  }

                  return (
                    <span
                      key={idx}
                      className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-100/90"
                    >
                      {interaction}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                {organism.id.startsWith('p-')
                  ? 'Toksik / Tıbbi Etkiler & Biyolojik Riskler'
                  : 'Neden Olduğu Hastalıklar, Toksinler & Riskler'}
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getDangerBadgeColor(organism.danger_level)}`}>
                {organism.danger_level}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {organism.diseases.map((disease, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-rose-500/30 bg-rose-950/50 px-3 py-1 text-xs font-medium text-rose-200"
                >
                  {disease}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}