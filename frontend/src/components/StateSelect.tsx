import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function StateSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = !filter.trim()
    ? NIGERIAN_STATES
    : NIGERIAN_STATES.filter((s) =>
        s.toLowerCase().includes(filter.toLowerCase())
      );

  useEffect(() => {
    setFilter('');
    setHighlightIdx(-1);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const select = (state: string) => {
    onChange(state);
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setFilter('');
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
      <div
        onClick={() => { setOpen(!open); if (!open) setFilter(''); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          width: '100%', padding: '0.75rem 1rem',
          border: '1.5px solid var(--border)', borderRadius: '0.5rem',
          background: 'var(--surface)', color: value ? 'var(--text)' : 'var(--text-muted)',
          fontSize: '0.875rem', cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <MapPin size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ flex: 1, fontFamily: 'var(--font-sans)' }}>
          {value || 'All States'}
        </span>
        {value ? (
          <button
            onClick={(e) => { e.stopPropagation(); clear(); }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        )}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
            background: 'var(--surface-card)', border: '1px solid var(--border)',
            borderRadius: '0.5rem', marginTop: '4px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            <input
              ref={inputRef}
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setHighlightIdx(-1); }}
              onKeyDown={handleKey}
              placeholder="Filter states..."
              style={{
                width: '100%', padding: '0.375rem 0.625rem',
                border: '1px solid var(--border)', borderRadius: '0.375rem',
                fontSize: '0.8125rem', fontFamily: 'var(--font-sans)',
                background: 'var(--surface)', color: 'var(--text)',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center' }}>
                No states match "{filter}"
              </div>
            ) : (
              filtered.map((state, i) => (
                <div
                  key={state}
                  onClick={() => select(state)}
                  onMouseEnter={() => setHighlightIdx(i)}
                  style={{
                    padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
                    background: i === highlightIdx ? 'var(--accent-glow)' : 'transparent',
                    color: i === highlightIdx ? 'var(--accent)' : 'var(--text)',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {state}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
