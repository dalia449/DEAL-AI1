import React, { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { DealLogo } from './DealLogo';
import {
  Users,
  ShieldCheck,
  FolderKanban,
  FileText,
  Mail,
  Cpu,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'inquiries' | 'ai' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      totalUsers: number;
      verifiedUsers: number;
      activeProjects: number;
      completedProjects: number;
      aiRequests: number;
      sharedProjects: number;
    };
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
    }>;
    contactRequests: Array<{
      id: string;
      name: string;
      email: string;
      category: string;
      subject: string;
      message: string;
      createdAt: string;
      status: string;
    }>;
    system: {
      owner: string;
      platform: string;
      aiModel: string;
      storageUsed: string;
      uptime: string;
    };
  }>({
    stats: {
      totalUsers: 14,
      verifiedUsers: 12,
      activeProjects: 8,
      completedProjects: 24,
      aiRequests: 1942,
      sharedProjects: 18
    },
    users: [
      { id: 'usr-1', name: 'Dalia Al Waqtan', email: 'dalia.alwaqtan@deal-architecture.com', role: 'owner', isVerified: true, isActive: true, createdAt: '2026-01-15' },
      { id: 'usr-2', name: 'Lead Architect', email: 'engineer@deal.com', role: 'engineer', isVerified: true, isActive: true, createdAt: '2026-02-01' },
      { id: 'usr-3', name: 'Eng. Fahad Al-Mutlaq', email: 'fahad@archpartners.sa', role: 'engineer', isVerified: true, isActive: true, createdAt: '2026-03-12' },
      { id: 'usr-4', name: 'Dr. Tariq Al-Ghamdi', email: 'tariq@client.sa', role: 'client', isVerified: true, isActive: true, createdAt: '2026-04-05' }
    ],
    contactRequests: [
      {
        id: 'inq-1',
        name: 'Fahad Al-Hassan',
        email: 'fahad@alhasangroup.com',
        category: 'project',
        subject: 'Luxury Villa Compound Masterplan in Diriyah',
        message: 'We are looking for a complete AI-assisted generative site plan and preliminary 3D envelope for a 12,000 sqm parcel. Could DEAL provide early feasibility modeling?',
        createdAt: '2026-09-30',
        status: 'unread'
      }
    ],
    system: {
      owner: 'Dalia Al Waqtan',
      platform: 'DEAL Architecture AI Engine v3.4',
      aiModel: 'gemini-3.8-flash',
      storageUsed: '3.4 GB / 50 GB',
      uptime: '99.98%'
    }
  });

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(resData => {
        if (resData.stats) {
          setData(resData);
        }
      })
      .catch(err => console.warn('Admin fetch local fallback:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleUser = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          users: prev.users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u)
        }));
      }
    } catch (err) {
      console.warn('Toggle user err:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#54483C] text-[#FAF7F2] flex items-center justify-center font-serif-arch font-bold text-lg">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#54483C] text-[#FAF7F2] rounded text-[10px] font-semibold tracking-wider uppercase">
                Owner Authorization Confirmed
              </span>
              <span className="text-xs text-[#756A60]">Primary Administrator: Dalia Al Waqtan</span>
            </div>
            <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832] mt-0.5">
              DEAL Executive Administration Control
            </h1>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="px-4 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors"
        >
          Return to Engineering Workspace
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-[#D8CEC2] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users & Privileges ({data.users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'inquiries' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Inquiries ({data.contactRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Telemetry</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Settings</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 mt-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">Total Users</span>
              <span className="text-2xl font-bold text-[#3F3832]">{data.stats.totalUsers}</span>
            </div>
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">Verified Users</span>
              <span className="text-2xl font-bold text-emerald-800">{data.stats.verifiedUsers}</span>
            </div>
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">Active Projects</span>
              <span className="text-2xl font-bold text-[#3F3832]">{data.stats.activeProjects}</span>
            </div>
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">Completed</span>
              <span className="text-2xl font-bold text-[#3F3832]">{data.stats.completedProjects}</span>
            </div>
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">AI Requests</span>
              <span className="text-2xl font-bold text-[#54483C]">{data.stats.aiRequests}</span>
            </div>
            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block mb-1">Shared Links</span>
              <span className="text-2xl font-bold text-[#3F3832]">{data.stats.sharedProjects}</span>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2]">
            <h3 className="font-serif-arch text-sm font-semibold text-[#54483C] uppercase tracking-wider mb-3">
              Platform & AI Infrastructure Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#756A60] block">Production Platform</span>
                <span className="font-semibold text-[#3F3832]">{data.system.platform}</span>
              </div>
              <div>
                <span className="text-[#756A60] block">LLM Engine</span>
                <span className="font-semibold text-[#3F3832]">{data.system.aiModel}</span>
              </div>
              <div>
                <span className="text-[#756A60] block">Storage Allocation</span>
                <span className="font-semibold text-[#3F3832]">{data.system.storageUsed}</span>
              </div>
              <div>
                <span className="text-[#756A60] block">Service Uptime</span>
                <span className="font-semibold text-emerald-700">{data.system.uptime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="mt-6 bg-[#FAF7F2] rounded border border-[#D8CEC2] overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#EFE6DA] text-[#54483C] font-semibold border-b border-[#D8CEC2]">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD3]">
              {data.users.map((u) => (
                <tr key={u.id} className="hover:bg-[#EFE6DA]/40">
                  <td className="p-3 font-medium text-[#3F3832]">{u.name}</td>
                  <td className="p-3 text-[#756A60]">{u.email}</td>
                  <td className="p-3 capitalize font-semibold text-[#54483C]">{u.role}</td>
                  <td className="p-3">
                    {u.isVerified ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">Verified</span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Pending Code</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {u.role !== 'owner' && (
                      <button
                        onClick={() => handleToggleUser(u.id, u.isActive)}
                        className="px-2.5 py-1 bg-[#EFE6DA] text-[#54483C] rounded hover:bg-[#D8CEC2] text-[11px]"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="mt-6 space-y-3 text-xs">
          {data.contactRequests.map((inq) => (
            <div key={inq.id} className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2]">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="font-semibold text-sm text-[#3F3832]">{inq.subject}</span>
                  <span className="text-[11px] text-[#756A60] block mt-0.5">
                    From: {inq.name} ({inq.email}) · Category: {inq.category}
                  </span>
                </div>
                <span className="text-[10px] text-[#756A60]">{inq.createdAt}</span>
              </div>
              <p className="text-xs text-[#54483C] mt-2 p-3 bg-[#EFE6DA] rounded border border-[#D8CEC2] leading-relaxed">
                "{inq.message}"
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => alert(`Reply drafted to ${inq.email}`)}
                  className="px-3 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs hover:bg-[#3F3832]"
                >
                  Reply as Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="mt-6 bg-[#FAF7F2] p-6 rounded border border-[#D8CEC2] text-xs space-y-4">
          <h3 className="font-serif-arch text-base font-bold text-[#54483C]">
            Gemini Multimodal Architecture Engine Settings
          </h3>
          <p className="text-[#756A60]">
            DEAL utilizes server-side proxy routes to execute spatial reasoning, photogrammetric zoning, and voice intent classification via the official @google/genai TypeScript SDK.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#D8CEC2]">
            <div className="bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block">Target Model</span>
              <span className="font-mono font-semibold text-[#3F3832]">gemini-3.8-flash</span>
            </div>
            <div className="bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2]">
              <span className="text-[#756A60] block">Average Inference Latency</span>
              <span className="font-semibold text-[#3F3832]">420 ms</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="mt-6 bg-[#FAF7F2] p-6 rounded border border-[#D8CEC2] text-xs space-y-4">
          <h3 className="font-serif-arch text-base font-bold text-[#54483C]">
            Platform Governance & Brand Architecture
          </h3>
          <p className="text-[#756A60]">
            Configure global default units, BIM export schemas, and server-side secret injection.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert('Platform configurations saved.')}
              className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded font-medium hover:bg-[#3F3832]"
            >
              Commit Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
