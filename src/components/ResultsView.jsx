import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Coins,
  Users,
  Scale,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Share2,
  Copy,
  Check,
  Globe2,
  TreeDeciduous,
  Calculator,
  Gavel,
  ExternalLink,
} from 'lucide-react';
import { translations } from '../translations/translations';
import { formatPKR, formatPKRWords } from '../utils/inheritanceCalculator';
import FamilyTreeVisualizer from './FamilyTreeVisualizer';
import AssetBreakdownCalculator from './AssetBreakdownCalculator';

// Curated harmonious color palette for Recharts
const COLORS = [
  '#10b981', // emerald
  '#d4a948', // gold
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#84cc16', // lime
];

export default function ResultsView({
  results,
  formData,
  lang,
  resultsSubTab: controlledSubTab,
  setResultsSubTab: setControlledSubTab,
  onNavigateToPaperwork,
  onPrint,
}) {
  const t = translations[lang];
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [localSubTab, setLocalSubTab] = useState('summary'); // 'summary' | 'tree' | 'assets' | 'overseas'
  const [copied, setCopied] = useState(false);

  const resultsSubTab = controlledSubTab !== undefined ? controlledSubTab : localSubTab;
  const setResultsSubTab = setControlledSubTab || setLocalSubTab;

  if (!results || !results.heirsList || results.heirsList.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">
          {lang === 'ur' ? 'کوئی شرعی ورثاء درج نہیں کیے گئے' : 'No Surviving Heirs Selected'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {lang === 'ur'
            ? 'برائے مہربانی بائیں جانب کے فارم میں متوفی کے حیات ورثاء کا انتخاب کریں اور "شرعی حصص کا حساب لگائیں" پر کلک کریں۔'
            : 'Please fill in the family structure form with at least one surviving heir to generate the Islamic estate breakdown.'}
        </p>
      </div>
    );
  }

  const {
    netEstate,
    grossEstate,
    status,
    totalHeirsCount,
    heirsList,
    blockedHeirs,
    auditSteps,
  } = results;

  // Prepare data for Recharts Pie Chart
  const chartData = heirsList.map((heir) => ({
    name: lang === 'ur' ? heir.nameUr : heir.nameEn,
    value: Number(heir.percentage),
    pkr: heir.totalPkr,
    fraction: heir.fractionFormatted,
    category: lang === 'ur' ? heir.categoryUr : heir.category,
  }));

  // Generate WhatsApp Share Text
  const generateShareText = () => {
    if (lang === 'ur') {
      let text = `*وارث (WARIS) — خلاصہ تقسیمِ وراثت و ترکہ*\n`;
      text += `کل قابلِ تقسیم ترکہ: ${formatPKR(netEstate)}\n`;
      text += `کل شرعی ورثاء: ${totalHeirsCount} افراد\n`;
      text += `تقسیم کا اصول: ${
        status === 'awl' ? 'عول (Awl)' : status === 'radd' ? 'رد (Radd)' : 'توزیع عصبہ (Hanafi Faraiz)'
      }\n\n`;
      text += `*حصص کی تفصیل:*\n`;
      heirsList.forEach((h) => {
        text += `• ${h.nameUr}: ${h.fractionFormatted} (${h.percentage}%) = ${formatPKR(h.totalPkr)}${
          h.count > 1 ? ` (فی کس: ${formatPKR(h.perIndividualPkr)})` : ''
        }\n`;
      });
      text += `\n🔗 مکمل وراثت نامہ اور قریبی نادرا مراکز: https://waris-app.vercel.app`;
      return text;
    } else {
      let text = `*WARIS — Islamic Estate Distribution Summary*\n`;
      text += `Net Distributable Estate: ${formatPKR(netEstate)}\n`;
      text += `Total Legal Heirs: ${totalHeirsCount}\n`;
      text += `Jurisprudence: Sunni / Hanafi Fara’iz (${status.toUpperCase()})\n\n`;
      text += `*Breakdown of Shares:*\n`;
      heirsList.forEach((h) => {
        text += `• ${h.nameEn}: ${h.fractionFormatted} (${h.percentage}%) = ${formatPKR(h.totalPkr)}${
          h.count > 1 ? ` (Per person: ${formatPKR(h.perIndividualPkr)})` : ''
        }\n`;
      });
      text += `\n🔗 Full Estate Certificate & NADRA Locator: https://waris-app.vercel.app`;
      return text;
    }
  };

  const handleCopyText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Custom tooltip for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-slate-100">{data.name}</p>
          <p className="text-emerald-400 font-semibold">
            {lang === 'ur' ? 'حصہ:' : 'Share:'} {data.fraction} ({data.value}%)
          </p>
          {data.pkr > 0 && (
            <p className="text-gold-400 font-bold">
              {formatPKR(data.pkr)} ({formatPKRWords(data.pkr, lang)})
            </p>
          )}
          <p className="text-[10px] text-slate-400">{data.category}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Status & Share Actions Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          status === 'awl'
            ? 'glass-panel-gold border-gold-500/30'
            : status === 'radd'
            ? 'glass-panel-emerald border-cyan-500/30'
            : 'glass-panel-emerald border-emerald-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              status === 'awl'
                ? 'bg-gold-600'
                : status === 'radd'
                ? 'bg-cyan-600'
                : 'bg-emerald-600'
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-900/80 text-slate-200 border border-slate-700">
                {status === 'awl'
                  ? 'عول (Awl)'
                  : status === 'radd'
                  ? 'رد (Radd)'
                  : 'توزیع عصبہ (Residue)'}
              </span>
              <h2 className="text-base font-extrabold text-slate-100">
                {status === 'awl'
                  ? t.statusAwl
                  : status === 'radd'
                  ? t.statusRadd
                  : t.statusNormal}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {status === 'awl'
                ? lang === 'ur'
                  ? 'مقررہ حصص کا مجموعہ 100% سے زیادہ ہونے پر تمام ورثاء کے حصوں میں متناسب کمی کی گئی ہے۔'
                  : 'Sum of fixed shares exceeded 100%; shares proportionally adjusted per classical Hanafi jurisprudence.'
                : status === 'radd'
                ? lang === 'ur'
                  ? 'کوئی عصبہ موجود نہ ہونے پر بچ جانے والا ترکہ دیگر قرآنی حصہ داروں پر رد کے اصول کے تحت تقسیم کیا گیا۔'
                  : 'Surplus returned proportionally to Quranic sharers via Radd.'
                : lang === 'ur'
                ? 'مقررہ حصص کی تقسیم کے بعد باقی ماندہ ترکہ عصبہ ورثاء میں تقسیم کیا گیا۔'
                : 'Residue distributed to eligible agnatic heirs (Asabah).'}
            </p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'واٹس ایپ پر بھیجیں' : 'WhatsApp Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
            title="Copy Summary Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'ur' ? 'کاپی ہو گیا!' : 'Copied!') : (lang === 'ur' ? 'کاپی خلاصہ' : 'Copy Text')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAuditTrail(!showAuditTrail)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            <span>{t.btnViewAudit}</span>
            {showAuditTrail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Summary & Chart | Visual Family Tree | Physical Asset Divider | Legal Protections */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          type="button"
          onClick={() => setResultsSubTab('summary')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            resultsSubTab === 'summary'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>{lang === 'ur' ? '1. خلاصہ و چارٹ' : '1. Summary & Donut Chart'}</span>
        </button>

        <button
          type="button"
          onClick={() => setResultsSubTab('tree')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            resultsSubTab === 'tree'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'ur' ? '2. شجرۂ وراثت (Family Tree)' : '2. Visual Shajra Tree'}</span>
        </button>

        <button
          type="button"
          onClick={() => setResultsSubTab('assets')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            resultsSubTab === 'assets'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-gold-300" />
          <span>{lang === 'ur' ? '3. مکان، اراضی و سونا تقسیم کار' : '3. Physical Property Divider'}</span>
        </button>

        <button
          type="button"
          onClick={() => setResultsSubTab('overseas')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            resultsSubTab === 'overseas'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ur' ? '4. بیرونِ ملک ورثاء و دفعہ 498-A' : '4. Overseas Heirs & Legal Rights'}</span>
        </button>
      </div>

      {/* Audit Trail Drawer */}
      {showAuditTrail && (
        <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-3 bg-slate-950/90">
          <div className="flex items-center gap-2 text-xs font-bold text-gold-400 border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4" />
            <span>
              {lang === 'ur'
                ? 'فقہی مراحل اور حسابی دلائل (Asl al-Mas’ala & Fatawa Basis):'
                : 'Step-by-Step Fara’iz Calculation Reasoning (Audit Trail):'}
            </span>
          </div>

          <div className="space-y-3">
            {auditSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
              >
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  {step.title}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'ur' ? step.descUr : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 1: Summary & Chart */}
      {resultsSubTab === 'summary' && (
        <div className="space-y-6">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{t.metricNetEstate}</span>
                <Coins className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-xl font-black text-slate-100">
                {formatPKR(netEstate)}
              </div>
              {netEstate > 0 && (
                <p className="text-[11px] font-semibold text-gold-400 mt-0.5">
                  {formatPKRWords(netEstate, lang)}
                </p>
              )}
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{t.metricTotalHeirs}</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400">
                {totalHeirsCount}{' '}
                <span className="text-xs font-normal text-slate-400">
                  {lang === 'ur' ? 'افراد' : 'Individual Heirs'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {heirsList.length}{' '}
                {lang === 'ur' ? 'وارث زمرے' : 'Inheriting Categories'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>{t.metricCalculationType}</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-base font-bold text-teal-300 truncate">
                {status === 'awl'
                  ? 'عول (Awl)'
                  : status === 'radd'
                  ? 'رد (Radd)'
                  : 'توزیع عصبہ (Residuary)'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'ur' ? 'حنفی اصولِ فرائض' : 'Hanafi Fara’iz Rules'}
              </p>
            </div>
          </div>

          {/* Visual Chart & Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-full flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t.chartTitle}</span>
                </h3>
                <span className="text-[10px] text-slate-400">
                  {lang === 'ur' ? 'حصص کا تناسب' : 'Share Proportions'}
                </span>
              </div>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#0f172a"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {heirsList.map((heir, idx) => (
                  <div
                    key={heir.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100">
                            {lang === 'ur' ? heir.nameUr : heir.nameEn}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {heir.count} {lang === 'ur' ? 'وارث' : 'heir(s)'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lang === 'ur' ? heir.categoryUr : heir.category}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400">
                        {heir.fractionFormatted}{' '}
                        <span className="text-xs text-slate-400">
                          ({heir.percentage}%)
                        </span>
                      </div>
                      {heir.totalPkr > 0 && (
                        <div className="text-xs font-bold text-gold-400">
                          {formatPKR(heir.totalPkr)}
                        </div>
                      )}
                      {heir.count > 1 && heir.totalPkr > 0 && (
                        <div className="text-[10px] text-slate-500">
                          {lang === 'ur' ? 'فی کس:' : 'Per Person:'}{' '}
                          {formatPKR(heir.perIndividualPkr)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Paperwork Bridge Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      {lang === 'ur'
                        ? 'اگلا مرحلہ: زمین، مکان یا بینک اکاؤنٹس کی منتقلی'
                        : 'Next Step: Legal Land Mutation & Bank Transfer'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'ur'
                        ? 'صوبائی پٹواری، اراضی ریکارڈ سینٹر اور نادرا کا طریقہ کار دیکھیں'
                        : 'View real-world paperwork checklist by province'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onNavigateToPaperwork}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1 transition shrink-0"
                >
                  <span>{lang === 'ur' ? 'کاغذی رہنماء' : 'Paperwork Guide'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{t.resultsHeader}</h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ur'
                    ? 'تمام ورثاء کے حصص، قرآنی آیات اور فی کس تقسیم کی مکمل تفصیل'
                    : 'Detailed fractional shares, percentages, and Quranic legal basis per heir'}
                </p>
              </div>

              <button
                type="button"
                onClick={onPrint}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Coins className="w-3.5 h-3.5 text-gold-400" />
                <span>{t.btnPrint}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{t.tableColHeir}</th>
                    <th className="py-3 px-3">{t.tableColRelation}</th>
                    <th className="py-3 px-3">{t.tableColFraction}</th>
                    <th className="py-3 px-3">{t.tableColPercent}</th>
                    <th className="py-3 px-4">{t.tableColTotalPKR}</th>
                    <th className="py-3 px-4">{t.tableColPerIndividual}</th>
                    <th className="py-3 px-4">{t.tableColIslamicBasis}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {heirsList.map((heir) => (
                    <tr
                      key={heir.id}
                      className="hover:bg-slate-900/40 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-100">
                        <div>{lang === 'ur' ? heir.nameUr : heir.nameEn}</div>
                        <div className="text-[10px] font-normal text-slate-400">
                          {heir.count} {lang === 'ur' ? 'وارث' : 'individual(s)'}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {lang === 'ur' ? heir.relationUr : heir.relationEn}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-400 text-sm">
                        {heir.fractionFormatted}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200">
                        {heir.percentage}%
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gold-400">
                        {formatPKR(heir.totalPkr)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-semibold">
                          {formatPKR(heir.perIndividualPkr)}
                        </div>
                        {heir.count > 1 && (
                          <div className="text-[10px] text-slate-500">
                            {heir.perIndividualFraction} ({heir.perIndividualPercentage}%)
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[11px] font-medium text-emerald-300">
                          {heir.quranRef}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                          {lang === 'ur' ? heir.ruleUr : heir.ruleEn}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Family Tree / Shajra-e-Nasab */}
      {resultsSubTab === 'tree' && (
        <FamilyTreeVisualizer
          formData={formData || { deceasedGender: 'male' }}
          results={results}
          lang={lang}
        />
      )}

      {/* VIEW 3: Physical Property & Asset Divider */}
      {resultsSubTab === 'assets' && (
        <AssetBreakdownCalculator results={results} lang={lang} />
      )}

      {/* VIEW 4: Overseas Pakistani Heirs & Legal Rights (Section 498A PPC) */}
      {resultsSubTab === 'overseas' && (
        <div className="space-y-6">
          {/* Section 498A PPC Warning & Female Rights */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-gold-500/30 shadow-glow-gold space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-300">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100">
                  {lang === 'ur'
                    ? 'خواتین کو وراثت سے محروم کرنے پر قانونی سزا (دفعہ 498-A مجموعہ تعزیراتِ پاکستان)'
                    : 'Criminal Liability for Depriving Female Heirs (Section 498A PPC)'}
                </h3>
                <span className="text-xs text-gold-400 font-semibold">
                  {lang === 'ur'
                    ? '10 سال تک قیدِ بامشقت اور 10 لاکھ روپے جرمانہ'
                    : 'Up to 10 Years Rigorous Imprisonment & PKR 1,000,000 Fine'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur'
                ? 'پاکستانی قانون (Section 498A of Pakistan Penal Code) کے تحت کسی بھی بیوہ، بیٹی یا بہن کو فریب، دباؤ، حلف نامہ یا زبردستی دستبرداری کے ذریعے جائیداد کے شرعی حق سے محروم کرنا سنگین ناقابلِ ضمانت جرم ہے۔ سپریم کورٹ آف پاکستان کے تاریخی فیصلوں کے مطابق زبانی یا اسٹامپ پیپر پر دستبرداری (Tamleek / Release Deed) اگر زبردستی لی گئی ہو تو باطل تصور ہوتی ہے۔'
                : 'Under Section 498A of the Pakistan Penal Code (PPC), coercing or deceitfully depriving any female heir (wife, daughter, mother, or sister) of her legal inheritance is a non-bailable criminal offense punishable with 5 to 10 years imprisonment. The Supreme Court of Pakistan has consistently ruled that coercive relinquishment or sham compromise deeds are void ab initio.'}
            </p>
          </div>

          {/* Overseas Pakistani Succession Guide */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100">
                  {lang === 'ur'
                    ? 'بیرونِ ملک مقیم ورثاء (Overseas Pakistanis) کا بائیومیٹرک طریقہ کار'
                    : 'Succession Protocol for Overseas Pakistani Legal Heirs'}
                </h3>
                <span className="text-xs text-teal-400 font-semibold">
                  {lang === 'ur' ? 'نادرا ڈیجیٹل پاور آف اٹارنی اور سفارت خانہ تصدیق' : 'Digital Power of Attorney & Foreign Mission Attestation'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-100">
                  {lang === 'ur' ? '1. نادرا آن لائن پاور آف اٹارنی پورٹل:' : '1. NADRA Digital Power of Attorney (PoA):'}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'ur'
                    ? 'اگر کوئی وارث پاکستان میں موجود نہیں ہے، تو وہ نادرا کے پورٹل پر آن لائن بائیومیٹرک اور ویڈیو تصدیق کے ذریعے پاکستان میں موجود اپنے کسی بھی رشتہ دار یا وکیل کو مختار نامہ (Power of Attorney) تفویض کر سکتا ہے۔'
                    : 'Overseas heirs who cannot travel to Pakistan can execute a legal Digital Power of Attorney online via NADRA’s portal with video link interview and digital fingerprint verification.'}
                </p>
                <a
                  href="https://poa.nadra.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline pt-1"
                >
                  <span>poa.nadra.gov.pk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-100">
                  {lang === 'ur' ? '2. سفارت خانے / قونصل خانے میں بائیومیٹرک:' : '2. Embassy / Consulate Biometrics:'}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'ur'
                    ? 'سکسیشن ایکٹ 2021 کے تحت، بیرونِ ملک پاکستانی کسی بھی قریبی پاکستانی سفارت خانے یا قونصل خانے کے نادra ڈیسک پر جا کر جانشینی درخواست کے لیے اپنا فنگر پرنٹ بائیومیٹرک درج کروا سکتے ہیں۔'
                    : 'Under the Letters of Administration & Succession Certificates Act 2021, overseas legal heirs can record their formal biometric verification at NADRA desks in Pakistan Embassies / Consulates worldwide without traveling to Pakistan.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Heirs Notice (If any) */}
      {blockedHeirs && blockedHeirs.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>{t.blockedTitle}</span>
          </div>
          <p className="text-xs text-slate-300">{t.blockedDesc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {blockedHeirs.map((blocked, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs space-y-1"
              >
                <span className="font-bold text-amber-300">
                  {lang === 'ur' ? blocked.nameUr : blocked.nameEn}
                </span>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ur' ? blocked.reasonUr : blocked.reasonEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
