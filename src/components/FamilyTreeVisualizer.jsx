import React from 'react';
import {
  User,
  Users,
  Shield,
  Sparkles,
  ArrowDown,
  Scale,
  CheckCircle2,
  Heart,
  Ban,
  Share2,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function FamilyTreeVisualizer({ formData, results, lang }) {
  if (!results || !results.heirsList) return null;

  const { heirsList, blockedHeirs, netEstate } = results;

  const findHeir = (id) => heirsList.find((h) => h.id === id);
  const isBlocked = (key) => blockedHeirs && blockedHeirs.some((b) => b.key === key);

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

  const NodeCard = ({ title, subtitle, count, fraction, pkr, percentage, category, isDeceased, isBlockedNode, relationIcon }) => {
    return (
      <div
        className={`relative p-3.5 rounded-2xl border transition-all duration-200 text-center flex flex-col justify-between min-w-[160px] max-w-[200px] shadow-md ${
          isDeceased
            ? 'bg-slate-900 border-emerald-500 shadow-glow border-2'
            : isBlockedNode
            ? 'bg-slate-900/40 border-slate-800/80 opacity-50'
            : 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-400 hover:shadow-lg'
        }`}
      >
        <div className="space-y-1">
          {/* Header Badge */}
          <div className="flex items-center justify-center gap-1">
            {isDeceased ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {lang === 'ur' ? 'مرحوم / متوفی' : 'Deceased'}
              </span>
            ) : isBlockedNode ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                <Ban className="w-3 h-3" />
                <span>{lang === 'ur' ? 'محروم' : 'Blocked'}</span>
              </span>
            ) : (
              <span
                className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-bold border ${
                  category && category.includes('Residuary')
                    ? 'bg-gold-500/20 text-gold-300 border-gold-500/30'
                    : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                }`}
              >
                {fraction || (lang === 'ur' ? 'وارث' : 'Legal Heir')}
              </span>
            )}
          </div>

          {/* Node Title */}
          <p className="text-xs font-extrabold text-slate-100 mt-1">{title}</p>
          {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
        </div>

        {/* Share & Valuation if active heir */}
        {!isDeceased && !isBlockedNode && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-0.5">
            <p className="text-xs font-bold text-emerald-400">
              {percentage}% {fraction ? `(${fraction})` : ''}
            </p>
            {pkr > 0 && (
              <p className="text-[10px] font-semibold text-gold-300">
                {formatPKR(pkr)}
              </p>
            )}
            {count > 1 && (
              <p className="text-[9px] text-slate-400">
                {lang === 'ur' ? `فی کس: ${formatPKR(pkr / count)}` : `Per person: ${formatPKR(pkr / count)}`}
              </p>
            )}
          </div>
        )}

        {isBlockedNode && (
          <div className="mt-2 pt-1 border-t border-slate-800 text-[9px] text-rose-300 font-medium">
            {lang === 'ur' ? 'حجبِ حرمان' : 'Excluded by closer heir'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ur' ? 'شجرۂ وراثت (Family Tree Graph)' : 'Interactive Shajra / Pedigree Tree'}</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1">
            {lang === 'ur'
              ? 'خاندانی شجرہ اور شرعی حصص کی تصویری نقشہ بندی'
              : 'Visual Family Pedigree & Islamic Estate Distribution Graph'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ur'
              ? 'متوفی، والدین، شریک حیات، بہن بھائیوں اور اولاد کے حصص کا شجرہ نسب'
              : 'Interactive pedigree chart showing relationship hierarchies, Quranic shares, and exclusion shields'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>{lang === 'ur' ? 'ذوی الفروض (مقررہ)' : 'Quranic Sharers'}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-gold-400 ml-2"></span>
          <span>{lang === 'ur' ? 'عصبہ (باقی ترکہ)' : 'Residuaries'}</span>
        </div>
      </div>

      {/* Tree Visualization Canvas */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="min-w-[700px] flex flex-col items-center space-y-8">
          
          {/* LEVEL 1: Grandparents (Ancestors) if active */}
          {(dada || dadi || nani || isBlocked('paternalGrandfather') || isBlocked('paternalGrandmother') || isBlocked('maternalGrandmother')) && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ur' ? 'مرحلہ 1: اجداد و جدات (دادا / دادی / نانی)' : 'Tier 1: Grandparents (Ascendants)'}
              </span>
              <div className="flex items-center justify-center gap-4">
                {(dada || isBlocked('paternalGrandfather')) && (
                  <NodeCard
                    title={lang === 'ur' ? 'دادا (Dada)' : 'Paternal Grandfather'}
                    subtitle={lang === 'ur' ? 'باپ کا باپ' : 'Father’s Father'}
                    count={1}
                    fraction={dada?.fractionFormatted}
                    pkr={dada?.totalPkr}
                    percentage={dada?.percentage}
                    category={dada?.category}
                    isBlockedNode={isBlocked('paternalGrandfather')}
                  />
                )}
                {(dadi || isBlocked('paternalGrandmother')) && (
                  <NodeCard
                    title={lang === 'ur' ? 'دادی (Dadi)' : 'Paternal Grandmother'}
                    subtitle={lang === 'ur' ? 'باپ کی ماں' : 'Father’s Mother'}
                    count={1}
                    fraction={dadi?.fractionFormatted}
                    pkr={dadi?.totalPkr}
                    percentage={dadi?.percentage}
                    category={dadi?.category}
                    isBlockedNode={isBlocked('paternalGrandmother')}
                  />
                )}
                {(nani || isBlocked('maternalGrandmother')) && (
                  <NodeCard
                    title={lang === 'ur' ? 'نانی (Nani)' : 'Maternal Grandmother'}
                    subtitle={lang === 'ur' ? 'ماں کی ماں' : 'Mother’s Mother'}
                    count={1}
                    fraction={nani?.fractionFormatted}
                    pkr={nani?.totalPkr}
                    percentage={nani?.percentage}
                    category={nani?.category}
                    isBlockedNode={isBlocked('maternalGrandmother')}
                  />
                )}
              </div>
              <div className="w-0.5 h-6 bg-slate-700"></div>
            </div>
          )}

          {/* LEVEL 2: Parents */}
          {(father || mother || formData.fatherAlive || formData.motherAlive) && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ur' ? 'مرحلہ 2: والدین (ماں اور باپ)' : 'Tier 2: Surviving Parents'}
              </span>
              <div className="flex items-center justify-center gap-6">
                {father && (
                  <NodeCard
                    title={lang === 'ur' ? 'والد صاحب (Father)' : 'Father'}
                    subtitle={father.categoryUr || father.category}
                    count={1}
                    fraction={father.fractionFormatted}
                    pkr={father.totalPkr}
                    percentage={father.percentage}
                    category={father.category}
                  />
                )}
                {mother && (
                  <NodeCard
                    title={lang === 'ur' ? 'والدہ صاحبہ (Mother)' : 'Mother'}
                    subtitle={mother.categoryUr || mother.category}
                    count={1}
                    fraction={mother.fractionFormatted}
                    pkr={mother.totalPkr}
                    percentage={mother.percentage}
                    category={mother.category}
                  />
                )}
              </div>
              <div className="w-0.5 h-6 bg-slate-700"></div>
            </div>
          )}

          {/* LEVEL 3: Deceased Core & Spouse & Siblings */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ur' ? 'مرکزی درجۂ حیات: متوفی، شریکِ حیات و بہن بھائی' : 'Primary Tier: Deceased & Surviving Spouse'}
            </span>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Siblings on left if any */}
              {(brothers || sisters || isBlocked('fullSiblings')) && (
                <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
                  {brothers && (
                    <NodeCard
                      title={lang === 'ur' ? `حقیقی بھائی (${brothers.count})` : `Full Brothers (${brothers.count})`}
                      subtitle={brothers.categoryUr || brothers.category}
                      count={brothers.count}
                      fraction={brothers.fractionFormatted}
                      pkr={brothers.totalPkr}
                      percentage={brothers.percentage}
                      category={brothers.category}
                    />
                  )}
                  {sisters && (
                    <NodeCard
                      title={lang === 'ur' ? `حقیقی بہنیں (${sisters.count})` : `Full Sisters (${sisters.count})`}
                      subtitle={sisters.categoryUr || sisters.category}
                      count={sisters.count}
                      fraction={sisters.fractionFormatted}
                      pkr={sisters.totalPkr}
                      percentage={sisters.percentage}
                      category={sisters.category}
                    />
                  )}
                  {isBlocked('fullSiblings') && (
                    <NodeCard
                      title={lang === 'ur' ? 'بہن بھائی (Siblings)' : 'Full Siblings'}
                      subtitle={lang === 'ur' ? 'محروم' : 'Excluded'}
                      count={1}
                      isBlockedNode={true}
                    />
                  )}
                </div>
              )}

              {/* Deceased Node in Center */}
              <NodeCard
                title={
                  formData.deceasedGender === 'male'
                    ? lang === 'ur'
                      ? 'متوفی (مرد / مرحوم)'
                      : 'Deceased (Male)'
                    : lang === 'ur'
                    ? 'متوفیہ (عورت / مرحومہ)'
                    : 'Deceased (Female)'
                }
                subtitle={lang === 'ur' ? `خالص ترکہ: ${formatPKR(netEstate)}` : `Net Estate: ${formatPKR(netEstate)}`}
                isDeceased={true}
              />

              {/* Surviving Spouse */}
              {wife && (
                <NodeCard
                  title={lang === 'ur' ? wife.nameUr : wife.nameEn}
                  subtitle={wife.categoryUr || wife.category}
                  count={wife.count}
                  fraction={wife.fractionFormatted}
                  pkr={wife.totalPkr}
                  percentage={wife.percentage}
                  category={wife.category}
                />
              )}
              {husband && (
                <NodeCard
                  title={lang === 'ur' ? 'شوہر (Husband)' : 'Husband'}
                  subtitle={husband.categoryUr || husband.category}
                  count={1}
                  fraction={husband.fractionFormatted}
                  pkr={husband.totalPkr}
                  percentage={husband.percentage}
                  category={husband.category}
                />
              )}
            </div>
            <div className="w-0.5 h-6 bg-slate-700"></div>
          </div>

          {/* LEVEL 4: Children (Descendants) */}
          {(sons || daughters) && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ur' ? 'مرحلہ 3: صلبی اولاد (بیٹے اور بیٹیاں - 2:1 تناسب)' : 'Tier 3: Surviving Children (Sons & Daughters)'}
              </span>
              <div className="flex items-center justify-center gap-6">
                {sons && (
                  <NodeCard
                    title={lang === 'ur' ? sons.nameUr : sons.nameEn}
                    subtitle={sons.categoryUr || sons.category}
                    count={sons.count}
                    fraction={sons.fractionFormatted}
                    pkr={sons.totalPkr}
                    percentage={sons.percentage}
                    category={sons.category}
                  />
                )}
                {daughters && (
                  <NodeCard
                    title={lang === 'ur' ? daughters.nameUr : daughters.nameEn}
                    subtitle={daughters.categoryUr || daughters.category}
                    count={daughters.count}
                    fraction={daughters.fractionFormatted}
                    pkr={daughters.totalPkr}
                    percentage={daughters.percentage}
                    category={daughters.category}
                  />
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
