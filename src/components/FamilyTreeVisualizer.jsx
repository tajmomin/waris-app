import React, { useState } from 'react';
import {
  User,
  Users,
  Shield,
  Sparkles,
  Heart,
  Ban,
  Info,
  X,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Coins,
  Crown,
  Scale,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function FamilyTreeVisualizer({ formData, results, lang }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'sharers' | 'residuaries' | 'blocked'
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!results || !results.heirsList) return null;

  const { heirsList, blockedHeirs, netEstate, status } = results;

  const findHeir = (id) => heirsList.find((h) => h.id === id);
  const isBlocked = (key) => blockedHeirs && blockedHeirs.find((b) => b.key === key);

  // Nodes extraction
  const wife = findHeir('wife');
  const husband = findHeir('husband');
  const mother = findHeir('mother');
  const father = findHeir('father') || findHeir('father_fard') || findHeir('father_pure_asabah');
  const dadi = findHeir('paternalGrandmother');
  const nani = findHeir('maternalGrandmother');
  const dada = findHeir('grandfather') || findHeir('grandfather_fard') || findHeir('grandfather_pure_asabah');
  const sons = findHeir('sons');
  const daughters = findHeir('daughters') || findHeir('daughters_asabah');
  const brothers = findHeir('fullBrothers');
  const sisters = findHeir('fullSisters') || findHeir('fullSisters_asabah') || findHeir('fullSisters_with_daughters');

  const blockedDada = isBlocked('paternalGrandfather');
  const blockedDadi = isBlocked('paternalGrandmother');
  const blockedNani = isBlocked('maternalGrandmother');
  const blockedSiblings = isBlocked('fullSiblings');

  // Interactive Bubble Node Component
  const TreeBubble = ({
    title,
    subtitle,
    count = 1,
    fraction,
    percentage,
    pkr,
    category,
    categoryType, // 'deceased' | 'spouse' | 'sharer' | 'residuary' | 'blocked'
    quranRef,
    ruleText,
    isBlockedNode = false,
    avatarEmoji = '👤',
  }) => {
    const isDeceased = categoryType === 'deceased';
    const isSharer = categoryType === 'sharer' || (category && category.includes('Fixed'));
    const isResiduary = categoryType === 'residuary' || (category && category.includes('Residuary'));
    const isSelected = selectedNode?.title === title;

    // Filter visibility
    if (filterMode === 'sharers' && !isSharer && !isDeceased) return null;
    if (filterMode === 'residuaries' && !isResiduary && !isDeceased) return null;
    if (filterMode === 'blocked' && !isBlockedNode) return null;

    let ringColor = 'border-emerald-500/50 shadow-glow';
    let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    let gradientBg = 'from-emerald-950/80 via-slate-900 to-slate-950';

    if (isDeceased) {
      ringColor = 'border-gold-400 ring-4 ring-gold-500/20 shadow-glow-gold';
      badgeBg = 'bg-gold-500/20 text-gold-300 border-gold-500/40';
      gradientBg = 'from-slate-900 via-emerald-950 to-slate-900';
    } else if (categoryType === 'spouse') {
      ringColor = 'border-teal-400 ring-2 ring-teal-500/20';
      badgeBg = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      gradientBg = 'from-teal-950/80 via-slate-900 to-slate-950';
    } else if (isResiduary) {
      ringColor = 'border-gold-500/60 ring-2 ring-gold-500/20 shadow-glow-gold';
      badgeBg = 'bg-gold-500/20 text-gold-300 border-gold-500/30';
      gradientBg = 'from-amber-950/70 via-slate-900 to-slate-950';
    } else if (isBlockedNode) {
      ringColor = 'border-slate-700/60 opacity-60';
      badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      gradientBg = 'from-slate-900 via-slate-950 to-slate-950';
    }

    return (
      <div
        onClick={() =>
          setSelectedNode({
            title,
            subtitle,
            count,
            fraction,
            percentage,
            pkr,
            category,
            categoryType,
            quranRef,
            ruleText,
            isBlockedNode,
            isDeceased,
          })
        }
        className={`group relative cursor-pointer p-4 rounded-3xl border transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-b ${gradientBg} ${ringColor} ${
          isSelected ? 'ring-4 ring-emerald-400 scale-105' : ''
        } min-w-[170px] max-w-[210px] text-center shadow-xl backdrop-blur-md`}
      >
        {/* Floating Top Avatar Icon */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-sm shadow-md group-hover:border-emerald-400 transition">
          {isDeceased ? '👑' : isBlockedNode ? '🛡️' : avatarEmoji}
        </div>

        <div className="pt-2 space-y-1.5">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            {isDeceased ? (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${badgeBg}`}>
                {lang === 'ur' ? 'متوفی (مرکزی شجرہ)' : 'Deceased (Root)'}
              </span>
            ) : isBlockedNode ? (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badgeBg} flex items-center gap-1`}>
                <Ban className="w-3 h-3" />
                <span>{lang === 'ur' ? 'محروم (حجب)' : 'Excluded'}</span>
              </span>
            ) : (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badgeBg}`}>
                {fraction ? `${fraction} • ${percentage}%` : lang === 'ur' ? 'وارث' : 'Legal Heir'}
              </span>
            )}
          </div>

          {/* Node Title */}
          <h4 className="text-xs font-black text-slate-100 line-clamp-1">{title}</h4>
          {subtitle && <p className="text-[10px] text-slate-400 truncate">{subtitle}</p>}

          {/* Share Valuation if not deceased / blocked */}
          {!isDeceased && !isBlockedNode && pkr > 0 && (
            <div className="pt-1.5 border-t border-slate-800/80">
              <p className="text-xs font-black text-gold-300">{formatPKR(pkr)}</p>
              {count > 1 && (
                <p className="text-[9px] text-slate-400">
                  {lang === 'ur' ? `فی کس: ${formatPKR(pkr / count)}` : `Each: ${formatPKR(pkr / count)}`}
                </p>
              )}
            </div>
          )}

          {isBlockedNode && (
            <div className="pt-1 border-t border-slate-800/80 text-[9.5px] text-rose-300">
              {lang === 'ur' ? 'قریبی وارث کی وجہ سے محروم' : 'Blocked by closer heir'}
            </div>
          )}
        </div>

        {/* Subtle click hint */}
        <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition text-[9px] text-slate-500">
          🔍 {lang === 'ur' ? 'تفصیل' : 'Details'}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Visual Shajra Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ur' ? 'شجرۂ نسب و فرائض' : 'Interactive Shajra-e-Nasab (Pedigree Tree)'}</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-1">
            {lang === 'ur'
              ? 'خاندانی شجرہ اور شرعی حصص کا بصری نقشہ'
              : 'Visual Family Pedigree & Heirship Network Graph'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ur'
              ? 'کسی بھی وارث کے ببل پر کلک کر کے قرآنی دلیل، حصہ اور مالیت دیکھیں۔'
              : 'Click any family bubble node to inspect exact Quranic verses, fractional portions, and cash/land shares.'}
          </p>
        </div>

        {/* Tree Controls: Filter & Zoom */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filterMode === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ur' ? 'سب ورثاء' : 'All Heirs'}
            </button>
            <button
              onClick={() => setFilterMode('sharers')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filterMode === 'sharers' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ur' ? 'قرآنی حصہ دار' : 'Fixed Sharers'}
            </button>
            <button
              onClick={() => setFilterMode('residuaries')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filterMode === 'residuaries' ? 'bg-gold-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ur' ? 'عصبہ' : 'Residuaries'}
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas & Organic Tree Graph Container */}
      <div className="overflow-x-auto pb-8 pt-4 rounded-2xl bg-slate-950/60 border border-slate-900 relative">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="min-w-[820px] transition-transform duration-200 flex flex-col items-center space-y-10 py-4 px-6 relative"
        >

          {/* ================= TIER 1: GRANDPARENTS (Ancestral Roots) ================= */}
          {(dada || dadi || nani || blockedDada || blockedDadi || blockedNani) && (
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                <span>🌱 {lang === 'ur' ? 'درجۂ اول: اجداد و جدات (دادا / دادی / نانی)' : 'Ancestral Roots: Grandparents'}</span>
              </div>

              <div className="flex items-center justify-center gap-6">
                {(dada || blockedDada) && (
                  <TreeBubble
                    title={lang === 'ur' ? 'دادا (Dada)' : 'Paternal Grandfather'}
                    subtitle={dada ? dada.categoryUr || dada.category : 'دادا'}
                    fraction={dada?.fractionFormatted}
                    percentage={dada?.percentage}
                    pkr={dada?.totalPkr}
                    category={dada?.category}
                    categoryType={dada ? 'sharer' : 'blocked'}
                    quranRef="Hadith / Hanafi Qiyas"
                    ruleText={dada?.ruleEn || blockedDada?.reasonEn}
                    isBlockedNode={!dada && !!blockedDada}
                    avatarEmoji="👴"
                  />
                )}
                {(dadi || blockedDadi) && (
                  <TreeBubble
                    title={lang === 'ur' ? 'دادی (Dadi)' : 'Paternal Grandmother'}
                    subtitle={dadi ? dadi.categoryUr || dadi.category : 'دادی'}
                    fraction={dadi?.fractionFormatted}
                    percentage={dadi?.percentage}
                    pkr={dadi?.totalPkr}
                    category={dadi?.category}
                    categoryType={dadi ? 'sharer' : 'blocked'}
                    quranRef="Sunan Abi Dawud"
                    ruleText={dadi?.ruleEn || blockedDadi?.reasonEn}
                    isBlockedNode={!dadi && !!blockedDadi}
                    avatarEmoji="👵"
                  />
                )}
                {(nani || blockedNani) && (
                  <TreeBubble
                    title={lang === 'ur' ? 'نانی (Nani)' : 'Maternal Grandmother'}
                    subtitle={nani ? nani.categoryUr || nani.category : 'نانی'}
                    fraction={nani?.fractionFormatted}
                    percentage={nani?.percentage}
                    pkr={nani?.totalPkr}
                    category={nani?.category}
                    categoryType={nani ? 'sharer' : 'blocked'}
                    quranRef="Sunan Abi Dawud"
                    ruleText={nani?.ruleEn || blockedNani?.reasonEn}
                    isBlockedNode={!nani && !!blockedNani}
                    avatarEmoji="👵"
                  />
                )}
              </div>

              {/* Connecting Tree Branch Downward */}
              <div className="w-1 h-8 bg-gradient-to-b from-slate-700 to-emerald-500 rounded-full"></div>
            </div>
          )}

          {/* ================= TIER 2: PARENTS ================= */}
          {(father || mother || formData.fatherAlive || formData.motherAlive) && (
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                <span>🌿 {lang === 'ur' ? 'درجۂ دوم: حیات والدین (ماں اور باپ)' : 'Tier 2: Surviving Parents'}</span>
              </div>

              <div className="flex items-center justify-center gap-8">
                {father && (
                  <TreeBubble
                    title={lang === 'ur' ? 'والد صاحب (Father)' : 'Father (Walid)'}
                    subtitle={father.categoryUr || father.category}
                    fraction={father.fractionFormatted}
                    percentage={father.percentage}
                    pkr={father.totalPkr}
                    category={father.category}
                    categoryType={father.category.includes('Residuary') ? 'residuary' : 'sharer'}
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={father.ruleEn}
                    avatarEmoji="👨"
                  />
                )}
                {mother && (
                  <TreeBubble
                    title={lang === 'ur' ? 'والدہ صاحبہ (Mother)' : 'Mother (Walidah)'}
                    subtitle={mother.categoryUr || mother.category}
                    fraction={mother.fractionFormatted}
                    percentage={mother.percentage}
                    pkr={mother.totalPkr}
                    category={mother.category}
                    categoryType="sharer"
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={mother.ruleEn}
                    avatarEmoji="👩"
                  />
                )}
              </div>

              {/* Connecting Tree Trunk Downward */}
              <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-500 to-emerald-400 rounded-full shadow-glow"></div>
            </div>
          )}

          {/* ================= TIER 3: DECEASED CORE & SPOUSE & SIBLINGS ================= */}
          <div className="flex flex-col items-center space-y-3 relative z-10 w-full">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-gold-400">
              <span>🌳 {lang === 'ur' ? 'مرکزی درجۂ وراثت: متوفی، شریکِ حیات و بہن بھائی' : 'Primary Tier: Deceased, Spouse & Siblings'}</span>
            </div>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Collateral Siblings Branch */}
              {(brothers || sisters || blockedSiblings) && (
                <div className="p-3 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  {brothers && (
                    <TreeBubble
                      title={lang === 'ur' ? `حقیقی بھائی (${brothers.count})` : `Full Brothers (${brothers.count})`}
                      subtitle={brothers.categoryUr || brothers.category}
                      count={brothers.count}
                      fraction={brothers.fractionFormatted}
                      percentage={brothers.percentage}
                      pkr={brothers.totalPkr}
                      category={brothers.category}
                      categoryType="residuary"
                      quranRef="Surah An-Nisa (4:176)"
                      ruleText={brothers.ruleEn}
                      avatarEmoji="🧔"
                    />
                  )}
                  {sisters && (
                    <TreeBubble
                      title={lang === 'ur' ? `حقیقی بہنیں (${sisters.count})` : `Full Sisters (${sisters.count})`}
                      subtitle={sisters.categoryUr || sisters.category}
                      count={sisters.count}
                      fraction={sisters.fractionFormatted}
                      percentage={sisters.percentage}
                      pkr={sisters.totalPkr}
                      category={sisters.category}
                      categoryType={sisters.category.includes('Residuary') ? 'residuary' : 'sharer'}
                      quranRef="Surah An-Nisa (4:176)"
                      ruleText={sisters.ruleEn}
                      avatarEmoji="🧕"
                    />
                  )}
                  {blockedSiblings && !brothers && !sisters && (
                    <TreeBubble
                      title={lang === 'ur' ? 'بہن بھائی' : 'Full Siblings'}
                      subtitle={lang === 'ur' ? 'محروم (حجب)' : 'Mahjoob'}
                      isBlockedNode={true}
                      ruleText={blockedSiblings.reasonEn}
                      avatarEmoji="👥"
                    />
                  )}
                </div>
              )}

              {/* Central Glowing Deceased Bubble Node */}
              <TreeBubble
                title={
                  formData.deceasedGender === 'male'
                    ? lang === 'ur'
                      ? 'مرحوم (متوفی)'
                      : 'Deceased (Male)'
                    : lang === 'ur'
                    ? 'مرحومہ (متوفیہ)'
                    : 'Deceased (Female)'
                }
                subtitle={lang === 'ur' ? `خالص ترکہ: ${formatPKR(netEstate)}` : `Net Estate: ${formatPKR(netEstate)}`}
                categoryType="deceased"
                pkr={netEstate}
                ruleText="Center Root: The deceased whose estate is distributed among the surviving legal heirs according to Islamic law (Fara'iz)."
              />

              {/* Surviving Spouse Bubble */}
              {wife && (
                <TreeBubble
                  title={lang === 'ur' ? wife.nameUr : wife.nameEn}
                  subtitle={wife.categoryUr || wife.category}
                  count={wife.count}
                  fraction={wife.fractionFormatted}
                  percentage={wife.percentage}
                  pkr={wife.totalPkr}
                  category={wife.category}
                  categoryType="spouse"
                  quranRef="Surah An-Nisa (4:12)"
                  ruleText={wife.ruleEn}
                  avatarEmoji="🧕"
                />
              )}
              {husband && (
                <TreeBubble
                  title={lang === 'ur' ? 'شوہر (Husband)' : 'Husband (Shohar)'}
                  subtitle={husband.categoryUr || husband.category}
                  count={1}
                  fraction={husband.fractionFormatted}
                  percentage={husband.percentage}
                  pkr={husband.totalPkr}
                  category={husband.category}
                  categoryType="spouse"
                  quranRef="Surah An-Nisa (4:12)"
                  ruleText={husband.ruleEn}
                  avatarEmoji="🧔"
                />
              )}
            </div>

            {/* Connecting Tree Trunk Branch Downward to Descendants */}
            {(sons || daughters) && (
              <div className="w-2 h-10 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full shadow-glow"></div>
            )}
          </div>

          {/* ================= TIER 4: CHILDREN & DESCENDANTS ================= */}
          {(sons || daughters) && (
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                <span>🍃 {lang === 'ur' ? 'درجۂ سوم: صلبی اولاد (بیٹے اور بیٹیاں — 2:1 کا شرعی تناسب)' : 'Tier 4: Descendants (Sons & Daughters — 2:1 Ratio)'}</span>
              </div>

              <div className="flex items-center justify-center gap-8">
                {sons && (
                  <TreeBubble
                    title={lang === 'ur' ? sons.nameUr : sons.nameEn}
                    subtitle={sons.categoryUr || sons.category}
                    count={sons.count}
                    fraction={sons.fractionFormatted}
                    percentage={sons.percentage}
                    pkr={sons.totalPkr}
                    category={sons.category}
                    categoryType="residuary"
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={sons.ruleEn}
                    avatarEmoji="👦"
                  />
                )}
                {daughters && (
                  <TreeBubble
                    title={lang === 'ur' ? daughters.nameUr : daughters.nameEn}
                    subtitle={daughters.categoryUr || daughters.category}
                    count={daughters.count}
                    fraction={daughters.fractionFormatted}
                    percentage={daughters.percentage}
                    pkr={daughters.totalPkr}
                    category={daughters.category}
                    categoryType={daughters.category.includes('Residuary') ? 'residuary' : 'sharer'}
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={daughters.ruleEn}
                    avatarEmoji="👧"
                  />
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Popover / Node Inspector Drawer when a bubble is clicked */}
      {selectedNode && (
        <div className="p-5 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/40 shadow-glow relative animate-fadeIn space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-100">{selectedNode.title}</h4>
                <p className="text-xs text-emerald-400 font-semibold">{selectedNode.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!selectedNode.isDeceased && !selectedNode.isBlockedNode && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ur' ? 'حصہ (کسر):' : 'Fraction:'}</span>
                <span className="font-extrabold text-emerald-400 text-sm">{selectedNode.fraction}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ur' ? 'فیصد:' : 'Percentage:'}</span>
                <span className="font-bold text-slate-200">{selectedNode.percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ur' ? 'کل رقم:' : 'Total PKR:'}</span>
                <span className="font-extrabold text-gold-300">{formatPKR(selectedNode.pkr)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ur' ? 'فی کس حصہ:' : 'Per Person:'}</span>
                <span className="font-semibold text-slate-200">
                  {formatPKR(selectedNode.pkr / (selectedNode.count || 1))}
                </span>
              </div>
            </div>
          )}

          {/* Islamic Jurisprudence basis & Quranic Ref */}
          <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-slate-800">
            {selectedNode.quranRef && (
              <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{selectedNode.quranRef}</span>
              </p>
            )}
            <p className="leading-relaxed text-slate-300">{selectedNode.ruleText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
