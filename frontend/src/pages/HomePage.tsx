import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, MapPin, Briefcase, GraduationCap, ArrowRight, Zap } from 'lucide-react';
import DepartmentSelect from '../components/DepartmentSelect';
import StateSelect from '../components/StateSelect';
import IndustrySelect from '../components/IndustrySelect';

export default function HomePage() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [state, setState] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (department) params.set('department', department);
    if (state) params.set('state', state);
    if (industry) params.set('industry', industry);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-to) 50%, var(--hero-from) 100%)',
        color: 'var(--nav-text)',
        padding: '5rem 0 4rem',
        position: 'relative',
      }}>
        <div className="bg-dots" style={{
          position: 'absolute', inset: 0,
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
            borderRadius: '9999px', padding: '0.375rem 1rem',
            fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600,
            marginBottom: '1.5rem', fontFamily: 'var(--font-mono)',
          }}>
            <Zap size={14} /> Your placement API
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Find Your<br />
            <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IT/SIWES Placement</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Discover verified companies across all 36 states in Nigeria offering internship,
            SIWES, and industrial training opportunities.
          </p>

          <form onSubmit={handleSearch} style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            maxWidth: '820px',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div className="search-grid">
              <div className="field-wide">
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.375rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Department
                </label>
                <DepartmentSelect
                  value={department}
                  onChange={setDepartment}
                  placeholder="Type your department..."
                />
              </div>
              <div className="field">
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.375rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  State
                </label>
                <StateSelect value={state} onChange={setState} />
              </div>
              <div className="field">
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.375rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Industry
                </label>
                <IndustrySelect value={industry} onChange={setIndustry} />
              </div>
              <div className="action">
                <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 2rem', borderRadius: '0.5rem' }}>
                  <Search size={18} /> Search
                </button>
              </div>
            </div>
          </form>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: Building2, label: '36 States Coverage', value: 'Nationwide' },
              { icon: Briefcase, label: 'SIWES, IT, Internships', value: 'All Opportunities' },
              { icon: GraduationCap, label: 'All Disciplines', value: 'Every Department' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nav-text)' }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>How It Works</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '-0.03em' }}>
              Three Steps to Your Placement
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Search', desc: 'Select your department, state, and industry to find matching companies across Nigeria.', icon: Search },
              { step: '02', title: 'Browse', desc: 'Explore verified company profiles with contact details and accepted disciplines.', icon: Building2 },
              { step: '03', title: 'Apply', desc: 'Get everything you need to reach out and secure your placement.', icon: ArrowRight },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 700,
                  color: 'var(--accent-glow)', position: 'absolute', top: '0.5rem', right: '1rem',
                  lineHeight: 1, userSelect: 'none',
                }}>
                  {step}
                </div>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '1rem',
                  background: 'var(--accent-gradient)', color: 'white', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem', position: 'relative',
                }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="bg-dots" style={{ position: 'absolute', inset: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
            Ready to Find Your Placement?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '0.9375rem' }}>
            Join thousands of Nigerian students who have found their IT/SIWES placements through <span style={{ fontFamily: 'var(--font-mono)' }}>{'{'} InternAPI {'}'}</span>.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: '0.5rem' }}>
            Start Searching <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
