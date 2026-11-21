import React, { useState, useMemo } from 'react';
import {
  Plus, Search, ArrowUpDown, MapPin, Award, Trash2,
  CheckCircle2, BookOpen, ThumbsUp, MessageSquare, Send, X, Upload
} from 'lucide-react';
import { type Organism, type Observation, FALLBACK_IMAGE } from '../types';
import { findMatchingOrganism, getAutocompleteMatches } from '../organismHelpers';

interface FeedViewProps {
  allOrganisms: Organism[];
  observations: Observation[];
  setObservations: React.Dispatch<React.SetStateAction<Observation[]>>;
  wikiImages: { [key: string]: string };
  onSelectOrganism: (org: Organism) => void;
}

export function FeedView({
  allOrganisms,
  observations,
  setObservations,
  wikiImages,
  onSelectOrganism,
}: FeedViewProps) {
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [feedStatusFilter, setFeedStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [feedSortBy, setFeedSortBy] = useState<'newest' | 'popular'>('newest');

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSpeciesGuess, setNewSpeciesGuess] = useState('');
  const [newSpeciesOrganismId, setNewSpeciesOrganismId] = useState<string | undefined>(undefined);
  const [newLocation, setNewLocation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [suggestionInputs, setSuggestionInputs] = useState<{ [key: string]: string }>({});
  const [suggestionOrganismIds, setSuggestionOrganismIds] = useState<{ [key: string]: string | undefined }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const filteredObservations = useMemo(() => {
    const q = feedSearchQuery.trim().toLowerCase();

    const filtered = observations.filter((obs) => {
      const maxVotes = obs.suggestions.reduce((max, s) => Math.max(max, s.votes), 0);
      const isVerified = maxVotes >= 5;

      if (feedStatusFilter === 'verified' && !isVerified) return false;
      if (feedStatusFilter === 'unverified' && isVerified) return false;

      if (!q) return true;

      return (
        obs.location.toLowerCase().includes(q) ||
        obs.note.toLowerCase().includes(q) ||
        obs.user.toLowerCase().includes(q) ||
        obs.suggestions.some((s) => s.species.toLowerCase().includes(q))
      );
    });

    if (feedSortBy === 'popular') {
      return [...filtered].sort((a, b) => {
        const maxA = a.suggestions.reduce((max, s) => Math.max(max, s.votes), 0);
        const maxB = b.suggestions.reduce((max, s) => Math.max(max, s.votes), 0);
        return maxB - maxA;
      });
    }

    return filtered;
  }, [observations, feedSearchQuery, feedStatusFilter, feedSortBy]);

  const modalAutocompleteMatches = useMemo(() => {
    if (newSpeciesOrganismId) return [];
    return getAutocompleteMatches(allOrganisms, newSpeciesGuess);
  }, [newSpeciesGuess, newSpeciesOrganismId, allOrganisms]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setNewImageUrl(compressedDataUrl);
        setIsProcessingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleVote = (obsId: string, sugId: string) => {
    setObservations((prev) =>
      prev.map((obs) => {
        if (obs.id !== obsId) return obs;
        return {
          ...obs,
          suggestions: obs.suggestions.map((s) => {
            if (s.id !== sugId) return s;
            return {
              ...s,
              votes: s.voted ? s.votes - 1 : s.votes + 1,
              voted: !s.voted,
            };
          }),
        };
      })
    );
  };

  const handleAddSuggestion = (obsId: string) => {
    const text = suggestionInputs[obsId]?.trim();
    if (!text) return;

    const matched = findMatchingOrganism(allOrganisms, text, suggestionOrganismIds[obsId]);

    setObservations((prev) =>
      prev.map((obs) => {
        if (obs.id !== obsId) return obs;
        return {
          ...obs,
          suggestions: [
            ...obs.suggestions,
            {
              id: `sug-${Date.now()}`,
              species: matched ? `${matched.scientific_name} (${matched.common_name})` : text,
              organismId: matched?.id,
              votes: 1,
              voted: true,
            },
          ],
        };
      })
    );
    setSuggestionInputs((prev) => ({ ...prev, [obsId]: '' }));
    setSuggestionOrganismIds((prev) => ({ ...prev, [obsId]: undefined }));
  };

  const handleAddComment = (obsId: string) => {
    const text = commentInputs[obsId]?.trim();
    if (!text) return;

    setObservations((prev) =>
      prev.map((obs) => {
        if (obs.id !== obsId) return obs;
        return {
          ...obs,
          comments: [
            ...(obs.comments || []),
            {
              id: `com-${Date.now()}`,
              user: 'senin_profilin',
              avatar: 'SP',
              text,
              timeAgo: 'Az önce',
            },
          ],
        };
      })
    );
    setCommentInputs((prev) => ({ ...prev, [obsId]: '' }));
  };

  const handleDeleteObservation = (obsId: string) => {
    setObservations((prev) => prev.filter((obs) => obs.id !== obsId));
  };

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation || !newNote) return;

    const matched = findMatchingOrganism(allOrganisms, newSpeciesGuess, newSpeciesOrganismId);

    const newObs: Observation = {
      id: `obs-${Date.now()}`,
      user: 'senin_profilin',
      avatar: 'SP',
      location: newLocation,
      timeAgo: 'Az önce',
      imageUrl: newImageUrl.trim(),
      linkedOrganismId: matched?.id || 'a-6',
      note: newNote,
      suggestions: newSpeciesGuess.trim()
        ? [
            {
              id: `sug-${Date.now()}`,
              species: matched ? `${matched.scientific_name} (${matched.common_name})` : newSpeciesGuess.trim(),
              organismId: matched?.id,
              votes: 1,
              voted: true,
            },
          ]
        : [],
      comments: [],
    };

    setObservations([newObs, ...observations]);
    setNewSpeciesGuess('');
    setNewSpeciesOrganismId(undefined);
    setNewLocation('');
    setNewImageUrl('');
    setNewNote('');
    setIsNewModalOpen(false);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-800/60 bg-emerald-950/30 p-4">
        <div>
          <h2 className="font-bold text-white">Doğada Bir Canlı, Bitki veya Mantar mı Gördün?</h2>
          <p className="text-xs text-emerald-300/80">Fotoğrafını paylaş, topluluk türünü belirlesin ve ansiklopediyle eşleştirsin.</p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Gözlem Ekle
        </button>
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-emerald-900/60 bg-[#0c1613] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500/70" />
            <input
              type="text"
              placeholder="Konum (örn: İstanbul, Niğde), not veya tür ara..."
              value={feedSearchQuery}
              onChange={(e) => setFeedSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/60 bg-[#070d0b] py-2 pl-9 pr-3 text-xs text-white placeholder-emerald-500/50 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-teal-400" />
            <select
              aria-label="Gözlem Sıralama"
              value={feedSortBy}
              onChange={(e) => setFeedSortBy(e.target.value as 'newest' | 'popular')}
              className="w-full sm:w-auto cursor-pointer rounded-xl border border-emerald-800/60 bg-[#070d0b] py-2 pl-8 pr-7 text-xs font-medium text-emerald-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="newest">En Yeniler</option>
              <option value="popular">En Çok Oy Alanlar</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFeedStatusFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                feedStatusFilter === 'all'
                  ? 'bg-teal-500 text-teal-950 font-semibold'
                  : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:border-teal-600'
              }`}
            >
              Tümü ({observations.length})
            </button>
            <button
              type="button"
              onClick={() => setFeedStatusFilter('verified')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                feedStatusFilter === 'verified'
                  ? 'bg-emerald-500 text-emerald-950 font-semibold'
                  : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-600'
              }`}
            >
              Topluluk Onaylı (5+ Oy)
            </button>
            <button
              type="button"
              onClick={() => setFeedStatusFilter('unverified')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                feedStatusFilter === 'unverified'
                  ? 'bg-amber-500 text-amber-950 font-semibold'
                  : 'border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 hover:border-amber-600'
              }`}
            >
              Doğrulama Bekleyenler
            </button>
          </div>

          <span className="text-[11px] text-emerald-400/70">
            <strong className="text-emerald-300">{filteredObservations.length}</strong> gözlem gösteriliyor
          </span>
        </div>
      </div>

      {filteredObservations.length === 0 ? (
        <div className="rounded-2xl border border-emerald-900/50 bg-[#0c1613] p-10 text-center space-y-3">
          <p className="text-sm text-emerald-300">Arama veya filtre kriterlerine uygun gözlem kaydı bulunamadı.</p>
          <button
            type="button"
            onClick={() => {
              setFeedSearchQuery('');
              setFeedStatusFilter('all');
            }}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredObservations.map((obs) => {
            const topSuggestion = [...obs.suggestions].sort((a, b) => b.votes - a.votes)[0];
            const currentInput = suggestionInputs[obs.id] || '';
            const currentSelectedId = suggestionOrganismIds[obs.id];
            const autocompleteMatches = currentSelectedId ? [] : getAutocompleteMatches(allOrganisms, currentInput);

            const resolvedObsImage =
              obs.imageUrl ||
              (obs.linkedOrganismId && wikiImages[obs.linkedOrganismId]) ||
              (topSuggestion?.organismId && wikiImages[topSuggestion.organismId]) ||
              FALLBACK_IMAGE;

            return (
              <article
                key={obs.id}
                className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#0c1613]"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700/40 text-xs font-bold text-emerald-200 border border-emerald-500/40">
                      {obs.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">@{obs.user}</p>
                      <p className="flex items-center gap-1 text-xs text-emerald-400/80">
                        <MapPin className="h-3 w-3" /> {obs.location} • {obs.timeAgo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {topSuggestion && topSuggestion.votes >= 5 && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-medium text-emerald-300">
                        <Award className="h-3.5 w-3.5" /> Topluluk Onaylı
                      </span>
                    )}

                    {obs.user === 'senin_profilin' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteObservation(obs.id)}
                        title="Gözlemi Sil"
                        className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-1.5 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="aspect-video w-full overflow-hidden bg-emerald-950">
                  <img
                    src={resolvedObsImage}
                    alt="Gözlem"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-sm text-emerald-100/90">{obs.note}</p>

                  <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/30 p-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Tür Tahminleri & Topluluk Doğrulaması
                    </h4>

                    {obs.suggestions.length === 0 ? (
                      <p className="text-xs text-emerald-500/70">Henüz tür tahmini yapılmadı. İlk tahmini sen yaz!</p>
                    ) : (
                      <div className="space-y-2">
                        {obs.suggestions.map((sug) => {
                          const linkedOrganism = findMatchingOrganism(allOrganisms, sug.species, sug.organismId);

                          return (
                            <div
                              key={sug.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-800/50 bg-[#070d0b] px-3 py-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {topSuggestion?.id === sug.id && sug.votes > 0 && (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                )}
                                <span className="text-xs font-medium text-emerald-100 truncate">
                                  {sug.species}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {linkedOrganism && (
                                  <button
                                    type="button"
                                    onClick={() => onSelectOrganism(linkedOrganism)}
                                    className="flex items-center gap-1 rounded-md border border-teal-500/40 bg-teal-950/50 px-2 py-1 text-[11px] font-medium text-teal-300 hover:bg-teal-600 hover:text-white transition-colors"
                                    title="Bu türün ansiklopedi künyesini incele"
                                  >
                                    <BookOpen className="h-3 w-3" /> Künyeyi Aç
                                  </button>
                                )}
                                <button
                                  onClick={() => handleVote(obs.id, sug.id)}
                                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                    sug.voted
                                      ? 'bg-emerald-500 text-emerald-950'
                                      : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-800'
                                  }`}
                                >
                                  <ThumbsUp className="h-3 w-3" /> {sug.votes}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tür ara veya yaz (örn: Sığla, Tilki, Köygöçüren)..."
                          value={currentInput}
                          onChange={(e) => {
                            setSuggestionInputs((prev) => ({ ...prev, [obs.id]: e.target.value }));
                            setSuggestionOrganismIds((prev) => ({ ...prev, [obs.id]: undefined }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSuggestion(obs.id);
                            }
                          }}
                          className="flex-1 rounded-lg border border-emerald-800/60 bg-[#070d0b] px-3 py-1.5 text-xs text-white placeholder-emerald-600 focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSuggestion(obs.id)}
                          className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                        >
                          Öner
                        </button>
                      </div>

                      {autocompleteMatches.length > 0 && (
                        <div className="mt-1.5 overflow-hidden rounded-xl border border-teal-700/60 bg-[#070d0b] shadow-xl">
                          <div className="bg-teal-950/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-300">
                            Ansiklopediden Eşleşen Türler
                          </div>
                          {autocompleteMatches.map((match) => (
                            <button
                              key={match.id}
                              type="button"
                              onClick={() => {
                                setSuggestionInputs((prev) => ({
                                  ...prev,
                                  [obs.id]: `${match.scientific_name} (${match.common_name})`,
                                }));
                                setSuggestionOrganismIds((prev) => ({
                                  ...prev,
                                  [obs.id]: match.id,
                                }));
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-emerald-950/60 border-b border-emerald-900/40 last:border-none"
                            >
                              <div>
                                <span className="font-semibold text-white">{match.common_name}</span>{' '}
                                <span className="italic text-emerald-400">({match.scientific_name})</span>
                              </div>
                              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                                {match.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-900/50 bg-[#070d0b]/70 p-4 space-y-3">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                      <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
                      Saha Notları & Tartışma ({obs.comments?.length || 0})
                    </h4>

                    {obs.comments && obs.comments.length > 0 && (
                      <div className="space-y-2">
                        {obs.comments.map((com) => (
                          <div
                            key={com.id}
                            className="rounded-lg border border-emerald-900/40 bg-[#0c1613] p-2.5 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-teal-300">@{com.user}</span>
                              <span className="text-[10px] text-emerald-500">{com.timeAgo}</span>
                            </div>
                            <p className="text-emerald-100/90 leading-relaxed">{com.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Gözlemle ilgili saha notu veya yorum yaz..."
                        value={commentInputs[obs.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [obs.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(obs.id);
                          }
                        }}
                        className="flex-1 rounded-lg border border-emerald-800/60 bg-[#0c1613] px-3 py-1.5 text-xs text-white placeholder-emerald-600 focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(obs.id)}
                        className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-600"
                      >
                        <Send className="h-3 w-3" /> Gönder
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-emerald-700/50 bg-[#0c1613] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Yeni Doğa Gözlemi Paylaş</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-emerald-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateObservation} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-emerald-300">Konum *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Küre Dağları, Bartın"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-emerald-300">
                  Senin Tür Tahminin (Ansiklopediden Otomatik Tamamlar)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ateş Semenderi veya boş bırak..."
                  value={newSpeciesGuess}
                  onChange={(e) => {
                    setNewSpeciesGuess(e.target.value);
                    setNewSpeciesOrganismId(undefined);
                  }}
                  className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />

                {modalAutocompleteMatches.length > 0 && (
                  <div className="mt-1.5 overflow-hidden rounded-xl border border-teal-700/60 bg-[#070d0b] shadow-xl">
                    {modalAutocompleteMatches.map((match) => (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => {
                          setNewSpeciesGuess(`${match.scientific_name} (${match.common_name})`);
                          setNewSpeciesOrganismId(match.id);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-emerald-950/60 border-b border-emerald-900/40 last:border-none"
                      >
                        <div>
                          <span className="font-semibold text-white">{match.common_name}</span>{' '}
                          <span className="italic text-emerald-400">({match.scientific_name})</span>
                        </div>
                        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                          {match.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-emerald-300">Fotoğraf Yükle (Cihazdan Seç)</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-800/80 bg-emerald-950/20 p-4 text-center hover:border-emerald-500 transition-colors">
                  <Upload className="mb-1.5 h-6 w-6 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-200">
                    {isProcessingImage ? 'Fotoğraf hazırlanıyor...' : 'Bilgisayardan veya telefondan fotoğraf seç'}
                  </span>
                  <span className="mt-0.5 text-[11px] text-emerald-500">JPG, PNG veya WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {newImageUrl && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-xl border border-emerald-700/50">
                    <img src={newImageUrl} alt="Önizleme" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-emerald-300">Gözlem Notu *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Canlıyı, bitkiyi veya mantarı nerede, ne yaparken gördün?"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingImage}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                Gözlemi Yayınla
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}