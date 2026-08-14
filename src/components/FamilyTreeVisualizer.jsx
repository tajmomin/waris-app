import React, { useState } from 'react';
import {
  Users,
  User,
  Heart,
  Scale,
  Sparkles,
  BookOpen,
  Info,
  X,
  Plus,
  Minus,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function FamilyTreeVisualizer({ formData, results, lang }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!results || !results.heirsList) return null;

  const { heirsList, blockedHeirs, netEstate } = results;

  const findHeir = (id) => heirsList.find((h) => h.id === id);
  const isBlocked = (key) => blockedHeirs && blockedHeirs.find((b) => b.key === key);

  // Extract Heirs
  const wife = findHeir('wife');
  const husband = findHeir('husband');
  const spouse = wife || husband;
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

  const grandParentsList = [
    dada && { ...dada, relationTitle: lang === 'ur' ? 'دادا (Dada)' : 'Paternal Grandfather' },
    dadi && { ...dadi, relationTitle: lang === 'ur' ? 'دادی (Dadi)' : 'Paternal Grandmother' },
    nani && { ...nani, relationTitle: lang === 'ur' ? 'نانی (Nani)' : 'Maternal Grandmother' },
  ].filter(Boolean);

  const parentsList = [
    father && { ...father, relationTitle: lang === 'ur' ? 'والد صاحب (Father)' : 'Father (Walid)' },
    mother && { ...mother, relationTitle: lang === 'ur' ? 'والدہ صاحبہ (Mother)' : 'Mother (Walidah)' },
  ].filter(Boolean);

  const childrenList = [
    sons && { ...sons, relationTitle: lang === 'ur' ? sons.nameUr : sons.nameEn },
    daughters && { ...daughters, relationTitle: lang === 'ur' ? daughters.nameUr : daughters.nameEn },
  ].filter(Boolean);

  const siblingsList = [
    brothers && { ...brothers, relationTitle: lang === 'ur' ? brothers.nameUr : brothers.nameEn },
    sisters && { ...sisters, relationTitle: lang === 'ur' ? sisters.nameUr : sisters.nameEn },
  ].filter(Boolean);

  // Clean, modern Card Component with exact dimensions for predictable tree alignment
  const TreeCard = ({
    name,
    relation,
    fraction,
    percent,
    pkr,
    category,
    type = 'heir', // 'deceased' | 'spouse' | 'heir' | 'blocked'
    quranRef,
    ruleText,
    count = 1,
  }) => {
    const isDeceased = type === 'deceased';
    const isBlockedNode = type === 'blocked';
    const isSpouse = type === 'spouse';
    const isSelected = selectedNode?.name === name;

    let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-900/90';
    let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

    if (isDeceased) {
      borderClass = 'border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 ring-1 ring-amber-500/20';
      badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    } else if (isSpouse) {
      borderClass = 'border-teal-500/40 bg-slate-900/90 hover:border-teal-500/60';
      badgeClass = 'bg-teal-500/10 text-teal-300 border-teal-500/20';
    } else if (isBlockedNode) {
      borderClass = 'border-slate-800 bg-slate-950/60 opacity-60';
      badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
    } else if (category && category.includes('Residuary')) {
      borderClass = 'border-gold-500/30 bg-slate-900/90 hover:border-gold-500/60';
      badgeClass = 'bg-gold-500/10 text-gold-300 border-gold-500/20';
    }

    return (
      <div
        onClick={() =>
          setSelectedNode({
            name,
            relation,
            fraction,
            percent,
            pkr,
            category,
            type,
            quranRef,
            ruleText,
            count,
          })
        }
        className={`relative cursor-pointer select-none rounded-2xl border ${borderClass} ${
          isSelected ? 'ring-2 ring-emerald-400 shadow-xl' : ''
        } p-4 w-64 shadow-lg backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 z-10`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {isDeceased
              ? lang === 'ur' ? 'متوفی' : 'Deceased'
              : isBlockedNode
              ? lang === 'ur' ? 'حجب (محروم)' : 'Excluded'
              : `${fraction} • ${percent}%`}
          </span>

          <span className="text-[10px] text-slate-400 font-medium truncate">
            {relation}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span className="truncate">{name}</span>
            {count > 1 && (
              <span className="text-[10px] font-normal text-slate-400">
                ×{count}
              </span>
            )}
          </div>

          {!isDeceased && !isBlockedNode && (
            <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                {lang === 'ur' ? 'شرعی حصہ:' : 'Share:'}
              </span>
              <span className="font-extrabold text-emerald-400">
                {formatPKR(pkr)}
              </span>
            </div>
          )}

          {isDeceased && (
            <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                {lang === 'ur' ? 'خالص ترکہ:' : 'Net Estate:'}
              </span>
              <span className="font-extrabold text-amber-300">
                {formatPKR(netEstate)}
              </span>
            </div>
          )}

          {isBlockedNode && (
            <p className="text-[10px] text-slate-500 pt-1 truncate">
              {lang === 'ur' ? 'قریبی وارث کی موجودگی' : 'Excluded by closer heir'}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Clean Tree Canvas Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800/90 overflow-x-auto relative shadow-2xl">
        <div className="min-w-[720px] flex flex-col items-center py-4 space-y-0">

          {/* ================= LEVEL 1: GRANDPARENTS ================= */}
          {grandParentsList.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-8">
                {grandParentsList.map((g, idx) => (
                  <TreeCard
                    key={idx}
                    name={g.relationTitle}
                    relation={lang === 'ur' ? 'اجداد' : 'Grandparent'}
                    fraction={g.fractionFormatted}
                    percent={g.percentage}
                    pkr={g.totalPkr}
                    category={g.category}
                    type="heir"
                    quranRef="Hadith / Sunnah"
                    ruleText={g.ruleEn}
                  />
                ))}
              </div>

              {/* Connected vertical trunk to parents */}
              <div className="w-0.5 h-10 bg-slate-700"></div>
            </div>
          )}

          {/* ================= LEVEL 2: PARENTS ================= */}
          {parentsList.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-8">
                {parentsList.map((p, idx) => (
                  <TreeCard
                    key={idx}
                    name={p.relationTitle}
                    relation={lang === 'ur' ? 'والدین' : 'Parent'}
                    fraction={p.fractionFormatted}
                    percent={p.percentage}
                    pkr={p.totalPkr}
                    category={p.category}
                    type="heir"
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={p.ruleEn}
                  />
                ))}
              </div>

              {/* Connected vertical trunk to primary tier */}
              <div className="w-0.5 h-10 bg-slate-700"></div>
            </div>
          )}

          {/* ================= LEVEL 3: PRIMARY TIER (DECEASED & SPOUSE) ================= */}
          <div className="flex flex-col items-center relative">
            <div className="flex items-center justify-center relative">
              {/* Deceased Card */}
              <TreeCard
                name={
                  formData.deceasedGender === 'male'
                    ? lang === 'ur' ? 'مرحوم والد / شوہر' : 'Deceased (Male)'
                    : lang === 'ur' ? 'مرحومہ والدہ / زوجہ' : 'Deceased (Female)'
                }
                relation={lang === 'ur' ? 'مورث (اصل جائیداد)' : 'Estate Owner'}
                type="deceased"
                ruleText="The deceased whose estate is distributed among legal heirs in accordance with Sunni/Hanafi Fara'iz jurisprudence."
              />

              {/* Seamless Marriage Bridge & Spouse */}
              {spouse ? (
                <>
                  {/* Continuous Horizontal Marriage Line with Center Junction Dot */}
                  <div className="w-16 h-0.5 bg-teal-500/70 relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-2 ring-slate-900 z-20"></div>
                  </div>

                  <TreeCard
                    name={
                      wife
                        ? lang === 'ur' ? wife.nameUr : wife.nameEn
                        : lang === 'ur' ? 'شوہر (Shohar)' : 'Husband'
                    }
                    relation={lang === 'ur' ? 'شریکِ حیات' : 'Surviving Spouse'}
                    fraction={spouse.fractionFormatted}
                    percent={spouse.percentage}
                    pkr={spouse.totalPkr}
                    count={spouse.count || 1}
                    category={spouse.category}
                    type="spouse"
                    quranRef="Surah An-Nisa (4:12)"
                    ruleText={spouse.ruleEn}
                  />
                </>
              ) : null}
            </div>

            {/* ================= CONTINUOUS CONNECTION TO CHILDREN ================= */}
            {childrenList.length > 0 && (
              <div className="flex flex-col items-center w-full">
                {/* 1. Vertical line dropping from the center of marriage (or deceased if no spouse) */}
                <div className="w-0.5 h-8 bg-slate-600"></div>

                {childrenList.length === 1 ? (
                  // Single child: Straight vertical line into child
                  <div className="w-0.5 h-6 bg-slate-600"></div>
                ) : (
                  // Multiple children (e.g. Sons + Daughters): Seamless Tee-Junction Fork
                  <div className="relative w-80 h-8 flex items-center justify-center">
                    {/* Horizontal Bus spanning exactly across children */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-600 rounded-full"></div>

                    {/* Center junction dot */}
                    <div className="absolute top-[-3px] w-2 h-2 rounded-full bg-slate-400 z-10"></div>

                    {/* Left Drop to Child 1 */}
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-slate-600"></div>

                    {/* Right Drop to Child 2 */}
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-slate-600"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= LEVEL 4: CHILDREN / DESCENDANTS ================= */}
          {childrenList.length > 0 && (
            <div className="flex items-center justify-center gap-16">
              {childrenList.map((c, idx) => (
                <TreeCard
                  key={idx}
                  name={c.relationTitle}
                  relation={
                    c.id === 'sons'
                      ? lang === 'ur' ? 'صلبی بیٹے (2 حصے)' : 'Sons (2x Asabah)'
                      : lang === 'ur' ? 'صلبی بیٹیاں (1 حصہ)' : 'Daughters (1x Share)'
                  }
                  fraction={c.fractionFormatted}
                  percent={c.percentage}
                  pkr={c.totalPkr}
                  count={c.count}
                  category={c.category}
                  type="heir"
                  quranRef="Surah An-Nisa (4:11)"
                  ruleText={c.ruleEn}
                />
              ))}
            </div>
          )}

          {/* ================= SIBLINGS SECTION (If present and no children/father) ================= */}
          {siblingsList.length > 0 && (
            <div className="flex flex-col items-center pt-8">
              <div className="w-0.5 h-6 bg-slate-700"></div>
              <div className="flex items-center justify-center gap-8">
                {siblingsList.map((s, idx) => (
                  <TreeCard
                    key={idx}
                    name={s.relationTitle}
                    relation={lang === 'ur' ? 'سگے بہن بھائی' : 'Surviving Sibling'}
                    fraction={s.fractionFormatted}
                    percent={s.percentage}
                    pkr={s.totalPkr}
                    count={s.count}
                    category={s.category}
                    type="heir"
                    quranRef="Surah An-Nisa (4:176)"
                    ruleText={s.ruleEn}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Clean Bottom Inspector Card (On Node Click) */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({selectedNode.relation})
                </span>
              </h4>
              {selectedNode.quranRef && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-3 h-3" />
                  <span>{selectedNode.quranRef}</span>
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
            {selectedNode.ruleText}
          </p>
        </div>
      )}
    </div>
  );
}
