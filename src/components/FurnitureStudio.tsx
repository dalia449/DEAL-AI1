import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { furnitureItem } from '../data/mockProjects';
import {
  Upload,
  Camera,
  CameraOff,
  Sparkles,
  Layers,
  Box,
  CheckCircle2,
  Sliders,
  RotateCw,
  Trash2,
  Copy,
  Plus
} from 'lucide-react';
import { ArchitecturalProject } from '../types';
import { CameraPermissionModal, CameraDeniedNotice } from './CameraPermissionModal';

interface FurnitureStudioProps {
  project: ArchitecturalProject;
  onAddFurnitureToProject: (item: any) => void;
  onOpen3DView: () => void;
}

export const FurnitureStudio: React.FC<FurnitureStudioProps> = ({
  project,
  onAddFurnitureToProject,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const [uploadedImage, setUploadedImage] = useState<string>(furnitureItem);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedModel, setProcessedModel] = useState<boolean>(true);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>('boucle_chair');

  // Camera states
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleConfirmAllowCamera = async () => {
    setShowPermissionModal(false);
    setPermissionDenied(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera permission denied for furniture capture:', err);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const handleCaptureFurniture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setUploadedImage(dataUrl);
      setProcessedModel(false);
      stopCameraStream();
    }
  };

  const catalog = [
    {
      id: 'boucle_chair',
      name: 'Milanese Bouclé Lounge Armchair',
      category: 'Seating',
      dimensions: '0.95m × 0.90m × 0.78m',
      material: 'Natural Cream Bouclé / Solid Walnut',
      image: furnitureItem
    },
    {
      id: 'travertine_table',
      name: 'Monolithic Travertine Dining Table',
      category: 'Tables',
      dimensions: '2.80m × 1.10m × 0.76m',
      material: 'Brushed Italian Travertine',
      image: furnitureItem
    },
    {
      id: 'modular_sofa',
      name: 'Low-Slung Courtyard Sectional',
      category: 'Living',
      dimensions: '3.60m × 2.40m × 0.68m',
      material: 'Textured Sand Linen',
      image: furnitureItem
    }
  ];

  const handleProcessImage = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedModel(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      setProcessedModel(false);
    }
  };

  const currentItem = catalog.find(c => c.id === selectedCatalogItem) || catalog[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Explicit Two-Step Permission Modal */}
      <CameraPermissionModal
        isOpen={showPermissionModal}
        featureName="Furniture Capture"
        explanation="DEAL needs access to your camera to photograph a real furniture piece for background isolation and volumetric 3D modeling."
        onAllow={handleConfirmAllowCamera}
        onCancel={() => setShowPermissionModal(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
            {t('furnitureTitle')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            {t('furnitureSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera Button */}
          {!cameraActive ? (
            <button
              onClick={() => setShowPermissionModal(true)}
              className="px-3.5 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Furniture</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>● Camera Active</span>
              </span>
              <button
                onClick={stopCameraStream}
                className="px-3 py-1.5 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2]"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>Stop Camera</span>
              </button>
            </div>
          )}

          <label className="px-3.5 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{t('uploadFurniturePhoto')}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleProcessImage}
            disabled={isProcessing}
            className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Isolating Volumetric Mesh...' : t('approximate3D')}</span>
          </button>
        </div>
      </div>

      {/* Permission Denied Notice */}
      {permissionDenied && (
        <div className="mt-4">
          <CameraDeniedNotice
            onTryAgain={() => setShowPermissionModal(true)}
            onContinueWithoutCamera={() => setPermissionDenied(false)}
          />
        </div>
      )}

      {/* Live Camera Viewfinder Overlay */}
      {cameraActive && (
        <div className="mt-4 p-4 bg-[#EFE6DA] rounded border border-[#D8CEC2]">
          <div className="relative h-80 rounded overflow-hidden bg-[#2C241E] flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center">
              <button
                onClick={handleCaptureFurniture}
                className="px-5 py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] shadow-lg flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Furniture Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left: Input Image & Background Removal Stage */}
        <div className="lg:col-span-5 bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
          <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider mb-3">
            Source Image & Boundary Isolation
          </span>

          <div className="relative flex-1 min-h-[320px] rounded overflow-hidden border border-[#D8CEC2] bg-[#FAF7F2] flex items-center justify-center p-4">
            <img
              src={uploadedImage}
              alt="Uploaded furniture asset"
              className="max-h-[300px] object-contain"
            />
            <div className="absolute bottom-3 left-3 bg-[#FAF7F2]/90 backdrop-blur px-2.5 py-1 rounded text-[11px] text-[#54483C] border border-[#D8CEC2]">
              Background Isolated: Transparent Alpha
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D8CEC2]">
            <span className="text-[10px] text-[#756A60] uppercase tracking-wider block mb-2">
              Or Select Verified Architectural Piece
            </span>
            <div className="grid grid-cols-3 gap-2">
              {catalog.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCatalogItem(cat.id);
                    setUploadedImage(cat.image);
                    setProcessedModel(true);
                  }}
                  className={`p-2 rounded border text-left text-xs transition-colors ${
                    selectedCatalogItem === cat.id
                      ? 'bg-[#54483C] text-[#FAF7F2] border-[#54483C]'
                      : 'bg-[#FAF7F2] text-[#3F3832] border-[#D8CEC2] hover:bg-[#EFE6DA]'
                  }`}
                >
                  <span className="font-semibold block truncate">{cat.name}</span>
                  <span className="text-[9px] opacity-80">{cat.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 3D Approximated Volumetric Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-[#54483C] uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4" />
                Parametric 3D Mesh Approximation
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PBR Ready
              </span>
            </div>

            <div className="relative flex-1 min-h-[260px] bg-[#EFE6DA] rounded border border-[#D8CEC2] flex items-center justify-center bg-cad-grid p-6">
              <div className="text-center">
                <div className="w-36 h-36 mx-auto mb-3 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-[#8A7A6A] rounded-lg rotate-12 bg-white/20 backdrop-blur"></div>
                  <img
                    src={uploadedImage}
                    alt="Mesh preview"
                    className="relative z-10 max-h-28 object-contain drop-shadow-md"
                  />
                </div>
                <h4 className="font-serif-arch text-sm font-semibold text-[#3F3832]">
                  {currentItem.name}
                </h4>
                <p className="text-[11px] text-[#756A60] mt-0.5">
                  Dimensions: {currentItem.dimensions} · Material: {currentItem.material}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D8CEC2] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => alert('Duplicated furniture element')}
                  className="px-2.5 py-1.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] text-[#3F3832] flex items-center gap-1 hover:bg-[#D8CEC2]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => alert('Rotated furniture 45°')}
                  className="px-2.5 py-1.5 bg-[#EFE6DA] rounded border border-[#D8CEC2] text-[#3F3832] flex items-center gap-1 hover:bg-[#D8CEC2]"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate 45°</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onAddFurnitureToProject(currentItem);
                  alert(`Added "${currentItem.name}" to ${project.name} living pavilion.`);
                  onOpen3DView();
                }}
                className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('placeInRoom')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
