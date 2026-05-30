import { useState, useEffect } from 'react';
import { getDashboardStats, getCollectorStatus, triggerCollection } from '../services/api';
import { Building2, CheckCircle, Clock, XCircle, Users, Search, Bot, Play, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collectorStatus, setCollectorStatus] = useState<any>(null);
  const [triggering, setTriggering] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getDashboardStats().then(setStats),
      getCollectorStatus().then(setCollectorStatus),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerCollection();
      await Promise.all([
        getDashboardStats().then(setStats),
        getCollectorStatus().then(setCollectorStatus),
      ]);
    } catch (_) {}
    setTriggering(false);
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load data</div>;

  const cards = [
    { label: 'Total Companies', value: stats.overview.totalCompanies, icon: Building2, color: '#3b82f6' },
    { label: 'Approved', value: stats.overview.approvedCount, icon: CheckCircle, color: '#22c55e' },
    { label: 'Pending Review', value: stats.overview.pendingCount, icon: Clock, color: '#f59e0b' },
    { label: 'Rejected', value: stats.overview.rejectedCount, icon: XCircle, color: '#ef4444' },
    { label: 'Total Searches', value: stats.overview.totalSearches, icon: Search, color: '#8b5cf6' },
    { label: 'Administrators', value: stats.overview.totalUsers, icon: Users, color: '#06b6d4' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>AI Collector</h3>
          </div>
          <button
            onClick={handleTrigger}
            disabled={triggering || collectorStatus?.isRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none',
              background: collectorStatus?.isRunning ? '#94a3b8' : '#8b5cf6',
              color: '#fff', fontSize: '0.8125rem', fontWeight: 600, cursor: collectorStatus?.isRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {triggering ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
            {triggering ? 'Running...' : collectorStatus?.isRunning ? 'Running...' : 'Run Collection'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Status</div>
            <span style={{
              padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
              background: collectorStatus?.isRunning ? '#fef3c7' : collectorStatus?.collectorEnabled ? '#dcfce7' : '#fef2f2',
              color: collectorStatus?.isRunning ? '#d97706' : collectorStatus?.collectorEnabled ? '#16a34a' : '#dc2626',
            }}>
              {collectorStatus?.isRunning ? 'Running' : collectorStatus?.collectorEnabled ? 'Active' : 'Disabled'}
            </span>
          </div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Last Run</div>
            <div style={{ fontWeight: 600 }}>
              {collectorStatus?.lastRun ? new Date(collectorStatus.lastRun).toLocaleString() : 'Never'}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>AI Available</div>
            <span style={{
              padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
              background: collectorStatus?.aiAvailable ? '#dcfce7' : '#fef3c7',
              color: collectorStatus?.aiAvailable ? '#16a34a' : '#d97706',
            }}>
              {collectorStatus?.aiAvailable ? 'Yes' : 'No (no API key)'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Top States</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.stateDistribution.map((s: any) => (
              <div key={s.state} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span>{s.state || 'Unknown'}</span>
                <span style={{ fontWeight: 600 }}>{s._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Top Industries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.industryDistribution.map((s: any) => (
              <div key={s.industry} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span>{s.industry || 'Unknown'}</span>
                <span style={{ fontWeight: 600 }}>{s._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
