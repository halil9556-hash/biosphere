import {
  Sparkles, ChevronDown, HelpCircle, Eye, CheckCircle2,
  ArrowRight, Scale, Users, Compass, Trees, Sprout
} from 'lucide-react';
import { type Organism, type TabId, FALLBACK_IMAGE } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface HomeViewProps {
  allOrganisms: Organism[];
  animalsCount: number;
  plantsCount: number;
  fungiCount: number;
  observationsCount: number;
  wikiImages: { [key: string]: string };
  onTabChange: (tab: TabId) => void;
  onSelectOrganism: (org: Organism) => void;
}

export function HomeView({
  allOrganisms,
  animalsCount,
  plantsCount,
  fungiCount,
  observationsCount,
  wikiImages,
  onTabChange,
  onSelectOrganism,
}: HomeViewProps) {
  const showcaseSpecies1 = allOrganisms.find((o) => o.id === 'a-1');
  const showcaseSpecies2 = allOrganisms.find((o) => o.id === 'a-7');
  const showcaseSpecies3 = allOrganisms.find((o) => o.id === 'a-29');

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-[86vh] flex-col items-center justify-center px-4 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>{allOrganisms.length} Canlı Türü • 3 Biyolojik Alem • Vatandaş Bilimi Ağı</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            BioSphere’e <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">Hoş Geldin</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-emerald-200/80 leading-relaxed">
            Doğanın gizli ekolojik ağlarını, nesli tehlike altındaki türleri ve yaban hayatının biyolojik sırlarını keşfetmeye hazır mısın?
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#kesif-akisi"
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-950/60 hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Burada Neler Var? Keşfet
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
            <button
              type="button"
              onClick={() => onTabChange('wizard')}
              className="flex items-center gap-2 rounded-2xl border border-violet-500/50 bg-violet-950/40 px-6 py-3.5 text-sm font-semibold text-violet-200 hover:bg-violet-600 hover:text-white transition-all"
            >
              <HelpCircle className="h-4 w-4" />
              Doğada Ne Gördüm? (Tür Bul)
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-xs text-emerald-400/70">
          <span>Keşfetmek için aşağı kaydır</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-emerald-500/40 p-1">
            <div className="h-2 w-1 rounded-full bg-emerald-400 animate-bounce" />
          </div>
        </div>
      </section>

      <section id="kesif-akisi" className="mx-auto max-w-6xl px-4 py-20 space-y-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div
              onClick={() => showcaseSpecies1 && onSelectOrganism(showcaseSpecies1)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-emerald-800/70 bg-[#0c1613] shadow-2xl shadow-emerald-950/60"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={(showcaseSpecies1 && wikiImages[showcaseSpecies1.id]) || FALLBACK_IMAGE}
                  alt={showcaseSpecies1?.common_name || 'Yaban Hayatı'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d0b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    Canlı Örnek • Tıkla ve İncele
                  </span>
                  <h4 className="mt-1 text-lg font-bold text-white">
                    {showcaseSpecies1?.common_name || 'Anadolu Yaban Hayatı'}
                  </h4>
                  <p className="text-xs italic text-emerald-300/80">
                    {showcaseSpecies1?.scientific_name}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500 p-2.5 text-emerald-950 shadow-lg transition-transform group-hover:translate-x-1">
                  <Eye className="h-4 w-4" />
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                01 • Kapsamlı Ekolojik Ansiklopedi
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-snug">
                Yüzlerce Türün Biyolojik Künyesini ve Koruma Statüsünü İncele
              </h2>
              <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed">
                Hayvanlar, bitkiler ve mantarlar alemindeki canlıların doğal yaşam alanlarını, besin zincirindeki rollerini, taşıdıkları toksin veya hastalık risklerini ve küresel <strong>IUCN Kırmızı Liste</strong> durumlarını tek bir merkezde keşfedebilirsin.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-300/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  Kritik tehlikedeki (CR, EN, VU) türleri anında filtreleme
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  Tıklanabilir besin zinciri ve ekosistem etkileşim ağı
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onTabChange('animals')}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-200 hover:bg-emerald-500 hover:text-emerald-950 transition-all"
                >
                  Ansiklopediyi Aç <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left" className="order-2 lg:order-1">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                02 • Yan Yana Karşılaştırma Stüdyosu
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-snug">
                Farklı Alemlerden Canlıları Aynı Ekranda Kıyasla
              </h2>
              <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed">
                Bir yırtıcı kuş ile zehirli bir mantarın veya endemik bir ağacın yaşam döngüsünü, enerji üretim biçimini ve ekolojik etkilerini yan yana getirerek karşılaştırabilir, biyoçeşitlilik istatistiklerini analiz edebilirsin.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onTabChange('compare')}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-950/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-cyan-200 hover:bg-cyan-500 hover:text-cyan-950 transition-all"
                >
                  Karşılaştırma Stüdyosuna Git <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150} className="order-1 lg:order-2">
            <div
              onClick={() => showcaseSpecies2 && onSelectOrganism(showcaseSpecies2)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-cyan-800/70 bg-[#0c1613] shadow-2xl shadow-cyan-950/40"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={(showcaseSpecies2 && wikiImages[showcaseSpecies2.id]) || FALLBACK_IMAGE}
                  alt={showcaseSpecies2?.common_name || 'Sakallı Akbaba'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d0b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="rounded-md bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                    Ekolojik Analiz • Künyeyi Gör
                  </span>
                  <h4 className="mt-1 text-lg font-bold text-white">
                    {showcaseSpecies2?.common_name || 'Sakallı Akbaba'}
                  </h4>
                  <p className="text-xs italic text-cyan-300/80">
                    {showcaseSpecies2?.scientific_name}
                  </p>
                </div>
                <span className="rounded-full bg-cyan-500 p-2.5 text-cyan-950 shadow-lg transition-transform group-hover:translate-x-1">
                  <Scale className="h-4 w-4" />
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div
              onClick={() => showcaseSpecies3 && onSelectOrganism(showcaseSpecies3)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-teal-800/70 bg-[#0c1613] shadow-2xl shadow-teal-950/40"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={(showcaseSpecies3 && wikiImages[showcaseSpecies3.id]) || FALLBACK_IMAGE}
                  alt={showcaseSpecies3?.common_name || 'Ateş Semenderi'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d0b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="rounded-md bg-teal-500/20 border border-teal-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
                    Vatandaş Bilimi • Saha Kaydı
                  </span>
                  <h4 className="mt-1 text-lg font-bold text-white">
                    {showcaseSpecies3?.common_name || 'Ateş Semenderi'}
                  </h4>
                  <p className="text-xs italic text-teal-300/80">
                    {showcaseSpecies3?.scientific_name}
                  </p>
                </div>
                <span className="rounded-full bg-teal-500 p-2.5 text-teal-950 shadow-lg transition-transform group-hover:translate-x-1">
                  <Users className="h-4 w-4" />
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-lg bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30">
                03 • Doğa Gözlem Ağı (WildFeed)
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-snug">
                Doğada Rastladığın Türleri Paylaş, Toplulukla Doğrula
              </h2>
              <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed">
                Doğa yürüyüşlerinde karşılaştığın canlıların fotoğrafını yükle, tür tahminlerini ansiklopedi veritabanıyla eşleştir, saha notları paylaş ve diğer gözlemcilerin kayıtlarını oyla.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onTabChange('feed')}
                  className="inline-flex items-center gap-2 rounded-xl border border-teal-500/50 bg-teal-950/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-teal-200 hover:bg-teal-500 hover:text-teal-950 transition-all"
                >
                  Gözlem Akışına Katıl <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="kategoriler" className="border-t border-emerald-900/50 bg-[#050908]/80 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal direction="up">
            <div className="mb-12 text-center space-y-3">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Keşfetmeye Nereden Başlamak İstersin?
              </h2>
              <p className="mx-auto max-w-xl text-sm text-emerald-300/80">
                Aşağıdaki biyolojik alemlerden veya etkileşimli araçlardan birini seçerek doğrudan incelemeye başlayabilirsin.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={0}>
              <button
                type="button"
                onClick={() => onTabChange('animals')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-emerald-800/70 bg-[#0c1613] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Compass className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-800">
                      {animalsCount} Tür
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Hayvanlar Alemi
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      Memeliler, yırtıcı kuşlar, sürüngenler, amfibiler, deniz canlıları ve eklembacaklıların ekolojik künyeleri.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  Hayvanları İncele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <button
                type="button"
                onClick={() => onTabChange('plants')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-lime-800/70 bg-[#0c1613] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-400 hover:shadow-xl hover:shadow-lime-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                      <Trees className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-lime-950 px-3 py-1 text-xs font-bold text-lime-300 border border-lime-800">
                      {plantsCount} Tür
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
                      Bitkiler Alemi
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      Endemik ağaçlar, tıbbi ve aromatik bitkiler, etçil bitkiler ve toksik alkaloid içeren flora türleri.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-lime-400">
                  Bitkileri İncele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <button
                type="button"
                onClick={() => onTabChange('fungi')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-amber-800/70 bg-[#0c1613] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Sprout className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-800">
                      {fungiCount} Tür
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      Mantarlar Alemi
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      Mikorizal orman ortakları, ayrıştırıcı türler, yenilebilir mantarlar ve ölümcül mikotoksin uyarıları.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  Mantarları İncele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={0}>
              <button
                type="button"
                onClick={() => onTabChange('wizard')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-violet-800/70 bg-[#0c1613] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-violet-950 px-3 py-1 text-xs font-bold text-violet-300 border border-violet-800">
                      3 Adımlı Rehber
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      Doğada Ne Gördüm?
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      Adını bilmediğin bir canlıyı görüldüğü habitat, sınıf ve özelliklerine göre adım adım teşhis et.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-violet-300">
                  Sihirbazı Başlat <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <button
                type="button"
                onClick={() => onTabChange('compare')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-cyan-800/70 bg-[#0c1613] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Scale className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-800">
                      Analiz Aracı
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Ekosistem & Karşılaştırma
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      3 farklı türü yan yana getirerek yaşam süresi, beslenme tipi ve risk profillerini karşılaştır.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  Stüdyoyu Aç <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <button
                type="button"
                onClick={() => onTabChange('feed')}
                className="group flex h-full w-full flex-col justify-between rounded-2xl border border-teal-800/70 bg-gradient-to-br from-[#0c1613] to-teal-950/40 p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-950/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-teal-950 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-800">
                      {observationsCount} Aktif Gözlem
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                      WildFeed — Gözlem Ağı
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-200/75 leading-relaxed">
                      Sahada çektiğin fotoğrafları paylaş, topluluk tür tahminleriyle canlıyı doğrula.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  Gözlem Akışına Git <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}