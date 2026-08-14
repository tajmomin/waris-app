import React from 'react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function PrintSummary({ formData, results, lang }) {
  if (!results || !results.heirsList) return null;

  const {
    netEstate,
    grossEstate,
    funeralExpenses,
    debts,
    wasiyyah,
    status,
    totalHeirsCount,
    heirsList,
    blockedHeirs,
  } = results;

  const dateStr = new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="hidden print:block print-only-container text-slate-900 font-sans space-y-4 max-w-4xl mx-auto py-2">
      {/* Islamic Calligraphy & Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3 print-avoid-break">
        <p className="text-sm font-serif font-bold text-slate-800 tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
          {lang === 'ur' ? 'گوشوارہ تقسیمِ ترکہ و وراثت' : 'Islamic Estate Distribution Certificate'}
        </h1>
        <p className="text-[11px] text-slate-600 font-medium">
          {lang === 'ur'
            ? 'فقہ حنفی کے قواعدِ فرائض کے مطابق تخمینہ تقسیمِ وراثت • وارث (Waris)'
            : 'Fara’iz (Sunni/Hanafi Jurisprudence) Valuation & Legal Heirship Summary • Waris'}
        </p>
        <p className="text-[10px] text-slate-500">
          {lang === 'ur' ? 'تاریخ اجراء:' : 'Generated Date:'} {dateStr}
        </p>
      </div>

      {/* Deceased & Estate Summary Table */}
      <div className="grid grid-cols-2 gap-3 text-[11px] print-avoid-break">
        <div className="border border-slate-300 rounded-lg p-2.5 space-y-0.5 bg-slate-50/50">
          <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">
            {lang === 'ur' ? 'متوفی کے کوائف:' : 'Deceased Profile:'}
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'جنس:' : 'Gender:'}</span>{' '}
            <span className="font-semibold text-slate-900">
              {formData.deceasedGender === 'male'
                ? lang === 'ur'
                  ? 'مرد (مرحوم)'
                  : 'Male (Deceased)'
                : lang === 'ur'
                ? 'عورت (مرحومہ)'
                : 'Female (Deceased)'}
            </span>
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'کل شرعی ورثاء:' : 'Total Legal Heirs:'}</span>{' '}
            <span className="font-semibold text-slate-900">{totalHeirsCount}</span>
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'تقسیم کا اصول:' : 'Shariah Mode:'}</span>{' '}
            <span className="font-semibold text-slate-900">
              {status === 'awl'
                ? 'عول (Awl)'
                : status === 'radd'
                ? 'رد (Radd)'
                : 'توزیع عصبہ (Residuary)'}
            </span>
          </p>
        </div>

        <div className="border border-slate-300 rounded-lg p-2.5 space-y-0.5 bg-slate-50/50">
          <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">
            {lang === 'ur' ? 'ترکہ و مالی حسابات:' : 'Estate Valuation:'}
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'کل ترکہ (Gross):' : 'Gross Estate:'}</span>{' '}
            <span className="font-semibold text-slate-900">{formatPKR(grossEstate)}</span>
          </p>
          <p>
            <span className="text-slate-500">
              {lang === 'ur' ? 'کفن دفن + قرض + وصیت:' : 'Funeral + Debts + Wasiyyah:'}
            </span>{' '}
            <span className="font-semibold text-slate-900">
              {formatPKR(funeralExpenses + debts + wasiyyah)}
            </span>
          </p>
          <p>
            <span className="text-slate-500">
              {lang === 'ur' ? 'خالص قابلِ تقسیم ترکہ:' : 'Net Distributable Estate:'}
            </span>{' '}
            <span className="font-bold text-slate-950">{formatPKR(netEstate)}</span>
          </p>
        </div>
      </div>

      {/* Heirs Shares Table */}
      <div className="space-y-1.5 print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5">
          {lang === 'ur' ? 'ورثاء میں حصص کی شرعی تقسیم:' : 'Legal Heirs Share Breakdown:'}
        </h2>
        <table className="w-full text-left text-[10.5px] border border-slate-300">
          <thead className="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th className="p-1.5 border-r border-slate-300">{lang === 'ur' ? 'وارث' : 'Heir / Group'}</th>
              <th className="p-1.5 border-r border-slate-300 text-center">{lang === 'ur' ? 'تعداد' : 'Count'}</th>
              <th className="p-1.5 border-r border-slate-300">{lang === 'ur' ? 'شرعی حیثیت' : 'Category'}</th>
              <th className="p-1.5 border-r border-slate-300 text-center">{lang === 'ur' ? 'حصہ (کسر)' : 'Fraction'}</th>
              <th className="p-1.5 border-r border-slate-300 text-center">{lang === 'ur' ? 'فیصد' : 'Percentage'}</th>
              <th className="p-1.5 border-r border-slate-300 text-right">{lang === 'ur' ? 'کل رقم (PKR)' : 'Total PKR'}</th>
              <th className="p-1.5 text-right">{lang === 'ur' ? 'فی کس حصہ' : 'Per Person'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {heirsList.map((heir) => (
              <tr key={heir.id} className="hover:bg-slate-50">
                <td className="p-1.5 font-bold border-r border-slate-300">
                  {lang === 'ur' ? heir.nameUr : heir.nameEn}
                </td>
                <td className="p-1.5 text-center border-r border-slate-300">{heir.count}</td>
                <td className="p-1.5 border-r border-slate-300 text-[9.5px] text-slate-700">
                  {lang === 'ur' ? heir.categoryUr : heir.category}
                </td>
                <td className="p-1.5 font-bold text-center border-r border-slate-300 text-emerald-800">
                  {heir.fractionFormatted}
                </td>
                <td className="p-1.5 text-center border-r border-slate-300 font-semibold">{heir.percentage}%</td>
                <td className="p-1.5 text-right font-bold border-r border-slate-300">{formatPKR(heir.totalPkr)}</td>
                <td className="p-1.5 text-right font-semibold text-slate-800">
                  {formatPKR(heir.perIndividualPkr)}
                  {heir.count > 1 && (
                    <span className="block text-[9px] text-slate-500 font-normal">
                      ({heir.perIndividualFraction})
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blocked Heirs Notice if any */}
      {blockedHeirs && blockedHeirs.length > 0 && (
        <div className="border border-slate-300 rounded-lg p-2 text-[10px] space-y-0.5 bg-slate-50/70 print-avoid-break">
          <p className="font-bold text-slate-800">
            {lang === 'ur' ? 'محروم ورثاء (حجب حرمان):' : 'Excluded Relatives (Mahjoob):'}
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
            {blockedHeirs.map((b, i) => (
              <li key={i}>
                <span className="font-semibold text-slate-700">{lang === 'ur' ? b.nameUr : b.nameEn}:</span>{' '}
                {lang === 'ur' ? b.reasonUr : b.reasonEn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quranic Verse */}
      <div className="p-2.5 bg-slate-50 border-l-4 border-emerald-700 text-[10px] space-y-0.5 print-avoid-break">
        <p className="font-serif font-bold text-slate-900 text-xs">
          لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالأَقْرَبُونَ مِمَّا قَلَّ مِنْهُ أَوْ كَثُرَ نَصِيبًا مَّفْرُوضًا
        </p>
        <p className="text-[9.5px] text-slate-600 italic">
          "For men is a share of what parents and close relatives leave, and for women is a share of what parents and close relatives leave, be it little or much — an obligatory share." (Surah An-Nisa 4:7)
        </p>
      </div>

      {/* Official Sign-off & Disclaimer */}
      <div className="pt-2 border-t border-slate-900 text-[9px] text-slate-500 space-y-1 print-avoid-break">
        <p className="font-semibold text-slate-700">
          {lang === 'ur' ? 'قانونی و شرعی تنبیہ:' : 'Legal & Shariah Disclaimer:'}
        </p>
        <p className="leading-tight">
          {lang === 'ur'
            ? 'یہ دستاویز اہلِ سنت حنفی فقہ کے مروجہ حسابی اصولوں کے تحت تیار کی گئی ہے اور محض فہم و رہنمائی کے لیے ہے۔ یہ کوئی رسمی عدالتی ڈگری یا شرعی فتویٰ نہیں ہے۔ جائیداد کی سرکاری منتقلی کے لیے نادرا جانشینی سینٹر یا متعلقہ عدالت سے باقاعدہ جانشینی سرٹیفکیٹ حاصل کریں۔'
            : 'This document provides an automated calculation based on classical Hanafi Fara’iz inheritance rules for educational and estimation purposes. It does not replace a formal Fatwa from a Mufti or a decree from a civil court. Obtain an official Succession Certificate from NADRA or the District Court for legal transfers.'}
        </p>
      </div>
    </div>
  );
}
