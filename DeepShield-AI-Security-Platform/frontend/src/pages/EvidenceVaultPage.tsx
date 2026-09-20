import { useState, useEffect } from 'react';

import { Vault, Search, Eye, Shield } from 'lucide-react';
import { evidenceAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, truncateHash } from '../utils/cn';
import type { Evidence } from '../types';

export default function EvidenceVaultPage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadEvidence(); }, []);

  const loadEvidence = async () => {
    try {
      const res = await evidenceAPI.list();
      setEvidence(res.data.evidence || []);
    } catch {} finally { setLoading(false); }
  };

  const filtered = evidence.filter(e =>
    e.original_filename.toLowerCase().includes(search.toLowerCase()) ||
    e.evidence_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Vault className="w-6 h-6 text-cyan-400" /> Evidence Vault
          </h1>
          <p className="text-slate-400 mt-1">Secure evidence management with chain of custody tracking</p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-blue-300">Demo Mode — Showing simulated evidence records</span>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search evidence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Vault className="w-8 h-8 text-slate-500" />}
          title="No evidence files"
          description="Evidence files will appear here after running analyses."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/50">
                  <th className="pb-3 font-medium">Evidence ID</th>
                  <th className="pb-3 font-medium">Filename</th>
                  <th className="pb-3 font-medium">Hash</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-3 font-mono text-xs text-cyan-400">{e.evidence_id}</td>
                    <td className="py-3 text-white max-w-[200px] truncate">{e.original_filename}</td>
                    <td className="py-3 font-mono text-xs text-slate-400">{truncateHash(e.file_hash, 16)}</td>
                    <td className="py-3"><StatusBadge status={e.status} /></td>
                    <td className="py-3 text-slate-400">{formatDate(e.created_at)}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
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
