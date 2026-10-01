import React from 'react';
import { useI18n } from '../lib/i18n';
import { siteAerial } from '../data/mockProjects';
import { Compass, Globe, Wind, Zap, Car, Shield, Sparkles } from 'lucide-react';

export const SmartCityStudio: React.FC = () => {
  const { t } = useI18n();

  const cityModules = [
    {
      title: 'City-Scale Land Analysis & Microclimate',
      desc: 'Topographical hydrology mapping, thermal island mitigation, and macro wind corridors across multi-kilometer development zones.',
      icon: Wind,
      readiness: 'R&D Phase 2'
    },
    {
      title: 'Parametric Building Distribution',
      desc: 'Generative zoning algorithms optimizing FAR, shadow encroachment, and sunlight rights for adjacent residential towers.',
      icon: Globe,
      readiness: 'Algorithmic Prototype'
    },
    {
      title: 'Smart Infrastructure & Mobility Simulation',
      desc: 'Autonomous transit routing, multi-tier utility conduits, and pedestrian walkability indices integrated with 3D master plans.',
      icon: Car,
      readiness: 'Conceptual Vision'
    },
    {
      title: 'District Net-Zero Microgrid Optimization',
      desc: 'Decentralized district cooling loops, peak solar balancing, and rainwater retention swales across community clusters.',
      icon: Zap,
      readiness: 'Engineering Horizon'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[#D8CEC2]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#54483C] text-[#FAF7F2] rounded text-[10px] font-semibold uppercase tracking-wider">
            Future Horizon
          </span>
          <span className="text-xs text-[#756A60]">Next-Generation Urban Scalability</span>
        </div>
        <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832] mt-1">
          {t('navSmartCity')}
        </h1>
        <p className="text-xs text-[#756A60]">
          Scaling DEAL artificial intelligence from individual buildings to district-wide urban simulations and sustainable smart cities.
        </p>
      </div>

      {/* Urban Visualization Banner */}
      <div className="mt-6 bg-[#EFE6DA] rounded border border-[#D8CEC2] p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-56 rounded border border-[#D8CEC2] overflow-hidden relative">
          <img src={siteAerial} alt="District scale parcel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cad-grid opacity-40"></div>
          <div className="absolute bottom-3 left-3 bg-[#54483C]/90 text-[#FAF7F2] backdrop-blur px-2.5 py-1 rounded text-xs">
            District Scale Grid: 10,000,000 m²
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-3 text-xs text-[#3F3832]">
          <h3 className="font-serif-arch text-base font-bold text-[#54483C]">
            Architectural Vision: From Parcel to Metropolis
          </h3>
          <p className="text-[#756A60] leading-relaxed">
            While current DEAL release focuses on high-precision single parcels and architectural complexes, our neural simulation models are architected for city-scale ingestion.
          </p>
          <div className="p-3 bg-[#FAF7F2] rounded border border-[#D8CEC2] text-[11px] text-[#54483C]">
            Notice: This module represents our long-term engineering scalability roadmap for government masterplanners and real estate development authorities.
          </div>
        </div>
      </div>

      {/* Grid of Future Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {cityModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div key={idx} className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#EFE6DA] flex items-center justify-center text-[#54483C]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#3F3832]">{mod.title}</h4>
                </div>
                <span className="text-[10px] text-[#8A7A6A] font-medium bg-[#EFE6DA] px-2 py-0.5 rounded">
                  {mod.readiness}
                </span>
              </div>
              <p className="text-xs text-[#756A60] leading-relaxed mt-2">
                {mod.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
