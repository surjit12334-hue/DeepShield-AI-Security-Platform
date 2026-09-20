import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, AlertCircle, Download, Plus, Eye, Lock, FileText } from 'lucide-react';
import { analysisAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { RiskBadge, Badge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CircularProgress, Progress } from '../components/ui/Progress';
import { LoadingSkeleton } from '../components/ui/EmptyState';
import { truncateHash } from '../utils/cn';
import type { Analysis } from '../types';

export default function AnalysisResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadAnalysis(id);
  }, [id]);

  const loadAnalysis = async (analysisId: string) => {
    try {
      const res = await analysisAPI.get(analysisId);
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-64" />
        <LoadingSkeleton className="h-64" />
        <div className="grid lg:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-48" />
          <LoadingSkeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
        <p className="text-slate-400 mb-6">{error || 'The requested analysis could not be found.'}</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const confidence = analysis.confidence_score ? Math.round(analysis.confidence_score * 100) : 0;
  const aiScore = analysis.ai_detection_score ? Math.round(analysis.ai_detection_score * 100) : 0;
  const manipulationScore = analysis.manipulation_score ? Math.round(analysis.manipulation_score * 100) : 0;
  const indicators = analysis.detection_indicators || [];
  const explainability = analysis.explainability_data || {};
  const metadata = analysis.metadata_analysis?.metadata || {};

  const verdictColor = analysis.risk_level === 'critical' ? '#ef4444' : analysis.risk_level === 'high' ? '#f97316' : analysis.risk_level === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Complete</h1>
          <p className="text-slate-400 text-sm">{analysis.original_filename}</p>
        </div>
      </div>

      {/* Assessment Card */}
      <Card className="border-blue-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularProgress value={confidence} size={160} strokeWidth={10} color={verdictColor} label="Confidence" />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              {analysis.risk_level === 'low' ? 'Likely Authentic' : 'Potentially Manipulated'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
              <RiskBadge level={analysis.risk_level || 'low'} />
              <Badge variant="info">{analysis.content_type}</Badge>
              <StatusBadge status={analysis.status} />
            </div>
            <p className="text-sm text-slate-400 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <AlertTriangle className="w-4 h-4 inline mr-2 text-amber-400" />
              This is an AI-generated assessment estimate and should not be considered a definitive determination. Manual verification is recommended.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* AI Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" /> AI Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">AI-Generated Probability</span>
                  <span className="text-white font-medium">{aiScore}%</span>
                </div>
                <Progress value={aiScore} color={aiScore > 60 ? 'red' : aiScore > 40 ? 'amber' : 'green'} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Manipulation Probability</span>
                  <span className="text-white font-medium">{manipulationScore}%</span>
                </div>
                <Progress value={manipulationScore} color={manipulationScore > 60 ? 'red' : manipulationScore > 40 ? 'amber' : 'green'} />
              </div>
            </CardContent>
          </Card>

          {/* File Integrity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" /> File Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">SHA-256</span>
                  <span className="text-xs font-mono text-white bg-slate-800 px-2 py-1 rounded">{truncateHash(analysis.file_hash, 32)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Integrity Status</span>
                  <span className="flex items-center gap-1 text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Verified
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" /> Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {metadata.creation_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created</span>
                    <span className="text-white">{metadata.creation_date}</span>
                  </div>
                )}
                {metadata.software && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Software</span>
                    <span className="text-white">{metadata.software}</span>
                  </div>
                )}
                {metadata.device && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Device</span>
                    <span className="text-white">{metadata.device}</span>
                  </div>
                )}
                {!metadata.creation_date && !metadata.software && (
                  <p className="text-slate-500 text-center py-2">No metadata available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Detection Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" /> Detection Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {indicators.length > 0 ? indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                    {ind.severity === 'high' ? (
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : ind.severity === 'medium' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-white">{ind.description || ind.type}</p>
                      <p className="text-xs text-slate-400 capitalize">{ind.severity} severity</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-center py-4">No specific indicators detected</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Explainable AI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" /> Explainable AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Why was this content flagged?</h4>
                  <p className="text-sm text-white">{explainability.summary || 'Analysis complete.'}</p>
                </div>
                {explainability.key_factors?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Key Factors</h4>
                    <ul className="space-y-1">
                      {explainability.key_factors.map((factor: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {explainability.recommendation && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-300"><strong>Recommendation:</strong> {explainability.recommendation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <div className="flex flex-wrap gap-3">
              <Link to={`/reports/${analysis.id}`}>
                <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Download Report</Button>
              </Link>
              <Link to="/evidence">
                <Button variant="ghost"><Eye className="w-4 h-4 mr-2" /> View Evidence</Button>
              </Link>
              <Link to="/analyze">
                <Button variant="ghost"><Plus className="w-4 h-4 mr-2" /> New Analysis</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
