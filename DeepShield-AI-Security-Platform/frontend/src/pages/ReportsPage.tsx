import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Shield } from 'lucide-react';
import { reportsAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/cn';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const res = await reportsAPI.list();
      setReports(res.data.reports || []);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" /> Reports
        </h1>
        <p className="text-slate-400 mt-1">Generate and manage security analysis reports</p>
      </div>

      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-blue-300">Demo Mode — Showing simulated report data</span>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />)}</div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Reports are generated after completing analyses."
        />
      ) : (
        <div className="grid gap-4">
          {reports.map((r) => (
            <Card key={r.report_id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-mono text-xs text-emerald-400">{r.report_id}</p>
                  <p className="text-sm text-white">{r.filename}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {r.risk_level && <RiskBadge level={r.risk_level} />}
                    <span className="text-xs text-slate-400">{r.created_at ? formatDate(r.created_at) : '—'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-1" /> Download</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
