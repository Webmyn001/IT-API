import { useState, useRef, useEffect } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { ALL_DEPARTMENTS } from '../data/departments';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DepartmentSelect({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || '');
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = !input.trim()
    ? ALL_DEPARTMENTS
    : ALL_DEPARTMENTS.filter((d) =>
        d.toLowerCase().includes(input.toLowerCase())
      );

  useEffect(() => {
    setInput(value || '');
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const select = (dept: string) => {
    onChange(dept);
    setInput(dept);
    setOpen(false);
    inputRef.current?.blur();
  };

  const clear = () => {
    onChange('');
    setInput('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      select(filtered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <GraduationCap
          size={16}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
        />
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder={placeholder || 'Type your department...'}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
            setHighlightIdx(-1);
            if (!e.target.value) onChange('');
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          autoComplete="off"
          style={{ paddingLeft: '2.25rem', paddingRight: value ? '2rem' : '1rem', color: 'var(--text)' }}
        />
        {value && (
          <button
            onClick={clear}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              padding: '2px', display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
            background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: '0.5rem',
            marginTop: '4px', maxHeight: '260px', overflow: 'auto',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center' }}>
              No departments match "{input}"
            </div>
          ) : (
            filtered.map((dept, i) => (
              <div
                key={dept}
                onClick={() => select(dept)}
                onMouseEnter={() => setHighlightIdx(i)}
                style={{
                  padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
                  background: i === highlightIdx ? 'var(--accent-glow)' : 'transparent',
                  color: i === highlightIdx ? 'var(--accent)' : 'var(--text)',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {dept}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
