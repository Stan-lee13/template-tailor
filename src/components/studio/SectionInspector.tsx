import { useState } from 'react';
import { Field, SectionDef } from '@/studio/sections/registry';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import MediaPickerDialog from './MediaPickerDialog';
import TiptapEditor from './TiptapEditor';

type Val = Record<string, unknown>;

function get(obj: Val, key: string) { return obj?.[key]; }
function set(obj: Val, key: string, value: unknown): Val { return { ...obj, [key]: value }; }

export default function SectionInspector({ def, value, onChange }: { def: SectionDef; value: Val; onChange: (v: Val) => void }) {
  return (
    <div className="space-y-4">
      {def.fields.map((f) => (
        <FieldEditor key={f.key} field={f} value={get(value, f.key)} onChange={(v) => onChange(set(value, f.key, v))} />
      ))}
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const label = (
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-white/20">
      {field.label}
      {field.help && <span className="ml-2 text-white/10 lowercase tracking-normal font-medium">· {field.help}</span>}
    </label>
  );

  const inputClasses = "w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-[#00D4FF]/50 transition-all placeholder:text-white/5";

  if (field.type === 'text' || field.type === 'url') {
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <input className={inputClasses} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <textarea rows={4} className={inputClasses} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === 'richtext') {
    const html = (value as string) ?? '';
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <div className="rounded-[2rem] border border-white/10 overflow-hidden bg-white/[0.01]">
          <TiptapEditor initialJson={html || null} onChange={(_j, h) => onChange(h)} />
        </div>
      </div>
    );
  }
  if (field.type === 'boolean') {
    return (
      <div className="mb-8 last:mb-0">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-[#00D4FF]' : 'bg-white/10'}`} />
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${value ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{field.label}</span>
        </label>
      </div>
    );
  }
  if (field.type === 'color') {
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0">
            <input type="color" value={(value as string) || '#000000'} onChange={(e) => onChange(e.target.value)} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" />
          </div>
          <input className={inputClasses} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    );
  }
  if (field.type === 'image') {
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <div className="flex items-center gap-6">
          {value ? (
            <div className="w-24 h-24 rounded-[2rem] border border-white/10 overflow-hidden flex-shrink-0 bg-white/[0.02]">
              <img src={value as string} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-[2rem] border border-white/10 flex items-center justify-center bg-white/[0.02] flex-shrink-0">
              <ImageIcon size={20} className="text-white/10" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setPickerOpen(true)} className="px-6 py-3 rounded-xl bg-[#00D4FF] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500">Inject</button>
            {value && <button type="button" onClick={() => onChange(null)} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">Purge</button>}
          </div>
        </div>
        <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={(url) => onChange(url)} />
      </div>
    );
  }
  if (field.type === 'list') {
    const items = (Array.isArray(value) ? value : []) as Val[];
    const itemFields = field.itemFields || [];
    return (
      <div className="mb-8 last:mb-0">
        {label}
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6 relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/10">Index {i + 1}</span>
                <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 rounded-xl text-white/10 hover:text-rose-500 hover:bg-rose-500/10 transition-all"><Trash2 size={14} strokeWidth={3} /></button>
              </div>
              {itemFields.map((f) => (
                <FieldEditor key={f.key} field={f} value={item[f.key]} onChange={(v) => {
                  const next = [...items]; next[i] = { ...next[i], [f.key]: v }; onChange(next);
                }} />
              ))}
            </div>
          ))}
          <button type="button" onClick={() => onChange([...items, {}])} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
            <Plus size={14} strokeWidth={3} /> Add Item Protocol
          </button>
        </div>
      </div>
    );
  }
  return null;
}
