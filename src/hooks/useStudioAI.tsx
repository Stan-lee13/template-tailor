import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';

export interface StudioAIContextValue {
  title: string;
  focusKeyword: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
}

type InsertHandler = (markdown: string) => boolean;
type FieldSetter = (field: 'metaTitle' | 'metaDescription' | 'excerpt' | 'title', value: string) => boolean;

interface Ctx {
  context: StudioAIContextValue | null;
  setContext: (c: StudioAIContextValue | null) => void;
  registerInsertHandler: (h: InsertHandler | null) => void;
  insertMarkdown: (md: string) => boolean;
  registerFieldSetter: (h: FieldSetter | null) => void;
  setField: FieldSetter;
  openPanel: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const StudioAI = createContext<Ctx | null>(null);

export function StudioAIProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<StudioAIContextValue | null>(null);
  const [isOpen, setOpen] = useState(false);
  const insertRef = useRef<InsertHandler | null>(null);
  const fieldRef = useRef<FieldSetter | null>(null);

  const registerInsertHandler = useCallback((h: InsertHandler | null) => { insertRef.current = h; }, []);
  const registerFieldSetter = useCallback((h: FieldSetter | null) => { fieldRef.current = h; }, []);
  const insertMarkdown = useCallback((md: string) => insertRef.current ? insertRef.current(md) : false, []);
  const setField: FieldSetter = useCallback((f, v) => fieldRef.current ? fieldRef.current(f, v) : false, []);
  const openPanel = useCallback(() => setOpen(true), []);

  const value = useMemo(() => ({
    context, setContext, registerInsertHandler, insertMarkdown, registerFieldSetter, setField, openPanel, isOpen, setOpen,
  }), [context, registerInsertHandler, insertMarkdown, registerFieldSetter, setField, openPanel, isOpen]);

  return <StudioAI.Provider value={value}>{children}</StudioAI.Provider>;
}

export function useStudioAI() {
  const ctx = useContext(StudioAI);
  if (!ctx) throw new Error('useStudioAI must be used within StudioAIProvider');
  return ctx;
}
