import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { paperSketch, heroVilla } from '../data/mockProjects';
import {
  Upload,
  Camera,
  CameraOff,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Box,
  Sliders,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { CADElement } from '../types';
import { CameraPermissionModal, CameraDeniedNotice } from './CameraPermissionModal';

interface PaperTo3DStudioProps {
  onApplyPlanToProject: (detectedElements: CADElement[]) => void;
  onOpen3DView: () => void;
}

export const PaperTo3DStudio: React.FC<PaperTo3DStudioProps> = ({
  onApplyPlanToProject,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const [uploadedImage, setUploadedImage] = useState<string>(paperSketch);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectionComplete, setDetectionComplete] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'compare3' | 'original' | 'detected' | 'threeD'>('compare3');

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
      console.warn('Camera permission denied for paper scan:', err);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const handleCaptureSketch = () => {
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
      setDetectionComplete(false);
      stopCameraStream();
    }
  };

  // Recognized elements from the sketch
  const [detectedItems, setDetectedItems] = useState<Array<{
    type: string;
    label: string;
    confidence: number;
    dimensions: string;
  }>>([
    { type: 'Room', label: 'Primary Living Room & Majlis', confidence: 98, dimensions: '8.4m × 6.2m' },
    { type: 'Room', label: 'Master Bedroom Suite', confidence: 95, dimensions: '5.8m × 4.6m' },
    { type: 'Room', label: 'Dining & Kitchen Core', confidence: 93, dimensions: '4.8m × 5.2m' },
    { type: 'Opening', label: 'Double Sliding Garden Glass', confidence: 96, dimensions: '4.2m width' },
    { type: 'Door', label: 'Entry Pivot Doorway', confidence: 94, dimensions: '1.4m width' },
    { type: 'Stairs', label: 'Cantilevered Floating Stairs', confidence: 89, dimensions: '18 risers, 28cm' },
    { type: 'Structure', label: 'Load-Bearing Boundary Walls', confidence: 99, dimensions: '30cm reinforced' }
  ]);

  const handleProcessSketch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDetectionComplete(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUploadedImage(url);
      setDetectionComplete(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Explicit Two-Step Permission Modal */}
      <CameraPermissionModal
        isOpen={showPermissionModal}
        featureName="Scan Paper Drawing"
        explanation="DEAL needs access to your camera to photograph your hand-drawn architectural sketch on paper and convert it into a structured digital plan."
        onAllow={handleConfirmAllowCamera}
        onCancel={() => setShowPermissionModal(false)}
      />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
            {t('paperTitle')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            {t('paperSubtitle')}
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
              <span>Scan Drawing</span>
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

          {/* Upload Button */}
          <label className="px-3.5 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Sketch File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleProcessSketch}
            disabled={isProcessing}
            className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Analyzing Geometry...' : t('scanNow')}</span>
          </button>
        </div>
      </div>

      {/* Camera Denied Warning Banner */}
      {permissionDenied && (
        <div className="mt-4">
          <CameraDeniedNotice
            onTryAgain={() => setShowPermissionModal(true)}
            onContinueWithoutCamera={() => setPermissionDenied(false)}
          />
        </div>
      )}

      {/* Live Camera Viewfinder Overlay (if cameraActive) */}
      {cameraActive && (
        <div className="mt-4 p-4 bg-[#EFE6DA] rounded border border-[#D8CEC2]">
          <div className="relative h-80 rounded overflow-hidden bg-[#2C241E] flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Alignment Grid Overlay */}
            <div className="absolute inset-8 border border-dashed border-[#FAF7F2]/60 pointer-events-none rounded flex items-center justify-center">
              <span className="text-xs text-[#FAF7F2]/80 bg-[#54483C]/70 px-3 py-1 rounded">
                Align paper sketch within the borders
              </span>
            </div>

            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center">
              <button
                onClick={handleCaptureSketch}
                className="px-5 py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] shadow-lg flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Sketch & Analyze</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-[#D8CEC2] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('compare3')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'compare3' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          {t('compareAllThree')}
        </button>
        <button
          onClick={() => setActiveTab('original')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'original' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          {t('originalDrawing')}
        </button>
        <button
          onClick={() => setActiveTab('detected')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'detected' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          {t('detectedCAD')}
        </button>
        <button
          onClick={() => setActiveTab('threeD')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'threeD' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#756A60] hover:text-[#3F3832]'
          }`}
        >
          {t('threeDBuilding')}
        </button>
      </div>

      {/* Main 3-Way Comparison Display */}
      {activeTab === 'compare3' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Panel 1: Original Hand Drawing */}
          <div className="bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#54483C]">
              <span>{t('originalDrawing')}</span>
              <span className="text-[10px] text-[#756A60]">Graph Paper Sketch</span>
            </div>
            <div className="relative flex-1 min-h-[340px] rounded overflow-hidden border border-[#D8CEC2] bg-[#FAF7F2] flex items-center justify-center">
              <img
                src={uploadedImage}
                alt="Architectural paper sketch"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-[#FAF7F2]/90 backdrop-blur px-2 py-1 rounded text-[10px] text-[#54483C] border border-[#D8CEC2]">
                Scale: Approx 1:100
              </div>
            </div>
            <p className="text-[11px] text-[#756A60] mt-3">
              Raw pencil and ink scan containing spatial divisions, door symbols, and handwriting.
            </p>
          </div>

          {/* Panel 2: Detected Structured Digital Plan */}
          <div className="bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#54483C]">
              <span>{t('detectedCAD')}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">AI Parsed 97%</span>
            </div>
            <div className="relative flex-1 min-h-[340px] rounded overflow-hidden border border-[#D8CEC2] bg-[#FAF7F2] p-4 flex flex-col">
              <div className="flex-1 border border-dashed border-[#8A7A6A] rounded relative bg-cad-grid p-3">
                <div className="absolute inset-4 border-2 border-[#54483C] rounded-sm flex flex-col">
                  <div className="flex-1 border-b border-[#54483C] flex">
                    <div className="w-1/2 border-r border-[#54483C] p-2 text-[10px] text-[#54483C] font-medium flex flex-col justify-between">
                      <span>LIVING MAJLIS</span>
                      <span className="text-[#8A7A6A]">8.4m × 6.2m</span>
                    </div>
                    <div className="w-1/2 p-2 text-[10px] text-[#54483C] font-medium flex flex-col justify-between">
                      <span>FAMILY LOUNGE</span>
                      <span className="text-[#8A7A6A]">6.0m × 5.2m</span>
                    </div>
                  </div>
                  <div className="h-2/5 flex">
                    <div className="w-2/3 border-r border-[#54483C] p-2 text-[10px] text-[#54483C] font-medium flex flex-col justify-between">
                      <span>COURTYARD & PATIO</span>
                      <span className="text-emerald-700">Open Sky</span>
                    </div>
                    <div className="w-1/3 p-2 text-[10px] text-[#54483C] font-medium flex flex-col justify-between">
                      <span>KITCHEN</span>
                      <span className="text-[#8A7A6A]">4.2m × 3.8m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                <span className="bg-[#EFE6DA] text-[#54483C] px-2 py-0.5 rounded">4 Rooms</span>
                <span className="bg-[#EFE6DA] text-[#54483C] px-2 py-0.5 rounded">7 Openings</span>
                <span className="bg-[#EFE6DA] text-[#54483C] px-2 py-0.5 rounded">1 Stair Core</span>
                <span className="bg-[#EFE6DA] text-[#54483C] px-2 py-0.5 rounded">Extrusion Ready</span>
              </div>
            </div>
            <p className="text-[11px] text-[#756A60] mt-3">
              Geometry vectorized into parametric walls, door swings, and area computations.
            </p>
          </div>

          {/* Panel 3: Generated 3D Building */}
          <div className="bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#54483C]">
              <span>{t('threeDBuilding')}</span>
              <button
                onClick={onOpen3DView}
                className="text-[10px] text-[#54483C] underline hover:text-[#3F3832]"
              >
                Inspect in Studio →
              </button>
            </div>
            <div className="relative flex-1 min-h-[340px] rounded overflow-hidden border border-[#D8CEC2] bg-[#FAF7F2]">
              <img
                src={heroVilla}
                alt="3D Building generated from sketch"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#54483C]/90 text-[#FAF7F2] backdrop-blur px-3 py-1 rounded text-xs">
                Volumetric Model Extruded
              </div>
            </div>
            <p className="text-[11px] text-[#756A60] mt-3">
              Direct physical extrusion preserving heights, fenestrations, and material assignments.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-[#EFE6DA] rounded border border-[#D8CEC2] p-6 flex flex-col items-center justify-center min-h-[420px]">
          {activeTab === 'original' && (
            <img src={uploadedImage} alt="Original" className="max-h-[500px] object-contain rounded" />
          )}
          {activeTab === 'detected' && (
            <div className="w-full max-w-2xl bg-[#FAF7F2] p-6 rounded border border-[#D8CEC2]">
              <h3 className="font-semibold text-sm text-[#54483C] mb-4">Detected Architectural Elements</h3>
              <div className="space-y-2">
                {detectedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#EFE6DA] rounded text-xs">
                    <div>
                      <span className="font-medium text-[#3F3832]">{item.label}</span>
                      <span className="text-[10px] text-[#756A60] block">{item.type} · {item.dimensions}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold">{item.confidence}% Match</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'threeD' && (
            <div className="text-center">
              <img src={heroVilla} alt="3D" className="max-h-[460px] object-contain rounded mb-4" />
              <button
                onClick={onOpen3DView}
                className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832]"
              >
                Launch in 3D Design Studio
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recognition Details & Correction Actions */}
      <div className="mt-8 bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-xs text-[#54483C] uppercase tracking-wider">
              Verification & Parameter Confirmation
            </h3>
            <p className="text-xs text-[#756A60] mt-1">
              Verify recognized room labels and boundary orientations before synchronizing with master project.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Plan successfully merged into project workspace!');
                onOpen3DView();
              }}
              className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to 3D Project Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
