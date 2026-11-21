import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Leaf, Bookmark, Home, Compass, Trees, Sprout,
  HelpCircle, Scale, Users
} from 'lucide-react';
import { type Organism, type Observation, type TabId } from './types';
import { HomeView } from './components/HomeView';
import { EncyclopediaView } from './components/EncyclopediaView';
import { CompareView } from './components/CompareView';
import { FeedView } from './components/FeedView';
import { NotebookDrawer, OrganismDetailModal } from './components/ModalsAndDrawers';

const VALID_TABS: TabId[] = ['home', 'animals', 'plants', 'fungi', 'wizard', 'compare', 'feed'];
const MAX_COMPARE_ITEMS = 3;

type WizardViewProps = {
  allOrganisms: Organism[];
  animals: Organism[];
  plants: Organism[];
  fungi: Organism[];
  wikiImages: { [key: string]: string };
  favoriteIds: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onSelectOrganism: (organism: Organism) => void;
  onVisibleOrganismsChange: (organisms: Organism[]) => void;
};

function WizardView({
  allOrganisms,
  wikiImages,
  favoriteIds,
  onToggleFavorite,
  onSelectOrganism,
  onVisibleOrganismsChange,
}: WizardViewProps) {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];
    return allOrganisms.filter((organism) =>
      organism.scientific_name.toLocaleLowerCase().includes(term)
    );
  }, [allOrganisms, query]);

  useEffect(() => {
    onVisibleOrganismsChange(matches);
  }, [matches, onVisibleOrganismsChange]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-violet-900/60 bg-emerald-950/30 p-6">
        <h2 className="text-2xl font-bold text-white">Tür Teşhisi</h2>
        <p className="mt-2 text-sm text-emerald-200/70">Bilimsel tür adına göre ansiklopedide arayın.</p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Bilimsel tür adı..."
          aria-label="Bilimsel tür adına göre ara"
          className="mt-5 w-full rounded-xl border border-emerald-800 bg-[#070d0b] px-4 py-3 text-white outline-none focus:border-violet-500"
        />
        {query.trim() && (
          <div className="mt-4 space-y-3">
            {matches.length === 0 ? (
              <p className="text-sm text-emerald-200/70">Eşleşen tür bulunamadı.</p>
            ) : matches.map((organism) => (
              <div key={organism.id} className="flex items-center gap-3 rounded-xl border border-emerald-900/60 bg-black/20 p-3">
                {wikiImages[organism.id] && (
                  <img src={wikiImages[organism.id]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                )}
                <button type="button" onClick={() => onSelectOrganism(organism)} className="min-w-0 flex-1 text-left font-medium text-white hover:text-emerald-300">
                  {organism.scientific_name}
                </button>
                <button
                  type="button"
                  aria-label={favoriteIds.includes(organism.id) ? 'Defterimden çıkar' : 'Defterime ekle'}
                  onClick={(event) => onToggleFavorite(organism.id, event)}
                  className="rounded-lg px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10"
                >
                  {favoriteIds.includes(organism.id) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-1',
    user: 'eren_doga',
    avatar: 'ED',
    location: 'Belgrad Ormanı, İstanbul',
    timeAgo: '2 saat önce',
    imageUrl: '',
    linkedOrganismId: 'a-29',
    note: 'Yağmur sonrası yürüyüş yolunun kenarında yaprakların arasında rastladım. Dokunmadan sadece fotoğrafını çektim, türü tam olarak nedir?',
    suggestions: [
      { id: 's1', species: 'Salamandra salamandra (Ateş Semenderi)', organismId: 'a-29', votes: 14, voted: false },
      { id: 's2', species: 'Triturus karelinii (Pürtüklü Semender)', votes: 3, voted: false },
    ],
    comments: [
      {
        id: 'c-1',
        user: 'selin_biyo',
        avatar: 'SB',
        text: 'Deri bezlerinden salgıladığı samandarin toksini nedeniyle eldivensiz dokunmamanız çok doğru olmuş.',
        timeAgo: '1 saat önce',
      },
    ],
  },
  {
    id: 'obs-2',
    user: 'selin_biyo',
    avatar: 'SB',
    location: 'Aladağlar Milli Parkı, Niğde',
    timeAgo: '5 saat önce',
    imageUrl: '',
    linkedOrganismId: 'a-7',
    note: 'Yüksek sarp kayalıkların üzerinde süzülürken yakaladım. Kanat açıklığı muazzamdı!',
    suggestions: [
      { id: 's3', species: 'Gypaetus barbatus (Sakallı Akbaba)', organismId: 'a-7', votes: 21, voted: true },
      { id: 's4', species: 'Gyps fulvus (Kızıl Akbaba)', votes: 4, voted: false },
    ],
    comments: [],
  },
];

function getTabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '') as TabId;
  return VALID_TABS.includes(hash) ? hash : 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(getTabFromHash);
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [visibleOrganisms, setVisibleOrganisms] = useState<Organism[]>([]);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('biosphere_favorites');
      return saved ? JSON.parse(saved) : ['a-1', 'a-29'];
    } catch {
      return [];
    }
  });
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>(['a-1', 'p-34', 'f-1']);

  const [animals, setAnimals] = useState<Organism[]>([]);
  const [plants, setPlants] = useState<Organism[]>([]);
  const [fungi, setFungi] = useState<Organism[]>([]);

  const [wikiImages, setWikiImages] = useState<{ [key: string]: string }>(() => {
    try {
      const cached = localStorage.getItem('biosphere_wiki_images');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [observations, setObservations] = useState<Observation[]>(() => {
    try {
      const saved = localStorage.getItem('biosphere_observations');
      if (saved) {
        const parsed: Observation[] = JSON.parse(saved);
        return parsed.map((obs) => {
          if (obs.id === 'obs-1') return { ...obs, imageUrl: '', linkedOrganismId: 'a-29' };
          if (obs.id === 'obs-2') return { ...obs, imageUrl: '', linkedOrganismId: 'a-7' };
          return obs;
        });
      }
      return INITIAL_OBSERVATIONS;
    } catch {
      return INITIAL_OBSERVATIONS;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const nextTab = getTabFromHash();
      setActiveTab(nextTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState(null, '', `#${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    Promise.all([
      fetch('./data/animals.json').then((res) => res.json()),
      fetch('./data/plants.json').then((res) => res.json()),
      fetch('./data/fungi.json').then((res) => res.json()),
    ])
      .then(([animalsRes, plantsRes, fungiRes]) => {
        setAnimals(animalsRes);
        setPlants(plantsRes);
        setFungi(fungiRes);
      })
      .catch((err) => console.error('Veriler yüklenemedi:', err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('biosphere_favorites', JSON.stringify(favoriteIds));
    } catch {
      
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('biosphere_observations', JSON.stringify(observations));
    } catch (err) {
      console.error('Depolama sınırı aşıldı:', err);
    }
  }, [observations]);

  const allOrganisms = useMemo(() => [...animals, ...plants, ...fungi], [animals, plants, fungi]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
    );
  };

  const toggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const favoriteOrganisms = useMemo(() => {
    return favoriteIds
      .map((id) => allOrganisms.find((o) => o.id === id))
      .filter((item): item is Organism => Boolean(item));
  }, [favoriteIds, allOrganisms]);

  const homeShowcaseOrganisms = useMemo(() => {
    if (allOrganisms.length === 0) return [];
    const showcaseIds = ['a-1', 'a-7', 'a-29', 'p-1', 'f-1'];
    return allOrganisms.filter((o) => showcaseIds.includes(o.id));
  }, [allOrganisms]);

  const compareList = useMemo(() => {
    return compareIds
      .map((id) => allOrganisms.find((item) => item.id === id))
      .filter((item): item is Organism => Boolean(item));
  }, [compareIds, allOrganisms]);

  const feedLinkedOrganisms = useMemo(() => {
    if (allOrganisms.length === 0) return [];
    const ids = new Set<string>(['a-6']);
    observations.forEach((obs) => {
      if (obs.linkedOrganismId) ids.add(obs.linkedOrganismId);
      obs.suggestions.forEach((s) => {
        if (s.organismId) ids.add(s.organismId);
      });
    });
    return allOrganisms.filter((o) => ids.has(o.id));
  }, [allOrganisms, observations]);

  const handleVisibleChange = useCallback((visible: Organism[]) => {
    setVisibleOrganisms(visible);
  }, []);

  useEffect(() => {
    const baseTargets =
      activeTab === 'home'
        ? homeShowcaseOrganisms
        : activeTab === 'compare'
        ? compareList
        : activeTab === 'feed'
        ? feedLinkedOrganisms
        : visibleOrganisms;

    const extraTargets: Organism[] = [];
    if (selectedOrganism) extraTargets.push(selectedOrganism);
    if (isNotebookOpen) extraTargets.push(...favoriteOrganisms);

    const targets = [...baseTargets, ...extraTargets];
    if (targets.length === 0) return;

    let isCancelled = false;

    const fetchImages = async () => {
      for (const item of targets) {
        if (isCancelled) break;
        if (wikiImages[item.id]) continue;

        try {
          const query = encodeURIComponent(item.scientific_name);
          const res = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=600&redirects=1&origin=*`
          );
          const data = await res.json();
          const pages = data.query?.pages;
          if (pages && !isCancelled) {
            const pageId = Object.keys(pages)[0];
            const thumb = pages[pageId]?.thumbnail?.source;
            if (thumb) {
              setWikiImages((prev) => {
                const updated = { ...prev, [item.id]: thumb };
                try {
                  localStorage.setItem('biosphere_wiki_images', JSON.stringify(updated));
                } catch {
                  
                }
                return updated;
              });
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 40));
        } catch {
          
        }
      }
    };

    fetchImages();
    return () => {
      isCancelled = true;
    };
  }, [
    activeTab,
    homeShowcaseOrganisms,
    visibleOrganisms,
    compareList,
    feedLinkedOrganisms,
    selectedOrganism,
    isNotebookOpen,
    favoriteOrganisms,
    wikiImages,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#070d0b] text-emerald-50">
      <header className="sticky top-0 z-30 border-b border-emerald-900/50 bg-[#070d0b]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 transition-transform group-hover:scale-105">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  BioSphere
                </h1>
                <p className="text-xs text-emerald-400/80">
                  Ekolojik Ansiklopedi ({allOrganisms.length} Tür) & Doğa Gözlem Ağı
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsNotebookOpen(true)}
              className="flex xl:hidden items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500 hover:text-amber-950 transition-colors"
            >
              <Bookmark className="h-4 w-4 fill-current" />
              <span>Defterim ({favoriteIds.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex w-full overflow-x-auto gap-1 rounded-xl bg-emerald-950/60 p-1 border border-emerald-900/60 xl:w-auto xl:flex-wrap">
              <button
                onClick={() => handleTabChange('home')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'home'
                    ? 'bg-emerald-500 text-emerald-950 font-semibold shadow-lg shadow-emerald-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                Ana Sayfa
              </button>
              <button
                onClick={() => handleTabChange('animals')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'animals'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                Hayvanlar ({animals.length})
              </button>
              <button
                onClick={() => handleTabChange('plants')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'plants'
                    ? 'bg-lime-600 text-white shadow-lg shadow-lime-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Trees className="h-3.5 w-3.5" />
                Bitkiler ({plants.length})
              </button>
              <button
                onClick={() => handleTabChange('fungi')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'fungi'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Sprout className="h-3.5 w-3.5" />
                Mantarlar ({fungi.length})
              </button>
              <button
                onClick={() => handleTabChange('wizard')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'wizard'
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-950'
                    : 'text-violet-300/80 hover:text-white'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Tür Teşhisi
              </button>
              <button
                onClick={() => handleTabChange('compare')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'compare'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Scale className="h-3.5 w-3.5" />
                Karşılaştır ({compareIds.length}/3)
              </button>
              <button
                onClick={() => handleTabChange('feed')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  activeTab === 'feed'
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-950'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Gözlem Akışı ({observations.length})
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setIsNotebookOpen(true)}
              className="hidden xl:flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500 hover:text-amber-950 transition-all"
              title="Kaydettiğin türleri görüntüle"
            >
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              <span>Defterim ({favoriteIds.length})</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            allOrganisms={allOrganisms}
            animalsCount={animals.length}
            plantsCount={plants.length}
            fungiCount={fungi.length}
            observationsCount={observations.length}
            wikiImages={wikiImages}
            onTabChange={handleTabChange}
            onSelectOrganism={setSelectedOrganism}
          />
        )}

        {(activeTab === 'animals' || activeTab === 'plants' || activeTab === 'fungi') && (
          <EncyclopediaView
            kingdom={activeTab}
            organisms={activeTab === 'plants' ? plants : activeTab === 'fungi' ? fungi : animals}
            wikiImages={wikiImages}
            compareIds={compareIds}
            favoriteIds={favoriteIds}
            onToggleCompare={toggleCompare}
            onToggleFavorite={toggleFavorite}
            onSelectOrganism={setSelectedOrganism}
            onVisibleOrganismsChange={handleVisibleChange}
          />
        )}

        {activeTab === 'wizard' && (
          <WizardView
            allOrganisms={allOrganisms}
            animals={animals}
            plants={plants}
            fungi={fungi}
            wikiImages={wikiImages}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onSelectOrganism={setSelectedOrganism}
            onVisibleOrganismsChange={handleVisibleChange}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            allOrganisms={allOrganisms}
            animalsCount={animals.length}
            plantsCount={plants.length}
            fungiCount={fungi.length}
            compareIds={compareIds}
            wikiImages={wikiImages}
            onToggleCompare={toggleCompare}
            onSelectOrganism={setSelectedOrganism}
          />
        )}

        {activeTab === 'feed' && (
          <FeedView
            allOrganisms={allOrganisms}
            observations={observations}
            setObservations={setObservations}
            wikiImages={wikiImages}
            onSelectOrganism={setSelectedOrganism}
          />
        )}
      </div>

      <footer className="mt-12 border-t border-emerald-900/40 bg-[#050908] py-6 text-center text-xs text-emerald-500/70">
        <div className="mx-auto max-w-7xl px-4 space-y-1">
          <p className="font-medium text-emerald-400/90">BioSphere — Açık Kaynak Ekolojik Ansiklopedi ve Vatandaş Bilimi Platformu</p>
          <p>Görseller Wikimedia Commons (CC BY-SA / Public Domain) arşivinden dinamik olarak sağlanmaktadır.</p>
        </div>
      </footer>

      <NotebookDrawer
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        favoriteOrganisms={favoriteOrganisms}
        compareIds={compareIds}
        wikiImages={wikiImages}
        onToggleCompare={toggleCompare}
        onToggleFavorite={toggleFavorite}
        onSelectOrganism={setSelectedOrganism}
      />

      <OrganismDetailModal
        organism={selectedOrganism}
        allOrganisms={allOrganisms}
        wikiImages={wikiImages}
        favoriteIds={favoriteIds}
        compareIds={compareIds}
        onClose={() => setSelectedOrganism(null)}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
        onSelectOrganism={setSelectedOrganism}
      />
    </div>
  );
}