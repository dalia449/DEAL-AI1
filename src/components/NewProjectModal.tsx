import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject, ProjectType } from '../types';
import { heroVilla } from '../data/mockProjects';
import { X, Upload, Mic, Plus, Building, MapPin, Layers } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: ArchitecturalProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const { t } = useI18n();

  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Villa');
  const [location, setLocation] = useState('Riyadh, Saudi Arabia');
  const [landArea, setLandArea] = useState<number>(1200);
  const [buildingType, setBuildingType] = useState('Luxury Courtyard Residence');
  const [floors, setFloors] = useState<number>(2);
  const [requirements, setRequirements] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProject: ArchitecturalProject = {
      id: `proj-${Date.now()}`,
      name: projectName.trim(),
      clientName: clientName.trim() || 'Private Client',
      projectType,
      location,
      landArea: Number(landArea) || 1000,
      buildingType: buildingType || 'Architectural Residence',
      floors: Number(floors) || 2,
      status: 'in_progress',
      updatedAt: 'Just now',
      thumbnail: heroVilla,
      wallHeight: 3.4,
      wallThickness: 0.25,
      facadeStyle: 'Travertine Stone',
      roofStyle: 'Cantilevered Eaves',
      flooringMaterial: 'Natural Limestone',
      exteriorColor: '#EAE1D5',
      interiorLighting: 'Warm 3000K',
      siteData: {
        parcelArea: Number(landArea) || 1000,
        usableArea: Math.round((Number(landArea) || 1000) * 0.7),
        orientation: 'South-West',
        roadAccess: 'Primary Access Road',
        topography: 'Flat terrain with gentle slope',
        solarIndex: 92,
        ventilationScore: 86,
        selectedOptionId: 'option-b',
        options: []
      },
      elements: [
        { id: 'w1', type: 'wall', x: 2, y: 2, width: 0.3, length: 14, rotation: 0, label: 'Exterior Wall' },
        { id: 'r1', type: 'room', x: 3, y: 3, width: 8, length: 6, rotation: 0, label: 'Central Living Pavilion' }
      ],
      versions: [
        { id: 'v1', versionName: 'v1.0 Baseline Creation', timestamp: new Date().toISOString().split('T')[0], author: 'Lead Architect', description: 'Initial project setup' }
      ],
      clientComments: []
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/60 backdrop-blur-sm select-none">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded border border-[#D8CEC2] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs text-[#3F3832]">
        {/* Header */}
        <div className="p-5 border-b border-[#D8CEC2] flex items-center justify-between bg-[#EFE6DA]">
          <div>
            <h2 className="font-serif-arch text-lg font-bold text-[#54483C]">
              {t('actionNewProject')}
            </h2>
            <p className="text-[11px] text-[#756A60]">
              Initialize a new AI-assisted engineering & architectural workspace
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#756A60] hover:text-[#3F3832]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#756A60] font-medium block mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Al-Rawdah Contemporary Villa"
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>
            <div>
              <label className="text-[#756A60] font-medium block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Al-Hazza Family"
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#756A60] font-medium block mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-2.5 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              >
                <option value="Residential">Residential</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[#756A60] font-medium block mb-1">Land Area (m²)</label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>

            <div>
              <label className="text-[#756A60] font-medium block mb-1">Number of Floors</label>
              <input
                type="number"
                min="1"
                max="8"
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#756A60] font-medium block mb-1">Location Coordinates / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Riyadh / Jeddah / Eastern Province"
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>

            <div>
              <label className="text-[#756A60] font-medium block mb-1">Architectural Typology</label>
              <input
                type="text"
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                placeholder="Courtyard Villa / Biophilic Pavilion"
                className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
              />
            </div>
          </div>

          {/* Upload Attachments Area */}
          <div>
            <label className="text-[#756A60] font-medium block mb-1">
              Upload Land Survey, Sketches, Reference Images, or Voice Notes
            </label>
            <div className="border border-dashed border-[#8A7A6A] rounded p-4 text-center bg-[#EFE6DA]/50 flex flex-col items-center justify-center">
              <Upload className="w-5 h-5 text-[#8A7A6A] mb-1.5" />
              <span className="text-[11px] text-[#54483C] font-medium">
                Drag and drop site plan, CAD DWG, or paper sketches
              </span>
              <span className="text-[10px] text-[#756A60] mt-0.5">Supports JPG, PNG, PDF, audio notes</span>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const names = Array.from(e.target.files).map(f => f.name);
                    setUploadedFiles(prev => [...prev, ...names]);
                  }
                }}
                className="mt-2 text-[10px]"
              />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {uploadedFiles.map((fn, idx) => (
                  <span key={idx} className="bg-[#EFE6DA] px-2 py-0.5 rounded text-[10px] text-[#54483C]">
                    {fn}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[#756A60] font-medium block mb-1">
              Programmatic Requirements & Notes
            </label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. Must feature private courtyard, formal majlis for 25 guests, north-facing master suite, sustainable solar roof."
              className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded p-2 text-xs focus:outline-none focus:border-[#54483C] resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#D8CEC2] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#EFE6DA] text-[#54483C] rounded text-xs hover:bg-[#D8CEC2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initialize Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
