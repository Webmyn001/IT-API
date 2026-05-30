import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, approveCompany, deleteCompany } from '../services/api';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('PENDING');

  const fetchData = async (p: number = 1) => {
    setLoading(true);
    try {
      const result = await getCompanies({ page: p, limit: 20, status: filter !== 'ALL' ? filter : undefined });
      setCompanies(result.data);
      setTotalPages(result.pagination.totalPages);
      setPage(p);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, [filter]);

  const handleApprove = async (id: string) => {
    await approveCompany(id, 'APPROVED');
    fetchData(page);
  };

  const handleReject = async (id: string) => {
    await approveCompany(id, 'REJECTED');
    fetchData(page);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this company permanently?')) return;
    await deleteCompany(id);
    fetchData(page);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Companies</h1>
        <Link to="/companies/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> Add Company
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0',
              background: filter === f ? '#3b82f6' : 'white', color: filter === f ? 'white' : '#374151',
              fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500,
            }}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>State</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Industry</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Source</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#64748b' }}>{c.state}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#64748b' }}>{c.industry || '-'}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                      background: c.status === 'APPROVED' ? '#dcfce7' : c.status === 'PENDING' ? '#fef3c7' : '#fef2f2',
                      color: c.status === 'APPROVED' ? '#16a34a' : c.status === 'PENDING' ? '#d97706' : '#dc2626',
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.75rem' }}>{c.source}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {c.status !== 'APPROVED' && (
                        <button onClick={() => handleApprove(c.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#22c55e' }} title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {c.status !== 'REJECTED' && (
                        <button onClick={() => handleReject(c.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Reject">
                          <XCircle size={16} />
                        </button>
                      )}
                      <Link to={`/companies/${c.id}/edit`} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3b82f6' }} title="Edit">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" disabled={page <= 1} onClick={() => fetchData(page - 1)}>Previous</button>
              <span style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                Page {page} of {totalPages}
              </span>
              <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => fetchData(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
