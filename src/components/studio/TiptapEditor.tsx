import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus, Trash2 } from 'lucide-react';
import { uploadPostMedia, getMediaUrl } from '@/lib/storage';
import { toast } from 'sonner';

export interface TiptapEditorHandle {
  insertHtml: (html: string) => boolean;
}

interface Props {
  initialJson?: any;
  onChange: (json: any, html: string) => void;
}


function Btn({ active, onClick, title, children, disabled }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="p-2 rounded transition-colors disabled:opacity-40"
      style={{
        background: active ? '#0A0A0A' : 'transparent',
        color: active ? '#f1ece4' : '#0A0A0A',
      }}
    >
      {children}
    </button>
  );
}

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(function TiptapEditor({ initialJson, onChange }, ref) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', class: 'underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg my-4 max-w-full cursor-pointer' } }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    content: initialJson && Object.keys(initialJson).length ? initialJson : '<p></p>',
    editorProps: {
      handleClickOn(_view, _pos, node, nodePos, _event, direct) {
        if (direct && node.type.name === 'image' && editor) {
          editor.chain().focus().setNodeSelection(nodePos).run();
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON(), editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialJson && Object.keys(initialJson).length && !editor.isFocused) {
      const current = JSON.stringify(editor.getJSON());
      const incoming = JSON.stringify(initialJson);
      if (current !== incoming && incoming !== '{}') {
        editor.commands.setContent(initialJson);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useImperativeHandle(ref, () => ({
    insertHtml: (html: string) => {
      if (!editor) return false;
      editor.chain().focus().insertContent(html).run();
      return true;
    },
  }), [editor]);

  if (!editor) return null;


  const addLink = () => {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt('URL (use /path for internal links)', previous || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = async (file: File) => {
    try {
      const path = await uploadPostMedia(file);
      const url = await getMediaUrl(path);
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2DDD3', background: '#fff' }}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b sticky top-0 z-10" style={{ borderColor: '#E2DDD3', background: '#fafafa' }}>
        <Btn title="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
        <Btn title="H3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
        <span className="w-px h-5 mx-1" style={{ background: '#E2DDD3' }} />
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
        <span className="w-px h-5 mx-1" style={{ background: '#E2DDD3' }} />
        <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
        <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></Btn>
        <span className="w-px h-5 mx-1" style={{ background: '#E2DDD3' }} />
        <Btn title="Link" active={editor.isActive('link')} onClick={addLink}><LinkIcon size={16} /></Btn>
        <Btn title="Image" onClick={() => fileRef.current?.click()}><ImageIcon size={16} /></Btn>
        <Btn title="Delete selected image" disabled={!editor.isActive('image')} onClick={() => editor.chain().focus().deleteSelection().run()}><Trash2 size={16} /></Btn>
        <span className="w-px h-5 mx-1" style={{ background: '#E2DDD3' }} />
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={16} /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={16} /></Btn>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ''; }} />
      </div>
      <div className="p-6 prose prose-neutral max-w-none font-inter" style={{ minHeight: 400 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
