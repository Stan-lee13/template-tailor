import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, X, Send, ClipboardCopy, Plus, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStudioAI } from '@/hooks/useStudioAI';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK_ACTIONS = [
  { label: 'Outline this post', prompt: 'Draft a clean H2/H3 outline for the current post based on its title and focus keyword. Return only the outline in Markdown.' },
  { label: 'Suggest meta title', prompt: 'Suggest 3 meta title options (≤ 60 chars each) that include the focus keyword naturally. Show character counts.' },
  { label: 'Suggest meta description', prompt: 'Suggest 3 meta description options (≤ 155 chars each) using the focus keyword. Show character counts.' },
  { label: 'Sharpen headline', prompt: 'Rewrite the current title into 5 sharper variants — punchier, benefit-led, no clichés. List them.' },
  { label: 'SEO gap check', prompt: 'Review the current post context and list concrete SEO gaps I should fix before publishing.' },
];

export default function AIAssistant() {
  const { isOpen, setOpen, context, insertMarkdown, setField } = useStudioAI();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowInsert, setAllowInsert] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/studio-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Assistant failed');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e: any) {
      toast.error(e.message || 'Assistant failed');
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success('Copied'); };

  const insert = (t: string) => {
    const ok = insertMarkdown(t);
    if (ok) toast.success('Inserted into editor');
    else toast.error('Open a post to insert content');
  };

  // Detect single-line meta suggestions and offer quick apply
  const tryApplyMeta = (text: string) => {
    // Look for lines like: 1. "Title text" (58) — apply first quoted option
    const lines = text.split('\n').filter(Boolean);
    const match = lines.map((l) => /["“]([^"”]{5,180})["”]/.exec(l)).find(Boolean);
    return match ? match[1] : null;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 bg-[#00D4FF] text-black border border-[#00D4FF]/20"
        aria-label="Open AI assistant"
      >
        <Sparkles size={16} strokeWidth={3} />
        Intelligence Assistant
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col w-full sm:w-[480px] h-full shadow-[0_0_100px_rgba(0,0,0,1)] bg-black border-l border-white/10 animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#00D4FF]" strokeWidth={3} />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">System Assistant</h3>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            aria-label="Close"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Context bar */}
        {context && (
          <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/[0.01]">
            <span className="truncate text-white/20">
              Active Node: <span className="text-white">{context.title || 'UNNAMED_ENTITY'}</span>
              {context.focusKeyword && <span className="text-[#00D4FF]"> · {context.focusKeyword}</span>}
            </span>
            <label className="flex items-center gap-2 shrink-0 ml-4 cursor-pointer group" title="Allow assistant to modify node data">
              <input 
                type="checkbox" 
                checked={allowInsert} 
                onChange={(e) => setAllowInsert(e.target.checked)}
                className="w-3 h-3 rounded bg-white/5 border-white/10 text-[#00D4FF] focus:ring-0"
              />
              <span className="text-white/20 group-hover:text-white transition-colors">Direct Injection</span>
            </label>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
          {messages.length === 0 && (
            <div className="space-y-8">
              <p className="text-sm font-medium leading-relaxed text-white/40">
                Awaiting protocol instructions. I can draft architectures, refine headlines, or audit SEO integrity for the current entity.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {QUICK_ACTIONS.map((a) => (
                  <button 
                    key={a.label} 
                    onClick={() => send(a.prompt)} 
                    className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/40 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all text-left"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {m.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-6 py-4 rounded-[2rem] rounded-br-lg bg-[#00D4FF] text-black text-sm font-black tracking-tight shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-invert prose-sm max-w-none prose-p:text-white/60 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-white prose-code:text-[#00D4FF] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => copy(m.content)} 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ClipboardCopy size={12} strokeWidth={3} /> Copy
                    </button>
                    {allowInsert && context && (
                      <>
                        <button 
                          onClick={() => insert(m.content)} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[10px] font-black uppercase tracking-widest text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black transition-all"
                        >
                          <Plus size={12} strokeWidth={3} /> Inject to Post
                        </button>
                        {(() => {
                          const candidate = tryApplyMeta(m.content);
                          if (!candidate) return null;
                          return (
                            <>
                              <button 
                                onClick={() => { if (setField('metaTitle', candidate)) toast.success('Applied to meta title'); }} 
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                              >
                                Set Meta Title
                              </button>
                              <button 
                                onClick={() => { if (setField('metaDescription', candidate)) toast.success('Applied to meta description'); }} 
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                              >
                                Set Meta Description
                              </button>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00D4FF] animate-pulse">
              <Loader2 size={14} className="animate-spin" strokeWidth={3} /> Decrypting Signal...
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="p-8 border-t border-white/10 bg-white/[0.02]">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Enter transmission..."
                rows={3}
                className="w-full resize-none px-6 py-4 rounded-[1.5rem] bg-black border border-white/10 text-white text-sm font-medium placeholder:text-white/10 focus:outline-none focus:border-[#00D4FF]/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#00D4FF] text-black disabled:opacity-20 disabled:grayscale transition-all hover:bg-white"
                aria-label="Send"
              >
                <Send size={18} strokeWidth={3} />
              </button>
            </div>
            {messages.length > 0 && (
              <button 
                onClick={() => setMessages([])} 
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-rose-500 transition-colors self-center"
              >
                Purge History
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
