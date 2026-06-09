import { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { travelService } from '../../services/travelService';

const starters = [
  'Plan a safe 3-day Goa trip', 
  'What should I do after dark?', 
  'Best family-friendly attractions',
  'Emergency procedures',
  'Night safety tips'
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! 👋 I\'m your AI safety travel assistant. Ask me anything about travel planning, safety tips, or emergency procedures!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await travelService.chatAI(text);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (error) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again!' }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') ? 'pl-2' : ''}>{line}</p>
    ));
  };

  return (
    <div className="page-container flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader title="AI Travel Assistant" subtitle="Get personalized travel & safety guidance 24/7" />
      <div className="mb-3 flex flex-wrap gap-2">
        {starters.map((s) => (
          <button 
            key={s} 
            type="button" 
            onClick={() => send(s)} 
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition-all hover:bg-brand-50 hover:border-brand-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="glass-panel flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-sm">AI</div>
              )}
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white' 
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className={`text-sm ${m.role === 'assistant' ? 'text-slate-800 dark:text-slate-100' : ''}`}>
                  {renderText(m.text)}
                </div>
              </div>
              {m.role === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm">You</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-sm">AI</div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); send(input); }} 
          className="flex gap-3 border-t border-slate-200 p-4 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80"
        >
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900" 
            placeholder="Ask about travel plans, safety, or emergencies…"
          />
          <Button type="submit" className="shrink-0">Send</Button>
        </form>
      </div>
    </div>
  );
}
