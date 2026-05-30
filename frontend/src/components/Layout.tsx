import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Info, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const WHATSAPP_NUMBER = '2349164028709';
const WHATSAPP_MSG = 'Hi%20webmyn!%20I%20have%20a%20question%20about%20InternAPI.';

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [waHover, setWaHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--surface-alt)' }}>
      <nav className="nav-glass" style={{
        color: 'var(--nav-text)',
        padding: '0.875rem 0', position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--nav-text)', fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '1.25rem' }}>{'{'} Intern<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>API</span> {'}'}</span>
          </Link>

          <div className="nav-icons" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Link to="/search" className="nav-icon-link" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', transition: 'background 0.15s' }}>
              <Search size={15} />
              <span className="nav-label">Search</span>
            </Link>
            <Link to="/about" className="nav-icon-link" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', transition: 'background 0.15s' }}>
              <Info size={15} />
              <span className="nav-label">About</span>
            </Link>
            <button
              onClick={toggle}
              className="theme-toggle"
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8',
                cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="hamburger"
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8',
                cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', marginLeft: '0.25rem',
              }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem' }}>{'{'} InternAPI {'}'}</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link to="/search" className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 0.75rem', borderRadius: '0.5rem', color: 'var(--text)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>
            <Search size={18} /> Search
          </Link>
          <Link to="/about" className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 0.75rem', borderRadius: '0.5rem', color: 'var(--text)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>
            <Info size={18} /> About
          </Link>
          <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 0.75rem', borderRadius: '0.5rem', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, textAlign: 'left', width: '100%' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />} {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      <div className="bg-dots" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      <footer style={{
        background: 'var(--footer-bg)', color: 'var(--footer-text)',
        padding: '2.5rem 0', marginTop: 'auto', fontSize: '0.8125rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} {'{'} InternAPI {'}'} — Designed by{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontWeight: 600 }}>
              webmyn
            </a>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Connecting Nigerian students with IT/SIWES placement opportunities nationwide across all 36 states.
          </p>
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '2.5rem', right: '1.5rem', zIndex: 100,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#22c55e', color: 'white', border: 'none',
          borderRadius: '9999px', padding: '0.75rem 1rem',
          boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
          cursor: 'pointer', textDecoration: 'none',
          fontSize: '0.8125rem', fontWeight: 600,
          transition: 'box-shadow 0.2s, transform 0.2s',
          transform: waHover ? 'scale(1.05)' : 'scale(1)',
        }}
        onMouseEnter={() => setWaHover(true)}
        onMouseLeave={() => setWaHover(false)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span style={{
          overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block',
          transition: 'opacity 0.2s, transform 0.2s',
          opacity: waHover ? 1 : 0,
          transform: `scaleX(${waHover ? 1 : 0})`,
          transformOrigin: 'left',
        }}>Chat</span>
      </a>
    </div>
  );
}
