import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FamilyInputForm from './components/FamilyInputForm';
import ResultsView from './components/ResultsView';
import PaperworkNavigator from './components/PaperworkNavigator';
import NadraLocator from './components/NadraLocator';
import PrintSummary from './components/PrintSummary';
import DisclaimerFooter from './components/DisclaimerFooter';
import WarisLegalChatbot from './components/WarisLegalChatbot';
import { calculateInheritance, formatPKR } from './utils/inheritanceCalculator';
import { translations } from './translations/translations';
import {
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  Scale,
  ArrowRight,
  Compass,
  TreeDeciduous,
  Calculator,
  Globe2,
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
  const [resultsSubTab, setResultsSubTab] = useState('summary'); // 'summary' | 'tree' | 'assets' | 'overseas'
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
    setResultsSubTab('summary');
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResultsSubTab = (subTabKey) => {
    setResultsSubTab(subTabKey);
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
    setResultsSubTab('summary');
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 no-print">
        {/* Sleek Hero Banner */}
        <div className="glass-panel-emerald p-5 sm:p-7 rounded-3xl border border-emerald-500/20 shadow-glow relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-gold-400" />
                  <span>{lang === 'ur' ? 'اہلِ سنت • فقہ حنفی' : 'Sunni / Hanafi Fara’iz Rules'}</span>
                </span>
                <span className="text-xs text-slate-400 font-serif hidden sm:inline">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {lang === 'ur' ? (
                  <span>وارث — اسلامی وراثت اور جائیداد کے قانونی انتقال کا رہنماء</span>
                ) : (
                  <span>Waris — Islamic Inheritance & Property Paperwork Navigator</span>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'ur'
                  ? 'متوفی کے ترکے کی شرعی تقسیم، خاندانی شجرہ، قریبی نادرا جانشینی سینٹرز، اور صوبائی انتقالِ اراضی کا مستند طریقہ کار۔'
                  : 'Calculate precise Islamic estate shares, visualize family pedigree trees, divide physical properties, and locate nearest NADRA Succession Centers.'}
              </p>
            </div>

            {/* Quick Live Net Estate Pill */}
            {results && results.netEstate > 0 && (
              <div className="shrink-0 flex items-center gap-3 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    {lang === 'ur' ? 'خالص ترکہ:' : 'Net Distributable Estate:'}
                  </span>
                  <span className="text-sm sm:text-base font-black text-emerald-400">
                    {formatPKR(results.netEstate)}
                  </span>
                </div>
              </div>
            )}
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

            {/* Quick Live Results Snapshot & Feature Launcher on Desktop Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-4">
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
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
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

                      {/* Feature Launchers */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleOpenResultsSubTab('summary')}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                          <span>{lang === 'ur' ? 'مکمل چارٹ و تفصیلات' : 'View Full Charts & Tables'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenResultsSubTab('tree')}
                            className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1 transition"
                          >
                            <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="truncate">{lang === 'ur' ? 'شجرہ نسب' : 'Family Tree'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenResultsSubTab('assets')}
                            className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1 transition"
                          >
                            <Calculator className="w-3.5 h-3.5 text-gold-400" />
                            <span className="truncate">{lang === 'ur' ? 'مکان و اراضی' : 'Asset Divider'}</span>
                          </button>
                        </div>
                      </div>
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
            formData={formData}
            lang={lang}
            resultsSubTab={resultsSubTab}
            setResultsSubTab={setResultsSubTab}
            onNavigateToPaperwork={() => setActiveTab('paperwork')}
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'paperwork' && (
          <PaperworkNavigator lang={lang} onPrint={handlePrint} />
        )}

        {activeTab === 'locator' && <NadraLocator lang={lang} />}
      </main>

      {/* Floating 24/7 AI Legal & Shariah Counsel Chatbot */}
      <WarisLegalChatbot formData={formData} results={results} lang={lang} />

      {/* Printable Report View (Visible only during window.print()) */}
      <PrintSummary formData={formData} results={results} lang={lang} />

      {/* Permanent Disclaimer Footer */}
      <DisclaimerFooter lang={lang} />
    </div>
  );
}
