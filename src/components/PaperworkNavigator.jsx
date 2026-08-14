import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  FileText,
  Landmark,
  Car,
  Briefcase,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  provinces,
  commonChecklistItems,
  provinceProcedures,
  movableAssetsGuide,
} from '../data/paperworkData';
import { translations } from '../translations/translations';

export default function PaperworkNavigator({ lang, onPrint }) {
  const t = translations[lang];
  const [selectedProvinceId, setSelectedProvinceId] = useState('punjab');
  const [activeSubTab, setActiveSubTab] = useState('steps'); // 'steps' | 'movable'
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (docId) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const totalDocs = commonChecklistItems.length;
  const readyDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const readinessPercentage = Math.round((readyDocsCount / totalDocs) * 100);

  const currentProvinceData = provinceProcedures[selectedProvinceId] || provinceProcedures.punjab;
  const currentProvinceObj = provinces.find((p) => p.id === selectedProvinceId) || provinces[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-emerald p-6 rounded-3xl border border-emerald-500/20 shadow-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {lang === 'ur' ? 'پاکستانی قوانین و اراضی ایکٹ' : 'Pakistani Land Laws & NADRA Act 2021'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-2">
              {t.paperworkTitle}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {t.paperworkSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2 transition self-start sm:self-center shrink-0"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t.btnPrint}</span>
          </button>
        </div>
      </div>

      {/* Interactive Document Readiness Tracker */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.checklistProgress}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'انتقالِ وراثت کی کارروائی شروع کرنے سے پہلے ضروری کاغذات پر ٹک لگائیں'
                : 'Check off the documents your family has assembled so far'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-emerald-400">
              {readinessPercentage}% {lang === 'ur' ? 'تیار' : 'Ready'}
            </span>
            <span className="text-xs text-slate-400 block">
              {readyDocsCount} / {totalDocs} {t.docsChecked}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-gold-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${readinessPercentage}%` }}
          />
        </div>

        {/* Document Checkboxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {commonChecklistItems.map((item) => {
            const isChecked = !!checkedDocs[item.id];
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => toggleDoc(item.id)}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-100'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-bold block ${
                      isChecked ? 'text-emerald-300' : 'text-slate-200'
                    }`}
                  >
                    {lang === 'ur' ? item.nameUr : item.nameEn}
                  </span>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {lang === 'ur' ? item.descriptionUr : item.descriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs: Provincial Mutation vs Movable Assets */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('steps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'steps'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.provincialStepsTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('movable')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'movable'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>{t.movableTab}</span>
        </button>
      </div>

      {activeSubTab === 'steps' ? (
        <div className="space-y-6">
          {/* Province Selector Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>{t.selectProvince}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {provinces.map((prov) => (
                <button
                  type="button"
                  key={prov.id}
                  onClick={() => setSelectedProvinceId(prov.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center flex flex-col items-center justify-center gap-1 ${
                    selectedProvinceId === prov.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'ur' ? prov.nameUr : prov.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Province Summary Header */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                {lang === 'ur' ? currentProvinceObj.nameUr : currentProvinceObj.nameEn}
              </span>
              <h3 className="text-base font-extrabold text-slate-100">
                {lang === 'ur' ? currentProvinceData.titleUr : currentProvinceData.titleEn}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ur' ? currentProvinceData.summaryUr : currentProvinceData.summaryEn}
            </p>
          </div>

          {/* Step-by-Step Procedure Cards */}
          <div className="space-y-4">
            {currentProvinceData.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition space-y-4 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-xs flex items-center justify-center shadow-md shrink-0">
                      {step.stepNumber}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">
                      {lang === 'ur' ? step.titleUr : step.titleEn}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{lang === 'ur' ? step.timelineUr : step.timelineEn}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Step Description */}
                  <div className="md:col-span-8 space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ur' ? step.detailsUr : step.detailsEn}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {t.locationOffice}: {lang === 'ur' ? step.officeUr : step.officeEn}
                      </span>
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="md:col-span-4 p-3 rounded-xl bg-gold-950/20 border border-gold-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-gold-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {t.proTip}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      {lang === 'ur' ? step.tipsUr : step.tipsEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Movable Assets Guide Tab */
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30">
                {lang === 'ur' ? 'منقولہ جائیداد کی قانونی تفصیل' : 'Succession Act 1925 & NADRA Act 2021'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {lang === 'ur' ? movableAssetsGuide.titleUr : movableAssetsGuide.titleEn}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ur' ? movableAssetsGuide.descriptionUr : movableAssetsGuide.descriptionEn}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {movableAssetsGuide.categories.map((cat, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    {idx === 0 ? (
                      <Landmark className="w-4 h-4" />
                    ) : idx === 1 ? (
                      <Car className="w-4 h-4" />
                    ) : idx === 2 ? (
                      <Briefcase className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {lang === 'ur' ? cat.nameUr : cat.nameEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {lang === 'ur' ? cat.requirementsUr : cat.requirementsEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
