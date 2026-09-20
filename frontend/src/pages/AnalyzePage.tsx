import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileVideo, FileAudio, FileText, CheckCircle, Circle, Loader2, Shield, X } from 'lucide-react';
import { analysisAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn, formatFileSize } from '../utils/cn';

type UploadState = 'upload' | 'preview' | 'processing';

interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  hash: string;
}

const PIPELINE_STEPS = [
  { id: 'received', label: 'File Received', icon: FileText },
  { id: 'hash', label: 'Hash Generation', icon: Shield },
  { id: 'metadata', label: 'Metadata Analysis', icon: FileText },
  { id: 'ai', label: 'AI Model Analysis', icon: Shield },
  { id: 'manipulation', label: 'Manipulation Detection', icon: Shield },
  { id: 'risk', label: 'Risk Assessment', icon: Shield },
  { id: 'report', label: 'Report Generation', icon: FileText },
];

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.startsWith('audio/')) return FileAudio;
  return FileText;
}

async function computeHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('upload');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [options, setOptions] = useState({
    deepfake_detection: true,
    metadata_analysis: true,
    integrity_check: true,
    ai_content_detection: true,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState(false);


  const handleFile = async (file: File) => {
    const hash = await computeHash(file);
    setFileInfo({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      hash,
    });
    setState('preview');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleRunAnalysis = async () => {
    if (!fileInfo) return;
    setState('processing');
    setUploading(true);

    try {
      const uploadRes = await analysisAPI.upload(fileInfo.file);
      const id = uploadRes.data.analysis_id;

      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 600));
        setCompletedSteps(prev => new Set(prev).add(i));
      }

      await analysisAPI.run(id);
      navigate(`/analysis/${id}`);
    } catch (err) {
      console.error('Analysis failed:', err);
      setState('preview');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analyze Digital Content</h1>
        <p className="text-slate-400 mt-1">Upload media to detect potential AI manipulation and integrity issues.</p>
      </div>

      {state === 'upload' && (
        <Card>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 rounded-xl p-16 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload File</h3>
            <p className="text-slate-400 mb-2">Drag & Drop Here</p>
            <p className="text-sm text-slate-500 mb-6">or click to browse files</p>
            
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mb-6">
              <span>Maximum file size: 100MB</span>
              <span>•</span>
              <span>Supported: Images, Video, Audio, Documents</span>
            </div>

            <p className="text-xs text-slate-600">
              <Shield className="w-3 h-3 inline mr-1" />
              Your files are processed securely and never shared.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,audio/*,.txt,.pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </Card>
      )}

      {state === 'preview' && fileInfo && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = getFileIcon(fileInfo.type);
                  return <Icon className="w-7 h-7 text-blue-400" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white truncate">{fileInfo.name}</h3>
                  <button onClick={() => { setState('upload'); setFileInfo(null); }} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Size:</span>
                    <span className="ml-2 text-white">{formatFileSize(fileInfo.size)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <span className="ml-2 text-white">{fileInfo.type}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">SHA-256:</span>
                    <span className="ml-2 text-white font-mono text-xs break-all">{fileInfo.hash}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Options</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: 'deepfake_detection', label: 'Deepfake Detection', desc: 'Detect face swaps and voice cloning' },
                { key: 'metadata_analysis', label: 'Metadata Analysis', desc: 'Examine file metadata for anomalies' },
                { key: 'integrity_check', label: 'Integrity Check', desc: 'Verify file hash and integrity' },
                { key: 'ai_content_detection', label: 'AI Content Detection', desc: 'Identify AI-generated content' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-800/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options[opt.key as keyof typeof options]}
                    onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{opt.label}</p>
                    <p className="text-xs text-slate-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setState('upload'); setFileInfo(null); }}>
              Cancel
            </Button>
            <Button onClick={handleRunAnalysis} loading={uploading}>
              Run Security Analysis
            </Button>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Analysis Pipeline</h3>
          <div className="space-y-1">
            {PIPELINE_STEPS.map((step, i) => {
              const isCompleted = completedSteps.has(i);
              const isCurrent = currentStep === i && !isCompleted;
              const isWaiting = i > currentStep && !isCompleted;

              return (
                <div key={step.id} className={cn(
                  'flex items-center gap-4 p-4 rounded-lg transition-all duration-300',
                  isCurrent && 'bg-blue-500/10 border border-blue-500/20',
                  isCompleted && 'bg-emerald-500/5',
                )}>
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    isCompleted && 'bg-emerald-500/20',
                    isCurrent && 'bg-blue-500/20',
                    isWaiting && 'bg-slate-800/50'
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      'text-sm font-medium',
                      isCompleted && 'text-emerald-300',
                      isCurrent && 'text-white',
                      isWaiting && 'text-slate-500'
                    )}>{step.label}</p>
                  </div>
                  {isCompleted && <span className="text-xs text-emerald-400">Complete</span>}
                  {isCurrent && <span className="text-xs text-blue-400">Processing...</span>}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}