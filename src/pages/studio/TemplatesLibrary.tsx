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
      <div className="mb-6">
        <h1 className="font-outfit font-medium text-3xl" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Templates</h1>
        <p className="font-inter text-sm" style={{ color: '#666' }}>Reusable section presets. Create from any section in the site editor.</p>
      </div>
      {loading ? <p className="font-inter text-sm text-gray-500">Loading…</p> :
        items.length === 0 ? <p className="font-inter text-sm text-gray-500">No templates yet.</p> :
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((t) => (
            <li key={t.id} className="p-4 rounded-xl flex items-start justify-between gap-3" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
              <div className="min-w-0">
                <p className="font-inter font-medium truncate">{t.name}</p>
                <p className="font-inter text-xs" style={{ color: '#888' }}>{getSection(t.type)?.label || t.type} · {new Date(t.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(t)} className="p-2 rounded hover:bg-red-50"><Trash2 size={14} color="#dc2626" /></button>
            </li>
          ))}
        </ul>
      }
    </StudioLayout>
  );
}
