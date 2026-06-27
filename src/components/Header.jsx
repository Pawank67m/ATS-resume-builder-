import React from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Palette, 
  Layout, 
  RotateCcw,
  Award,
  Upload,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const STEPS = [
  { id: 'personal', label: 'Heading' },
  { id: 'experiences', label: 'Work History' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'summary', label: 'Summary' },
  { id: 'extra', label: 'Final Polish' }
];

export const TEMPLATES = [
  { id: 'cascade', name: 'Cascade (INNOV Sidebar)' },
  { id: 'concept', name: 'Concept (Modern Banner)' },
  { id: 'cubic', name: 'Cubic (Structured Grid)' },
  { id: 'crisp', name: 'Crisp (ATS Minimalist)' }
];

export const COLORS = [
  { id: 'navy', hex: '#1e293b', name: 'INNOV Navy' },
  { id: 'orange', hex: '#f97316', name: 'INNOV Amber' },
  { id: 'emerald', hex: '#10b981', name: 'Emerald Green' },
  { id: 'purple', hex: '#8b5cf6', name: 'Royal Purple' },
  { id: 'crimson', hex: '#e11d48', name: 'Crimson Red' }
];

export default function Header({ 
  activeStep, 
  setActiveStep, 
  activeTemplate, 
  setActiveTemplate, 
  activeColor, 
  setActiveColor, 
  atsScore = 95, 
  onOpenATSModal,
  onOpenChecker, 
  onOpenUploadModal,
  onOpenUpload,
  onLoadSample, 
  onDownloadPDF 
}) {
  const triggerATSModal = onOpenChecker || onOpenATSModal;
  const triggerUploadModal = onOpenUpload || onOpenUploadModal;

  return (
    <header className="zety-header">
      <div className="header-top">
        <div className="brand-logo">
          <div className="logo-badge">I</div>
          <span className="logo-text">INNOV<span className="logo-sub">builder</span></span>
          <span className="ai-tag"><Sparkles size={12} /> AI Powered</span>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Upload Resume Button */}
          <button className="btn btn-secondary btn-sm" onClick={triggerUploadModal}>
            <Upload size={14} /> Upload Resume
          </button>

          {/* Sample Profiles Dropdown */}
          <div className="template-select-wrapper" style={{ zIndex: 100, background: 'var(--primary)' }}>
            <UserCheck size={16} style={{ color: 'white' }} />
            <select 
              defaultValue="pavanSai"
              onChange={(e) => onLoadSample(e.target.value)}
              className="template-select"
              style={{ fontWeight: 600 }}
            >
              <option value="pavanSai" style={{ background: '#1e293b', color: 'white', padding: '8px' }}>
                👤 Pavan Sai Resume (AI & Cloud)
              </option>
              <option value="softwareDeveloper" style={{ background: '#1e293b', color: 'white', padding: '8px' }}>
                💻 Software Engineer Sample
              </option>
            </select>
          </div>

          {/* Color Selector */}
          <div className="color-picker-dropdown">
            <Palette size={16} />
            <div className="color-options">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  className={`color-dot ${activeColor === c.id ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  onClick={() => setActiveColor(c.id)}
                />
              ))}
            </div>
          </div>

          {/* Template Switcher Dropdown */}
          <div className="template-select-wrapper" style={{ zIndex: 100 }}>
            <Layout size={16} />
            <select 
              value={activeTemplate} 
              onChange={(e) => setActiveTemplate(e.target.value)}
              className="template-select"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#1e293b', color: 'white', padding: '10px' }}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* ATS Score Check Button */}
          <button className="ats-check-btn" onClick={triggerATSModal}>
            <ShieldCheck size={16} className="text-emerald" style={{ color: '#10b981' }} />
            <span className="ats-label">
              Resume Check
            </span>
          </button>

          {/* Download PDF Button */}
          <button className="btn btn-primary" onClick={onDownloadPDF}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Step Wizard Bar */}
      <nav className="wizard-nav">
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            className={`wizard-step ${activeStep === step.id ? 'active' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            <span className="step-num">{idx + 1}</span>
            <span className="step-label">{step.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
