import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { getSection } from '@/studio/sections/registry';

type Template = { id: string; name: string; type: string; content: any; created_at: string };

export default function TemplatesLibrary() {
  const [items, setItems] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('section_templates').select('*').order('created_at', { ascending: false });
    setItems((data as Template[]) || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (t: Template) => {
    if (!confirm(`Delete template "${t.name}"?`)) return;
    const { error } = await supabase.from('section_templates').delete().eq('id', t.id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  return (
    <StudioLayout>
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Preset <span className="text-gradient-cyan">Blueprints</span></h1>
        <p className="text-white/40 font-medium">Reusable system architectures. Create from any node in the visual engine.</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#C9A227] animate-spin" />
          Synchronizing blueprints...
        </div>
      ) : items.length === 0 ? (
          <div className="rounded-[2.5rem] p-20 text-center bg-black border border-white/10">
            <p className="text-white/20 font-black text-xs uppercase tracking-widest">Blueprint library empty.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((t) => (
              <li key={t.id} className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-[#C9A227]/30 transition-all duration-500 flex flex-col justify-between">
                <div className="min-w-0 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-2 py-0.5 rounded bg-[#C9A227]/10 text-[#C9A227] text-[8px] font-black uppercase tracking-[0.2em]">
                      {t.type}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight truncate group-hover:text-[#C9A227] transition-colors">{t.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Deployed: {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/10">{getSection(t.type)?.label || t.type}</span>
                  <button 
                    onClick={() => remove(t)} 
                    className="p-3 rounded-xl bg-rose-500/5 text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    title="Purge Blueprint"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </StudioLayout>
  );
}
