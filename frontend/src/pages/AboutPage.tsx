import { Braces, Building2, Shield, Search, Database, Globe, GraduationCap, Heart, MessageCircle, Mail, Linkedin } from 'lucide-react';

const WHATSAPP_NUMBER = '2349164028709';
const EMAIL = 'bellomuhyideen0001@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/bello-muhyideen';

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '1rem',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Braces size={36} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>About</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.03em' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{'{'} Intern<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>API</span> {'}'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontFamily: 'var(--font-mono)' }}>
            Developed by a student, for students.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem', borderLeft: '4px solid var(--accent)' }}>
          <div className="about-flex" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="about-icon" style={{
              width: '48px', height: '48px', borderRadius: '0.75rem',
              background: 'var(--accent-glow)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <GraduationCap size={24} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>My Story</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                Hi, I'm <strong>Bello Muhyideen</strong>, a student at <strong>Obafemi Awolowo University (OAU)</strong>, Ile-Ife.
                I developed <span style={{ fontFamily: 'var(--font-mono)' }}>{'{'} InternAPI {'}'}</span> after watching my friends struggle for weeks before eventually getting their IT placement. As students, we waste time searching for organizations that accept interns,
                often relying on word of mouth or outdated information.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', marginTop: '0.75rem' }}>
                This platform is my contribution to making the process easier for every Nigerian student,
                whether you're studying Computer Science in Lagos, Engineering in Kano, or Business
                Administration in Port Harcourt. You deserve a stress-free way to find your placement.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Platform</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.375rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>What <span style={{ fontFamily: 'var(--font-mono)' }}>{'{'} InternAPI {'}'}</span> Does</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{'{'} InternAPI {'}'}</span> is a centralized platform that automatically gathers, structures, and presents
            company information from all 36 states in Nigeria so students can easily identify and contact
            organizations for SIWES, SIWEP, Industrial Training (IT), internships, and work placement opportunities.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Features</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.375rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Key Features</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { icon: Search, title: 'Smart Search', desc: 'Filter companies by state, industry, department, and keywords.' },
              { icon: Database, title: 'Comprehensive Database', desc: 'Hundreds of companies across all 36 states and FCT.' },
              { icon: Shield, title: 'Verified Information', desc: 'AI-powered collection with human admin oversight.' },
              { icon: Globe, title: 'Nationwide Coverage', desc: 'From Lagos to Maiduguri, Calabar to Sokoto.' },
              { icon: Building2, title: 'All Industries', desc: 'Tech, banking, manufacturing, healthcare, oil & gas, and more.' },
              { icon: Heart, title: 'Built for Students', desc: 'Free to use, mobile-friendly, and student-focused.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="about-flex" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div className="about-icon" style={{
                  width: '40px', height: '40px', borderRadius: '0.625rem',
                  background: 'var(--accent-glow)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.125rem' }}>{title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Data</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.375rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Data Collection</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
            Our platform uses AI-powered data collection (Playwright web crawling + OpenAI extraction) to
            continuously search public sources and gather company information. All data is verified by human
            administrators before publication. We only collect publicly available information
            and respect data privacy.
          </p>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--accent-glow), transparent)',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: '1rem', padding: '1.75rem',
        }}>
          <div className="about-flex" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <MessageCircle size={24} color="var(--accent)" className="about-icon" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Have questions or suggestions?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                I'd love to hear from you! Reach out to me anytime.
              </p>
              <div className="contact-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20webmyn!%20I%20saw%20InternAPI%20and%20have%20a%20question.`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ borderRadius: '0.5rem', fontSize: '0.8125rem', padding: '0.6rem 1rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn btn-outline"
                  style={{ borderRadius: '0.5rem', fontSize: '0.8125rem', padding: '0.6rem 1rem' }}
                >
                  <Mail size={16} /> Email
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ borderRadius: '0.5rem', fontSize: '0.8125rem', padding: '0.6rem 1rem' }}
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .about-flex { flex-direction: column !important; }
          .about-flex .about-icon { margin-bottom: 0.5rem; }
          .contact-links { flex-direction: column !important; }
          .contact-links a { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
}
