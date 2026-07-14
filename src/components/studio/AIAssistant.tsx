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
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-inter text-sm font-medium transition-transform hover:scale-105"
        style={{ background: '#0A0A0A', color: '#f1ece4' }}
        aria-label="Open AI assistant"
      >
        <Sparkles size={16} color="#F97316" />
        Assistant
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col w-full sm:w-[420px] h-full shadow-2xl" style={{ background: '#fff', borderLeft: '1px solid #E2DDD3' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E2DDD3', background: '#0A0A0A' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} color="#F97316" />
            <h3 className="font-outfit font-medium text-base" style={{ color: '#f1ece4' }}>Editorial assistant</h3>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} color="#f1ece4" /></button>
        </div>

        {/* Context bar */}
        {context && (
          <div className="px-5 py-2.5 border-b flex items-center justify-between text-xs font-inter" style={{ borderColor: '#E2DDD3', background: '#f8f5ee' }}>
            <span className="truncate" style={{ color: '#555' }}>
              <span style={{ color: '#888' }}>Working on: </span>
              <strong style={{ color: '#0A0A0A' }}>{context.title || 'Untitled'}</strong>
              {context.focusKeyword && <span style={{ color: '#888' }}> · {context.focusKeyword}</span>}
            </span>
            <label className="flex items-center gap-1.5 shrink-0 ml-2" title="Allow assistant to insert / apply into fields">
              <input type="checkbox" checked={allowInsert} onChange={(e) => setAllowInsert(e.target.checked)} />
              <span style={{ color: '#555' }}>Allow insert</span>
            </label>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="font-inter text-sm" style={{ color: '#666' }}>
                Ask me to draft outlines, sharpen headlines, write meta tags, or check SEO gaps. {context ? "I'll use the current post as context." : 'Open a post for post-aware answers.'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.label} onClick={() => send(a.prompt)} className="px-2.5 py-1.5 rounded-full text-xs font-inter border" style={{ borderColor: '#E2DDD3', color: '#333' }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="text-sm font-inter">
              {m.role === 'user' ? (
                <div className="flex justify-end"><div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-sm" style={{ background: '#0A0A0A', color: '#f1ece4' }}>{m.content}</div></div>
              ) : (
                <div>
                  <div className="prose prose-sm max-w-none prose-neutral prose-headings:font-outfit prose-headings:font-medium prose-p:my-2 prose-headings:mt-3 prose-headings:mb-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button onClick={() => copy(m.content)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] border" style={{ borderColor: '#E2DDD3', color: '#555' }}>
                      <ClipboardCopy size={11} /> Copy
                    </button>
                    {allowInsert && context && (
                      <>
                        <button onClick={() => insert(m.content)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px]" style={{ background: '#F97316', color: '#0A0A0A' }}>
                          <Plus size={11} /> Insert into post
                        </button>
                        {(() => {
                          const candidate = tryApplyMeta(m.content);
                          if (!candidate) return null;
                          return (
                            <>
                              <button onClick={() => { if (setField('metaTitle', candidate)) toast.success('Applied to meta title'); }} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] border" style={{ borderColor: '#E2DDD3', color: '#333' }}>
                                Apply as meta title
                              </button>
                              <button onClick={() => { if (setField('metaDescription', candidate)) toast.success('Applied to meta description'); }} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] border" style={{ borderColor: '#E2DDD3', color: '#333' }}>
                                Apply as meta description
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
            <div className="flex items-center gap-2 text-xs font-inter" style={{ color: '#888' }}>
              <Loader2 size={14} className="animate-spin" /> Thinking…
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t p-3 flex items-end gap-2" style={{ borderColor: '#E2DDD3' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about this post, or paste text to rewrite…"
            rows={2}
            className="flex-1 resize-none px-3 py-2 rounded-md border font-inter text-sm focus:outline-none focus:border-black"
            style={{ borderColor: '#E2DDD3', background: '#fff' }}
          />
          <button type="submit" disabled={loading || !input.trim()} className="p-2.5 rounded-md disabled:opacity-40" style={{ background: '#0A0A0A', color: '#f1ece4' }} aria-label="Send">
            <Send size={16} />
          </button>
        </form>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-[11px] font-inter py-1.5 border-t" style={{ borderColor: '#E2DDD3', color: '#888' }}>
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
}
