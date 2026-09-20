import { useState } from 'react';
import { Settings, Shield, Key, Trash2, Copy, Check, Lock, Smartphone, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'profile', label: 'Profile', icon: Settings },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'api', label: 'API', icon: Key },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return;
    success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleGenerateApiKey = () => {
    const key = 'ds_' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setApiKey(key);
    success('API key generated');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap',
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <Card>
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button onClick={handleChangePassword}>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-white">Authenticator App</p>
                    <p className="text-xs text-slate-400">Use an authenticator app for 2FA</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    twoFactor ? 'bg-blue-600' : 'bg-slate-600'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                    twoFactor ? 'translate-x-5.5' : 'translate-x-0.5'
                  )} style={{ left: twoFactor ? '22px' : '2px' }} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'api' && (
        <Card>
          <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Generate API keys for programmatic access to DeepShield.</p>
            {apiKey ? (
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-800 px-3 py-2 rounded text-sm text-white font-mono truncate">{apiKey}</code>
                <Button variant="ghost" size="sm" onClick={handleCopyKey}>
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No API keys generated yet.</p>
            )}
            <Button onClick={handleGenerateApiKey} variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" /> Generate New Key
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Data Retention</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Analysis data is retained for 90 days by default.</p>
              <select className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                <option>30 days</option>
                <option selected>90 days</option>
                <option>180 days</option>
                <option>365 days</option>
              </select>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                <div>
                  <p className="text-sm text-white">Delete All Analysis Data</p>
                  <p className="text-xs text-slate-400">Permanently remove all your analyses and evidence</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => { setShowDeleteConfirm(false); success('Data deletion requested'); }}
            title="Delete All Data"
            message="This action cannot be undone. All your analyses, evidence, and reports will be permanently deleted."
            confirmLabel="Delete Everything"
          />
        </div>
      )}
    </div>
  );
}
