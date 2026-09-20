import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    outline: 'border border-slate-600 text-slate-300',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    low: { variant: 'success', label: 'Low Risk' },
    medium: { variant: 'warning', label: 'Medium Risk' },
    high: { variant: 'danger', label: 'High Risk' },
    critical: { variant: 'danger', label: 'Critical' },
  };

  const { variant, label } = config[level] || config.low;
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    pending: { variant: 'outline', label: 'Pending' },
    processing: { variant: 'info', label: 'Processing' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
    created: { variant: 'outline', label: 'Created' },
    uploaded: { variant: 'info', label: 'Uploaded' },
    analyzed: { variant: 'success', label: 'Analyzed' },
    exported: { variant: 'info', label: 'Exported' },
  };

  const { variant, label } = config[status] || { variant: 'default' as const, label: status };
  return <Badge variant={variant}>{label}</Badge>;
}
