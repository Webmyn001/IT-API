import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Mail, Phone, Building2, Briefcase, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { getCompany, Company } from '../services/api';

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getCompany(slug)
      .then(setCompany)
      .catch(() => setError('Company not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'var(--text-muted)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'sp 0.7s linear infinite', margin: '0 auto 1rem' }} />
        <style>{`@keyframes sp { to { transform: rotate(360deg) } }`}</style>
        Loading company details...
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.25rem' }}>{error || 'Company not found'}</h2>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8125rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}>
        <ArrowLeft size={16} /> Back to results
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }} className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '1rem',
                background: 'var(--accent-gradient)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Building2 size={28} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2 }}>{company.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {company.verificationStatus === 'VERIFIED' && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                      <CheckCircle size={12} /> VERIFIED
                    </span>
                  )}
                  {company.internshipAvailable && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      ACCEPTS INTERNS
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {company.state && (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} /> {company.state}{company.city ? `, ${company.city}` : ''}
                </span>
              )}
              {company.industry && (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Briefcase size={14} /> {company.industry}
                </span>
              )}
            </div>

            {company.description && (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{company.description}</p>
            )}
          </div>

          {company.departments.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Accepted Departments</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {company.departments.map((dept) => (
                  <span key={dept} style={{
                    background: 'var(--accent-glow)', color: 'var(--accent)', padding: '0.25rem 0.75rem',
                    borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'var(--font-mono)',
                  }}>
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>Contact</span>
              Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {company.address && (
                <div style={{ fontSize: '0.8125rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.125rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Address</div>
                  <div>{company.address}</div>
                </div>
              )}
              {company.email && (
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Email</div>
                  <a href={`mailto:${company.email}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-all' }}>
                    <Mail size={14} /> {company.email}
                  </a>
                </div>
              )}
              {company.website && (
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Website</div>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Globe size={14} /> Visit Website <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {company.phone && (
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Phone</div>
                  <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={14} /> {company.phone}
                  </div>
                </div>
              )}
            </div>

            {company.internshipAvailable && (
              <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'var(--accent-glow)', borderRadius: '0.625rem', textAlign: 'center', border: '1px solid rgba(96,165,250,0.15)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.8125rem' }}>
                  This company accepts interns/SIWES students
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
