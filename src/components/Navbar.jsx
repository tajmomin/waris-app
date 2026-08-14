import React from 'react';
import {
  Scale,
  Languages,
  Printer,
  FileDown,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
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
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-glow border border-emerald-400/30">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-gold-400">
                  {t.appTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  {lang === 'ur' ? 'وارث' : 'Fara’iz Engine'}
                </span>
              </div>
              <p
                className={`text-xs text-slate-400 max-w-md hidden sm:block truncate ${
                  lang === 'ur' ? 'urdu-text text-[11px]' : ''
                }`}
              >
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${lang === 'ur' ? 'urdu-text text-[13px] py-1' : ''}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t.navCalculator}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${lang === 'ur' ? 'urdu-text text-[13px] py-1' : ''}`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              {t.navResults}
            </button>

            <button
              onClick={() => setActiveTab('paperwork')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'paperwork'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${lang === 'ur' ? 'urdu-text text-[13px] py-1' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              {t.navPaperwork}
            </button>
          </nav>

          {/* Right actions: Preset Selector, Print, Lang toggle */}
          <div className="flex items-center gap-2">
            {/* Quick Test Presets Dropdown */}
            <div className="relative group hidden lg:block">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{t.navTestCases}</span>
              </button>
              <div className="absolute right-0 mt-2 w-80 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  {lang === 'ur' ? 'فوری جانچ کے پری سیٹس' : 'Standard Test Scenarios'}
                </div>
                <button
                  onClick={() => onSelectPreset('standard')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.presetStandard}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('parents_spouse')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.presetParentsSpouse}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('daughters_brother')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.presetDaughtersBrother}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('awl')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{t.presetAwlCase}</span>
                </button>
                <button
                  onClick={() => onSelectPreset('radd')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{t.presetSingleDaughter}</span>
                </button>
              </div>
            </div>

            {/* Print / Export Button */}
            <button
              onClick={onPrint}
              title={t.btnPrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t.btnPrint}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow border border-emerald-400/30 flex items-center gap-1.5 transition transform active:scale-95"
            >
              <Languages className="w-4 h-4" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              activeTab === 'calculator' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {lang === 'ur' ? '1. فارم' : '1. Calculator'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              activeTab === 'results' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {lang === 'ur' ? '2. نتائج' : '2. Results'}
          </button>
          <button
            onClick={() => setActiveTab('paperwork')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              activeTab === 'paperwork' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {lang === 'ur' ? '3. انتقالِ اراضی' : '3. Paperwork'}
          </button>
        </div>
      </div>
    </header>
  );
}
