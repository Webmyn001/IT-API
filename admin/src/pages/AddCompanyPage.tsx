import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompany, createCompany, updateCompany, getStates, bulkUpload } from '../services/api';

const ALL_DEPARTMENTS = [
  'Accounting', 'Aeronautical Engineering', 'Agricultural Engineering', 'Agriculture',
  'Animal Science', 'Architecture', 'Banking & Finance', 'Biochemistry', 'Biology',
  'Business Administration', 'Chemical Engineering', 'Chemistry', 'Civil Engineering',
  'Computer Engineering', 'Computer Science', 'Cyber Security', 'Data Science',
  'Economics', 'Education', 'Electrical Engineering', 'English Language',
  'Environmental Science', 'Food Science & Technology', 'Geology', 'Geophysics',
  'Hospitality Management', 'Information Technology', 'Insurance & Risk Management',
  'International Relations', 'Journalism', 'Law', 'Marketing', 'Mass Communication',
  'Mathematics', 'Mechanical Engineering', 'Mechatronics Engineering',
  'Medical Laboratory Science', 'Medicine & Surgery', 'Microbiology', 'Nursing',
  'Petroleum Engineering', 'Pharmacy', 'Physics', 'Physiotherapy', 'Political Science',
  'Psychology', 'Public Administration', 'Public Health', 'Radiography',
  'Software Engineering', 'Statistics', 'Transport Management', 'Urban & Regional Planning',
  'Veterinary Medicine',
];

const INDUSTRIES = [
  'Technology', 'Banking & Finance', 'Telecommunications', 'Manufacturing',
  'Oil & Gas', 'Healthcare', 'Education', 'Agriculture', 'Construction',
  'Government', 'Media & Communications', 'Real Estate', 'Hospitality & Tourism',
  'Energy & Utilities', 'Transportation & Logistics', 'Food & Beverage',
  'Consulting', 'Aviation', 'Automotive', 'Entertainment',
];

export default function AddCompanyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkData, setBulkData] = useState('');
  const [deptInput, setDeptInput] = useState('');
  const [deptOpen, setDeptOpen] = useState(false);

  const [form, setForm] = useState({
    name: '', industry: '', state: '', city: '', address: '',
    email: '', website: '', phone: '', description: '',
    departments: [] as string[],
    internshipAvailable: false,
  });

  const deptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStates().then((s) => setStates(s.map((st: any) => st.name))).catch(() => {});
    if (id) {
      getCompany(id).then((c) => {
        setForm({
          name: c.name, industry: c.industry || '', state: c.state, city: c.city || '',
          address: c.address || '', email: c.email || '', website: c.website || '',
          phone: c.phone || '', description: c.description || '',
          departments: c.departments || [], internshipAvailable: c.internshipAvailable,
        });
      }).catch(() => navigate('/companies'));
    }
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateCompany(id!, form);
      } else {
        await createCompany(form);
      }
      navigate('/companies');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (dept: string) => {
    setForm({
      ...form,
      departments: form.departments.includes(dept)
        ? form.departments.filter((d) => d !== dept)
        : [...form.departments, dept],
    });
  };

  const handleBulkUpload = async () => {
    try {
      const companies = JSON.parse(bulkData);
      if (!Array.isArray(companies)) throw new Error('Must be an array');
      const result = await bulkUpload(companies);
      alert(`${result.created} created, ${result.errors} errors`);
      navigate('/companies');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Invalid JSON format');
    }
  };

  const filteredDepts = !deptInput.trim()
    ? ALL_DEPARTMENTS
    : ALL_DEPARTMENTS.filter((d) => d.toLowerCase().includes(deptInput.toLowerCase()));

  if (mode === 'bulk') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bulk Upload</h1>
          <button className="btn btn-outline" onClick={() => setMode('single')}>Switch to Single</button>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            Paste a JSON array of companies. Each object should have at least "name" and "state" fields.
          </p>
          <textarea
            className="input"
            rows={12}
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder='[{"name": "Company Name", "state": "Lagos", "industry": "Technology"}]'
            style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}
          />
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleBulkUpload}>
            Upload Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isEdit ? 'Edit Company' : 'Add Company'}</h1>
        <button className="btn btn-outline" onClick={() => setMode('bulk')}>Bulk Upload</button>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Company Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>State *</label>
            <select className="select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required>
              <option value="">Select state</option>
              {states.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>City</label>
            <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Industry</label>
            <select className="select" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (<option key={i} value={i}>{i}</option>))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Website</label>
            <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Accepted Departments</label>

            <div ref={deptRef} style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <input
                className="input"
                placeholder="Type to filter departments..."
                value={deptInput}
                onChange={(e) => { setDeptInput(e.target.value); setDeptOpen(true); }}
                onFocus={() => setDeptOpen(true)}
              />
              {deptOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem',
                  marginTop: '2px', maxHeight: '180px', overflow: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  {filteredDepts.length === 0 ? (
                    <div style={{ padding: '0.5rem', color: '#94a3b8', fontSize: '0.8125rem' }}>No matches</div>
                  ) : (
                    filteredDepts.map((dept) => (
                      <div
                        key={dept}
                        onClick={() => { toggleDepartment(dept); setDeptOpen(false); setDeptInput(''); }}
                        style={{
                          padding: '0.375rem 0.75rem', cursor: 'pointer', fontSize: '0.8125rem',
                          background: form.departments.includes(dept) ? '#eff6ff' : 'white',
                          color: form.departments.includes(dept) ? '#2563eb' : '#0f172a',
                        }}
                      >
                        {dept} {form.departments.includes(dept) ? '✓' : ''}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {form.departments.map((dept) => (
                <span key={dept} style={{
                  padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem',
                  background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem',
                }}>
                  {dept}
                  <button type="button" onClick={() => toggleDepartment(dept)} style={{
                    border: 'none', background: 'none', color: 'white', cursor: 'pointer', padding: 0,
                    fontSize: '0.875rem', lineHeight: 1,
                  }}>×</button>
                </span>
              ))}
              {form.departments.length === 0 && (
                <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>No departments selected</span>
              )}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.internshipAvailable} onChange={(e) => setForm({ ...form, internshipAvailable: e.target.checked })} />
              <span style={{ fontSize: '0.875rem' }}>This company accepts interns / SIWES students</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Company' : 'Create Company'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/companies')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
