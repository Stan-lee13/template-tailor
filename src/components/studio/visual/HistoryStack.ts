import { useCallback, useRef, useState } from 'react';

type Entry = {
  sectionId: string;
  prev: Record<string, unknown>;
  next: Record<string, unknown>;
};

export function useHistory(applyContent: (sectionId: string, content: Record<string, unknown>) => Promise<void>) {
  const stack = useRef<Entry[]>([]);
  const cursor = useRef<number>(-1); // index of last-applied entry
  const [, forceRender] = useState(0);
  const bump = () => forceRender((n) => n + 1);

  const push = useCallback((entry: Entry) => {
    // Drop redo tail
    stack.current = stack.current.slice(0, cursor.current + 1);
    stack.current.push(entry);
    if (stack.current.length > 50) {
      stack.current = stack.current.slice(stack.current.length - 50);
    }
    cursor.current = stack.current.length - 1;
    bump();
  }, []);

  const canUndo = cursor.current >= 0;
  const canRedo = cursor.current < stack.current.length - 1;

  const undo = useCallback(async () => {
    if (cursor.current < 0) return;
    const entry = stack.current[cursor.current];
    cursor.current -= 1;
    await applyContent(entry.sectionId, entry.prev);
    bump();
  }, [applyContent]);

  const redo = useCallback(async () => {
    if (cursor.current >= stack.current.length - 1) return;
    cursor.current += 1;
    const entry = stack.current[cursor.current];
    await applyContent(entry.sectionId, entry.next);
    bump();
  }, [applyContent]);

  const clear = useCallback(() => {
    stack.current = [];
    cursor.current = -1;
    bump();
  }, []);

  return { push, undo, redo, canUndo, canRedo, clear };
}
