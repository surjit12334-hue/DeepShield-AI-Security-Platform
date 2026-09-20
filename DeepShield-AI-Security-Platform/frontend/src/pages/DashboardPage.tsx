import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, AlertTriangle, Vault, FileText, Upload, Eye, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { analysisAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge, RiskBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/cn';
import type { Analysis, Stats } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total_analyses: 0, threats_detected: 0, evidence_files: 0, reports_generated: 0 });
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, analysesRes] = await Promise.all([
        analysisAPI.getStats().catch(() => ({ data: { total_analyses: 0, threats_detected: 0, evidence_files: 0, reports_generated: 0 } })),
        analysisAPI.list({ per_page: 5 }).catch(() => ({ data: { analyses: [] } })),
      ]);
      setStats(statsRes.data);
      setAnalyses(analysesRes.data.analyses || []);
    } catch {
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadRes = await analysisAPI.upload(file);
      const analysisId = uploadRes.data.analysis_id;
      await analysisAPI.run(analysisId);
      navigate(`/analysis/${analysisId}`);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  const statCards = [
    { label: 'Total Analyses', value: stats.total_analyses, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Threats Detected', value: stats.threats_detected, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Evidence Files', value: stats.evidence_files, icon: Vault, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Reports Generated', value: stats.reports_generated, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo Banner */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-blue-300">Demo Mode — Using simulated analysis results for demonstration</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-400 mt-1">Monitor and analyze suspicious digital content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Analysis + Recent Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Analysis */}
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Analysis</h2>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors"
          >
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-300 mb-1">Drop your file here</p>
            <p className="text-xs text-slate-500 mb-4">or click to browse</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {['JPG', 'PNG', 'MP4', 'MOV', 'WAV', 'MP3', 'TXT', 'PDF'].map((fmt) => (
                <span key={fmt} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">{fmt}</span>
              ))}
            </div>
            <label>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.mp4,.mov,.wav,.mp3,.txt,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <Button loading={uploading} className="w-full cursor-pointer">
                Start Analysis
              </Button>
            </label>
          </div>
        </Card>

        {/* Recent Analyses */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
            <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
          </div>

          {analyses.length === 0 ? (
            <EmptyState
              title="No analyses yet"
              description="Upload your first file to get started with content analysis."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
                    <th className="pb-3 font-medium">File</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Risk</th>
                    <th className="pb-3 font-medium">Confidence</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {analyses.map((a) => (
                    <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="py-3 text-white max-w-[200px] truncate">{a.original_filename}</td>
                      <td className="py-3"><Badge variant="info">{a.content_type}</Badge></td>
                      <td className="py-3">{a.risk_level ? <RiskBadge level={a.risk_level} /> : <span className="text-slate-500">—</span>}</td>
                      <td className="py-3 text-slate-300">{a.confidence_score ? `${(a.confidence_score * 100).toFixed(0)}%` : '—'}</td>
                      <td className="py-3"><StatusBadge status={a.status} /></td>
                      <td className="py-3 text-slate-400">{formatDate(a.created_at)}</td>
                      <td className="py-3">
                        <Link to={`/analysis/${a.id}`} className="text-blue-400 hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
