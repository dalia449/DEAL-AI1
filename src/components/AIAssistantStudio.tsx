import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { ArchitecturalProject } from '../types';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Compass,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

interface AIAssistantStudioProps {
  project: ArchitecturalProject;
  onApplyModification: (details: string) => void;
  onOpen3DView: () => void;
}

export const AIAssistantStudio: React.FC<AIAssistantStudioProps> = ({
  project,
  onApplyModification,
  onOpen3DView
}) => {
  const { t } = useI18n();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInstruction, setVoiceInstruction] = useState<{
    transcript: string;
    intent: string;
    changes: Array<{ element: string; action: string; impact: string }>;
  } | null>({
    transcript: "Enlarge the living pavilion by 20% towards the courtyard pool and introduce two floor-to-ceiling glass panels on the north elevation.",
    intent: "Spatial Expansion & Daylighting Optimization",
    changes: [
      { element: "Living Pavilion", action: "Expand +1.8m toward South Garden", impact: "+16.8 m² floor space" },
      { element: "Fenestration", action: "Add 2 double-glazed sliding panels", impact: "+32% natural illuminance" },
      { element: "Circulation", action: "Recalibrate central corridor alignment", impact: "Zero bottleneck" }
    ]
  });

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      sender: 'assistant',
      text: `Hello. I am the DEAL Architectural AI Assistant. I have analyzed the active project "${project.name}" in ${project.location}. How can I assist your layout, orientation, or material specifications today?`,
      timestamp: '14:32'
    }
  ]);

  const [issues, setIssues] = useState<Array<{
    id: string;
    title: string;
    location: string;
    whyItMatters: string;
    suggestedImprovement: string;
    status: 'pending' | 'applied';
  }>>([
    {
      id: 'iss-1',
      title: 'Potential Circulation Bottleneck',
      location: 'Ground Floor Entrance Foyer to Dining Passage',
      whyItMatters: 'Clear passage width is 85 cm, which restricts wheelchair accessibility and luxury spatial proportions.',
      suggestedImprovement: 'Widen corridor to 120 cm by offsetting the powder room partition wall.',
      status: 'pending'
    },
    {
      id: 'iss-2',
      title: 'Door Swing Arc Conflict',
      location: 'Guest Powder Room & Service Pantry',
      whyItMatters: 'Exterior door swing intersects with the primary service circulation pathway.',
      suggestedImprovement: 'Incorporate an inward-sliding pocket door or reverse hinge swing direction.',
      status: 'pending'
    },
    {
      id: 'iss-3',
      title: 'Solar Glare on West-Facing Bedroom Glass',
      location: 'First Floor Master Suite West Elevation',
      whyItMatters: 'Unprotected afternoon solar gain increases HVAC mechanical loads during summer peak.',
      suggestedImprovement: 'Apply 80cm deep cantilevered cedar wood louvers or motorized external blinds.',
      status: 'pending'
    }
  ]);

  const handleSendMessage = () => {
    if (!inputQuery.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputQuery.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Context-aware architectural response
    setTimeout(() => {
      let reply = `Based on the ${project.buildingType} spatial model (${project.landArea} m²), I have reviewed your request. I recommend maintaining a 2.8m minimum setback on the street facade while grouping service rooms on the eastern boundary to protect private family spaces.`;
      if (userMsg.text.toLowerCase().includes('window') || userMsg.text.toLowerCase().includes('light')) {
        reply = `For optimal daylighting in ${project.location}, consider utilizing clerestory openings oriented toward the North-East to capture diffuse natural light without solar heat penalties.`;
      } else if (userMsg.text.toLowerCase().includes('kitchen') || userMsg.text.toLowerCase().includes('living')) {
        reply = `Connecting the kitchen with direct visual axis to the family living pavilion improves openness. Shall I generate a proposed layout modification for your review?`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const handleSimulateVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceInstruction({
        transcript: "Make the guest majlis 15% larger and move the powder room closer to the foyer.",
        intent: "Spatial Reorganization & Hospitality Expansion",
        changes: [
          { element: "Guest Majlis", action: "Expand width by 1.2m", impact: "+12.4 m²" },
          { element: "Powder Room", action: "Relocate 2.0m north adjacent to foyer", impact: "Direct foyer access" }
        ]
      });
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[#D8CEC2]">
        <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
          {t('aiAssistantTitle')}
        </h1>
        <p className="text-xs text-[#756A60] mt-1">
          {t('aiAssistantSubtitle')} · Active Model: {project.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left Column: Voice Instruction Panel & Chat */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Voice Input Section */}
          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-4 h-4" />
                {t('voiceTitle')}
              </span>
              <span className="text-[11px] text-[#756A60]">Real-Time Architectural Speech Parser</span>
            </div>

            {/* Voice Record Bar */}
            <div className="flex items-center gap-3 bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2]">
              <button
                onClick={handleSimulateVoice}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-[#54483C] text-[#FAF7F2] hover:bg-[#3F3832]'
                }`}
                title="Speak to DEAL"
              >
                <Mic className="w-4 h-4" />
              </button>

              <div className="flex-1 text-xs">
                <span className="font-medium text-[#3F3832]">
                  {isRecording ? t('voiceRecording') : 'Click microphone to issue voice instruction'}
                </span>
                <p className="text-[11px] text-[#756A60] mt-0.5">
                  {t('voiceSamplePrompt')}
                </p>
              </div>
            </div>

            {/* Voice Transcription & Proposed Action Diff */}
            {voiceInstruction && (
              <div className="mt-4 bg-[#EFE6DA] p-4 rounded border border-[#D8CEC2] text-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#756A60] uppercase tracking-wider block">
                      {t('transcription')}
                    </span>
                    <p className="font-medium text-[#3F3832] italic mt-0.5">
                      "{voiceInstruction.transcript}"
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-[#FAF7F2] text-[#54483C] text-[10px] rounded border border-[#D8CEC2]">
                    {voiceInstruction.intent}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#D8CEC2]">
                  <span className="text-[10px] text-[#54483C] font-semibold uppercase tracking-wider block mb-1.5">
                    {t('proposedChanges')}
                  </span>
                  <div className="space-y-1.5">
                    {voiceInstruction.changes.map((ch, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#FAF7F2] p-2 rounded border border-[#D8CEC2]">
                        <span className="font-medium text-[#3F3832]">{ch.element}: {ch.action}</span>
                        <span className="text-emerald-700 text-[10px] font-semibold">{ch.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Rule Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#756A60]">
                    AI changes require your explicit engineering approval.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVoiceInstruction(null)}
                      className="px-3 py-1.5 text-xs text-[#756A60] hover:text-[#3F3832]"
                    >
                      {t('cancelChanges')}
                    </button>
                    <button
                      onClick={() => {
                        onApplyModification(voiceInstruction.intent);
                        alert('Changes applied to architectural model.');
                        setVoiceInstruction(null);
                        onOpen3DView();
                      }}
                      className="px-3.5 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('applyChanges')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Contextual Chat Session */}
          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-[#54483C] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Architectural Chat
              </span>
              <span className="text-[#756A60]">{project.facadeStyle} · {project.flooringMaterial}</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto mb-4 p-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#54483C] text-[#FAF7F2]'
                        : 'bg-[#EFE6DA] text-[#3F3832] border border-[#D8CEC2]'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[#756A60] mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#D8CEC2]">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('askAssistant')}
                className="flex-1 bg-[#EFE6DA] border border-[#D8CEC2] rounded px-3 py-2 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-[#54483C] text-[#FAF7F2] rounded hover:bg-[#3F3832] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Problem Detection & Code Heuristics */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#FAF7F2] border border-[#D8CEC2] rounded p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#54483C] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                {t('problemDetectionTitle')}
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {issues.filter(i => i.status === 'pending').length} Concerns
              </span>
            </div>
            <p className="text-[11px] text-[#756A60] mb-4">
              {t('problemDetectionSub')}
            </p>

            {/* List of Heuristic Issues */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {issues.map((iss) => (
                <div key={iss.id} className="bg-[#EFE6DA] p-3.5 rounded border border-[#D8CEC2] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#54483C]">{iss.title}</span>
                    <span className="text-[10px] text-[#756A60]">{iss.status === 'applied' ? 'Resolved' : t('considerReviewing')}</span>
                  </div>

                  <span className="text-[10px] text-[#756A60] block mb-2">{iss.location}</span>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="font-medium text-[#756A60]">{t('whyItMatters')}:</span>{' '}
                      <span className="text-[#3F3832]">{iss.whyItMatters}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#54483C]">{t('suggestedImprovement')}:</span>{' '}
                      <span className="text-[#3F3832]">{iss.suggestedImprovement}</span>
                    </div>
                  </div>

                  {iss.status === 'pending' && (
                    <div className="mt-3 pt-2 border-t border-[#D8CEC2] flex justify-end">
                      <button
                        onClick={() => {
                          setIssues(prev => prev.map(i => i.id === iss.id ? { ...i, status: 'applied' } : i));
                          alert(`Applied suggestion: ${iss.suggestedImprovement}`);
                        }}
                        className="px-2.5 py-1 bg-[#54483C] text-[#FAF7F2] rounded text-[11px] hover:bg-[#3F3832]"
                      >
                        Apply Adjustment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#756A60] mt-4 pt-3 border-t border-[#D8CEC2]">
              Preliminary heuristic analysis. Not a certified structural engineering certification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
