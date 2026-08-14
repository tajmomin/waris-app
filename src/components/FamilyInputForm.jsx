import React, { useState } from 'react';
import {
  User,
  Users,
  Coins,
  HeartHandshake,
  ShieldAlert,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  RotateCcw,
  Info,
} from 'lucide-react';
import { translations } from '../translations/translations';
import { formatPKR, formatPKRWords } from '../utils/inheritanceCalculator';

export default function FamilyInputForm({
  formData,
  setFormData,
  onCalculate,
  onReset,
  lang,
  onSelectPreset,
}) {
  const t = translations[lang];
  const [showDeductions, setShowDeductions] = useState(false);

  // Helper to update form values
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const increment = (field, max = 50) => {
    const curr = Number(formData[field]) || 0;
    if (curr < max) {
      updateField(field, curr + 1);
    }
  };

  const decrement = (field, min = 0) => {
    const curr = Number(formData[field]) || 0;
    if (curr > min) {
      updateField(field, curr - 1);
    }
  };

  // Quick estate setters
  const setQuickEstate = (amount) => {
    updateField('grossEstate', amount);
  };

  // Calculate live net estate preview
  const gross = Math.max(0, Number(formData.grossEstate) || 0);
  const funeral = Math.max(0, Number(formData.funeralExpenses) || 0);
  const debts = Math.max(0, Number(formData.debts) || 0);
  const afterLiabilities = Math.max(0, gross - funeral - debts);
  const maxWasiyyah = afterLiabilities / 3;
  const wasiyyah = Math.min(Math.max(0, Number(formData.wasiyyah) || 0), maxWasiyyah);
  const netPreview = Math.max(0, afterLiabilities - wasiyyah);

  return (
    <div className="space-y-6">
      {/* Quick Test Presets Bar for Easy Demo & Verification */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gold-400">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ur' ? 'فوری جانچ کے لیے خاندانی مثالیں:' : 'Quick Preloaded Test Scenarios:'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {lang === 'ur' ? 'ایک کلک میں فارم بھریں' : 'Click to populate form instantly'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => onSelectPreset('standard')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700/80 transition text-center truncate"
          >
            {t.presetStandard}
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('parents_spouse')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700/80 transition text-center truncate"
          >
            {t.presetParentsSpouse}
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('daughters_brother')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700/80 transition text-center truncate"
          >
            {t.presetDaughtersBrother}
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('awl')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-gold-950/60 text-slate-200 hover:text-gold-300 border border-slate-700/80 transition text-center truncate"
          >
            {t.presetAwlCase}
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('radd')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 border border-slate-700/80 transition text-center truncate"
          >
            {t.presetSingleDaughter}
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="space-y-6"
      >
        {/* Section 1: Deceased & Estate Information */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionDeceased}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'متوفی کی جنس اور کل ترکہ (جائیداد/بینک بیلنس) درج کریں'
                  : 'Specify gender of deceased and total estate valuation'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gender of Deceased */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t.deceasedGenderLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateField('deceasedGender', 'male');
                    updateField('husband', false);
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1.5 ${
                    formData.deceasedGender === 'male'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-glow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold">{lang === 'ur' ? 'مرد (مرحوم)' : 'Male (Deceased)'}</span>
                  <span className="text-[10px] text-slate-400 text-center">
                    {lang === 'ur' ? 'والد / شوہر / بھائی' : 'Father / Husband'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField('deceasedGender', 'female');
                    updateField('wivesCount', 0);
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1.5 ${
                    formData.deceasedGender === 'female'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-glow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold">{lang === 'ur' ? 'عورت (مرحومہ)' : 'Female (Deceased)'}</span>
                  <span className="text-[10px] text-slate-400 text-center">
                    {lang === 'ur' ? 'والدہ / بیوی / بہن' : 'Mother / Wife'}
                  </span>
                </button>
              </div>
            </div>

            {/* Gross Estate Value (PKR) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-gold-400" />
                  {t.grossEstateLabel}
                </label>
                {gross > 0 && (
                  <span className="text-[11px] font-bold text-gold-400">
                    {formatPKRWords(gross, lang)}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.grossEstate || ''}
                  onChange={(e) => updateField('grossEstate', e.target.value)}
                  placeholder={t.grossEstatePlaceholder}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Quick PKR Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setQuickEstate(5000000)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700"
                >
                  {t.quickPkr50L}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(10000000)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700"
                >
                  {t.quickPkr1C}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(30000000)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700"
                >
                  {t.quickPkr3C}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(50000000)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700"
                >
                  {t.quickPkr5C}
                </button>
              </div>
            </div>
          </div>

          {/* Deductions & Liabilities Accordion (Islamic Estate Rights: Tajheez, Duyoon, Wasiyyah) */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowDeductions(!showDeductions)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-emerald-300 transition"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>{t.deductionsHeader}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {lang === 'ur' ? 'کفن دفن، قرض اور وصیت' : 'Burial, Debts & Will'}
                </span>
              </div>
              {showDeductions ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showDeductions && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    {t.funeralLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.funeralExpenses || ''}
                    onChange={(e) => updateField('funeralExpenses', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    {t.debtsLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.debts || ''}
                    onChange={(e) => updateField('debts', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-400">
                      {t.wasiyyahLabel}
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={maxWasiyyah}
                    value={formData.wasiyyah || ''}
                    onChange={(e) => updateField('wasiyyah', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {lang === 'ur'
                      ? `زیادہ سے زیادہ حد: ${formatPKR(maxWasiyyah)}`
                      : `Max 1/3: ${formatPKR(maxWasiyyah)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Net Estate Live Badge */}
            {gross > 0 && (
              <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-xs font-semibold text-emerald-300">
                  {t.netEstateCalculated}
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatPKR(netPreview)}{' '}
                  <span className="text-xs font-normal text-emerald-200">
                    ({formatPKRWords(netPreview, lang)})
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Surviving Spouse */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionSpouse}</h2>
              <p className="text-xs text-slate-400">
                {formData.deceasedGender === 'male'
                  ? lang === 'ur'
                    ? 'متوفی کی بیوہ (یا بیک وقت 4 بیواؤں تک)'
                    : 'Surviving wives (up to 4 wives legally allowed in Islamic law)'
                  : lang === 'ur'
                  ? 'متوفیہ کا شوہر'
                  : 'Surviving husband'}
              </p>
            </div>
          </div>

          {formData.deceasedGender === 'male' ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.wifeCountLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur'
                    ? 'اولاد ہونے پر 1/8، اولاد نہ ہونے پر 1/4 تمام بیواؤں میں برابر تقسیم ہوگا'
                    : 'Fixed 1/8 share if children exist, or 1/4 if no children (shared equally)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement('wivesCount', 0)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-emerald-400">
                  {formData.wivesCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('wivesCount', 4)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.husbandLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur'
                    ? 'اولاد ہونے پر 1/4، اولاد نہ ہونے پر 1/2 مقررہ حصہ'
                    : 'Fixed 1/4 share if children exist, or 1/2 if no children'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateField('husband', !formData.husband)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  formData.husband
                    ? 'bg-emerald-600 text-white shadow-glow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {formData.husband && <Check className="w-3.5 h-3.5" />}
                {formData.husband
                  ? lang === 'ur'
                    ? 'جی ہاں (حیات ہیں)'
                    : 'Yes (Surviving)'
                  : lang === 'ur'
                  ? 'نہیں (وفات پا چکے)'
                  : 'No (Deceased)'}
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Surviving Children (Sons & Daughters) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionChildren}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'بیٹے اور بیٹیاں عصبہ بالغیر کے طور پر 2:1 کے تناسب سے شریک ہوتے ہیں'
                  : 'Sons & daughters inherit as residuaries with 2:1 ratio (Surah An-Nisa 4:11)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sons Counter */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.sonsCountLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur' ? 'عصبہ بالنفس / 2 حصے' : 'Residuary (2 Shares)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement('sonsCount', 0)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-emerald-400">
                  {formData.sonsCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('sonsCount', 20)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Daughters Counter */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.daughtersCountLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur'
                    ? 'اکلوتی 1/2، دو یا زائد 2/3 (اگر بیٹا نہ ہو)'
                    : '1/2 if single, 2/3 if 2+ (or 1 share with brothers)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement('daughtersCount', 0)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-emerald-400">
                  {formData.daughtersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('daughtersCount', 20)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Surviving Parents */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionParents}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'والدین کا مقررہ فرض اولاد ہونے پر 1/6 ہے'
                  : 'Parents receive fixed 1/6 share in presence of children (Surah An-Nisa 4:11)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Father Alive Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.fatherAliveLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur' ? '1/6 فرض یا عصبہ' : '1/6 or Residuary'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateField('fatherAlive', !formData.fatherAlive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  formData.fatherAlive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {formData.fatherAlive && <Check className="w-3 h-3" />}
                {formData.fatherAlive
                  ? lang === 'ur'
                    ? 'حیات ہیں'
                    : 'Alive'
                  : lang === 'ur'
                  ? 'وفات پا چکے'
                  : 'Deceased'}
              </button>
            </div>

            {/* Mother Alive Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.motherAliveLabel}</span>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ur' ? '1/6 (اولاد/بھائی) یا 1/3' : '1/6 (with kids/2+ sibs) or 1/3'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateField('motherAlive', !formData.motherAlive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  formData.motherAlive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {formData.motherAlive && <Check className="w-3 h-3" />}
                {formData.motherAlive
                  ? lang === 'ur'
                    ? 'حیات ہیں'
                    : 'Alive'
                  : lang === 'ur'
                  ? 'وفات پا چکے'
                  : 'Deceased'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Grandparents (Conditional Display / Assistance) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionGrandparents}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'باپ کی موجودگی میں دادا، اور ماں کی موجودگی میں دادی/نانی محروم ہوتے ہیں'
                  : 'Grandfather blocked by father; Grandmothers blocked by mother'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grandfather (Dada) */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                formData.fatherAlive
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">
                  {t.paternalGrandfatherLabel}
                </span>
                <button
                  type="button"
                  disabled={formData.fatherAlive}
                  onClick={() =>
                    updateField('paternalGrandfatherAlive', !formData.paternalGrandfatherAlive)
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    formData.paternalGrandfatherAlive && !formData.fatherAlive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {formData.paternalGrandfatherAlive && !formData.fatherAlive ? 'Yes' : 'No'}
                </button>
              </div>
              {formData.fatherAlive && (
                <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>{lang === 'ur' ? 'والد کی حیات پر محروم' : 'Blocked by Father'}</span>
                </p>
              )}
            </div>

            {/* Paternal Grandmother (Dadi) */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                formData.motherAlive || formData.fatherAlive
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">
                  {t.paternalGrandmotherLabel}
                </span>
                <button
                  type="button"
                  disabled={formData.motherAlive || formData.fatherAlive}
                  onClick={() =>
                    updateField('paternalGrandmotherAlive', !formData.paternalGrandmotherAlive)
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    formData.paternalGrandmotherAlive &&
                    !formData.motherAlive &&
                    !formData.fatherAlive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {formData.paternalGrandmotherAlive &&
                  !formData.motherAlive &&
                  !formData.fatherAlive
                    ? 'Yes'
                    : 'No'}
                </button>
              </div>
              {(formData.motherAlive || formData.fatherAlive) && (
                <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>
                    {lang === 'ur' ? 'والدہ/والد کی حیات پر محروم' : 'Blocked by Mother/Father'}
                  </span>
                </p>
              )}
            </div>

            {/* Maternal Grandmother (Nani) */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                formData.motherAlive
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">
                  {t.maternalGrandmotherLabel}
                </span>
                <button
                  type="button"
                  disabled={formData.motherAlive}
                  onClick={() =>
                    updateField('maternalGrandmotherAlive', !formData.maternalGrandmotherAlive)
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    formData.maternalGrandmotherAlive && !formData.motherAlive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {formData.maternalGrandmotherAlive && !formData.motherAlive ? 'Yes' : 'No'}
                </button>
              </div>
              {formData.motherAlive && (
                <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>{lang === 'ur' ? 'والدہ کی حیات پر محروم' : 'Blocked by Mother'}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Surviving Siblings (Brothers & Sisters) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.sectionSiblings}</h2>
              <p className="text-xs text-slate-400">
                {formData.fatherAlive || formData.sonsCount > 0
                  ? lang === 'ur'
                    ? 'نوٹ: والد یا بیٹے کی موجودگی میں تمام بہن بھائی شرعاً محروم (محجوب) ہوتے ہیں'
                    : 'Notice: Siblings are excluded (blocked) if Father or Son is alive'
                  : lang === 'ur'
                  ? 'حقیقی (سگے)، علاتی (باپ شریک)، اور اخیافی (ماں شریک) بہن بھائی'
                  : 'Full siblings, Paternal siblings (same father), Maternal siblings (same mother)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Brothers */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.fullBrothersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'حقیقی بھائی' : 'Full Brother'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('fullBrothersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.fullBrothersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('fullBrothersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Full Sisters */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.fullSistersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'حقیقی بہن' : 'Full Sister'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('fullSistersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.fullSistersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('fullSistersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Paternal Brothers */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.paternalBrothersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'علاتی بھائی' : 'Paternal Brother'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('paternalBrothersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.paternalBrothersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('paternalBrothersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Paternal Sisters */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.paternalSistersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'علاتی بہن' : 'Paternal Sister'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('paternalSistersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.paternalSistersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('paternalSistersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Maternal Brothers */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.maternalBrothersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'اخیافی بھائی' : 'Maternal Brother'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('maternalBrothersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.maternalBrothersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('maternalBrothersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Maternal Sisters */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.maternalSistersLabel}</span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ur' ? 'اخیافی بہن' : 'Maternal Sister'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => decrement('maternalSistersCount', 0)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-emerald-400">
                  {formData.maternalSistersCount || 0}
                </span>
                <button
                  type="button"
                  onClick={() => increment('maternalSistersCount', 20)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Calculate & Reset */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
          >
            <Calculator className="w-5 h-5" />
            <span>{t.btnCalculate}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>{t.btnReset}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
