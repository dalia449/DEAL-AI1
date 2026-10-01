import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject, ClientFeedback, ProjectVersion } from '../types';
import { heroVilla, villaInterior } from '../data/mockProjects';
import {
  Eye,
  MessageSquare,
  History,
  CheckCircle2,
  Share2,
  Lock,
  Send,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ClientPresentationStudioProps {
  project: ArchitecturalProject;
  onAddComment: (comment: ClientFeedback) => void;
  onRestoreVersion: (version: ProjectVersion) => void;
}

export const ClientPresentationStudio: React.FC<ClientPresentationStudioProps> = ({
  project,
  onAddComment,
  onRestoreVersion
}) => {
  const { t } = useI18n();

  const [activeVariant, setActiveVariant] = useState<'a' | 'b'>('a');
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(project.clientName || 'Client');
  const [activeTab, setActiveTab] = useState<'explore' | 'compare' | 'versions'>('explore');

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    const newComment: ClientFeedback = {
      id: `comm-${Date.now()}`,
      author: authorName.trim() || 'Client',
      text: commentText.trim(),
      date: 'Just now',
      status: 'pending'
    };
    onAddComment(newComment);
    setCommentText('');
    alert('Your comment has been submitted to the lead architectural engineer.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header with Client Presentation Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#54483C] text-[#FAF7F2] rounded text-[10px] font-semibold uppercase tracking-wider">
              Client View
            </span>
            <span className="text-xs text-[#756A60]">Read-Only Client Experience</span>
          </div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832] mt-1">
            {project.name}
          </h1>
          <p className="text-xs text-[#756A60]">
            Client: {project.clientName} · {project.location}
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              activeTab === 'explore' ? 'bg-[#54483C] text-[#FAF7F2]' : 'bg-[#EFE6DA] text-[#3F3832]'
            }`}
          >
            Virtual Walkthrough
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              activeTab === 'compare' ? 'bg-[#54483C] text-[#FAF7F2]' : 'bg-[#EFE6DA] text-[#3F3832]'
            }`}
          >
            Compare Variants
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              activeTab === 'versions' ? 'bg-[#54483C] text-[#FAF7F2]' : 'bg-[#EFE6DA] text-[#3F3832]'
            }`}
          >
            Version History ({project.versions.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left: Presentation 3D / Render Viewport */}
        <div className="lg:col-span-8 bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
          <div className="relative flex-1 min-h-[440px] rounded overflow-hidden border border-[#D8CEC2] bg-[#2C241E]">
            <img
              src={activeVariant === 'a' ? heroVilla : villaInterior}
              alt="Client presentation render"
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Overlaid Variant Switcher Controls for Client */}
            <div className="absolute top-4 left-4 bg-[#FAF7F2]/95 backdrop-blur px-3 py-2 rounded border border-[#D8CEC2] shadow text-xs">
              <span className="text-[#756A60] block text-[10px] uppercase font-semibold mb-1">
                Aesthetic Scheme Variant:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveVariant('a')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeVariant === 'a' ? 'bg-[#54483C] text-[#FAF7F2]' : 'bg-[#EFE6DA] text-[#3F3832]'
                  }`}
                >
                  Scheme A: Travertine Exterior
                </button>
                <button
                  onClick={() => setActiveVariant('b')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeVariant === 'b' ? 'bg-[#54483C] text-[#FAF7F2]' : 'bg-[#EFE6DA] text-[#3F3832]'
                  }`}
                >
                  Scheme B: Courtyard Interior
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-[#FAF7F2]/90 backdrop-blur px-3 py-1.5 rounded text-xs text-[#3F3832] border border-[#D8CEC2]">
              Facade: {project.facadeStyle} · Flooring: {project.flooringMaterial}
            </div>
          </div>
        </div>

        {/* Right: Client Feedback & Version History */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {activeTab === 'versions' ? (
            <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-4 h-4" />
                Immutable Version Tree
              </span>

              <div className="space-y-3 flex-1 overflow-y-auto text-xs">
                {project.versions.map((ver) => (
                  <div key={ver.id} className="p-3 bg-[#EFE6DA] rounded border border-[#D8CEC2]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#3F3832]">{ver.versionName}</span>
                      <span className="text-[10px] text-[#756A60]">{ver.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#756A60] mb-2">{ver.description}</p>
                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="text-[10px] text-[#54483C] font-semibold hover:underline"
                    >
                      Inspect Snapshot →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Client Review & Feedback
              </span>
              <p className="text-[11px] text-[#756A60] mb-4">
                Leave notes directly on the design. The engineering team will review in the next revision cycle.
              </p>

              {/* Existing Comments */}
              <div className="flex-1 space-y-2.5 overflow-y-auto mb-4 text-xs">
                {project.clientComments.map((comm) => (
                  <div key={comm.id} className="p-2.5 bg-[#EFE6DA] rounded border border-[#D8CEC2]">
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="font-semibold text-[#54483C]">{comm.author}</span>
                      <span className="text-[#756A60] text-[10px]">{comm.date}</span>
                    </div>
                    <p className="text-[11px] text-[#3F3832]">{comm.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <div className="pt-3 border-t border-[#D8CEC2] space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Al-Mansoor)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-3 py-1.5 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
                />
                <textarea
                  rows={3}
                  placeholder={t('commentPlaceholder')}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded p-2 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C] resize-none"
                />
                <button
                  onClick={handleSendComment}
                  className="w-full py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('submitComment')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
