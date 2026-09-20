export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Analysis {
  id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  content_type: string;
  file_hash: string;
  status: string;
  risk_level: string | null;
  confidence_score: number | null;
  ai_detection_score: number | null;
  manipulation_score: number | null;
  metadata_analysis: any;
  detection_indicators: any[];
  explainability_data: any;
  pipeline_results: any;
  created_at: string;
  completed_at: string | null;
}

export interface Evidence {
  id: string;
  evidence_id: string;
  original_filename: string;
  file_hash: string;
  file_size: string;
  mime_type: string | null;
  status: string;
  chain_of_custody: any[];
  created_at: string;
  uploaded_at: string | null;
  analyzed_at: string | null;
}

export interface ThreatIndicator {
  id: string;
  type: string;
  value: string;
  severity: string;
  description: string;
  source: string;
  confidence: number;
  created_at: string;
}

export interface Report {
  report_id: string;
  analysis_id: string;
  filename: string;
  risk_level: string;
  created_at: string;
}

export interface Stats {
  total_analyses: number;
  threats_detected: number;
  evidence_files: number;
  reports_generated: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
