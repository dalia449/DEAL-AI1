import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject, ProjectStatus } from '../types';
import {
  Plus,
  Compass,
  FileUp,
  Box,
  Hand,
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sliders
} from 'lucide-react';

interface DashboardViewProps {
  projects: ArchitecturalProject[];
  onOpenProject: (project: ArchitecturalProject) => void;
  onNewProjectClick: () => void;
  onNavigateSection: (section: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onOpenProject,
  onNewProjectClick,
  onNavigateSection
}) => {
  const { t, isRTL } = useI18n();

  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 lg:p-8 overflow-y-auto">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#D8CEC2] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#756A60] font-semibold block mb-1">
            ARCHITECTURAL DESIGN PLATFORM
          </span>
          <h1 className="font-serif-arch text-2xl lg:text-3xl font-bold text-[#3F3832]">
            {t('dashboardOverview')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            Transforming land surveys, hand sketches, and spatial parameters into realistic 3D architectural reality.
          </p>
        </div>

        <button
          onClick={onNewProjectClick}
          className="px-4 py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('actionNewProject')}</span>
        </button>
      </div>

      {/* Quick Action Tiles (Thin Architectural Cards) */}
      <div className="mt-6">
        <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider block mb-3">
          {t('quickActions')}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={onNewProjectClick}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionNewProject')}</span>
            <span className="text-[10px] text-[#756A60]">New workspace</span>
          </button>

          <button
            onClick={() => onNavigateSection('site')}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionAnalyzeLand')}</span>
            <span className="text-[10px] text-[#756A60]">Solar & zoning</span>
          </button>

          <button
            onClick={() => onNavigateSection('paper')}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <FileUp className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionUploadDrawing')}</span>
            <span className="text-[10px] text-[#756A60]">Paper → 3D Model</span>
          </button>

          <button
            onClick={() => onNavigateSection('3d')}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <Box className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionStart3D')}</span>
            <span className="text-[10px] text-[#756A60]">Realistic materials</span>
          </button>

          <button
            onClick={() => onNavigateSection('hand')}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <Hand className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionHandTracking')}</span>
            <span className="text-[10px] text-[#756A60]">Spatial gestures</span>
          </button>

          <button
            onClick={() => onNavigateSection('reports')}
            className="p-3.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] hover:border-[#8A7A6A] hover:bg-[#FAF7F2] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded bg-[#FAF7F2] flex items-center justify-center text-[#54483C] mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#3F3832] block">{t('actionGenerateReport')}</span>
            <span className="text-[10px] text-[#756A60]">Printable CAD sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs for Projects */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8CEC2] pb-3 gap-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-[#54483C] text-[#FAF7F2]'
                : 'text-[#756A60] hover:text-[#3F3832]'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'in_progress'
                ? 'bg-[#54483C] text-[#FAF7F2]'
                : 'text-[#756A60] hover:text-[#3F3832]'
            }`}
          >
            {t('inProgress')}
          </button>
          <button
            onClick={() => setStatusFilter('client_review')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'client_review'
                ? 'bg-[#54483C] text-[#FAF7F2]'
                : 'text-[#756A60] hover:text-[#3F3832]'
            }`}
          >
            {t('clientReview')}
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-[#54483C] text-[#FAF7F2]'
                : 'text-[#756A60] hover:text-[#3F3832]'
            }`}
          >
            {t('completed')}
          </button>
        </div>

        <span className="text-xs text-[#756A60]">
          Showing {filteredProjects.length} architectural envelopes
        </span>
      </div>

      {/* Modular Architectural Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#EFE6DA] rounded border border-[#D8CEC2] overflow-hidden flex flex-col justify-between hover:border-[#8A7A6A] transition-all group"
          >
            <div>
              {/* Architectural Thumbnail */}
              <div className="h-52 w-full relative overflow-hidden bg-[#2C241E]">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur px-2.5 py-1 rounded text-xs text-[#54483C] font-semibold border border-[#D8CEC2]">
                  {project.projectType}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#54483C]/90 text-[#FAF7F2] px-2.5 py-1 rounded text-xs">
                  {project.landArea} m² · {project.floors} Floors
                </div>
              </div>

              {/* Project Card Content */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-serif-arch text-lg font-bold text-[#3F3832] group-hover:text-[#54483C] transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-[10px] text-[#756A60] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.updatedAt}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-[#756A60]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A7A6A] flex-shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#3F3832]">Client:</span>
                    <span>{project.clientName}</span>
                  </div>
                </div>

                {/* AI Site Analysis Metric Pill Replacement (Unboxed Architectural Metadata) */}
                <div className="mt-4 pt-3 border-t border-[#D8CEC2] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#756A60] block">Land Utilization</span>
                    <span className="font-bold text-[#54483C]">
                      {project.siteData.usableArea} m² ({Math.round((project.siteData.usableArea / project.siteData.parcelArea) * 100)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#756A60] block">Solar / Energy Score</span>
                    <span className="font-bold text-emerald-800">
                      {project.siteData.solarIndex} / 100 (Optimal)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="p-5 pt-0 border-t border-[#D8CEC2] mt-2 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-[#756A60] capitalize">
                Status: {project.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => onOpenProject(project)}
                className="px-3.5 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{t('openProject')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
