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
  ArrowRight,
  ArrowLeft,
  Layers,
  Heart,
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
  const [formStep, setFormStep] = useState(1); // 1: Estate & Deceased, 2: Immediate Family, 3: Extended Family
  const [wizardMode, setWizardMode] = useState(true); // true = Step-by-Step, false = All-in-one
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
      {/* Mode Switcher & Top Steps Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFormStep(1)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              formStep === 1
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? '1. ترکہ و متوفی' : '1. Estate & Deceased'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFormStep(2)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              formStep === 2
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? '2. بیوی / شوہر و اولاد' : '2. Spouse & Children'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFormStep(3)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              formStep === 3
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? '3. والدین و بہن بھائی' : '3. Parents & Siblings'}</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <button
          type="button"
          onClick={() => setWizardMode(!wizardMode)}
          className="text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>
            {wizardMode
              ? lang === 'ur'
                ? 'تمام خانے ایک ساتھ دیکھیں'
                : 'Switch to All-in-One View'
              : lang === 'ur'
              ? 'مرحلہ وار آسان طریقہ اپنائیں'
              : 'Switch to Step-by-Step Wizard'}
          </span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="space-y-6"
      >
        {/* ================= STEP 1: DECEASED & ESTATE ================= */}
        {(formStep === 1 || !wizardMode) && (
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
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

            {/* Gender Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {t.deceasedGenderLabel} <span className="text-emerald-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateField('deceasedGender', 'male');
                    updateField('husband', false);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    formData.deceasedGender === 'male'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                      👨
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">
                        {lang === 'ur' ? 'مرد (مرحوم)' : 'Male (Deceased Father/Husband)'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'ur' ? 'بیوہ، اولاد اور والدین ورثاء ہو سکتے ہیں' : 'Wife, Children, Parents inherit'}
                      </div>
                    </div>
                  </div>
                  {formData.deceasedGender === 'male' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField('deceasedGender', 'female');
                    updateField('wivesCount', 0);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    formData.deceasedGender === 'female'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                      👩
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">
                        {lang === 'ur' ? 'عورت (مرحومہ)' : 'Female (Deceased Mother/Wife)'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'ur' ? 'شوہر، اولاد اور والدین ورثاء ہو سکتے ہیں' : 'Husband, Children, Parents inherit'}
                      </div>
                    </div>
                  </div>
                  {formData.deceasedGender === 'female' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Gross Estate Amount */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {t.grossEstateLabel} <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.grossEstate}
                  onChange={(e) => updateField('grossEstate', e.target.value)}
                  placeholder={t.grossEstatePlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                />
                <Coins className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Quick Pakistani Amounts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">
                  {lang === 'ur' ? 'فوری رقم:' : 'Quick Amounts:'}
                </span>
                <button
                  type="button"
                  onClick={() => setQuickEstate(5000000)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  {t.quickPkr50L}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(10000000)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition font-semibold"
                >
                  {t.quickPkr1C}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(30000000)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  {t.quickPkr3C}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEstate(50000000)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  {t.quickPkr5C}
                </button>
              </div>

              {gross > 0 && (
                <div className="text-xs font-semibold text-gold-400 pt-1">
                  {formatPKR(gross)} ({formatPKRWords(gross, lang)})
                </div>
              )}
            </div>

            {/* Optional Liabilities Accordion */}
            <div className="border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowDeductions(!showDeductions)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-emerald-400 transition py-1"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>{t.deductionsHeader} (تجہیز و تکفین، قرضے، وصیت)</span>
                </span>
                {showDeductions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDeductions && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.funeralLabel}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.funeralExpenses}
                      onChange={(e) => updateField('funeralExpenses', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.debtsLabel}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.debts}
                      onChange={(e) => updateField('debts', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.wasiyyahLabel}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.wasiyyah}
                      onChange={(e) => updateField('wasiyyah', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 1 Next Button in Wizard Mode */}
            {wizardMode && (
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
                >
                  <span>{lang === 'ur' ? 'اگلا مرحلہ: شریکِ حیات و اولاد' : 'Next: Spouse & Children'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: SPOUSE & CHILDREN ================= */}
        {(formStep === 2 || !wizardMode) && (
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
            {/* Section: Surviving Spouse */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">{t.sectionSpouse}</h2>
                  <p className="text-xs text-slate-400">
                    {formData.deceasedGender === 'male'
                      ? lang === 'ur' ? 'حیات بیواؤں کی تعداد منتخب کریں' : 'Select number of surviving wives (0 - 4)'
                      : lang === 'ur' ? 'کیا شوہر حیات ہیں؟' : 'Select if surviving husband is alive'}
                  </p>
                </div>
              </div>

              {formData.deceasedGender === 'male' ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{t.wifeCountLabel}</span>
                    <span className="block text-[11px] text-slate-400">
                      {formData.sonsCount > 0 || formData.daughtersCount > 0
                        ? lang === 'ur' ? 'اولاد کی موجودگی میں بیوہ کا حصہ 1/8 ہے' : '1/8 share in presence of children'
                        : lang === 'ur' ? 'اولاد نہ ہونے پر بیوہ کا حصہ 1/4 ہے' : '1/4 share with no children'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement('wivesCount')}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-emerald-400 text-sm">
                      {formData.wivesCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment('wivesCount', 4)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{t.husbandLabel}</span>
                    <span className="block text-[11px] text-slate-400">
                      {formData.sonsCount > 0 || formData.daughtersCount > 0
                        ? lang === 'ur' ? 'اولاد کی موجودگی میں شوہر کا حصہ 1/4 ہے' : '1/4 share in presence of children'
                        : lang === 'ur' ? 'اولاد نہ ہونے پر شوہر کا حصہ 1/2 ہے' : '1/2 share with no children'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('husband', !formData.husband)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        formData.husband
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {formData.husband ? (lang === 'ur' ? 'حیات ہیں ✓' : 'Alive ✓') : (lang === 'ur' ? 'نہیں' : 'No')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Surviving Children */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">{t.sectionChildren}</h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'ur'
                      ? 'حیات صلبی بیٹوں اور بیٹیوں کی تعداد درج کریں (2:1 تناسب)'
                      : 'Enter surviving sons and daughters (inheriting at 2:1 ratio)'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sons Counter */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{t.sonsCountLabel}</span>
                    <span className="block text-[10px] text-emerald-400 font-semibold">
                      {lang === 'ur' ? 'عصبہ بالنفس / 2 حصے' : 'Primary Residuary (2x share)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement('sonsCount')}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-emerald-400 text-sm">
                      {formData.sonsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment('sonsCount', 20)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Daughters Counter */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{t.daughtersCountLabel}</span>
                    <span className="block text-[10px] text-teal-400 font-semibold">
                      {formData.sonsCount > 0
                        ? lang === 'ur' ? 'بھائی کے ساتھ عصبہ بالغیر (1 حصہ)' : 'Residuary with brother (1x share)'
                        : lang === 'ur' ? 'اکیلی: 1/2 • دو یا زائد: 2/3' : '1 daughter: 1/2 • 2+: 2/3'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement('daughtersCount')}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-emerald-400 text-sm">
                      {formData.daughtersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment('daughtersCount', 20)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Wizard Navigation */}
            {wizardMode && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'پیچھے' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition"
                >
                  <span>{lang === 'ur' ? 'اگلا مرحلہ: والدین و بہن بھائی' : 'Next: Parents & Extended'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: EXTENDED RELATIVES (PARENTS, GRANDPARENTS, SIBLINGS) ================= */}
        {(formStep === 3 || !wizardMode) && (
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
            {/* Parents Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">{t.sectionParents}</h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'ur'
                      ? 'کیا متوفی کے والد یا والدہ حیات ہیں؟'
                      : 'Select if deceased’s mother or father are surviving'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('fatherAlive', !formData.fatherAlive)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    formData.fatherAlive
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-100">{t.fatherAliveLabel}</div>
                    <div className="text-[10px] text-slate-400">
                      {formData.sonsCount > 0
                        ? lang === 'ur' ? '1/6 مقررہ حصہ' : '1/6 Fixed Share'
                        : lang === 'ur' ? '1/6 فرض + باقی ترکہ (عصبہ)' : '1/6 + Residue'}
                    </div>
                  </div>
                  {formData.fatherAlive && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => updateField('motherAlive', !formData.motherAlive)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    formData.motherAlive
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-100">{t.motherAliveLabel}</div>
                    <div className="text-[10px] text-slate-400">
                      {formData.sonsCount > 0 || formData.daughtersCount > 0
                        ? lang === 'ur' ? '1/6 حصہ (اولاد کی موجودگی)' : '1/6 share with children'
                        : lang === 'ur' ? '1/3 حصہ (اولاد نہ ہونے پر)' : '1/3 share without children'}
                    </div>
                  </div>
                  {formData.motherAlive && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Grandparents Section */}
            {(!formData.fatherAlive || !formData.motherAlive) && (
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 block">{t.sectionGrandparents}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {!formData.fatherAlive && (
                    <button
                      type="button"
                      onClick={() => updateField('paternalGrandfatherAlive', !formData.paternalGrandfatherAlive)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        formData.paternalGrandfatherAlive
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t.paternalGrandfatherLabel}: <strong>{formData.paternalGrandfatherAlive ? '✓' : '—'}</strong>
                    </button>
                  )}
                  {!formData.motherAlive && !formData.fatherAlive && (
                    <button
                      type="button"
                      onClick={() => updateField('paternalGrandmotherAlive', !formData.paternalGrandmotherAlive)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        formData.paternalGrandmotherAlive
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t.paternalGrandmotherLabel}: <strong>{formData.paternalGrandmotherAlive ? '✓' : '—'}</strong>
                    </button>
                  )}
                  {!formData.motherAlive && (
                    <button
                      type="button"
                      onClick={() => updateField('maternalGrandmotherAlive', !formData.maternalGrandmotherAlive)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        formData.maternalGrandmotherAlive
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t.maternalGrandmotherLabel}: <strong>{formData.maternalGrandmotherAlive ? '✓' : '—'}</strong>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Siblings Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 block">{t.sectionSiblings}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-200">{t.fullBrothersLabel}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => decrement('fullBrothersCount')}
                      className="w-7 h-7 rounded bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-emerald-400">
                      {formData.fullBrothersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment('fullBrothersCount', 10)}
                      className="w-7 h-7 rounded bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-200">{t.fullSistersLabel}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => decrement('fullSistersCount')}
                      className="w-7 h-7 rounded bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-emerald-400">
                      {formData.fullSistersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment('fullSistersCount', 10)}
                      className="w-7 h-7 rounded bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {t.btnReset}
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow flex items-center gap-2 transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>{t.btnCalculate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
