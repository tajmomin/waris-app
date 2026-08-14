import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Scale,
  CheckCircle2,
  ShieldAlert,
  Gavel,
} from 'lucide-react';
import { formatPKR, formatPKRWords } from '../utils/inheritanceCalculator';

export default function LegalAffidavitModal({
  isOpen,
  onClose,
  formData,
  results,
  lang,
}) {
  if (!isOpen || !results || !results.heirsList) return null;

  const { heirsList, netEstate, grossEstate, status } = results;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 no-print-bg transition-opacity duration-300">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative animate-fade-in-scale">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-20 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-100">
                {lang === 'ur'
                  ? 'باقاعدہ قانونی بیانِ حلفی برائے نادرا و عدالتِ دیوانی'
                  : 'Official Succession Legal Affidavit & Distribution Schedule'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'نادرا جانشینی سرٹیفکیٹ ایکٹ 2021 اور عدالتی تقاضوں کے عین مطابق'
                  : 'Standardized Stamp-Paper Template under NADRA Succession Act 2021'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ur' ? 'پرنٹ / محفوظ کریں' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Legal Affidavit Paper Layout */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-200 bg-slate-950 font-serif leading-relaxed" id="printable-affidavit">
          {/* Stamp Header Graphic */}
          <div className="border-4 border-double border-emerald-800/60 p-6 rounded-2xl bg-slate-900/40 text-center space-y-2">
            <div className="text-xs tracking-widest text-emerald-400 uppercase font-sans font-bold">
              GOVERNMENT OF PAKISTAN • NADRA SUCCESSION FACILITATION
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 font-sans">
              {lang === 'ur'
                ? 'بیانِ حلفی و وراثت نامہ (برائے جانشینی سرٹیفکیٹ)'
                : 'LEGAL AFFIDAVIT & SCHEDULE OF INHERITANCE'}
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Under The Letters of Administration and Succession Certificates Act, 2021
            </p>
          </div>

          {/* Affidavit Body */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p>
              <strong>Date:</strong> {currentDate} | <strong>Jurisdiction:</strong> Pakistan
            </p>

            <p>
              I/We, the legal heirs of the deceased named below, do hereby solemnly affirm and declare on oath as under:
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Gender of Deceased:</span>{' '}
                  <strong className="text-slate-200 uppercase">{formData.deceasedGender}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Total Net Distributable Estate:</span>{' '}
                  <strong className="text-emerald-400">{formatPKR(netEstate)}</strong>
                </div>
              </div>
              <div className="text-slate-400">
                Amount in Words:{' '}
                <span className="text-gold-300 font-semibold">{formatPKRWords(netEstate, lang)}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-100 font-sans pt-2">
              SCHEDULE OF SURVIVING LEGAL HEIRS & SHARIAH SHARES (FARA'IZ):
            </h3>

            {/* Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden font-sans">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Legal Heir Name / Category</th>
                    <th className="py-2.5 px-3">Relationship</th>
                    <th className="py-2.5 px-3">Share (Fraction)</th>
                    <th className="py-2.5 px-3">Percentage</th>
                    <th className="py-2.5 px-3">Total Allocation (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {heirsList.map((heir, idx) => (
                    <tr key={heir.id}>
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        {lang === 'ur' ? heir.nameUr : heir.nameEn}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {lang === 'ur' ? heir.relationUr : heir.relationEn}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{heir.fractionFormatted}</td>
                      <td className="py-2.5 px-3">{heir.percentage}%</td>
                      <td className="py-2.5 px-3 font-bold text-gold-300">{formatPKR(heir.totalPkr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sworn Oath & Section 498A PPC Declaration */}
            <div className="p-4 rounded-xl bg-slate-900 border border-gold-500/30 space-y-2 text-xs font-sans">
              <h4 className="font-bold text-gold-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Statutory Declaration & Compliance with Section 498-A PPC:</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                We solemnly verify that no surviving legal heir (including females, daughters, widows, and minors) has been concealed, excluded, or coerced into relinquishing their rightful Quranic and statutory inheritance. We understand that depriving female heirs constitutes a cognizable criminal offense under Section 498-A of the Pakistan Penal Code, punishable by up to 10 years imprisonment.
              </p>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 font-sans">
              <div className="space-y-4 text-center">
                <div className="border-b border-slate-700 h-12"></div>
                <span className="text-xs text-slate-400 block font-semibold">Deponent / Legal Heir Signature</span>
              </div>
              <div className="space-y-4 text-center">
                <div className="border-b border-slate-700 h-12"></div>
                <span className="text-xs text-slate-400 block font-semibold">Witness 1 (CNIC & Signature)</span>
              </div>
              <div className="space-y-4 text-center">
                <div className="border-b border-slate-700 h-12"></div>
                <span className="text-xs text-slate-400 block font-semibold">Oath Commissioner / NADRA Attestation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
