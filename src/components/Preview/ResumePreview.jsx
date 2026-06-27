import React from 'react';
import { Mail, Phone, MapPin, Globe, Link, Award, Briefcase, GraduationCap, Wrench, FileText, FolderGit2 } from 'lucide-react';
import { COLORS } from '../Header';

export default function ResumePreview({ resume, template = 'cascade', color = 'navy' }) {
  const selectedColorObj = COLORS.find(c => c.id === color) || COLORS[0];
  const themeHex = selectedColorObj.hex;

  const { personal = {}, summary = '', experiences = [], projects = [], education = [], skills = {}, skillCategories = [], certifications = [] } = resume;

  // Flatten all skill items from categories with manual level support
  let allSkillsList = [];
  if (skillCategories && skillCategories.length > 0) {
    skillCategories.forEach(cat => {
      if (cat.items && cat.items.length > 0) {
        cat.items.forEach(item => {
          if (typeof item === 'string') {
            allSkillsList.push({ name: item, level: 90 });
          } else if (item && item.name) {
            allSkillsList.push({ name: item.name, level: item.level !== undefined ? item.level : 90 });
          }
        });
      }
    });
  }

  if (allSkillsList.length === 0) {
    const techSkills = skills.technical || [];
    const softSkills = skills.soft || [];
    const tools = skills.tools || [];
    [...techSkills, ...softSkills, ...tools].forEach((sk, idx) => {
      allSkillsList.push({ name: sk, level: Math.max(60, 95 - (idx * 3)) });
    });
  }

  // Render Skill Bars (Full Expanded List)
  const renderSkillBars = () => {
    return (
      <div className="skill-bars">
        {allSkillsList.map((skObj, idx) => {
          const fillWidth = skObj.level;
          return (
            <div key={idx} className="skill-bar-item" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                <span className="sk-name">{skObj.name}</span>
                <span className="sk-percent" style={{ opacity: 0.85 }}>{fillWidth}%</span>
              </div>
              <div className="sk-track" style={{ height: '6px', background: template === 'cascade' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  className="sk-fill" 
                  style={{ 
                    width: `${fillWidth}%`, 
                    height: '100%', 
                    background: template === 'cascade' ? 'white' : 'var(--theme-color)',
                    borderRadius: '3px'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="preview-container">
      <div 
        id="resume-paper" 
        className={`resume-paper template-${template}`}
        style={{ '--theme-color': themeHex }}
      >
        {/* TEMPLATE 1: CASCADE (INNOV Signature Sidebar) */}
        {template === 'cascade' && (
          <div className="cascade-layout">
            {/* Left Sidebar */}
            <aside className="cascade-sidebar">
              <div className="sidebar-header">
                <h1 className="name">{personal.fullName || 'Your Name'}</h1>
                <p className="title">{personal.jobTitle || 'Target Role'}</p>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-heading">Contact</h3>
                <ul className="contact-list">
                  {personal.email && <li><Mail size={12} /> {personal.email}</li>}
                  {personal.phone && <li><Phone size={12} /> {personal.phone}</li>}
                  {personal.location && <li><MapPin size={12} /> {personal.location}</li>}
                  {personal.linkedin && <li><Link size={12} /> {personal.linkedin}</li>}
                  {personal.github && <li><Globe size={12} /> {personal.github}</li>}
                </ul>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-heading">Skills</h3>
                {renderSkillBars()}
              </div>

              {education.length > 0 && (
                <div className="sidebar-section">
                  <h3 className="sidebar-heading">Education</h3>
                  {education.map(edu => (
                    <div key={edu.id} className="sidebar-edu-item">
                      <strong className="deg">{edu.degree}</strong>
                      <span className="inst">{edu.institution}</span>
                      <span className="date">{edu.endDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="cascade-main">
              {summary && (
                <section className="main-section">
                  <h2 className="section-title"><FileText size={16} /> Professional Summary</h2>
                  <p className="summary-text">{summary}</p>
                </section>
              )}

              {experiences.length > 0 && (
                <section className="main-section">
                  <h2 className="section-title"><Briefcase size={16} /> Work Experience</h2>
                  <div className="experience-list">
                    {experiences.map(exp => (
                      <div key={exp.id} className="exp-item">
                        <div className="exp-header">
                          <h3 className="job-title">{exp.jobTitle}</h3>
                          <span className="exp-date">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div className="exp-sub">
                          <span className="company">{exp.company}</span>
                          {exp.location && <span className="location">• {exp.location}</span>}
                        </div>
                        <ul className="bullet-list">
                          {(exp.bullets || []).map((b, bIdx) => (
                            b.trim() && <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {projects.length > 0 && (
                <section className="main-section">
                  <h2 className="section-title"><FolderGit2 size={16} /> Key Projects</h2>
                  <div className="experience-list">
                    {projects.map(proj => (
                      <div key={proj.id} className="exp-item">
                        <div className="exp-header">
                          <h3 className="job-title">{proj.title}</h3>
                          {proj.link && <span className="exp-date">{proj.link}</span>}
                        </div>
                        {proj.tech && <div className="exp-sub">Tech: {proj.tech}</div>}
                        <p className="summary-text" style={{ marginBottom: 0 }}>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {certifications.length > 0 && (
                <section className="main-section">
                  <h2 className="section-title"><Award size={16} /> Certifications & Achievements</h2>
                  <ul className="bullet-list">
                    {certifications.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </section>
              )}
            </main>
          </div>
        )}

        {/* TEMPLATE 2: CONCEPT (Modern Banner Header) */}
        {template === 'concept' && (
          <div className="concept-layout">
            <header className="concept-header">
              <h1 className="name">{personal.fullName || 'Your Name'}</h1>
              <p className="title">{personal.jobTitle || 'Target Role'}</p>
              <div className="concept-contact">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>• {personal.phone}</span>}
                {personal.location && <span>• {personal.location}</span>}
                {personal.linkedin && <span>• {personal.linkedin}</span>}
              </div>
            </header>

            <div className="concept-body">
              {summary && (
                <section className="concept-section">
                  <h2 className="concept-title">Profile</h2>
                  <p>{summary}</p>
                </section>
              )}

              <section className="concept-section">
                <h2 className="concept-title">Skills & Competencies</h2>
                {renderSkillBars()}
              </section>

              {experiences.length > 0 && (
                <section className="concept-section">
                  <h2 className="concept-title">Experience</h2>
                  {experiences.map(exp => (
                    <div key={exp.id} className="concept-exp">
                      <div className="exp-row">
                        <strong>{exp.jobTitle}</strong> | <span>{exp.company}</span>
                        <span className="date-right">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <ul className="bullet-list">
                        {(exp.bullets || []).map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section className="concept-section">
                  <h2 className="concept-title">Projects</h2>
                  {projects.map(proj => (
                    <div key={proj.id} className="concept-exp">
                      <div className="exp-row">
                        <strong>{proj.title}</strong>
                        {proj.link && <span className="date-right">{proj.link}</span>}
                      </div>
                      {proj.tech && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{proj.tech}</p>}
                      <p>{proj.description}</p>
                    </div>
                  ))}
                </section>
              )}

              {certifications.length > 0 && (
                <section className="concept-section">
                  <h2 className="concept-title">Certifications</h2>
                  <ul className="bullet-list">
                    {certifications.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </section>
              )}

              {education.length > 0 && (
                <section className="concept-section">
                  <h2 className="concept-title">Education</h2>
                  {education.map(edu => (
                    <div key={edu.id}>
                      <strong>{edu.degree}</strong>
                      <p>{edu.institution} ({edu.endDate})</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        )}

        {/* TEMPLATE 3: CUBIC & TEMPLATE 4: CRISP */}
        {(template === 'cubic' || template === 'crisp') && (
          <div className={`standard-layout ${template}`}>
            <header className="std-header">
              <h1 className="name">{personal.fullName || 'Your Name'}</h1>
              <p className="title">{personal.jobTitle || 'Target Role'}</p>
              <div className="std-contact">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span> | {personal.phone}</span>}
                {personal.location && <span> | {personal.location}</span>}
                {personal.linkedin && <span> | {personal.linkedin}</span>}
              </div>
            </header>

            {summary && (
              <section className="std-section">
                <h2 className="std-title">Summary</h2>
                <p>{summary}</p>
              </section>
            )}

            <section className="std-section">
              <h2 className="std-title">Skills & Competencies</h2>
              {renderSkillBars()}
            </section>

            {experiences.length > 0 && (
              <section className="std-section">
                <h2 className="std-title">Experience</h2>
                {experiences.map(exp => (
                  <div key={exp.id} className="std-exp">
                    <div className="exp-top">
                      <strong>{exp.jobTitle}</strong> — <span>{exp.company}</span>
                      <span className="date-span">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="bullet-list">
                      {(exp.bullets || []).map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section className="std-section">
                <h2 className="std-title">Projects</h2>
                {projects.map(proj => (
                  <div key={proj.id} className="std-exp">
                    <div className="exp-top">
                      <strong>{proj.title}</strong> {proj.tech && <span>({proj.tech})</span>}
                      {proj.link && <span className="date-span">{proj.link}</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#334155' }}>{proj.description}</p>
                  </div>
                ))}
              </section>
            )}

            {certifications.length > 0 && (
              <section className="std-section">
                <h2 className="std-title">Certifications</h2>
                <ul className="bullet-list">
                  {certifications.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </section>
            )}

            {education.length > 0 && (
              <section className="std-section">
                <h2 className="std-title">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="std-edu">
                    <strong>{edu.degree}</strong>, <span>{edu.institution}</span> ({edu.endDate})
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
