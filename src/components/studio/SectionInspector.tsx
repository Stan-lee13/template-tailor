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
    <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
      {field.label}
      {field.help && <span className="ml-2 normal-case tracking-normal" style={{ color: '#999' }}>· {field.help}</span>}
    </label>
  );

  if (field.type === 'text' || field.type === 'url') {
    return (
      <div>
        {label}
        <input className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea rows={4} className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === 'richtext') {
    const html = (value as string) ?? '';
    return (
      <div>
        {label}
        <div className="border rounded-md" style={{ borderColor: '#E2DDD3' }}>
          <TiptapEditor initialJson={html || null} onChange={(_j, h) => onChange(h)} />
        </div>
      </div>
    );
  }
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 font-inter text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.type === 'color') {
    return (
      <div>
        {label}
        <div className="flex items-center gap-2">
          <input type="color" value={(value as string) || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-12 h-9 rounded border" style={{ borderColor: '#E2DDD3' }} />
          <input className="flex-1 px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    );
  }
  if (field.type === 'image') {
    return (
      <div>
        {label}
        <div className="flex items-start gap-3">
          {value ? (
            <img src={value as string} alt="" className="w-24 h-24 object-cover rounded border" style={{ borderColor: '#E2DDD3' }} />
          ) : (
            <div className="w-24 h-24 rounded border flex items-center justify-center bg-gray-50" style={{ borderColor: '#E2DDD3' }}><ImageIcon size={20} color="#aaa" /></div>
          )}
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setPickerOpen(true)} className="px-3 py-1.5 rounded-md font-inter text-xs" style={{ background: '#0A0A0A', color: '#fff' }}>Choose</button>
            {value && <button type="button" onClick={() => onChange(null)} className="px-3 py-1.5 rounded-md font-inter text-xs border" style={{ borderColor: '#E2DDD3' }}>Remove</button>}
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
      <div>
        {label}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="p-3 rounded-md border space-y-2" style={{ borderColor: '#E2DDD3', background: '#fafafa' }}>
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs" style={{ color: '#888' }}>Item {i + 1}</span>
                <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 rounded hover:bg-red-50"><Trash2 size={14} color="#dc2626" /></button>
              </div>
              {itemFields.map((f) => (
                <FieldEditor key={f.key} field={f} value={item[f.key]} onChange={(v) => {
                  const next = [...items]; next[i] = { ...next[i], [f.key]: v }; onChange(next);
                }} />
              ))}
            </div>
          ))}
          <button type="button" onClick={() => onChange([...items, {}])} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-inter text-xs border" style={{ borderColor: '#E2DDD3' }}>
            <Plus size={14} /> Add item
          </button>
        </div>
      </div>
    );
  }
  return null;
}
