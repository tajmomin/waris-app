import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Scale,
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
          ? 'السلام علیکم! میں وارث اے آئی قانونی اور شرعی مشیر ہوں۔ آپ اسلامی وراثت، نادرا جانشینی سرٹیفکیٹ یا اراضی کے انتقال سے متعلق کوئی بھی سوال پوچھ سکتے ہیں۔'
          : 'As-salamu alaykum! I am Waris AI — an AI Legal & Shariah Counsel powered by real-time LLM inference. Ask me any question about Fara’iz shares, NADRA succession, or land mutation.',
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

  // Real LLM API Inference Call
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
      const activeEstate =
        results && results.heirsList && results.heirsList.length > 0
          ? `Active User Estate: Net PKR ${results.netEstate}, Status: ${results.status}, Heirs: ${results.heirsList
              .map((h) => `${h.nameEn} (${h.fractionFormatted})`)
              .join(', ')}.`
          : 'No calculation entered yet.';

      const promptContext = `You are Waris AI, a world-class Islamic Inheritance Jurisprudence (Sunni/Hanafi Fara'iz) scholar and Pakistani Succession Law advocate (familiar with NADRA Succession Act 2021, Section 498-A PPC, PLRA Land Revenue mutation, and Supreme Court of Pakistan rulings).
Context: ${activeEstate}
User Language: ${lang === 'ur' ? 'Urdu' : 'English'}.
User Message: "${query}"

Respond concisely, accurately, and naturally in 1-3 short paragraphs in ${lang === 'ur' ? 'Urdu' : 'English'}.`;

      // Call Real LLM API Endpoint
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(promptContext)}?model=openai&system=${encodeURIComponent(
          'You are Waris AI, a certified Pakistani succession lawyer and Hanafi Islamic jurisprudence expert.'
        )}`
      );

      let aiResponse = '';
      if (response.ok) {
        aiResponse = await response.text();
      } else {
        throw new Error('LLM API error');
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: aiResponse.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Fallback if offline
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text:
          lang === 'ur'
            ? 'معذرت، انٹرنیٹ رابطہ سست ہے۔ براہ کرم دوبارہ کوشش فرمائیں۔'
            : 'Connection timed out. Please check your connection and try again.',
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
                  <span>{lang === 'ur' ? 'وارث اے آئی قانونی مشیر' : 'Waris AI Legal Counsel'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    LLM ENGINE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ur' ? 'حقیقی لارج لینگویج ماڈل پر مبنی' : 'Real-time Generative LLM Assistant'}
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
              onClick={() => handleSendMessage('Can a father disown a child through newspaper Aaq-Nama under Pakistani law?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition"
            >
              ⚖️ Aaq-Nama Validity
            </button>
            <button
              onClick={() => handleSendMessage('What is Section 498-A PPC for female inheritance in Pakistan?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shrink-0 transition"
            >
              👩 Section 498A PPC
            </button>
            <button
              onClick={() => handleSendMessage('How do I apply for a NADRA Succession Certificate step by step?')}
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
                <span>{lang === 'ur' ? 'ماڈل جواب تیار کر رہا ہے...' : 'Generating response via LLM...'}</span>
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
              placeholder={lang === 'ur' ? 'کوئی بھی سوال لکھیں...' : 'Ask any question...'}
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
