import React from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject } from '../types';
import { heroVilla, villaInterior, siteAerial } from '../data/mockProjects';
import { Box, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface TemplatesStudioProps {
  onLoadTemplate: (template: any) => void;
  onOpen3DView: () => void;
}

export const TemplatesStudio: React.FC<TemplatesStudioProps> = ({
  onLoadTemplate,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const templates = [
    {
      id: 'tmpl-modern-villa',
      title: 'Modern Courtyard Villa',
      category: 'Villa',
      area: '1,450 m²',
      floors: 2,
      facade: 'Travertine Stone',
      image: heroVilla,
      description: 'Award-winning contemporary desert architecture with internal olive tree courtyard, reflecting pool, and cantilevered sun canopy.',
      features: ['Central Courtyard Microclimate', 'Cantilevered Eaves', 'Smart Lighting Integration', 'Double-Height Living Volume']
    },
    {
      id: 'tmpl-luxury-residence',
      title: 'Diriyah Heritage Villa',
      category: 'Luxury Villa',
      area: '2,100 m²',
      floors: 2,
      facade: 'Textured Stucco',
      image: villaInterior,
      description: 'Najdi architectural fusion combining traditional earthen massing with floor-to-ceiling glass and private family gardens.',
      features: ['Thermal Mass Adobe Walls', 'Shaded Rooftop Terrace', 'Private Majlis Suite', 'Rainwater Cistern']
    },
    {
      id: 'tmpl-coastal-pavilion',
      title: 'Corniche Waterfront Loft & Office',
      category: 'Commercial / Office',
      area: '3,200 m²',
      floors: 3,
      facade: 'Fair-Faced Concrete',
      image: siteAerial,
      description: 'Minimalist post-tensioned concrete structural frame designed for open creative studios and high wind loads.',
      features: ['Column-Free Interior Spans', '360° Gulf Panoramic View', 'BREEAM Certified Envelope', 'Automated Shading Louvers']
    },
    {
      id: 'tmpl-eco-compact',
      title: 'Net-Zero Sustainable House',
      category: 'Sustainable House',
      area: '820 m²',
      floors: 2,
      facade: 'Cedar Wood Louvers',
      image: heroVilla,
      description: 'Passive solar house equipped with 40 kWp photovoltaic roof canopy and greywater biological filtration pond.',
      features: ['Net-Zero Energy Balance', 'Cross-Ventilation Wind Tower', 'Recycled Composite Siding', 'Geothermal Pre-cooling']
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[#D8CEC2]">
        <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
          {t('navTemplates')}
        </h1>
        <p className="text-xs text-[#756A60] mt-1">
          Ready-made verified architectural models optimized for judging demonstrations and rapid feasibility studies.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {templates.map(tmpl => (
          <div
            key={tmpl.id}
            className="bg-[#EFE6DA] rounded border border-[#D8CEC2] overflow-hidden flex flex-col justify-between hover:border-[#8A7A6A] transition-all"
          >
            <div>
              {/* Image Banner */}
              <div className="h-52 w-full relative overflow-hidden bg-[#2C241E]">
                <img
                  src={tmpl.image}
                  alt={tmpl.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur px-2.5 py-1 rounded text-xs text-[#54483C] font-semibold border border-[#D8CEC2]">
                  {tmpl.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#54483C]/90 text-[#FAF7F2] px-2.5 py-1 rounded text-xs">
                  {tmpl.area} · {tmpl.floors} Floors
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-serif-arch text-lg font-bold text-[#3F3832]">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-[#756A60] mt-1.5 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Features List */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {tmpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#3F3832]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-[#D8CEC2] mt-4 pt-3">
              <span className="text-[11px] text-[#756A60]">Facade: {tmpl.facade}</span>
              <button
                onClick={() => {
                  onLoadTemplate(tmpl);
                  onOpen3DView();
                }}
                className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Launch Template Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
