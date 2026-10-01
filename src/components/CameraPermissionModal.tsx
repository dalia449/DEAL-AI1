import React from 'react';
import { Camera, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface CameraPermissionModalProps {
  isOpen: boolean;
  featureName: string;
  explanation: string;
  onAllow: () => void;
  onCancel: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  featureName,
  explanation,
  onAllow,
  onCancel
}) => {
  const { isRTL } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/70 backdrop-blur-sm select-none">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded border border-[#D8CEC2] shadow-2xl p-6 text-xs text-[#3F3832]">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#54483C]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#756A60]">
              Camera Permission Request
            </span>
            <h3 className="font-serif-arch text-base font-bold text-[#3F3832]">
              {featureName}
            </h3>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs text-[#54483C] leading-relaxed bg-[#EFE6DA]/60 p-3.5 rounded border border-[#D8CEC2]">
          {explanation}
        </p>

        <div className="mt-3 text-[11px] text-[#756A60] space-y-1">
          <p>• DEAL never records or accesses your camera in the background.</p>
          <p>• The camera stream is processed strictly in your browser session.</p>
          <p>• You can stop and release the camera device at any time.</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-[#D8CEC2]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#EFE6DA] text-[#54483C] rounded font-medium hover:bg-[#D8CEC2] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAllow}
            className="px-5 py-2 bg-[#54483C] text-[#FAF7F2] rounded font-semibold hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Allow Camera</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CameraDeniedNoticeProps {
  onTryAgain: () => void;
  onContinueWithoutCamera: () => void;
}

export const CameraDeniedNotice: React.FC<CameraDeniedNoticeProps> = ({
  onTryAgain,
  onContinueWithoutCamera
}) => {
  return (
    <div className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2] text-xs text-[#3F3832] space-y-3">
      <div className="flex items-start gap-2.5 text-amber-800">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block">Camera access was denied.</span>
          <p className="text-xs text-[#756A60] mt-0.5 leading-relaxed">
            Camera access is required for live optical detection, but you can continue using DEAL without camera-based features (interactive vision emulation is supported).
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={onTryAgain}
          className="px-3.5 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded font-medium hover:bg-[#3F3832] transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onContinueWithoutCamera}
          className="px-3.5 py-1.5 bg-[#EFE6DA] text-[#54483C] rounded border border-[#D8CEC2] hover:bg-[#D8CEC2] transition-colors"
        >
          Continue Without Camera
        </button>
      </div>
    </div>
  );
};
