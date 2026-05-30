import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Building2, Briefcase, Search, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import DepartmentSelect from '../components/DepartmentSelect';
import StateSelect from '../components/StateSelect';
import { searchCompanies, Company, SearchParams } from '../services/api';

const INDUSTRIES = [
  'Technology', 'Banking & Finance', 'Telecommunications', 'Manufacturing',
  'Oil & Gas', 'Healthcare', 'Education', 'Agriculture',
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    department: searchParams.get('department') || '',
    industry: searchParams.get('industry') || '',
  });

  const fetchCompanies = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const params: SearchParams = { ...filters, page: pageNum, limit: 20 };
      if (!params.search) delete params.search;
      if (!params.state) delete params.state;
      if (!params.department) delete params.department;
      if (!params.industry) delete params.industry;

      const result = await searchCompanies(params);
      setCompanies(result.data);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
      setPage(result.pagination.page);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(1); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.state) params.set('state', filters.state);
    if (filters.department) params.set('department', filters.department);
    if (filters.industry) params.set('industry', filters.industry);
    setSearchParams(params);
    fetchCompanies(1);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Discover</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginTop: '0.25rem' }}>
          <Search size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Search Companies
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: '1rem',
        padding: '1.25rem', marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 200px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keyword</label>
            <input
              className="input"
              placeholder="Search companies, keywords..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</label>
            <StateSelect value={filters.state} onChange={(v) => setFilters({ ...filters, state: v })} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</label>
            <DepartmentSelect value={filters.department} onChange={(v) => setFilters({ ...filters, department: v })} placeholder="Department..." />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry</label>
            <select className="select" value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
              <option value="">All Industries</option>
              {INDUSTRIES.map((i) => (<option key={i} value={i}>{i}</option>))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
            <Search size={16} /> Search
          </button>
        </div>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'sp 0.7s linear infinite', margin: '0 auto 0.75rem' }} />
          <style>{`@keyframes sp { to { transform: rotate(360deg) } }`}</style>
          Searching companies...
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {total} company{total !== 1 ? 'ies' : 'y'} found
            </span>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {companies.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.125rem' }}>No companies found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try adjusting your search filters</p>
              </div>
            ) : (
              companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.slug}`}
                  className="card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', textDecoration: 'none', color: 'inherit', gap: '1rem', padding: '1.25rem' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.02em' }}>{company.name}</h3>
                      {company.internshipAvailable && (
                        <span style={{ fontSize: '0.65rem', background: 'var(--accent-glow)', color: 'var(--accent)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          INTERNSHIPS
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {company.state && <span><MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{company.state}{company.city ? `, ${company.city}` : ''}</span>}
                      {company.industry && <span><Briefcase size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{company.industry}</span>}
                    </div>
                    {company.description && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                        {company.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                </Link>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button className="btn btn-outline" disabled={page <= 1} onClick={() => fetchCompanies(page - 1)} style={{ borderRadius: '0.5rem' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                {page} / {totalPages}
              </span>
              <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => fetchCompanies(page + 1)} style={{ borderRadius: '0.5rem' }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
