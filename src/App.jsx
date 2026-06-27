import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StepEditor from './components/Editor/StepEditor';
import ResumePreview from './components/Preview/ResumePreview';
import AISuggestionsModal from './components/Editor/AISuggestionsModal';
import UploadResumeModal from './components/Editor/UploadResumeModal';
import ZetyCheckerModal from './components/ATS/ZetyCheckerModal';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { analyzeATS } from './utils/atsAnalyzer';

export default function App() {
  // LocalStorage Auto-Load
  const [resume, setResume] = useState(() => {
    const saved = localStorage.getItem('innov_resume_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_RESUMES.pavanSai;
  });

  const [activeStep, setActiveStep] = useState('personal');
  
  const [activeTemplate, setActiveTemplate] = useState(() => {
    return localStorage.getItem('innov_active_template') || 'cascade';
  });

  const [activeColor, setActiveColor] = useState(() => {
    return localStorage.getItem('innov_active_color') || 'navy';
  });

  const [targetJD, setTargetJD] = useState(() => {
    return localStorage.getItem('innov_target_jd') || '';
  });

  const [saveStatus, setSaveStatus] = useState('');

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState('bullet');
  const [targetExpId, setTargetExpId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);

  // Auto-Save Effect
  useEffect(() => {
    try {
      localStorage.setItem('innov_resume_data', JSON.stringify(resume));
      localStorage.setItem('innov_active_template', activeTemplate);
      localStorage.setItem('innov_active_color', activeColor);
      localStorage.setItem('innov_target_jd', targetJD);
      setSaveStatus('Auto-saved ✓');
      const timer = setTimeout(() => setSaveStatus(''), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Auto-save error:', e);
    }
  }, [resume, activeTemplate, activeColor, targetJD]);

  const handleLoadSample = (key) => {
    if (SAMPLE_RESUMES[key]) {
      setResume(SAMPLE_RESUMES[key]);
    }
  };

  const handleImportData = (importedData) => {
    setResume(importedData);
  };

  const handleOpenAISuggestions = (type, expId = null) => {
    setAiModalType(type);
    setTargetExpId(expId);
    setIsAIModalOpen(true);
  };

  const handleApplyAISuggestion = (text) => {
    if (aiModalType === 'bullet' && targetExpId) {
      setResume(prev => ({
        ...prev,
        experiences: (prev.experiences || []).map(exp => {
          if (exp.id !== targetExpId) return exp;
          return { ...exp, bullets: [...(exp.bullets || []), text] };
        })
      }));
    } else if (aiModalType === 'summary') {
      setResume(prev => ({ ...prev, summary: text }));
    } else if (aiModalType === 'skill') {
      setResume(prev => {
        const categories = [...(prev.skillCategories || [])];
        if (categories.length > 0) {
          categories[0].items = [...(categories[0].items || []), { name: text, level: 90 }];
        } else {
          categories.push({ category: 'Technical Skills', items: [{ name: text, level: 90 }] });
        }
        return { ...prev, skillCategories: categories };
      });
    }
  };

  // High-Precision PDF Generator (Clean 8mm Margins - No Border Touching)
  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-paper');
    if (!element) return;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${(resume.personal?.fullName || 'Pavan_Sai').replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: 'css' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  return (
    <div className="app-container">
      <Header 
        activeStep={activeStep} 
        setActiveStep={setActiveStep} 
        activeTemplate={activeTemplate} 
        setActiveTemplate={setActiveTemplate} 
        activeColor={activeColor} 
        setActiveColor={setActiveColor}
        onLoadSample={handleLoadSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onDownloadPDF={handleDownloadPDF}
      />

      {saveStatus && (
        <div className="save-toast" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, background: 'rgba(16, 185, 129, 0.95)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          {saveStatus}
        </div>
      )}

      <main className="main-content">
        <div className="split-layout">
          <section className="editor-pane">
            <StepEditor 
              activeStep={activeStep} 
              setActiveStep={setActiveStep} 
              resume={resume} 
              setResume={setResume} 
              onOpenAISuggestions={handleOpenAISuggestions} 
            />
          </section>

          <section className="preview-pane">
            <ResumePreview 
              resume={resume} 
              template={activeTemplate} 
              color={activeColor} 
            />
          </section>
        </div>
      </main>

      <AISuggestionsModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        type={aiModalType} 
        roleTitle={resume.personal?.jobTitle || 'Software Engineer'} 
        onApply={handleApplyAISuggestion} 
      />

      <UploadResumeModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onImportData={handleImportData} 
      />

      <ZetyCheckerModal 
        isOpen={isCheckerOpen} 
        onClose={() => setIsCheckerOpen(false)} 
        resume={resume} 
        targetJD={targetJD} 
        setTargetJD={setTargetJD} 
      />
    </div>
  );
}
