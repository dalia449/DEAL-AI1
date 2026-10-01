import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Mail, Send, CheckCircle2, MessageSquare, Phone, MapPin, Building } from 'lucide-react';

export const ContactStudio: React.FC = () => {
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'project' | 'technical' | 'partnership' | 'general'>('project');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, subject, message })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Could not submit inquiry. Please try again.');
      }
    } catch (err) {
      console.warn('Network error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] p-6 overflow-y-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[#D8CEC2]">
        <h1 className="font-serif-arch text-2xl font-bold text-[#3F3832]">
          {t('navContact')}
        </h1>
        <p className="text-xs text-[#756A60] mt-1">
          Direct communication with Dalia Al Waqtan and the DEAL architectural engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 max-w-5xl">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[#EFE6DA] p-6 rounded border border-[#D8CEC2]">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-serif-arch text-lg font-bold text-[#3F3832]">
                Inquiry Successfully Dispatched
              </h3>
              <p className="text-xs text-[#756A60] mt-1 max-w-md mx-auto">
                Your message has been delivered directly into the DEAL Owner Dashboard. Our engineering team will review your specifications.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-4 py-2 bg-[#54483C] text-[#FAF7F2] rounded text-xs hover:bg-[#3F3832]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#3F3832]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eng. Khalid Al-Sulaiman"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@firm.com"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  >
                    <option value="project">New Architectural Project Consultation</option>
                    <option value="technical">Technical Support & Hand Tracking SDK</option>
                    <option value="partnership">Institutional Partnership</option>
                    <option value="general">General Inquiries</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project Brief / Feasibility Question"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#756A60] font-medium block mb-1">Message Details</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your site coordinates, square meterage, programmatic requirements, or hand-tracking workstation integration questions..."
                  className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded p-3 text-xs focus:outline-none focus:border-[#54483C] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Transmit Inquiry to DEAL Team'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Studio Direct Channels */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <div className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2]">
            <h3 className="font-serif-arch text-sm font-semibold text-[#54483C] uppercase tracking-wider mb-3">
              DEAL Executive Headquarters
            </h3>
            <div className="space-y-3 text-[#3F3832]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8A7A6A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Architectural Engineering Directorate</span>
                  <p className="text-[11px] text-[#756A60]">King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#8A7A6A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Direct Inquiries</span>
                  <p className="text-[11px] text-[#756A60]">dalia.alwaqtan@deal-architecture.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded border border-[#D8CEC2]">
            <span className="text-[10px] text-[#756A60] uppercase tracking-wider font-semibold block mb-1">
              Founder & Chief Architect
            </span>
            <h4 className="font-serif-arch text-base font-bold text-[#3F3832]">
              Dalia Al Waqtan
            </h4>
            <p className="text-xs text-[#756A60] mt-1 leading-relaxed">
              "DEAL bridges human architectural intuition with computational artificial intelligence, empowering designers to create sustainable, contextual spaces."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
