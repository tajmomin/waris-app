import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Scale,
  BookOpen,
  ShieldAlert,
  Compass,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCcw,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

// Comprehensive Pakistani Legal & Shariah Knowledge Base for the AI Engine
const LEGAL_KNOWLEDGE_BASE = [
  {
    keywords: ['aaq', 'disown', 'newspaper', 'عاق', 'محروم', 'وارث سے نکالنا', 'اخبار'],
    responseEn:
      'Under both Islamic Shariah (Hanafi jurisprudence) and Pakistani Statutory Law, publishing an "Aaq-Nama" (عاق نامہ) in newspapers has ZERO legal validity. An estate only opens upon the death of the owner, and mandatory Quranic shares (Fara’iz) cannot be extinguished by any private declaration. Biological children remain full legal heirs regardless of any newspaper ad (Supreme Court precedent: PLD 1991 SC 731).',
    responseUr:
      'اسلامی شریعت اور پاکستانی قانون کے تحت اخبار میں "عاق نامہ" چھپوانے کی کوئی قانونی یا شرعی حیثیت نہیں ہے۔ باپ اپنی زندگی میں کسی جائز اولاد کو شرعی وراثت سے محروم نہیں کر سکتا۔ وفات کے بعد ترکہ خود بخود شرعی ورثاء میں تقسیم ہوتا ہے (سپریم کورٹ فیصلہ: PLD 1991 SC 731)۔',
    citation: 'PLD 1991 SC 731 • Federal Shariat Court Ruling',
  },
  {
    keywords: ['498', 'women', 'sister', 'daughter', 'female', 'behan', 'beti', 'خواتین', 'بہن', 'بیٹی', 'حق بخشوانا', 'محروم'],
    responseEn:
      'Section 498-A of the Pakistan Penal Code (PPC) makes it a severe criminal offense to deprive, deceive, or coerce any female heir (wife, daughter, mother, or sister) out of her rightful inheritance. Punishment is 5 to 10 years of rigorous imprisonment and a fine of up to PKR 1,000,000. Forcing female heirs to "forgo" (Haq Bakhshwana) or sign blank stamp papers is strictly illegal and void ab initio in court (PLD 2017 SC 692).',
    responseUr:
      'دفعہ 498-A مجموعہ تعزیراتِ پاکستان کے تحت کسی بھی خاتون (بیوی، بیٹی، ماں یا بہن) کو وراثت سے محروم کرنا، دھوکہ دینا یا حق بخشوانے پر مجبور کرنا سنگین جرم ہے جس کی سزا 5 سے 10 سال قیدِ بامشقت اور 10 لاکھ روپے تک جرمانہ ہے۔',
    citation: 'Section 498-A PPC • PLD 2017 SC 692',
  },
  {
    keywords: ['nadra', 'succession', 'certificate', 'letter of administration', 'جانشینی', 'سرٹیفکیٹ', 'نادرا'],
    responseEn:
      'Under the Letters of Administration and Succession Certificates Act 2021, legal heirs no longer need to endure years in Civil Courts for undisputed movable/financial assets. NADRA issues Computerized Succession Certificates within 15 to 20 days. Process: (1) Application submission with Death Certificate & FRC, (2) Biometric verification of all heirs, (3) Public notice in 2 newspapers (14 days), and (4) Certificate issuance.',
    responseUr:
      'جانشینی سرٹیفکیٹ ایکٹ 2021 کے تحت نادرا بلا تنازعہ ترکے کے لیے 15 سے 20 دن میں ڈیجیٹل سرٹیفکیٹ جاری کرتا ہے۔ مراحل: (1) ڈیتھ سرٹیفکیٹ و FRC کے ساتھ درخواست، (2) تمام ورثاء کا بائیومیٹرک، (3) قومی اخبارات میں 14 روزہ اشتہار، (4) سرٹیفکیٹ کا اجراء۔',
    citation: 'Letters of Administration & Succession Certificates Act 2021',
  },
  {
    keywords: ['intiqal', 'mutation', 'patwari', 'plra', 'arazi', 'انتقال', 'پٹواری', 'اراضی', 'فرد'],
    responseEn:
      'Land Mutation (Intiqal-e-Wirasat / انتقالِ وراثت) legally updates government revenue records (Fard Malkiat). In Punjab, visit your nearest Tehsil Arazi Record Center (PLRA / ARC). In Sindh, visit Mukhtiarkar / Tapedar. In Urban areas (LDA, KDA, CDA, DHA), visit the respective housing authority for Title Transfer. Documents needed: NADRA Death Certificate, FRC, Succession Certificate/Decree, and Original Title Deed/Registry.',
    responseUr:
      'انتقالِ وراثت کے لیے پنجاب میں تحصیل اراضی ریکارڈ سینٹر (PLRA / ARC)، سندھ میں مختار کار / تپیدار، اور ہاؤسنگ سوسائٹیز (DHA, LDA, CDA) میں متعلقہ دفتر جانا ہوتا ہے۔ ضروری دستاویزات: نادرا ڈیتھ سرٹیفکیٹ، FRC، جانشینی سرٹیفکیٹ اور اصل فرد/رجسٹری۔',
    citation: 'Punjab Land Revenue Act 1967 • Provincial Land Revenue Codes',
  },
  {
    keywords: ['orphan', 'grandchild', 'mflo', 'section 4', 'پوتے', 'یتیم', 'دادا', 'باپ کی زندگی'],
    responseEn:
      'Under classical Hanafi jurisprudence, grandchildren are excluded by living sons (uncles). However, under Section 4 of Pakistan’s Muslim Family Laws Ordinance (MFLO) 1961, orphan grandchildren are statutorily entitled to receive the per-stirpes share their deceased father would have inherited. While legal debates exist, statutory courts uphold Section 4 rights.',
    responseUr:
      'روایتی حنفی فقہ کے مطابق چچا کی موجودگی میں یتیم پوتے محروم ہوتے ہیں، لیکن مسلم عائلی قوانین آرڈیننس 1961 کی دفعہ 4 کے تحت پاکستانی قانون میں یتیم پوتوں کو ان کے والد کا حصہ ملتا ہے۔ تنازعات سے بچنے کے لیے دادا کی جانب سے زندگی میں وصیت یا ہبہ مستحب ہے۔',
    citation: 'Section 4, Muslim Family Laws Ordinance 1961 • PLD 2021 SC 475',
  },
  {
    keywords: ['overseas', 'poa', 'power of attorney', 'embassy', 'بیرون ملک', 'مختار نامہ', 'سفارت خانہ'],
    responseEn:
      'Overseas Pakistani legal heirs who cannot travel to Pakistan can: (1) Execute a Digital Power of Attorney via poa.nadra.gov.pk with video-link interview, OR (2) Visit the nearest Pakistan Embassy / Consulate to record biometric verification directly for the NADRA Succession Certificate application.',
    responseUr:
      'بیرونِ ملک مقیم ورثاء (1) نادرا پورٹل (poa.nadra.gov.pk) کے ذریعے آن لائن ویڈیو تصدیق سے مختار نامہ (PoA) بنوا سکتے ہیں، یا (2) قریبی پاکستانی سفارت خانے کے نادرا ڈیسک پر جا کر جانشینی کے لیے بائیومیٹرک فنگر پرنٹ درج کروا سکتے ہیں۔',
    citation: 'NADRA Digital PoA Rules 2021',
  },
  {
    keywords: ['awl', 'radd', 'عول', 'رد', 'fraction', 'حصص کا زیادہ ہونا'],
    responseEn:
      '• Awl (عول): Occurs when the sum of Quranic fixed shares exceeds 1 (e.g. 8/6). Shares are proportionally reduced across all heirs so total equals 100%.\n• Radd (رد): Occurs when fixed shares do not add up to 1 and there are no agnatic residuaries (Asabah). The surplus residue is returned proportionally to eligible Quranic sharers.',
    responseUr:
      '• مسئلہ عول: جب مقررہ حصوں کا مجموعہ 1 سے بڑھ جائے تو تمام ورثاء کے حصوں میں متناسب کمی کی جاتی ہے۔\n• مسئلہ رد: جب مقررہ حصوں کے بعد ترکہ بچ جائے اور کوئی عصبہ نہ ہو، تو بچ جانے والا ترکہ دوبارہ قرآنی ورثاء میں تقسیم کر دیا جاتا ہے۔',
    citation: 'Classical Hanafi Jurisprudence (Al-Sirajiyyah fil Mirath)',
  },
  {
    keywords: ['funeral', 'debt', 'wasiyyah', 'loan', 'قرض', 'کفن دفن', 'وصیت'],
    responseEn:
      'Islamic estate liabilities must be settled in this strict sequence before heirs receive anything: (1) Funeral & burial expenses (Tajheez o Takfeen), (2) All outstanding debts (Duyoon) including unpaid Mahr and bank loans, (3) Valid Wasiyyah (Bequest) up to 1/3 for non-heirs, and (4) The remaining net estate is divided among legal heirs.',
    responseUr:
      'ترکے کی تقسیم سے قبل لازمی ترتیب: (1) تجہیز و تکفین کے اخراجات، (2) متوفی کے تمام قرضے اور حقِ مہر، (3) غیر ورثاء کے لیے جائز وصیت (زیادہ سے زیادہ ایک تہائی 1/3)، اور (4) خالص ترکے کی ورثاء میں تقسیم۔',
    citation: 'Surah An-Nisa (4:11-12)',
  },
];

