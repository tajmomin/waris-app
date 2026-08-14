import React from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';
import { formatPKR, formatPKRWords } from '../utils/inheritanceCalculator';

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
    <div className="hidden print:block p-8 bg-white text-slate-900 font-sans space-y-6 max-w-4xl mx-auto">
      {/* Islamic Calligraphy & Header */}
      <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
        <p className="text-base font-serif font-bold text-slate-800">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
          {lang === 'ur' ? 'گوشوارہ تقسیمِ ترکہ و وراثت' : 'Islamic Estate Distribution Certificate'}
        </h1>
        <p className="text-xs text-slate-600">
          {lang === 'ur'
            ? 'فقہ حنفی کے قواعدِ فرائض کے مطابق تخمینہ تقسیمِ وراثت'
            : 'Fara’iz (Sunni/Hanafi Jurisprudence) Valuation & Legal Heirship Summary'}
        </p>
        <p className="text-[11px] text-slate-500 font-medium">
          {lang === 'ur' ? 'تاریخ اجراء:' : 'Generated Date:'} {dateStr}
        </p>
      </div>

      {/* Deceased & Estate Summary Table */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="border border-slate-300 rounded-lg p-3 space-y-1">
          <p className="font-bold text-slate-900 border-b pb-1">
            {lang === 'ur' ? 'متوفی کے کوائف:' : 'Deceased Profile:'}
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'جنس:' : 'Gender:'}</span>{' '}
            <span className="font-semibold">
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
            <span className="font-semibold">{totalHeirsCount}</span>
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'تقسیم کا اصول:' : 'Shariah Mode:'}</span>{' '}
            <span className="font-semibold">
              {status === 'awl'
                ? 'عول (Awl)'
                : status === 'radd'
                ? 'رد (Radd)'
                : 'توزیع عصبہ (Residuary)'}
            </span>
          </p>
        </div>

        <div className="border border-slate-300 rounded-lg p-3 space-y-1">
          <p className="font-bold text-slate-900 border-b pb-1">
            {lang === 'ur' ? 'ترکہ و مالی حسابات:' : 'Estate Valuation:'}
          </p>
          <p>
            <span className="text-slate-500">{lang === 'ur' ? 'کل ترکہ (Gross):' : 'Gross Estate:'}</span>{' '}
            <span className="font-semibold">{formatPKR(grossEstate)}</span>
          </p>
          <p>
            <span className="text-slate-500">
              {lang === 'ur' ? 'کفن دفن + قرضہ + وصیت:' : 'Funeral + Debts + Wasiyyah:'}
            </span>{' '}
            <span className="font-semibold">{formatPKR(funeralExpenses + debts + wasiyyah)}</span>
          </p>
          <p>
            <span className="text-slate-500">
              {lang === 'ur' ? 'خالص تقسیم کے قابل ترکہ:' : 'Net Distributable Estate:'}
            </span>{' '}
            <span className="font-bold text-slate-950">{formatPKR(netEstate)}</span>
          </p>
        </div>
      </div>

      {/* Heirs Shares Table */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 border-b pb-1">
          {lang === 'ur' ? 'ورثاء میں حصص کی شرعی تقسیم:' : 'Legal Heirs Share Breakdown:'}
        </h2>
        <table className="w-full text-left text-xs border border-slate-300">
          <thead className="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th className="p-2 border-r">{lang === 'ur' ? 'وارث' : 'Heir / Group'}</th>
              <th className="p-2 border-r">{lang === 'ur' ? 'تعداد' : 'Count'}</th>
              <th className="p-2 border-r">{lang === 'ur' ? 'شرعی حیثیت' : 'Category'}</th>
              <th className="p-2 border-r">{lang === 'ur' ? 'حصہ (کسر)' : 'Fraction'}</th>
              <th className="p-2 border-r">{lang === 'ur' ? 'فیصد' : 'Percentage'}</th>
              <th className="p-2 border-r">{lang === 'ur' ? 'کل رقم (PKR)' : 'Total PKR'}</th>
              <th className="p-2">{lang === 'ur' ? 'فی کس حصہ' : 'Per Person'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {heirsList.map((heir) => (
              <tr key={heir.id}>
                <td className="p-2 font-bold border-r">
                  {lang === 'ur' ? heir.nameUr : heir.nameEn}
                </td>
                <td className="p-2 border-r">{heir.count}</td>
                <td className="p-2 border-r text-[10px]">
                  {lang === 'ur' ? heir.categoryUr : heir.category}
                </td>
                <td className="p-2 font-bold border-r">{heir.fractionFormatted}</td>
                <td className="p-2 border-r">{heir.percentage}%</td>
                <td className="p-2 font-bold border-r">{formatPKR(heir.totalPkr)}</td>
                <td className="p-2 font-semibold">{formatPKR(heir.perIndividualPkr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blocked Heirs Notice if any */}
      {blockedHeirs && blockedHeirs.length > 0 && (
        <div className="border border-slate-300 rounded-lg p-3 text-xs space-y-1 bg-slate-50">
          <p className="font-bold text-slate-800">
            {lang === 'ur' ? 'محروم ورثاء (حجب حرمان):' : 'Excluded Relatives (Mahjoob):'}
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
            {blockedHeirs.map((b, i) => (
              <li key={i}>
                <span className="font-semibold">{lang === 'ur' ? b.nameUr : b.nameEn}:</span>{' '}
                {lang === 'ur' ? b.reasonUr : b.reasonEn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quranic Verse */}
      <div className="p-3 bg-slate-50 border-l-4 border-slate-900 text-xs space-y-1">
        <p className="font-serif font-bold text-slate-800 text-sm">
          لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالأَقْرَبُونَ مِمَّا قَلَّ مِنْهُ أَوْ كَثُرَ نَصِيبًا مَّفْرُوضًا
        </p>
        <p className="text-[11px] text-slate-600">
          "For men is a share of what parents and close relatives leave, and for women is a share of what parents and close relatives leave, be it little or much — an obligatory share." (Surah An-Nisa 4:7)
        </p>
      </div>

      {/* Official Sign-off & Disclaimer */}
      <div className="pt-4 border-t-2 border-slate-900 text-[10px] text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">
          {lang === 'ur' ? 'قانونی و شرعی تنبیہ:' : 'Legal & Shariah Disclaimer:'}
        </p>
        <p className="leading-relaxed">
          {lang === 'ur'
            ? 'یہ دستاویز اہلِ سنت حنفی فقہ کے مروجہ حسابی اصولوں کے تحت تیار کی گئی ہے اور محض فہم و رہنمائی کے لیے ہے۔ یہ کوئی رسمی عدالتی ڈگری یا شرعی فتویٰ نہیں ہے۔ جائیداد کی سرکاری منتقلی کے لیے نادرا جانشینی سینٹر یا متعلقہ عدالت سے باقاعدہ جانشینی سرٹیفکیٹ حاصل کریں۔'
            : 'This document provides an automated calculation based on classical Hanafi Fara’iz inheritance rules for educational and estimation purposes. It does not replace a formal Fatwa from a Mufti or a decree from a civil court. Obtain an official Succession Certificate from NADRA or the District Court for legal transfers.'}
        </p>
      </div>
    </div>
  );
}
