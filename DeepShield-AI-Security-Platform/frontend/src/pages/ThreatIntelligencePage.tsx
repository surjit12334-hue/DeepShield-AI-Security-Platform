import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { threatAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ThreatData {
  threat_level: string;
  active_indicators: number;
  recent_threats: number;
  detection_trends: any[];
  ai_threat_trends: any[];
  recent_indicators: any[];
}

const severityColors: Record<string, string> = {
  low: 'success', medium: 'warning', high: 'danger', critical: 'danger',
};

const trendIcons: Record<string, any> = {
  increasing: TrendingUp, stable: Minus, decreasing: TrendingDown,
};

export default function ThreatIntelligencePage() {
  const [data, setData] = useState<ThreatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await threatAPI.getIntelligence();
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-xl animate-pulse" />)}</div>;
  if (!data) return null;

  const threatColor = data.threat_level === 'high' || data.threat_level === 'critical' ? 'danger' : data.threat_level === 'medium' || data.threat_level === 'elevated' ? 'warning' : 'success';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" /> Threat Intelligence
        </h1>
        <p className="text-slate-400 mt-1">Monitor emerging threats and AI manipulation trends</p>
      </div>

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
        <Shield className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-amber-300">Demo Data — Simulated threat intelligence for demonstration purposes only</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-400 mb-1">Current Threat Level</p>
          <Badge variant={threatColor as any} className="text-lg px-4 py-1">{data.threat_level.toUpperCase()}</Badge>
        </Card>
        <Card>
          <p className="text-sm text-slate-400 mb-1">Active Indicators</p>
          <p className="text-3xl font-bold text-white">{data.active_indicators}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400 mb-1">Recent Threats</p>
          <p className="text-3xl font-bold text-white">{data.recent_threats}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Detection Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.detection_trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" /> AI Threat Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.ai_threat_trends.map((trend: any, i: number) => {
                const Icon = trendIcons[trend.trend] || Minus;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${trend.trend === 'increasing' ? 'text-red-400' : trend.trend === 'decreasing' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="text-sm text-white">{trend.type}</span>
                    </div>
                    <span className={`text-sm font-medium ${trend.trend === 'increasing' ? 'text-red-400' : trend.trend === 'decreasing' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {trend.change}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Recent Threat Indicators</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/50">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Confidence</th>
                  <th className="pb-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_indicators.map((ind: any) => (
                  <tr key={ind.id} className="border-b border-slate-800/50">
                    <td className="py-3"><Badge variant="info">{ind.type}</Badge></td>
                    <td className="py-3 font-mono text-xs text-white max-w-[200px] truncate">{ind.value}</td>
                    <td className="py-3"><Badge variant={severityColors[ind.severity] as any || 'default'}>{ind.severity}</Badge></td>
                    <td className="py-3 text-slate-300">{(ind.confidence * 100).toFixed(0)}%</td>
                    <td className="py-3 text-slate-400">{ind.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
