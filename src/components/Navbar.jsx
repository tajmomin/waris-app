import React from 'react';
import {
  Scale,
  Languages,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { translations } from '../translations/translations';

export default function Navbar({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  onSelectPreset,
  onPrint,
}) {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-lg backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => setActiveTab('calculator')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-glow border border-emerald-400/30 shrink-0">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-gold-400">
                  {t.appTitle}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  {lang === 'ur' ? 'وارث' : 'Fara’iz'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate leading-tight">
                {lang === 'ur'
                  ? 'اسلامی وراثت اور قانونی انتقال کا رہنماء'
                  : 'Islamic Inheritance & Land Navigator'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t.navCalculator}</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'results'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{t.navResults}</span>
            </button>

            <button
              onClick={() => setActiveTab('paperwork')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'paperwork'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.navPaperwork}</span>
            </button>

            <button
              onClick={() => setActiveTab('locator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'locator'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.navLocator}</span>
            </button>
          </nav>

          {/* Right Actions: Test Presets, Print, Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Test Presets Dropdown */}
            <div className="relative group hidden sm:block">
              <button className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-1 transition">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden lg:inline">{t.navTestCases}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              <div className="absolute right-0 mt-1.5 w-72 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  {lang === 'ur' ? 'فوری جانچ کے پری سیٹس' : 'Quick Test Scenarios'}
                </div>
                <button
                  onClick={() => onSelectPreset('standard')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{t.presetStandard}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('parents_spouse')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{t.presetParentsSpouse}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('daughters_brother')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{t.presetDaughtersBrother}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('awl')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span className="truncate">{t.presetAwlCase}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('radd')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{t.presetSingleDaughter}</span>
                </button>
              </div>
            </div>

            {/* Print Button */}
            <button
              onClick={onPrint}
              title={t.btnPrint}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{t.btnPrint}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow border border-emerald-400/30 flex items-center gap-1.5 transition transform active:scale-95"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (Fixed bottom / compact top bar) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 ${
              activeTab === 'calculator' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {t.navCalculator}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 ${
              activeTab === 'results' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {t.navResults}
          </button>
          <button
            onClick={() => setActiveTab('paperwork')}
            className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 ${
              activeTab === 'paperwork' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {t.navPaperwork}
          </button>
          <button
            onClick={() => setActiveTab('locator')}
            className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 ${
              activeTab === 'locator' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {t.navLocator}
          </button>
        </div>
      </div>
    </header>
  );
}
