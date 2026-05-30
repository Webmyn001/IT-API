import { useState, useEffect } from 'react';
import { getCollectionLogs, triggerCollection, getCollectorStatus } from '../services/api';
import { Play, RefreshCw, Bot } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [collectorStatus, setCollectorStatus] = useState<any>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      getCollectionLogs().then((result) => setLogs(result.data)),
      getCollectorStatus().then(setCollectorStatus),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerCollection();
      await load();
    } catch (_) {}
    setTriggering(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Collection Logs</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {collectorStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#64748b' }}>
              <Bot size={16} color="#8b5cf6" />
              <span style={{
                padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                background: collectorStatus.isRunning ? '#fef3c7' : collectorStatus.collectorEnabled ? '#dcfce7' : '#fef2f2',
                color: collectorStatus.isRunning ? '#d97706' : collectorStatus.collectorEnabled ? '#16a34a' : '#dc2626',
              }}>
                {collectorStatus.isRunning ? 'Running' : collectorStatus.collectorEnabled ? 'Scheduled' : 'Disabled'}
              </span>
              {collectorStatus.lastRun && (
                <span>Last: {new Date(collectorStatus.lastRun).toLocaleDateString()} {new Date(collectorStatus.lastRun).toLocaleTimeString()}</span>
              )}
            </div>
          )}
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
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Source</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Added</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Updated</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Duplicates</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Errors</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.startedAt).toLocaleDateString()} {new Date(log.startedAt).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{log.source}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                      background: log.status === 'COMPLETED' ? '#dcfce7' : log.status === 'RUNNING' ? '#fef3c7' : '#fef2f2',
                      color: log.status === 'COMPLETED' ? '#16a34a' : log.status === 'RUNNING' ? '#d97706' : '#dc2626',
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{log.companiesAdded}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{log.companiesUpdated}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{log.duplicatesFound}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{log.errors}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {log.duration ? `${(log.duration / 1000).toFixed(1)}s` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No collection logs yet</div>
          )}
        </div>
      )}
    </div>
  );
}
