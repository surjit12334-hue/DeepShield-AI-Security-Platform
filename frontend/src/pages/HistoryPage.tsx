import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { analysisAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge, RiskBadge, StatusBadge } from '../components/ui/Badge';

import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, cn } from '../utils/cn';
import type { Analysis } from '../types';

const typeFilters = [
  { value: '', label: 'All' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
];

const riskFilters = [
  { value: '', label: 'All Risks' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => { loadAnalyses(); }, [typeFilter, riskFilter]);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const params: any = { per_page: 50 };
      if (typeFilter) params.content_type = typeFilter;
      if (riskFilter) params.risk_level = riskFilter;
      const res = await analysisAPI.list(params);
      setAnalyses(res.data.analyses || []);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-400" /> Analysis History
        </h1>
        <p className="text-slate-400 mt-1">View and manage all your previous analyses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                typeFilter === f.value ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {riskFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-800/50 rounded-lg animate-pulse" />)}
        </div>
      ) : analyses.length === 0 ? (
        <EmptyState
          title="No analyses found"
          description="No analyses match your current filters."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/50">
                  <th className="pb-3 font-medium">File</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Risk</th>
                  <th className="pb-3 font-medium">Confidence</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-3 text-white max-w-[200px] truncate">{a.original_filename}</td>
                    <td className="py-3"><Badge variant="info">{a.content_type}</Badge></td>
                    <td className="py-3">{a.risk_level ? <RiskBadge level={a.risk_level} /> : <span className="text-slate-500">—</span>}</td>
                    <td className="py-3 text-slate-300">{a.confidence_score ? `${(a.confidence_score * 100).toFixed(0)}%` : '—'}</td>
                    <td className="py-3 text-slate-400 text-xs">{formatDate(a.created_at)}</td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3 flex gap-2">
                      <Link to={`/analysis/${a.id}`} className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