export default function WarisLegalChatbot({ formData, results, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      textEn:
        'As-salamu alaykum! I am Waris AI — your Islamic Inheritance Jurisprudence & Pakistani Land Mutation Legal Assistant. How can I assist you today?',
      textUr:
        'السلام علیکم! میں وارث اے آئی ہوں — آپ کا شرعی فرائض اور پاکستانی اراضی و قانونی امور کا معاون۔ میں آپ کی کیا مدد کر سکتا ہوں؟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Process user question against Legal Knowledge Base & active calculation context
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      textEn: query,
      textUr: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedEntry = null;

      // Search knowledge base
      for (const entry of LEGAL_KNOWLEDGE_BASE) {
        if (entry.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))) {
          matchedEntry = entry;
          break;
        }
      }

      let botResponseEn = '';
      let botResponseUr = '';
      let citation = '';

      if (matchedEntry) {
        botResponseEn = matchedEntry.responseEn;
        botResponseUr = matchedEntry.responseUr;
        citation = matchedEntry.citation;
      } else if (lowerQuery.includes('share') || lowerQuery.includes('calculate') || lowerQuery.includes('ترکہ') || lowerQuery.includes('حصہ')) {
        if (results && results.heirsList && results.heirsList.length > 0) {
          const heirsSummary = results.heirsList
            .map((h) => `${h.nameEn} (${h.fractionFormatted} - ${h.percentage}%)`)
            .join(', ');
          botResponseEn = `Based on your current estate calculation of ${formatPKR(results.netEstate)}, the shares are: ${heirsSummary}. All calculations adhere to Sunni Hanafi Fara'iz rules.`;
          botResponseUr = `آپ کے درج کردہ خالص ترکے (${formatPKR(results.netEstate)}) کے مطابق ورثاء کے حصص مقرر کیے جا چکے ہیں۔ آپ نتائج کے ٹیب میں مکمل گوشوارہ دیکھ سکتے ہیں۔`;
          citation = 'Hanafi Fara’iz Engine';
        } else {
          botResponseEn = 'Please enter the family structure in the Calculator tab, and I will compute the exact Islamic shares according to classical Hanafi Fara’iz jurisprudence.';
          botResponseUr = 'براہ کرم کیلکولیٹر میں کوائف درج کریں تاکہ میں شرعی حصص کا درست حساب پیش کر سکوں۔';
        }
      } else {
        botResponseEn = `Under Pakistani law and Hanafi jurisprudence, succession of movable and immovable assets opens strictly upon death. You can obtain a NADRA Succession Certificate within 15 days or file for land mutation (Intiqal) at the Tehsil Arazi Record Center. Is there a specific relative (e.g. wife, daughters, mother, brother) or legal step you would like to know about?`;
        botResponseUr = `پاکستانی قانون اور حنفی فقہ کے تحت ترکے کا قانونی انتقال نادرا جانشینی سرٹیفکیٹ اور اراضی ریکارڈ سینٹر (PLRA / مختار کار) کے ذریعے ہوتا ہے۔ کیا آپ کسی خاص وارث یا قانونی مرحلے کے بارے میں پوچھنا چاہتے ہیں؟`;
        citation = 'General Legal Advisory';
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        textEn: botResponseEn,
        textUr: botResponseUr,
        citation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow-gold border border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-400 ring-2 ring-slate-950"></span>
          </div>
          <span className="hidden sm:inline">
            {lang === 'ur' ? 'وارث اے آئی قانونی معاون' : 'Waris Legal AI Assistant'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30">
            24/7 AI
          </span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50'
              : 'w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-glow border border-emerald-400/30 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-slate-100">
                    {lang === 'ur' ? 'وارث اے آئی قانونی و شرعی رہنماء' : 'Waris AI Legal & Shariah Counsel'}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ur' ? 'حنفی فقہ و ملکی قوانین کا ماہر' : 'Pakistani Succession Law & Hanafi Fara’iz'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            <button
              onClick={() => handleSendMessage('Can a father disown a child through newspaper Aaq-Nama?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[10px] font-semibold shrink-0 transition"
            >
              ⚖️ Aaq-Nama Validity
            </button>
            <button
              onClick={() => handleSendMessage('What is Section 498-A PPC for female inheritance?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[10px] font-semibold shrink-0 transition"
            >
              👩 Section 498A PPC
            </button>
            <button
              onClick={() => handleSendMessage('How to get a NADRA Succession Certificate?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[10px] font-semibold shrink-0 transition"
            >
              📜 NADRA Certificate
            </button>
            <button
              onClick={() => handleSendMessage('How does land mutation Intiqal work in Punjab and Sindh?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[10px] font-semibold shrink-0 transition"
            >
              🌾 Land Intiqal
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">
                    {lang === 'ur' ? msg.textUr || msg.textEn : msg.textEn}
                  </p>

                  {msg.citation && (
                    <div className="pt-1.5 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{msg.citation}</span>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 block text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>{lang === 'ur' ? 'وارث اے آئی جواب تیار کر رہا ہے...' : 'Waris AI is searching jurisprudence & statutes...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={lang === 'ur' ? 'قانون یا شریعت سے متعلق سوال لکھیں...' : 'Ask any legal, NADRA, or inheritance question...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
