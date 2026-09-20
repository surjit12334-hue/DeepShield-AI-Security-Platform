import { Link } from 'react-router-dom';
import { Shield, ScanLine, Brain, Lock, Eye, FileText, AlertTriangle, ArrowRight, CheckCircle, Upload, Search, ShieldCheck, FileBarChart } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Button } from '../components/ui/Button';

const features = [
  { icon: ScanLine, title: 'Deepfake Detection', description: 'Advanced AI models analyze visual and audio content for signs of synthetic generation or manipulation.' },
  { icon: Brain, title: 'AI Content Analysis', description: 'Multi-modal analysis across images, video, audio, and text to detect AI-generated content.' },
  { icon: Lock, title: 'Evidence Integrity', description: 'SHA-256 hashing and chain of custody tracking ensure evidence authenticity and admissibility.' },
  { icon: Eye, title: 'Explainable Results', description: 'Understand why content was flagged with transparent AI reasoning and detection indicators.' },
  { icon: FileText, title: 'Secure Reports', description: 'Generate comprehensive security reports with detailed findings and professional formatting.' },
  { icon: AlertTriangle, title: 'Threat Intelligence', description: 'Stay informed about emerging deepfake techniques and AI manipulation trends.' },
];

const steps = [
  { num: '01', icon: Upload, title: 'Upload', description: 'Submit your digital content for secure analysis' },
  { num: '02', icon: Search, title: 'Analyze', description: 'AI models scan for manipulation indicators' },
  { num: '03', icon: ShieldCheck, title: 'Verify', description: 'Review detailed findings and risk assessment' },
  { num: '04', icon: FileBarChart, title: 'Report', description: 'Generate comprehensive security reports' },
];

const stats = [
  { label: 'AI-Powered Analysis', description: 'Multi-format detection capabilities' },
  { label: 'Multi-Format Detection', description: 'Images, video, audio, and text' },
  { label: 'Evidence Integrity', description: 'Cryptographic verification' },
  { label: 'Secure Reporting', description: 'Professional documentation' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <LandingNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <Shield className="w-3.5 h-3.5" />
                AI-POWERED DIGITAL SECURITY
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Detect AI Manipulation.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Verify Digital Evidence.</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-lg">
                DeepShield uses AI-powered analysis to identify potential deepfakes, synthetic media, and suspicious digital content while preserving evidence integrity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/analyze">
                  <Button size="lg">
                    Analyze Content <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">Explore Platform</Button>
                </Link>
              </div>
            </div>

            {/* Hero Visual - Analysis Pipeline */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#111827] border border-slate-700/50 rounded-2xl p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-500 ml-2">analysis-pipeline.exe</span>
                </div>

                {[
                  { label: 'Uploaded File', sub: 'image_001.jpg • 2.4 MB', icon: Upload, color: 'text-blue-400', status: 'complete' },
                  { label: 'AI Analysis', sub: 'Running detection models...', icon: Brain, color: 'text-cyan-400', status: 'processing' },
                  { label: 'Risk Assessment', sub: 'Calculating threat level...', icon: AlertTriangle, color: 'text-amber-400', status: 'waiting' },
                  { label: 'Report Generated', sub: 'Pending analysis completion', icon: FileText, color: 'text-slate-500', status: 'waiting' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.status === 'complete' ? 'bg-emerald-500/20' : step.status === 'processing' ? 'bg-cyan-500/20 animate-pulse' : 'bg-slate-700/50'}`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{step.label}</p>
                      <p className="text-xs text-slate-400">{step.sub}</p>
                    </div>
                    {step.status === 'complete' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {step.status === 'processing' && <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />}
                  </div>
                ))}

                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Risk Assessment</span>
                    <span className="text-sm font-bold text-amber-400">MEDIUM</span>
                  </div>
                  <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[62%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Detection Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive AI-powered analysis tools to identify and assess potentially manipulated digital content.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-[#1a1f2e] border border-slate-700/50 rounded-xl hover:border-blue-500/30 transition-all duration-200 group">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                  <f.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A streamlined four-step process from upload to comprehensive security report.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="text-5xl font-bold text-slate-800 mb-4">{s.num}</div>
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 w-24 border-t border-dashed border-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-[#1a1f2e] border border-slate-700/50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{s.label}</h3>
                <p className="text-xs text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Analyze?</h2>
          <p className="text-slate-400 mb-8">Start detecting potential deepfakes and AI-generated content today.</p>
          <Link to="/register">
            <Button size="lg">
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-white">DEEPSHIELD</span>
          </div>
          <p className="text-xs text-slate-500">&copy; 2024 DeepShield. All rights reserved. AI analysis results are estimates, not definitive determinations.</p>
        </div>
      </footer>
    </div>
  );
}
