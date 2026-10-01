import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject } from '../types';
import { Layers, Palette, Check, Sliders, Sparkles, Box } from 'lucide-react';

interface MaterialsStudioProps {
  project: ArchitecturalProject;
  onUpdateProject: (updated: ArchitecturalProject) => void;
  onOpen3DView: () => void;
}

export const MaterialsStudio: React.FC<MaterialsStudioProps> = ({
  project,
  onUpdateProject,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const [activeCategory, setActiveCategory] = useState<
    'Stone' | 'Marble' | 'Concrete' | 'Wood' | 'Glass' | 'Metal' | 'Tiles' | 'Plaster' | 'Fabric'
  >('Stone');

  const [targetSurface, setTargetSurface] = useState<'facade' | 'flooring' | 'walls' | 'roof'>('facade');

  const categories = ['Stone', 'Marble', 'Concrete', 'Wood', 'Glass', 'Metal', 'Tiles', 'Plaster', 'Fabric'];

  const materialsList: Record<string, Array<{ name: string; hex: string; roughness: number; reflection: number; desc: string }>> = {
    Stone: [
      { name: 'Riyadh Travertine', hex: '#EAE1D5', roughness: 0.85, reflection: 0.15, desc: 'Porous warm limestone with linear sedimentary grain' },
      { name: 'Jerusalem Limestone', hex: '#DFD5C6', roughness: 0.8, reflection: 0.2, desc: 'Dense cream limestone with honed tactile finish' },
      { name: 'Basalt Charcoal Paver', hex: '#4A443E', roughness: 0.9, reflection: 0.1, desc: 'Volcanic textured dark paver for perimeter decks' }
    ],
    Marble: [
      { name: 'Calacatta Warm Gold', hex: '#FAF7F2', roughness: 0.2, reflection: 0.85, desc: 'Italian white marble with warm taupe and champagne veining' },
      { name: 'Statuario Extra', hex: '#F4EFEB', roughness: 0.25, reflection: 0.8, desc: 'Crisp architectural book-matched slabs' },
      { name: 'Emperador Bronze', hex: '#584C3F', roughness: 0.35, reflection: 0.7, desc: 'Rich earthen marble with fine crystalline networks' }
    ],
    Concrete: [
      { name: 'Fair-Faced Architectural Concrete', hex: '#D6CEC3', roughness: 0.75, reflection: 0.25, desc: 'Smooth tie-rod exposed finish with micro-pores' },
      { name: 'Warm Greige Concrete', hex: '#C8BEB2', roughness: 0.8, reflection: 0.2, desc: 'Warm aggregate concrete with brushed texture' },
      { name: 'Fluted Architectural Panels', hex: '#D1C7BA', roughness: 0.85, reflection: 0.15, desc: 'Vertical rhythm casting for boundary facade walls' }
    ],
    Wood: [
      { name: 'Fumed White Oak', hex: '#8F7D6B', roughness: 0.6, reflection: 0.35, desc: 'Wide-plank timber flooring with matte polyurethane seal' },
      { name: 'Architectural Cedar Slats', hex: '#6D5B4B', roughness: 0.7, reflection: 0.25, desc: 'Exterior weather-resistant brise-soleil battens' },
      { name: 'American Black Walnut', hex: '#4E4137', roughness: 0.55, reflection: 0.4, desc: 'Deep warm wood for interior acoustic paneling' }
    ],
    Glass: [
      { name: 'Low-E Solar Control Glass', hex: '#EAF0F2', roughness: 0.05, reflection: 0.95, desc: 'Double-glazed vacuum acoustic glass with 0.28 SHGC' },
      { name: 'Fluted Privacy Glass', hex: '#F0ECE6', roughness: 0.3, reflection: 0.7, desc: 'Ribbed translucent partitions for bathrooms & majlis' }
    ],
    Metal: [
      { name: 'Brushed Champagne Bronze', hex: '#A89988', roughness: 0.4, reflection: 0.65, desc: 'Anodized aluminum mullions and door hardware' },
      { name: 'Charcoal Architectural Steel', hex: '#3B3530', roughness: 0.5, reflection: 0.5, desc: 'Structural beams and pergola support columns' }
    ],
    Tiles: [
      { name: 'Large-Format Porcelain Terrazzo', hex: '#E5DCD0', roughness: 0.45, reflection: 0.55, desc: '60×120cm rectified tiles with river-stone aggregate' }
    ],
    Plaster: [
      { name: 'Venetian Mineral Stucco', hex: '#F6EFE5', roughness: 0.9, reflection: 0.1, desc: 'Breathable lime plaster with subtle hand-troweled texture' }
    ],
    Fabric: [
      { name: 'Natural Bouclé Yarn', hex: '#FAF7F2', roughness: 0.95, reflection: 0.05, desc: 'Cozy woolen upholstery with textured loops' }
    ]
  };

  // DEAL Architectural Color Palette
  const dealPalettes = [
    { name: 'Warm Ivory', hex: '#F6EFE5' },
    { name: 'Soft Cream', hex: '#EFE6DA' },
    { name: 'Warm Off-White', hex: '#FAF7F2' },
    { name: 'Deep Architectural Brown', hex: '#54483C' },
    { name: 'Dark Charcoal Text', hex: '#3F3832' },
    { name: 'Secondary Taupe', hex: '#756A60' },
    { name: 'Stone Border', hex: '#D8CEC2' },
    { name: 'Light Brown Accent', hex: '#8A7A6A' },
    { name: 'Subtle Beige', hex: '#D9CBBE' }
  ];

  const handleApplyMaterial = (mat: { name: string; hex: string }) => {
    if (targetSurface === 'facade') {
      onUpdateProject({ ...project, facadeStyle: mat.name as any, exteriorColor: mat.hex });
    } else if (targetSurface === 'flooring') {
      onUpdateProject({ ...project, flooringMaterial: mat.name as any });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
            {t('materialsTitle')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            {t('materialsSubtitle')} · PBR Architectural Library
          </p>
        </div>

        <button
          onClick={onOpen3DView}
          className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto"
        >
          <Box className="w-4 h-4" />
          <span>Inspect in 3D Studio</span>
        </button>
      </div>

      {/* Target Surface Selector */}
      <div className="flex items-center gap-2 mt-6 border-b border-[#D8CEC2] pb-3 text-xs">
        <span className="text-[#756A60] mr-2">Target Surface:</span>
        <button
          onClick={() => setTargetSurface('facade')}
          className={`px-3 py-1.5 rounded transition-colors ${
            targetSurface === 'facade' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          Exterior Facade ({project.facadeStyle})
        </button>
        <button
          onClick={() => setTargetSurface('flooring')}
          className={`px-3 py-1.5 rounded transition-colors ${
            targetSurface === 'flooring' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          Flooring ({project.flooringMaterial})
        </button>
        <button
          onClick={() => setTargetSurface('walls')}
          className={`px-3 py-1.5 rounded transition-colors ${
            targetSurface === 'walls' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          Interior Partitions
        </button>
        <button
          onClick={() => setTargetSurface('roof')}
          className={`px-3 py-1.5 rounded transition-colors ${
            targetSurface === 'roof' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          Roof Soffit
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#54483C] text-[#FAF7F2]'
                : 'bg-[#EFE6DA] text-[#3F3832] hover:bg-[#D8CEC2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {(materialsList[activeCategory] || []).map((mat, idx) => (
          <div
            key={idx}
            className="bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col justify-between hover:border-[#8A7A6A] transition-colors"
          >
            <div>
              {/* Texture Swatch */}
              <div
                className="h-28 rounded border border-[#D8CEC2] mb-3 relative overflow-hidden flex items-end p-2.5 shadow-inner"
                style={{ backgroundColor: mat.hex }}
              >
                <div className="bg-[#FAF7F2]/90 backdrop-blur px-2 py-0.5 rounded text-[10px] text-[#54483C] border border-[#D8CEC2]">
                  Roughness: {mat.roughness * 100}%
                </div>
              </div>

              <h4 className="font-semibold text-sm text-[#3F3832]">{mat.name}</h4>
              <p className="text-[11px] text-[#756A60] mt-1">{mat.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D8CEC2] flex items-center justify-between">
              <span className="text-[10px] text-[#756A60]">Specular Refl: {Math.round(mat.reflection * 100)}%</span>
              <button
                onClick={() => handleApplyMaterial(mat)}
                className="px-3 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs hover:bg-[#3F3832] transition-colors"
              >
                Apply to {targetSurface}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DEAL Curated Architectural Color Swatches */}
      <div className="mt-8 bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5">
        <h3 className="font-serif-arch text-sm font-semibold text-[#3F3832] mb-1">
          DEAL Official Architectural Color Palette
        </h3>
        <p className="text-xs text-[#756A60] mb-4">
          Natural earth and limestone mineral tones calibrated for authentic architectural realism.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {dealPalettes.map((c, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateProject({ ...project, exteriorColor: c.hex })}
              className="flex flex-col items-center group text-center"
            >
              <div
                className="w-12 h-12 rounded border border-[#D8CEC2] group-hover:scale-105 transition-transform shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-[10px] font-medium text-[#3F3832] mt-1.5 truncate max-w-[80px]">
                {c.name}
              </span>
              <span className="text-[9px] text-[#756A60] uppercase">{c.hex}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
