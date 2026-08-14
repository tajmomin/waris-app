import React from 'react';
import { ShieldAlert, BookOpen, Scale, ExternalLink } from 'lucide-react';
import { translations } from '../translations/translations';

export default function DisclaimerFooter({ lang }) {
  const t = translations[lang];

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 text-slate-400 no-print">
      {/* Permanent Non-Dismissible Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-y border-amber-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {t.legalDisclaimerHeader}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.legalDisclaimerBody}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-slate-100 tracking-tight">
                {t.appTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ur'
                ? 'پاکستانی شہریوں اور خاندانوں کی سہولت کے لیے وقف ایک مکمل آزاد، اوپن سورس اور مفت پلیٹ فارم تاکہ وہ اپنے مرحومین کے ترکے کی شرعی تقسیم اور سرکاری انتقال اراضی کے مراحل کو آسانی سے سمجھ سکیں۔'
                : 'A free, client-side open web application helping Pakistani families navigate Islamic inheritance shares and provincial land mutation paperwork transparently.'}
            </p>
          </div>

          {/* Canonical Islamic References */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ur' ? 'شرعی و فقہی حوالہ جات' : 'Shariah & Legal References'}</span>
            </h5>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• Holy Quran: Surah An-Nisa (4:7, 4:11, 4:12, 4:176)</li>
              <li>• Al-Sirajiyyah fi al-Fara’id (Imam Siraj al-Din al-Sajawandi)</li>
              <li>• Letters of Administration & Succession Act 2021 (NADRA)</li>
              <li>• West Pakistan Land Revenue Act 1967 (Mutation / Intiqal)</li>
              <li>• Succession Act 1925 (Movable Estate Administration)</li>
            </ul>
          </div>

          {/* Privacy & Technical Info */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider">
              {lang === 'ur' ? 'پرائیویسی و رازداری' : '100% Client-Side & Private'}
            </h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lang === 'ur'
                ? 'تمام حسابی عمل براہ راست آپ کے براؤزر کے اندر انجام پاتا ہے۔ آپ کے خاندان یا مالیاتی ترکے کا کوئی بھی ڈیٹا کسی سرور پر محفوظ یا منتقل نہیں کیا جاتا۔'
                : 'All calculation algorithms execute purely inside your web browser. No family details or financial amounts are stored or transmitted to external servers.'}
            </p>
            <p className="text-[11px] text-emerald-400 font-medium pt-2">
              © {new Date().getFullYear()} Waris (وارث) • Designed for Pakistan 🇵🇰
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
