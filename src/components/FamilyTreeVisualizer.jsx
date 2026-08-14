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

  const hasParents = father || mother;
  const hasGrandparents = dada || dadi || nani || blockedDada || blockedDadi || blockedNani;
  const hasChildren = sons || daughters;
  const hasSiblings = brothers || sisters || blockedSiblings;

  // Sleek Node Component
  const TreeNode = ({
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
      borderClass = 'border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 ring-1 ring-amber-500/30';
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
        } p-4 w-60 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {isDeceased
              ? lang === 'ur' ? 'متوفی' : 'Deceased'
              : isBlockedNode
              ? lang === 'ur' ? 'حجب (محروم)' : 'Excluded (Mahjoob)'
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
        <div className="min-w-[760px] flex flex-col items-center space-y-8 py-2">

          {/* ================= LEVEL 1: GRANDPARENTS (If surviving/relevant) ================= */}
          {hasGrandparents && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-6">
                {(dada || blockedDada) && (
                  <TreeNode
                    name={lang === 'ur' ? 'دادا (Dada)' : 'Paternal Grandfather'}
                    relation={lang === 'ur' ? 'باپ کا باپ' : 'Paternal Grandfather'}
                    fraction={dada?.fractionFormatted}
                    percent={dada?.percentage}
                    pkr={dada?.totalPkr}
                    category={dada?.category}
                    type={dada ? 'heir' : 'blocked'}
                    quranRef="Hadith / Sunnah"
                    ruleText={dada?.ruleEn || blockedDada?.reasonEn}
                  />
                )}

                {(dadi || blockedDadi) && (
                  <TreeNode
                    name={lang === 'ur' ? 'دادی (Dadi)' : 'Paternal Grandmother'}
                    relation={lang === 'ur' ? 'باپ کی ماں' : 'Paternal Grandmother'}
                    fraction={dadi?.fractionFormatted}
                    percent={dadi?.percentage}
                    pkr={dadi?.totalPkr}
                    category={dadi?.category}
                    type={dadi ? 'heir' : 'blocked'}
                    quranRef="Sunan Abi Dawud"
                    ruleText={dadi?.ruleEn || blockedDadi?.reasonEn}
                  />
                )}

                {(nani || blockedNani) && (
                  <TreeNode
                    name={lang === 'ur' ? 'نانی (Nani)' : 'Maternal Grandmother'}
                    relation={lang === 'ur' ? 'ماں کی ماں' : 'Maternal Grandmother'}
                    fraction={nani?.fractionFormatted}
                    percent={nani?.percentage}
                    pkr={nani?.totalPkr}
                    category={nani?.category}
                    type={nani ? 'heir' : 'blocked'}
                    quranRef="Sunan Abi Dawud"
                    ruleText={nani?.ruleEn || blockedNani?.reasonEn}
                  />
                )}
              </div>

              {/* Vertical Branch Line */}
              <div className="w-px h-6 bg-slate-700"></div>
            </div>
          )}

          {/* ================= LEVEL 2: PARENTS ================= */}
          {hasParents && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-8">
                {father && (
                  <TreeNode
                    name={lang === 'ur' ? 'والد صاحب (Father)' : 'Father (Walid)'}
                    relation={lang === 'ur' ? 'والد' : 'Father'}
                    fraction={father.fractionFormatted}
                    percent={father.percentage}
                    pkr={father.totalPkr}
                    category={father.category}
                    type="heir"
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={father.ruleEn}
                  />
                )}

                {mother && (
                  <TreeNode
                    name={lang === 'ur' ? 'والدہ صاحبہ (Mother)' : 'Mother (Walidah)'}
                    relation={lang === 'ur' ? 'والدہ' : 'Mother'}
                    fraction={mother.fractionFormatted}
                    percent={mother.percentage}
                    pkr={mother.totalPkr}
                    category={mother.category}
                    type="heir"
                    quranRef="Surah An-Nisa (4:11)"
                    ruleText={mother.ruleEn}
                  />
                )}
              </div>

              {/* Vertical Branch Line */}
              <div className="w-px h-8 bg-slate-700"></div>
            </div>
          )}

          {/* ================= LEVEL 3: DECEASED & SPOUSE & SIBLINGS ================= */}
          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Siblings Collateral Branch */}
              {hasSiblings && (
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                  {brothers && (
                    <TreeNode
                      name={lang === 'ur' ? brothers.nameUr : brothers.nameEn}
                      relation={lang === 'ur' ? 'سگے بھائی' : 'Full Brothers'}
                      fraction={brothers.fractionFormatted}
                      percent={brothers.percentage}
                      pkr={brothers.totalPkr}
                      count={brothers.count}
                      category={brothers.category}
                      type="heir"
                      quranRef="Surah An-Nisa (4:176)"
                      ruleText={brothers.ruleEn}
                    />
                  )}

                  {sisters && (
                    <TreeNode
                      name={lang === 'ur' ? sisters.nameUr : sisters.nameEn}
                      relation={lang === 'ur' ? 'سگی بہنیں' : 'Full Sisters'}
                      fraction={sisters.fractionFormatted}
                      percent={sisters.percentage}
                      pkr={sisters.totalPkr}
                      count={sisters.count}
                      category={sisters.category}
                      type="heir"
                      quranRef="Surah An-Nisa (4:176)"
                      ruleText={sisters.ruleEn}
                    />
                  )}

                  {blockedSiblings && !brothers && !sisters && (
                    <TreeNode
                      name={lang === 'ur' ? 'بہن بھائی' : 'Full Siblings'}
                      relation={lang === 'ur' ? 'سگے بہن بھائی' : 'Siblings'}
                      type="blocked"
                      ruleText={blockedSiblings.reasonEn}
                    />
                  )}
                </div>
              )}

              {/* The Deceased Core Node */}
              <TreeNode
                name={
                  formData.deceasedGender === 'male'
                    ? lang === 'ur' ? 'مرحوم والد / شوہر' : 'Deceased (Male)'
                    : lang === 'ur' ? 'مرحومہ والدہ / زوجہ' : 'Deceased (Female)'
                }
                relation={lang === 'ur' ? 'مورث (اصل جائیداد)' : 'Estate Owner'}
                type="deceased"
                ruleText="The deceased whose estate is distributed among legal heirs in accordance with Sunni/Hanafi Fara'iz jurisprudence."
              />

              {/* Marriage Connector Line & Spouse */}
              {wife && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-teal-500/40"></div>
                  <TreeNode
                    name={lang === 'ur' ? wife.nameUr : wife.nameEn}
                    relation={lang === 'ur' ? 'شریکِ حیات' : 'Wife / Widow'}
                    fraction={wife.fractionFormatted}
                    percent={wife.percentage}
                    pkr={wife.totalPkr}
                    count={wife.count}
                    category={wife.category}
                    type="spouse"
                    quranRef="Surah An-Nisa (4:12)"
                    ruleText={wife.ruleEn}
                  />
                </div>
              )}

              {husband && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-teal-500/40"></div>
                  <TreeNode
                    name={lang === 'ur' ? 'شوہر (Shohar)' : 'Husband'}
                    relation={lang === 'ur' ? 'شریکِ حیات' : 'Surviving Husband'}
                    fraction={husband.fractionFormatted}
                    percent={husband.percentage}
                    pkr={husband.totalPkr}
                    count={1}
                    category={husband.category}
                    type="spouse"
                    quranRef="Surah An-Nisa (4:12)"
                    ruleText={husband.ruleEn}
                  />
                </div>
              )}
            </div>

            {/* Branching down to children */}
            {hasChildren && (
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="w-32 h-px bg-slate-700"></div>
              </div>
            )}
          </div>

          {/* ================= LEVEL 4: CHILDREN / DESCENDANTS ================= */}
          {hasChildren && (
            <div className="flex items-center justify-center gap-8 pt-2">
              {sons && (
                <TreeNode
                  name={lang === 'ur' ? sons.nameUr : sons.nameEn}
                  relation={lang === 'ur' ? 'صلبی بیٹے (2 حصے)' : 'Sons (2x Asabah)'}
                  fraction={sons.fractionFormatted}
                  percent={sons.percentage}
                  pkr={sons.totalPkr}
                  count={sons.count}
                  category={sons.category}
                  type="heir"
                  quranRef="Surah An-Nisa (4:11)"
                  ruleText={sons.ruleEn}
                />
              )}

              {daughters && (
                <TreeNode
                  name={lang === 'ur' ? daughters.nameUr : daughters.nameEn}
                  relation={lang === 'ur' ? 'صلبی بیٹیاں (1 حصہ)' : 'Daughters (1x share)'}
                  fraction={daughters.fractionFormatted}
                  percent={daughters.percentage}
                  pkr={daughters.totalPkr}
                  count={daughters.count}
                  category={daughters.category}
                  type="heir"
                  quranRef="Surah An-Nisa (4:11)"
                  ruleText={daughters.ruleEn}
                />
              )}
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
