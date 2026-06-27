import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, X, Sparkles, Target, ShieldCheck, Cpu, Briefcase, ChevronRight } from 'lucide-react';
import { analyzeATS } from '../../utils/atsAnalyzer';

const TARGET_ROLE_SAMPLES = {
  aiml: "FAANG AI/ML Platform Engineer: Seeking an AI Platform & MLOps Engineer to architect cloud-native AI services on AWS and Kubernetes. Must have expertise in Python, Generative AI, LLMs, Docker, Terraform, CI/CD pipelines, and microservices architecture. Responsible for optimizing model deployment latency and infrastructure automation.",
  devops: "Senior Cloud & DevOps Engineer: Looking for a DevOps Engineer proficient in AWS, Docker, Kubernetes, Terraform, GitHub Actions, Linux administration, and Infrastructure as Code (IaC). Must demonstrate experience automating CI/CD pipelines and scaling microservices.",
  fullstack: "Senior Full Stack Engineer: Seeking a React.js and Node.js Full Stack Developer with RESTful API integration, MongoDB database architecture, TypeScript/JavaScript expertise, and frontend component optimization skills."
};

export default function ZetyCheckerModal({ isOpen, onClose, resume, targetJD, setTargetJD }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'keywords'
  const analysis = analyzeATS(resume, targetJD);

  const applyRoleSample = (roleKey) => {
    setTargetJD(TARGET_ROLE_SAMPLES[roleKey]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zety-checker-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck className="icon-emerald" size={28} style={{ color: '#10b981' }} />
            <div>
              <h3>FAANG Enterprise ATS Resume Diagnostic Suite</h3>
              <p>Greenhouse, Lever, & Workday Enterprise Parser Compatibility Audit</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="role-selector-bar" style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={14} /> 5-Pillar Audit Report
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'keywords' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('keywords')}
          >
            <Target size={14} /> Target Job Matcher
          </button>
        </div>

        <div className="checker-body" style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Top Score Summary Banner */}
          <div className="score-dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div className="circular-score-wrapper" style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" className="score-circle-svg" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="42" className="circle-bg" style={{ fill: 'none', stroke: 'rgba(255,255,255,0.1)', strokeWidth: '8' }} />
                <circle 
                  cx="50" cy="50" r="42" 
                  className="circle-progress"
                  style={{
                    fill: 'none',
                    strokeWidth: '8',
                    strokeDasharray: 264,
                    strokeDashoffset: 264 - (264 * analysis.score) / 100,
                    stroke: analysis.score >= 85 ? '#10b981' : analysis.score >= 70 ? '#f59e0b' : '#ef4444',
                    strokeLinecap: 'round',
                    transition: 'stroke-dashoffset 1s ease'
                  }}
                />
              </svg>
              <div className="score-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span className="score-val" style={{ fontSize: '2rem', fontWeight: 800, color: 'white', display: 'block', lineHeight: 1 }}>{analysis.score}</span>
                <span className="score-max" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/100</span>
              </div>
            </div>

            <div className="score-summary-meta">
              <h4 style={{ color: analysis.score >= 85 ? '#10b981' : '#f59e0b', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {analysis.score >= 85 ? '🏆 FAANG Top 5% Tier Resume!' : analysis.score >= 70 ? '⚡ Strong Tech Resume – Minor Optimizations Recommended' : '⚠️ ATS Optimization Required'}
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Your resume scored <strong>{analysis.score}/100</strong> across Tier-1 tech recruitment algorithms (Greenhouse, Lever, Workday). Verified contact matrix, metric density, and cloud infrastructure stack.
              </p>
            </div>
          </div>

          {/* TAB 1: 5-PILLAR AUDIT REPORT */}
          {activeTab === 'audit' && (
            <div className="diagnostic-checks">
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.05rem' }}>5-Pillar FAANG Engineering Diagnostics</h4>
              <div className="checks-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {analysis.checks.map((chk, idx) => (
                  <div 
                    key={idx} 
                    className={`check-item ${chk.status}`}
                    style={{
                      background: 'var(--bg-dark)',
                      border: `1px solid ${chk.status === 'pass' ? 'rgba(16, 185, 129, 0.3)' : chk.status === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      padding: '1rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.8rem'
                    }}
                  >
                    <div className="check-icon" style={{ marginTop: '0.1rem' }}>
                      {chk.status === 'pass' && <CheckCircle2 size={20} style={{ color: '#10b981' }} />}
                      {chk.status === 'warning' && <AlertTriangle size={20} style={{ color: '#f59e0b' }} />}
                      {chk.status === 'fail' && <XCircle size={20} style={{ color: '#ef4444' }} />}
                      {chk.status === 'info' && <Target size={20} style={{ color: '#3b82f6' }} />}
                    </div>
                    <div className="check-content">
                      <strong className="check-title" style={{ color: 'white', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>{chk.title}</strong>
                      <p className="check-msg" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{chk.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TARGET JOB MATCHER */}
          {activeTab === 'keywords' && (
            <div className="jd-parser-card">
              <div className="card-header-sm" style={{ marginBottom: '0.8rem' }}>
                <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} className="text-primary" /> Target Role Keyword Matcher
                </h4>
              </div>
              <p className="hint-text" style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Select a target FAANG benchmark profile or paste any job description to evaluate keyword density:
              </p>

              {/* Quick Preset Buttons */}
              <div className="preset-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => applyRoleSample('aiml')}>
                  <Cpu size={14} /> Load AI/ML Engineer JD
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => applyRoleSample('devops')}>
                  <Briefcase size={14} /> Load DevOps Cloud JD
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => applyRoleSample('fullstack')}>
                  <Sparkles size={14} /> Load Full Stack JD
                </button>
              </div>

              <textarea 
                value={targetJD} 
                onChange={e => setTargetJD(e.target.value)}
                placeholder="Paste any target job description text here..."
                rows={5}
                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', fontSize: '0.85rem' }}
              />

              {targetJD.trim() && (
                <div className="keywords-results" style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="kw-group">
                    <span className="kw-label" style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>
                      Verified Matched Keywords ({analysis.matchedKeywords.length}):
                    </span>
                    <div className="tags-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {analysis.matchedKeywords.map(kw => (
                        <span key={kw} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                          ✓ {kw}
                        </span>
                      ))}
                      {analysis.matchedKeywords.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None matched yet</span>}
                    </div>
                  </div>

                  <div className="kw-group">
                    <span className="kw-label" style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>
                      Recommended Missing Keywords ({analysis.missingKeywords.length}):
                    </span>
                    <div className="tags-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {analysis.missingKeywords.map(kw => (
                        <span key={kw} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                          + Add {kw}
                        </span>
                      ))}
                      {analysis.missingKeywords.length === 0 && <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>🎉 100% Keyword Alignment Reached!</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
