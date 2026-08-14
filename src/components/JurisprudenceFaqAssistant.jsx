import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
  HelpCircle,
  Gavel,
  ShieldCheck,
} from 'lucide-react';

export const INHERITANCE_FAQS = [
  {
    id: '1',
    category: 'Children & Minors',
    questionEn: 'Can an adopted child inherit from the adoptive parents?',
    questionUr: 'کیا لے پالک (گود لیا ہوا بچہ) شرعی طور پر وراثت پا سکتا ہے؟',
    answerEn:
      'Under Sunni (Hanafi) Islamic law, an adopted child does not inherit as a Quranic or residuary heir because legal lineage (Nasab) remains with biological parents (Surah Al-Ahzab 33:4-5). However, adoptive parents can legally bequeath up to 1/3 (one-third) of their net estate to the adopted child via a valid Wasiyyah (Will) or execute a gift (Hiba) during their lifetime.',
    answerUr:
      'اسلامی شریعت (حنفی فقہ) کے مطابق لے پالک بچہ وارث نہیں بنتا کیونکہ اس کا نسب حیاتیاتی والدین سے جڑا رہتا ہے۔ البتہ، گود لینے والے والدین اپنی زندگی میں ایک تہائی (1/3) تک جائز وصیت یا ہبہ (گفٹ) کے ذریعے جائیداد منتقل کر سکتے ہیں۔',
    citation: 'Surah Al-Ahzab (33:4-5) • Al-Hidayah Vol 4',
  },
  {
    id: '2',
    category: 'Statutory Law vs Shariah',
    questionEn: 'What happens if a son passed away before his father? (Grandchildren Rights)',
    questionUr: 'اگر باپ کی زندگی میں بیٹے کا انتقال ہو جائے تو کیا یتیم پوتوں کو دادا کے ترکے سے حصہ ملے گا؟',
    answerEn:
      'Under classical Hanafi Fara’iz, grandchildren are excluded by surviving living sons. However, under Section 4 of Pakistan’s Muslim Family Laws Ordinance (MFLO) 1961, orphan grandchildren are statutorily entitled to receive the per-stirpes share their deceased father would have inherited. The Supreme Court of Pakistan has addressed various reconciliations on this point, making lifetime Wasiyyah/Hiba highly recommended.',
    answerUr:
      'حنفی فقہ کے روایتی اصول کے مطابق چچا کی موجودگی میں یتیم پوتے محروم ہوتے ہیں۔ تاہم، مسلم عائلی قوانین آرڈیننس 1961 کی دفعہ 4 کے تحت یتیم پوتے اپنے مرحوم باپ کا حصہ پانے کے حقدار ہیں۔ تنازعات سے بچنے کے لیے دادا کی جانب سے زندگی میں وصیت یا ہبہ مستحب ہے۔',
    citation: 'Section 4, Muslim Family Laws Ordinance 1961 • PLD 2021 SC 475',
  },
  {
    id: '3',
    category: 'Disinheritance & Aaq-Nama',
    questionEn: 'Can a father disown a son/daughter via Newspaper Ad (Aaq-Nama)?',
    questionUr: 'کیا اخبار میں عاق نامہ شائع کروانے سے اولاد وراثت سے محروم ہو جاتی ہے؟',
    answerEn:
      'No. Under Islamic Shariah and Pakistani law, publishing an "Aaq-Nama" in newspapers has NO legal validity in disinheriting a biological child from their Islamic inheritance. An estate only opens upon death, and mandatory Quranic shares (Fara’iz) cannot be extinguished by any private declaration.',
    answerUr:
      'ہرگز نہیں۔ اخبار میں عاق نامہ چھپوانے کی کوئی قانونی یا شرعی حیثیت نہیں ہے۔ وفات کے بعد ترکہ خود بخود شرعی ورثاء میں تقسیم ہوتا ہے اور باپ اپنی زندگی میں قرآنی حصص کو ختم نہیں کر سکتا۔',
    citation: 'PLD 1991 SC 731 • Federal Shariat Court Ruling',
  },
  {
    id: '4',
    category: 'Debts & Funeral',
    questionEn: 'In what exact sequence must liabilities be cleared before dividing inheritance?',
    questionUr: 'ترکے کی تقسیم سے قبل واجبات کی ادائیگی کی شرعی ترتیب کیا ہے؟',
    answerEn:
      'The strict Islamic priority sequence is: (1) Reasonable Funeral & Burial Expenses (Tajheez o Takfeen), (2) Settlement of all outstanding Debts (Duyoon) including bank loans and unpaid Mahr, (3) Execution of valid Bequests/Wasiyyah (up to 1/3 of remainder for non-heirs), and (4) Division of the remaining net estate among legal heirs (Fara’iz).',
    answerUr:
      'شرعی ترتیب: (1) تجہیز و تکفین کے اخراجات، (2) متوفی کے تمام قرضہ جات اور غیر ادا شدہ حقِ مہر کی ادائیگی، (3) غیر ورثاء کے لیے جائز وصیت (زیادہ سے زیادہ 1/3)، اور (4) بچ جانے والے خالص ترکے کی ورثاء میں تقسیم۔',
    citation: 'Surah An-Nisa (4:11-12) • Al-Sirajiyyah fil Mirath',
  },
  {
    id: '5',
    category: 'Women Rights',
    questionEn: 'Can family members ask a sister or daughter to "forgo" (Haq Bakhshwana)?',
    questionUr: 'کیا بہنوں یا بیٹیوں سے حق بخشوانا یا وراثت چھوڑنے کا دستخط لینا جائز ہے؟',
    answerEn:
      'Strictly illegal and sinful. Forcing or emotionally pressuring female heirs to surrender their inheritance is a criminal offense in Pakistan under Section 498-A PPC, carrying up to 10 years rigorous imprisonment. Relinquishment before actual estate opening is legally void in the Supreme Court.',
    answerUr:
      'یہ عمل قطعی ناجائز اور قابلِ دست اندازی پولیس جرم ہے۔ دفعہ 498-A تعزیراتِ پاکستان کے تحت خواتین کو وراثت سے محروم کرنے پر 10 سال تک قید اور 10 لاکھ روپے جرمانہ عائد ہوتا ہے۔',
    citation: 'Section 498-A Pakistan Penal Code • PLD 2017 SC 692',
  },
];

export default function JurisprudenceFaqAssistant({ lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('1');

  const filteredFaqs = INHERITANCE_FAQS.filter((faq) => {
    const q = searchQuery.toLowerCase();
    return (
      faq.questionEn.toLowerCase().includes(q) ||
      faq.questionUr.includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ur' ? 'فقہی و قانونی رہنمائی' : 'Islamic Jurisprudence & Legal FAQ'}</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1">
            {lang === 'ur'
              ? 'عام خاندانی تنازعات اور فقہی سوالات کے مدلل جوابات'
              : 'Inheritance Dispute Navigator & Shariah Q&A'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ur'
              ? 'عاق نامہ، یتیم پوتے، لے پالک بچے، اور خواتین کے حقوق سے متعلق معتبر دلائل۔'
              : 'Authoritative answers on contentious cases: orphan grandchildren, Aaq-nama, adoption, and Section 498-A PPC.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={lang === 'ur' ? 'سوال تلاش کریں...' : 'Search legal questions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gold-400 block">
                      {faq.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                      {lang === 'ur' ? faq.questionUr : faq.questionEn}
                    </h4>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-1 bg-slate-950/60 border-t border-slate-800/80 space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>{lang === 'ur' ? faq.answerUr : faq.answerEn}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                    <span>Citation: {faq.citation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
