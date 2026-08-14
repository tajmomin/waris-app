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
  Maximize2,
  Minimize2,
  RefreshCcw,
} from 'lucide-react';
import { formatPKR } from '../utils/inheritanceCalculator';

export default function WarisLegalChatbot({ formData, results, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text:
        lang === 'ur'
          ? 'السلام علیکم! میں وارث اے آئی قانونی اور شرعی معاون ہوں۔ آپ اسلامی وراثت، نادرا جانشینی سرٹیفکیٹ یا اراضی کے انتقال سے متعلق کچھ بھی پوچھ سکتے ہیں۔'
          : 'As-salamu alaykum! I am Waris AI — your Islamic Inheritance Jurisprudence & Pakistani Legal Assistant. Ask me anything about Fara’iz shares, NADRA certificates, or land mutation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // System Prompt with full domain context & active calculation
  const buildSystemPrompt = () => {
    const estateContext =
      results && results.heirsList && results.heirsList.length > 0
        ? `Current active estate: Net PKR ${results.netEstate}, Status: ${results.status}, Heirs: ${results.heirsList
            .map((h) => `${h.nameEn} (${h.fractionFormatted})`)
            .join(', ')}.`
        : 'No estate calculation active yet.';

    return `You are Waris AI, an expert, polite Islamic Inheritance (Sunni/Hanafi Fara'iz) scholar and Pakistani Succession Law advocate (covering NADRA Succession Certificates Act 2021, Section 498-A PPC against female deprivation, PLRA/Patwari mutation, MFLO Section 4 orphan grandchildren, and Aaq-nama invalidity).
Context: ${estateContext}
Language preference: ${lang === 'ur' ? 'Urdu' : 'English'}.
Guidelines:
1. If the user greets (Hi, Hello, Salam, etc.), greet them warmly and politely.
2. Answer questions concisely, conversationally, and accurately with legal/Shariah basis when relevant.
3. Keep responses clean, well-formatted, and easy to read (max 2-3 short paragraphs).`;
  };

  // Real AI API Call
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Free, high-speed, CORS-friendly Real AI API (Pollinations.ai / OpenAI compatible)
      const systemPrompt = buildSystemPrompt();
      const conversationHistory = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: query },
          ],
          model: 'openai',
          seed: 42,
          temperature: 0.7,
        }),
      });

      let botText = '';
      if (res.ok) {
        botText = await res.text();
      } else {
        throw new Error('API offline');
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      // Natural fallback if external network is slow
      let fallbackText = '';
      const q = query.toLowerCase();

      if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('salam')) {
        fallbackText =
          lang === 'ur'
            ? 'وعلیکم السلام! میں آپ کی کیا مدد کر سکتا ہوں؟ آپ وراثت کی تقسیم، نادرا سرٹیفکیٹ یا اراضی کے انتقال کے بارے میں پوچھ سکتے ہیں۔'
            : 'As-salamu alaykum! How can I help you today? Feel free to ask any question regarding Islamic inheritance, NADRA succession certificates, or property mutation.';
      } else if (q.includes('aaq') || q.includes('disown') || q.includes('عاق')) {
        fallbackText =
          lang === 'ur'
            ? 'اخبار میں عاق نامہ چھپوانے کی کوئی قانونی یا شرعی حیثیت نہیں ہے۔ باپ اپنی زندگی میں کسی جائز اولاد کو شرعی وراثت سے محروم نہیں کر سکتا (سپریم کورٹ فیصلہ: PLD 1991 SC 731)۔'
            : 'Publishing an "Aaq-Nama" in newspapers has ZERO legal validity under Islamic law and Pakistani courts (PLD 1991 SC 731). Biological children cannot be disowned from mandatory Quranic inheritance.';
      } else if (q.includes('498') || q.includes('women') || q.includes('sister') || q.includes('خواتین')) {
        fallbackText =
          lang === 'ur'
            ? 'دفعہ 498-A مجموعہ تعزیراتِ پاکستان کے تحت خواتین (بیوی، بیٹی، بہن، ماں) کو وراثت سے محروم کرنے پر 5 سے 10 سال قید اور 10 لاکھ روپے تک جرمانہ ہے۔'
            : 'Section 498-A of the Pakistan Penal Code penalizes coercing or depriving female heirs with 5 to 10 years imprisonment and up to PKR 1,000,000 fine.';
      } else if (q.includes('nadra') || q.includes('succession') || q.includes('جانشینی')) {
        fallbackText =
          lang === 'ur'
            ? 'نادرا جانشینی سرٹیفکیٹ ایکٹ 2021 کے تحت نادرا 15 سے 20 دن میں سرٹیفکیٹ جاری کرتا ہے۔ اس کے لیے ڈیتھ سرٹیفکیٹ، FRC اور تمام ورثاء کا بائیومیٹرک درکار ہوتا ہے۔'
            : 'Under the Letters of Administration & Succession Certificates Act 2021, NADRA issues digital certificates within 15-20 days following biometric verification of all legal heirs.';
      } else {
        fallbackText =
          lang === 'ur'
            ? 'میں آپ کے سوال کا جائزہ لے رہا ہوں۔ آپ متوفی کے ورثاء، نادرا کے مراحل یا اراضی ریکارڈ سینٹر (انتقالِ اراضی) کے بارے میں مزید تفصیل بتا سکتے ہیں۔'
            : 'Under Pakistani succession law and classical Hanafi Fara’iz, the estate opens strictly upon death. Could you specify which relative or legal procedure you would like to know about?';
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 no-print font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-2xl border border-emerald-400/40 transition transform hover:scale-105 active:scale-95"
        >
          <Bot className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">
            {lang === 'ur' ? 'وارث اے آئی معاون' : 'Waris AI Legal Counsel'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        </button>
      )}

      {/* Modern Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl transition-all duration-200 ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50'
              : 'w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh]'
          }`}
        >
          {/* Clean Header */}
          <div className="p-3.5 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{lang === 'ur' ? 'وارث اے آئی قانونی رہنماء' : 'Waris AI Legal Counsel'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    LIVE AI
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ur' ? 'آن لائن شرعی و قانونی معاون' : 'Islamic Inheritance & Succession Law'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
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

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar text-[10.5px]">
            <button
              onClick={() => handleSendMessage('Can a father disown a child through newspaper Aaq-Nama?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition"
            >
              ⚖️ Aaq-Nama
            </button>
            <button
              onClick={() => handleSendMessage('What is Section 498-A PPC for female inheritance?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition"
            >
              👩 Section 498A
            </button>
            <button
              onClick={() => handleSendMessage('How to get a NADRA Succession Certificate?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition"
            >
              📜 NADRA Steps
            </button>
          </div>

          {/* Stream of Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed text-xs shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1 opacity-70">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{lang === 'ur' ? 'وارث اے آئی سوچ رہا ہے...' : 'Waris AI is generating response...'}</span>
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
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={lang === 'ur' ? 'سوال درج کریں...' : 'Ask any legal or inheritance question...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
