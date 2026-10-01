import React from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject } from '../types';
import { DealLogo } from './DealLogo';
import { heroVilla, villaInterior, siteAerial, paperSketch } from '../data/mockProjects';
import { Printer, Download, Compass, FileText, CheckCircle2 } from 'lucide-react';

interface ReportGeneratorStudioProps {
  project: ArchitecturalProject;
}

export const ReportGeneratorStudio: React.FC<ReportGeneratorStudioProps> = ({ project }) => {
  const { t } = useI18n();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDigital = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_deal_specification.json`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Action Toolbar (hidden when printing) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
            {t('reportsTitle')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            {t('reportsSubtitle')} · Document ID: REP-2026-089
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadDigital}
            className="px-3.5 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Digital JSON Bundle</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReport')} / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Architectural Presentation Booklet Layout (Printable) */}
      <div className="mt-6 max-w-4xl mx-auto w-full bg-white border border-[#D8CEC2] p-10 shadow-sm text-[#3F3832] space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Cover Header */}
        <div className="border-b-2 border-[#54483C] pb-8 flex flex-col items-center text-center">
          <DealLogo variant="full" size="lg" className="mb-4" />
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#756A60] font-semibold">
            Comprehensive Architectural Engineering Report
          </div>
          <h2 className="font-serif-arch text-3xl font-bold text-[#3F3832] mt-2">
            {project.name}
          </h2>
          <p className="text-xs text-[#756A60] mt-1">
            {project.buildingType} · {project.location} · Total Land Area: {project.landArea} m²
          </p>
        </div>

        {/* Section 01: Project & Client Overview */}
        <div>
          <div className="flex items-center justify-between border-b border-[#D8CEC2] pb-1.5 mb-3">
            <span className="font-serif-arch text-xs font-bold uppercase tracking-widest text-[#54483C]">
              01 — Project & Client Parameters
            </span>
            <span className="text-[10px] text-[#756A60]">Status: {project.status.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#FAF7F2] p-3 border border-[#E5DDD3]">
              <span className="text-[10px] text-[#756A60] block">Client Name</span>
              <span className="font-semibold text-[#3F3832]">{project.clientName}</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 border border-[#E5DDD3]">
              <span className="text-[10px] text-[#756A60] block">Gross Floor Area</span>
              <span className="font-semibold text-[#3F3832]">980 m²</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 border border-[#E5DDD3]">
              <span className="text-[10px] text-[#756A60] block">Levels</span>
              <span className="font-semibold text-[#3F3832]">{project.floors} Floors</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 border border-[#E5DDD3]">
              <span className="text-[10px] text-[#756A60] block">Primary Facade</span>
              <span className="font-semibold text-[#3F3832]">{project.facadeStyle}</span>
            </div>
          </div>
        </div>

        {/* Section 02: Site & Environmental Analysis */}
        <div>
          <div className="flex items-center justify-between border-b border-[#D8CEC2] pb-1.5 mb-3">
            <span className="font-serif-arch text-xs font-bold uppercase tracking-widest text-[#54483C]">
              02 — Site & Microclimate Zoning
            </span>
            <span className="text-[10px] text-[#756A60]">Orientation: {project.siteData.orientation}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
            <div className="md:col-span-5 h-48 border border-[#D8CEC2] overflow-hidden">
              <img src={siteAerial} alt="Site plot" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-7 space-y-2 text-[11px] leading-relaxed text-[#756A60]">
              <p>
                <strong className="text-[#3F3832]">Topographical Conditions:</strong> {project.siteData.topography}
              </p>
              <p>
                <strong className="text-[#3F3832]">Solar & Wind Orientation:</strong> The parcel receives dominant high-angle solar radiation along the south-western exposure, mitigated by deep cantilevered eaves and internal courtyard buffering.
              </p>
              <p>
                <strong className="text-[#3F3832]">Selected AI Placement:</strong> Central Courtyard & Bio-Oasis (Option B) yielding 74% usable efficiency and exceptional thermal protection.
              </p>
            </div>
          </div>
        </div>

        {/* Section 03: Architectural Floor Plan & Drawing Sheet Title Block */}
        <div>
          <div className="flex items-center justify-between border-b border-[#D8CEC2] pb-1.5 mb-3">
            <span className="font-serif-arch text-xs font-bold uppercase tracking-widest text-[#54483C]">
              03 — Approved Architectural Floor Plan
            </span>
            <span className="text-[10px] text-[#756A60]">Drawing Ref: DWG-001 (Rev 2.1)</span>
          </div>

          <div className="border border-[#54483C] p-4 bg-cad-grid relative min-h-[320px] flex flex-col justify-between">
            {/* North Arrow */}
            <div className="absolute top-4 right-4 flex flex-col items-center text-[#54483C]">
              <Compass className="w-6 h-6" />
              <span className="text-[9px] font-bold mt-0.5">NORTH (32°)</span>
            </div>

            {/* Conceptual Floor Layout Schematic */}
            <div className="my-auto mx-auto w-4/5 h-48 border-2 border-[#54483C] relative bg-white/70 p-3">
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 border-b border-[#54483C] flex">
                  <div className="w-1/2 border-r border-[#54483C] p-2 text-[10px] font-bold text-[#54483C]">
                    FORMAL MAJLIS
                  </div>
                  <div className="w-1/2 p-2 text-[10px] font-bold text-[#54483C]">
                    LIVING PAVILION
                  </div>
                </div>
                <div className="h-1/2 flex">
                  <div className="w-2/3 border-r border-[#54483C] p-2 text-[10px] font-bold text-emerald-800">
                    CENTRAL COURTYARD & WATER POOL
                  </div>
                  <div className="w-1/3 p-2 text-[10px] font-bold text-[#54483C]">
                    DINING & KITCHEN
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Drawing Title Block (Standard Engineering Title Block) */}
            <div className="border-t-2 border-[#54483C] pt-2 mt-4 grid grid-cols-4 gap-2 text-[10px]">
              <div>
                <span className="text-[#756A60] block">PROJECT</span>
                <span className="font-bold text-[#3F3832]">{project.name}</span>
              </div>
              <div>
                <span className="text-[#756A60] block">LEAD ENGINEER</span>
                <span className="font-bold text-[#3F3832]">Dalia Al Waqtan / DEAL</span>
              </div>
              <div>
                <span className="text-[#756A60] block">SCALE</span>
                <span className="font-bold text-[#3F3832]">1:100 @ A3</span>
              </div>
              <div>
                <span className="text-[#756A60] block">DATE / REV</span>
                <span className="font-bold text-[#3F3832]">OCTOBER 2026 / V2.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 04: Photorealistic 3D Renders */}
        <div>
          <div className="flex items-center justify-between border-b border-[#D8CEC2] pb-1.5 mb-3">
            <span className="font-serif-arch text-xs font-bold uppercase tracking-widest text-[#54483C]">
              04 — 3D Architectural Visualizations
            </span>
            <span className="text-[10px] text-[#756A60]">Photorealistic Raytrace</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#D8CEC2] overflow-hidden">
              <img src={heroVilla} alt="Exterior Render" className="w-full h-48 object-cover" />
              <div className="p-2 bg-[#FAF7F2] text-[10px] text-[#756A60]">
                Fig 4.1: Exterior Golden Hour Perspective with Cantilevered Eaves
              </div>
            </div>
            <div className="border border-[#D8CEC2] overflow-hidden">
              <img src={villaInterior} alt="Interior Render" className="w-full h-48 object-cover" />
              <div className="p-2 bg-[#FAF7F2] text-[10px] text-[#756A60]">
                Fig 4.2: Courtyard Living Pavilion with Integrated Olive Tree
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Preliminary Disclaimer */}
        <div className="border-t border-[#D8CEC2] pt-4 text-center text-[10px] text-[#756A60] leading-relaxed">
          <p>
            PRELIMINARY AI-POWERED ARCHITECTURAL CONCEPT DESIGN.
            NOT CERTIFIED ENGINEERING, STRUCTURAL, SURVEYING, GEOTECHNICAL, OR REGULATORY DECISIONS.
          </p>
          <p className="mt-1 font-serif-arch text-[11px] text-[#54483C] font-semibold">
            DEAL — DESIGN • ENGINEERING • ARCHITECTURE • LIVING
          </p>
        </div>
      </div>
    </div>
  );
};
