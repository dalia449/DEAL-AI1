import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { siteAerial, heroVilla, villaInterior } from '../data/mockProjects';
import {
  Upload,
  Camera,
  CameraOff,
  Compass,
  Sun,
  Wind,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
  Info
} from 'lucide-react';
import { ArchitecturalProject } from '../types';
import { CameraPermissionModal, CameraDeniedNotice } from './CameraPermissionModal';

interface SiteAnalysisStudioProps {
  project: ArchitecturalProject;
  onSelectOption: (optionId: string) => void;
  onOpen3DView: () => void;
}

export const SiteAnalysisStudio: React.FC<SiteAnalysisStudioProps> = ({
  project,
  onSelectOption,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const [activeOptionId, setActiveOptionId] = useState<string>('option-b');
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [siteImage, setSiteImage] = useState<string>(siteAerial);

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
        throw new Error('Camera API not supported');
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
      console.warn('Camera access denied for site analysis:', err);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSiteImage(dataUrl);
      stopCameraStream();
    }
  };

  const options = [
    {
      id: 'option-a',
      title: t('optionA'),
      tagline: 'Expansive formal reception halls with monolithic exterior volume',
      spaceUtilization: '86%',
      footprintArea: '620 m²',
      energyScore: 'B+',
      image: heroVilla,
      advantages: [
        'Maximizes gross floor area and formal reception capacity',
        'Direct street vehicular ingress with concealed parking',
        'Consolidated high-efficiency central service core'
      ],
      limitations: [
        'Reduced perimeter landscaping buffer',
        'High afternoon cooling load on western facade without deep overhangs'
      ],
      recommendation: 'Recommended if client program prioritizes grand guest entertainment and multi-generational suites.'
    },
    {
      id: 'option-b',
      title: t('optionB'),
      tagline: 'Traditional introverted courtyard design with private garden and water reflection pool',
      spaceUtilization: '74%',
      footprintArea: '520 m²',
      energyScore: 'A',
      image: villaInterior,
      advantages: [
        'Absolute family visual privacy from street and neighbors',
        'Natural microclimate evaporative cooling via central reflection pool',
        '360° natural daylight to all living areas and bedrooms'
      ],
      limitations: [
        'Requires perimeter double-loaded circulation corridor'
      ],
      recommendation: 'Highly recommended for luxury residential living in hot arid climates.'
    },
    {
      id: 'option-c',
      title: t('optionC'),
      tagline: 'Staggered dual-wing configuration capturing prevailing north-westerly breezes',
      spaceUtilization: '78%',
      footprintArea: '560 m²',
      energyScore: 'A-',
      image: heroVilla,
      advantages: [
        'Passive cross-ventilation reduces mechanical cooling by up to 22%',
        'Acoustically separates formal majlis from private family quarters'
      ],
      limitations: [
        'Higher external facade surface-to-volume ratio'
      ],
      recommendation: 'Optimal for health-conscious living and sustainable energy-efficiency targets.'
    },
    {
      id: 'option-d',
      title: t('optionD'),
      tagline: 'Southward angled roof canopy optimized for 38 kWp integrated photovoltaic solar tiles',
      spaceUtilization: '71%',
      footprintArea: '500 m²',
      energyScore: 'A+',
      image: villaInterior,
      advantages: [
        'Near net-zero electrical generation offset potential',
        'Self-shading cantilevered balconies shield floor-to-ceiling glass'
      ],
      limitations: [
        'Strict structural geometry dictated by solar zenith angles'
      ],
      recommendation: 'Ideal for LEED Platinum or Saudi Mostadam certified green buildings.'
    }
  ];

  const currentOption = options.find(o => o.id === activeOptionId) || options[1];

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Explicit Two-Step Permission Modal */}
      <CameraPermissionModal
        isOpen={showPermissionModal}
        featureName="Scan Land Parcel"
        explanation="DEAL needs access to your camera to capture live survey photography of the site for orientation and boundary analysis."
        onAllow={handleConfirmAllowCamera}
        onCancel={() => setShowPermissionModal(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#D8CEC2] gap-4">
        <div>
          <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
            {t('siteTitle')}
          </h1>
          <p className="text-xs text-[#756A60] mt-1">
            {t('siteSubtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Camera Button */}
          {!cameraActive ? (
            <button
              onClick={() => setShowPermissionModal(true)}
              className="px-3.5 py-2 bg-[#EFE6DA] text-[#54483C] border border-[#D8CEC2] rounded text-xs font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Open Camera</span>
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
            <span>{t('uploadSitePhoto')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSiteImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="hidden"
            />
          </label>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzing ? 'Analyzing Microclimate...' : t('analyzeLandBtn')}</span>
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

      {/* Mandatory Engineering Disclaimer */}
      <div className="mt-4 p-3 bg-[#EFE6DA]/70 border border-[#D8CEC2] rounded text-xs text-[#756A60] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#54483C] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t('disclaimerEngineering')}
        </p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Viewport / Map / Camera Stream */}
        <div className="lg:col-span-7 bg-[#EFE6DA] rounded border border-[#D8CEC2] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-[#54483C] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              {project.location} · {project.landArea} m²
            </span>
            <span className="text-[#756A60]">Survey Grid: North-Facing (32° Offset)</span>
          </div>

          <div className="relative flex-1 min-h-[420px] rounded overflow-hidden border border-[#D8CEC2] bg-[#FAF7F2] flex items-center justify-center">
            {cameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center">
                  <button
                    onClick={handleCaptureFrame}
                    className="px-5 py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Site Frame</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={siteImage}
                  alt="Site land parcel aerial view"
                  className="w-full h-full object-cover"
                />

                {/* Architectural Boundary & Zoning Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon
                    points="18,15 82,15 88,85 12,85"
                    fill="rgba(84, 72, 60, 0.08)"
                    stroke="#54483C"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                  <polygon
                    points="26,24 74,24 78,76 22,76"
                    fill="rgba(138, 122, 106, 0.15)"
                    stroke="#8A7A6A"
                    strokeWidth="0.8"
                  />
                  <line x1="12" y1="12" x2="88" y2="12" stroke="#54483C" strokeWidth="2.5" />
                </svg>

                <div className="absolute top-4 left-6 bg-[#FAF7F2]/95 backdrop-blur px-3 py-1.5 rounded text-[11px] text-[#3F3832] border border-[#D8CEC2] shadow-sm">
                  <span className="font-semibold text-[#54483C]">Access:</span> Primary 30m Boulevard
                </div>

                <div className="absolute top-4 right-6 bg-[#FAF7F2]/95 backdrop-blur px-3 py-1.5 rounded text-[11px] text-[#3F3832] border border-[#D8CEC2] shadow-sm flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-700" />
                  <span>Solar Zenith: 68° Azimuth</span>
                </div>

                <div className="absolute bottom-4 left-6 bg-[#54483C] text-[#FAF7F2] px-3.5 py-1.5 rounded text-xs shadow-md">
                  Buildable Footprint Zone: 72%
                </div>
              </>
            )}
          </div>

          {/* Interactive Sun Path Simulator */}
          <div className="mt-4 bg-[#FAF7F2] p-3 rounded border border-[#D8CEC2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-700" />
              <span className="font-medium text-[#3F3832]">Sun Orientation Simulator:</span>
              <span className="text-[#756A60]">{sunAngle}° Zenith</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={sunAngle}
              onChange={(e) => setSunAngle(parseInt(e.target.value))}
              className="w-48 accent-[#54483C]"
            />
          </div>
        </div>

        {/* Right: AI Analysis & Placement Options */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5">
            <h3 className="text-xs font-semibold text-[#54483C] uppercase tracking-wider mb-4">
              Microclimate & Sustainability Diagnostics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2]">
                <div className="flex items-center gap-1.5 text-[#54483C] font-semibold mb-1">
                  <Sun className="w-4 h-4" />
                  <span>Solar Efficiency</span>
                </div>
                <div className="text-lg font-bold text-[#3F3832]">94 / 100</div>
                <span className="text-[10px] text-[#756A60]">High solar generation potential</span>
              </div>

              <div className="bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2]">
                <div className="flex items-center gap-1.5 text-[#54483C] font-semibold mb-1">
                  <Wind className="w-4 h-4" />
                  <span>Passive Airflow</span>
                </div>
                <div className="text-lg font-bold text-[#3F3832]">89 / 100</div>
                <span className="text-[10px] text-[#756A60]">Prevailing sea breeze capture</span>
              </div>
            </div>

            <p className="text-[11px] text-[#756A60] mt-3 leading-relaxed">
              "Consider incorporating an internal shaded courtyard and deep cantilevered overhangs to mitigate intense south-western solar radiation while funneling cool night-time winds."
            </p>
          </div>

          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#54483C] uppercase tracking-wider">
                {t('placementOptions')}
              </h3>
              <span className="text-[10px] text-[#8A7A6A]">4 Alternatives</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setActiveOptionId(opt.id);
                    onSelectOption(opt.id);
                  }}
                  className={`p-2.5 rounded border text-left transition-colors ${
                    activeOptionId === opt.id
                      ? 'bg-[#54483C] text-[#FAF7F2] border-[#54483C]'
                      : 'bg-[#EFE6DA] text-[#3F3832] border-[#D8CEC2] hover:bg-[#D8CEC2]'
                  }`}
                >
                  <span className="font-semibold text-xs block">{opt.title.split('—')[0]}</span>
                  <span className="text-[10px] opacity-80 block truncate">
                    {opt.title.split('—')[1] || opt.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2] flex-1 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#3F3832]">{currentOption.title}</h4>
                  <span className="px-2 py-0.5 bg-[#FAF7F2] text-[#54483C] rounded font-semibold text-[11px] border border-[#D8CEC2]">
                    {currentOption.spaceUtilization} Util.
                  </span>
                </div>
                <p className="text-[11px] text-[#756A60] mt-1">{currentOption.tagline}</p>

                <div className="mt-3">
                  <span className="font-semibold text-[11px] text-[#54483C] block mb-1">Key Advantages:</span>
                  <ul className="space-y-1 text-[11px] text-[#3F3832]">
                    {currentOption.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <span className="font-semibold text-[11px] text-[#756A60] block mb-1">Potential Considerations:</span>
                  <ul className="space-y-1 text-[11px] text-[#756A60]">
                    {currentOption.limitations.map((lim, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8CEC2] flex items-center justify-between">
                <span className="text-[11px] text-[#756A60]">Footprint: {currentOption.footprintArea}</span>
                <button
                  onClick={onOpen3DView}
                  className="px-3.5 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{t('applyToProject')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
