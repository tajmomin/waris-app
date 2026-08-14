import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FamilyInputForm from './components/FamilyInputForm';
import ResultsView from './components/ResultsView';
import PaperworkNavigator from './components/PaperworkNavigator';
import NadraLocator from './components/NadraLocator';
import PrintSummary from './components/PrintSummary';
import DisclaimerFooter from './components/DisclaimerFooter';
import { calculateInheritance } from './utils/inheritanceCalculator';
import { translations } from './translations/translations';
import {
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  Scale,
  ArrowRight,
  Compass,
} from 'lucide-react';

const initialFormData = {
  deceasedGender: 'male',
  wivesCount: 1,
  husband: false,
  sonsCount: 2,
  daughtersCount: 1,
  fatherAlive: false,
  motherAlive: false,
  paternalGrandfatherAlive: false,
  paternalGrandmotherAlive: false,
  maternalGrandmotherAlive: false,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  paternalBrothersCount: 0,
  paternalSistersCount: 0,
  maternalBrothersCount: 0,
  maternalSistersCount: 0,
  grossEstate: 10000000, // 1 Crore PKR default
  funeralExpenses: 50000,
  debts: 0,
  wasiyyah: 0,
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'results' | 'paperwork' | 'locator'
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState(null);

  const t = translations[lang];

  // Perform calculation automatically on mount or when form values change
  useEffect(() => {
    const res = calculateInheritance(formData);
    setResults(res);
  }, [formData]);

  const handleCalculate = () => {
    const res = calculateInheritance(formData);
    setResults(res);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      deceasedGender: 'male',
      wivesCount: 0,
      husband: false,
      sonsCount: 0,
      daughtersCount: 0,
      fatherAlive: false,
      motherAlive: false,
      paternalGrandfatherAlive: false,
      paternalGrandmotherAlive: false,
      maternalGrandmotherAlive: false,
      fullBrothersCount: 0,
      fullSistersCount: 0,
      paternalBrothersCount: 0,
      paternalSistersCount: 0,
      maternalBrothersCount: 0,
      maternalSistersCount: 0,
      grossEstate: '',
      funeralExpenses: '',
      debts: '',
      wasiyyah: '',
    });
  };

  const handleSelectPreset = (presetKey) => {
    if (presetKey === 'standard') {
      setFormData({
        ...initialFormData,
        deceasedGender: 'male',
        wivesCount: 1,
        husband: false,
        sonsCount: 2,
        daughtersCount: 1,
        fatherAlive: false,
        motherAlive: false,
        grossEstate: 10000000,
      });
    } else if (presetKey === 'parents_spouse') {
      setFormData({
        ...initialFormData,
        deceasedGender: 'female',
        wivesCount: 0,
        husband: true,
        sonsCount: 0,
        daughtersCount: 0,
        fatherAlive: true,
        motherAlive: true,
        grossEstate: 6000000,
      });
    } else if (presetKey === 'daughters_brother') {
      setFormData({
        ...initialFormData,
        deceasedGender: 'male',
        wivesCount: 1,
        husband: false,
        sonsCount: 0,
        daughtersCount: 2,
        fatherAlive: false,
        motherAlive: false,
        fullBrothersCount: 1,
        grossEstate: 12000000,
      });
    } else if (presetKey === 'awl') {
      setFormData({
        ...initialFormData,
        deceasedGender: 'female',
        wivesCount: 0,
        husband: true,
        sonsCount: 0,
        daughtersCount: 0,
        fatherAlive: false,
        motherAlive: true,
        fullSistersCount: 2,
        grossEstate: 8000000,
      });
    } else if (presetKey === 'radd') {
      setFormData({
        ...initialFormData,
        deceasedGender: 'male',
        wivesCount: 0,
        husband: false,
        sonsCount: 0,
        daughtersCount: 1,
        fatherAlive: false,
        motherAlive: true,
        grossEstate: 4000000,
      });
    }
    setActiveTab('results');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${
        lang === 'ur' ? 'font-urdu' : 'font-sans'
      }`}
    >
      {/* Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 no-print">
        {/* Hero Banner with Islamic Ornamentation */}
        <div className="glass-panel-emerald p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-glow relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'ur' ? 'علم الفرائض اور انتقال اراضی' : 'Sunni / Hanafi Fara’iz Rules'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'ur' ? (
                <span>
                  وارث — شرعی وراثت اور جائیداد کی قانونی منتقلی کا رہنماء
                </span>
              ) : (
                <span>
                  Waris — Islamic Inheritance & Property Paperwork Navigator
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur'
                ? 'متوفی کے ترکے کی شرعی تقسیم، حسابی گوشوارہ، قریبی نادرا جانشینی سینٹرز، اور صوبائی انتقالِ اراضی کا مستند طریقہ کار۔'
                : 'Calculate precise Islamic estate shares according to classical Hanafi Fara’iz rules, locate nearest NADRA Succession Centers, and navigate provincial mutation (Intiqal) paperwork.'}
            </p>

            {/* Tab Switcher Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'calculator'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t.navCalculator}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'results'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>{t.navResults}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paperwork')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'paperwork'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.navPaperwork}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('locator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'locator'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                <Compass className="w-4 h-4 text-teal-400" />
                <span>{t.navLocator}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <FamilyInputForm
                formData={formData}
                setFormData={setFormData}
                onCalculate={handleCalculate}
                onReset={handleReset}
                lang={lang}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            {/* Quick Live Results Snapshot on Desktop Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span>{lang === 'ur' ? 'فوری خلاصہ:' : 'Live Estate Summary:'}</span>
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {results ? results.status.toUpperCase() : 'CALCULATING'}
                    </span>
                  </div>

                  {results && results.heirsList && results.heirsList.length > 0 ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {results.heirsList.map((h, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-200">
                                {lang === 'ur' ? h.nameUr : h.nameEn}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {h.categoryUr || h.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-emerald-400 block">
                                {h.fractionFormatted} ({h.percentage}%)
                              </span>
                              {h.totalPkr > 0 && (
                                <span className="text-[10px] font-semibold text-gold-400">
                                  Rs. {h.totalPkr.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('results')}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition"
                      >
                        <span>{lang === 'ur' ? 'مکمل چارٹ و تفصیلات دیکھیں' : 'View Full Charts & Tables'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">
                      {lang === 'ur'
                        ? 'ورثاء منتخب کریں تاکہ یہاں فوری خلاصہ نظر آئے'
                        : 'Select heirs in the form to view real-time calculations'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <ResultsView
            results={results}
            lang={lang}
            onNavigateToPaperwork={() => setActiveTab('paperwork')}
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'paperwork' && (
          <PaperworkNavigator lang={lang} onPrint={handlePrint} />
        )}

        {activeTab === 'locator' && <NadraLocator lang={lang} />}
      </main>

      {/* Printable Report View (Visible only during window.print()) */}
      <PrintSummary formData={formData} results={results} lang={lang} />

      {/* Permanent Disclaimer Footer */}
      <DisclaimerFooter lang={lang} />
    </div>
  );
}
