import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Sparkles, User, Briefcase, GraduationCap, Wrench, FileText, CheckCircle, FolderGit2, Award } from 'lucide-react';

const POPULAR_SKILLS_DICTIONARY = [
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "Oracle Database", "SQLite", "DynamoDB", "Snowflake", "Elasticsearch",
  "AWS", "Amazon Web Services", "Microsoft Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "CI/CD Pipelines", "Linux", "Git",
  "Generative AI", "Large Language Models (LLMs)", "Prompt Engineering", "PyTorch", "TensorFlow", "LangChain", "OpenAI API",
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go (Golang)", "Rust", "SQL", "HTML5", "CSS3",
  "React.js", "Node.js", "Express.js", "Next.js", "Vue.js", "Angular", "RESTful APIs", "GraphQL", "Tailwind CSS", "Bootstrap",
  "VS Code", "GitHub", "GitLab", "Linux CLI", "Postman", "Figma"
];

function SkillAutocompleteInput({ categoryName, onAddSkill }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim().length > 0) {
      const filtered = POPULAR_SKILLS_DICTIONARY.filter(sk => 
        sk.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (sk) => {
    onAddSkill(sk, 90);
    setInputValue('');
    setShowDropdown(false);
  };

  const handleAddCurrent = () => {
    if (inputValue.trim()) {
      onAddSkill(inputValue.trim(), 90);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapperRef} className="autocomplete-wrapper" style={{ position: 'relative', flex: 1 }}>
      <div className="add-tag-row" style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder={`Type to search skills (e.g. PostgreSQL, AWS)...`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.trim().length > 0) setShowDropdown(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCurrent();
            }
          }}
          style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white' }}
        />
        <button className="btn btn-secondary btn-sm" onClick={handleAddCurrent}>Add Skill</button>
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#1e293b',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          marginTop: '4px',
          maxHeight: '220px',
          overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          listStyle: 'none',
          padding: '0.4rem 0',
          margin: 0
        }}>
          {suggestions.map((sk, idx) => (
            <li 
              key={idx}
              onClick={() => handleSelectSuggestion(sk)}
              style={{
                padding: '0.6rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>{sk}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+ Add (90%)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StepEditor({ 
  activeStep, 
  setActiveStep, 
  resume, 
  setResume, 
  onOpenAISuggestions 
}) {
  const handlePersonalChange = (field, val) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: val }
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    };
    setResume(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp]
    }));
  };

  const updateExperience = (id, field, val) => {
    setResume(prev => ({
      ...prev,
      experiences: (prev.experiences || []).map(exp => exp.id === id ? { ...exp, [field]: val } : exp)
    }));
  };

  const deleteExperience = (id) => {
    setResume(prev => ({
      ...prev,
      experiences: (prev.experiences || []).filter(exp => exp.id !== id)
    }));
  };

  const handleBulletChange = (expId, bIdx, val) => {
    setResume(prev => ({
      ...prev,
      experiences: (prev.experiences || []).map(exp => {
        if (exp.id !== expId) return exp;
        const newBullets = [...(exp.bullets || [])];
        newBullets[bIdx] = val;
        return { ...exp, bullets: newBullets };
      })
    }));
  };

  const addBullet = (expId) => {
    setResume(prev => ({
      ...prev,
      experiences: (prev.experiences || []).map(exp => exp.id === expId ? { ...exp, bullets: [...(exp.bullets || []), ''] } : exp)
    }));
  };

  const deleteBullet = (expId, bIdx) => {
    setResume(prev => ({
      ...prev,
      experiences: (prev.experiences || []).map(exp => {
        if (exp.id !== expId) return exp;
        const newBullets = (exp.bullets || []).filter((_, i) => i !== bIdx);
        return { ...exp, bullets: newBullets.length ? newBullets : [''] };
      })
    }));
  };

  // Project Handlers
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: '',
      tech: '',
      description: '',
      link: ''
    };
    setResume(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
  };

  const updateProject = (id, field, val) => {
    setResume(prev => ({
      ...prev,
      projects: (prev.projects || []).map(proj => proj.id === id ? { ...proj, [field]: val } : proj)
    }));
  };

  const deleteProject = (id) => {
    setResume(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(proj => proj.id !== id)
    }));
  };

  // Certification Handlers
  const addCertification = () => {
    setResume(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), '']
    }));
  };

  const updateCertification = (idx, val) => {
    setResume(prev => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[idx] = val;
      return { ...prev, certifications: newCerts };
    });
  };

  const deleteCertification = (idx) => {
    setResume(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== idx)
    }));
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResume(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const updateEducation = (id, field, val) => {
    setResume(prev => ({
      ...prev,
      education: (prev.education || []).map(edu => edu.id === id ? { ...edu, [field]: val } : edu)
    }));
  };

  const deleteEducation = (id) => {
    setResume(prev => ({
      ...prev,
      education: (prev.education || []).filter(edu => edu.id !== id)
    }));
  };

  // Skill Category Handlers
  const addSkillCategory = () => {
    setResume(prev => ({
      ...prev,
      skillCategories: [...(prev.skillCategories || []), { category: 'New Category', items: [{ name: 'Skill 1', level: 85 }] }]
    }));
  };

  const updateCategoryName = (catIdx, newName) => {
    setResume(prev => {
      const newCats = [...(prev.skillCategories || [])];
      newCats[catIdx] = { ...newCats[catIdx], category: newName };
      return { ...prev, skillCategories: newCats };
    });
  };

  const addSkillToCategory = (catIdx, skillVal, skillLevel = 90) => {
    if (!skillVal.trim()) return;
    setResume(prev => {
      const newCats = [...(prev.skillCategories || [])];
      const items = [...(newCats[catIdx].items || []), { name: skillVal.trim(), level: Number(skillLevel) }];
      newCats[catIdx] = { ...newCats[catIdx], items };
      return { ...prev, skillCategories: newCats };
    });
  };

  const updateSkillLevel = (catIdx, skillIdx, newLevel) => {
    setResume(prev => {
      const newCats = [...(prev.skillCategories || [])];
      const items = [...(newCats[catIdx].items || [])];
      const current = typeof items[skillIdx] === 'string' ? { name: items[skillIdx], level: 90 } : items[skillIdx];
      items[skillIdx] = { ...current, level: Math.min(100, Math.max(0, Number(newLevel))) };
      newCats[catIdx] = { ...newCats[catIdx], items };
      return { ...prev, skillCategories: newCats };
    });
  };

  const deleteSkillFromCategory = (catIdx, skillIdx) => {
    setResume(prev => {
      const newCats = [...(prev.skillCategories || [])];
      const items = (newCats[catIdx].items || []).filter((_, i) => i !== skillIdx);
      newCats[catIdx] = { ...newCats[catIdx], items };
      return { ...prev, skillCategories: newCats };
    });
  };

  const deleteCategory = (catIdx) => {
    setResume(prev => ({
      ...prev,
      skillCategories: (prev.skillCategories || []).filter((_, i) => i !== catIdx)
    }));
  };

  return (
    <div className="step-editor-container">
      {/* STEP 1: HEADING */}
      {activeStep === 'personal' && (
        <div className="editor-card">
          <div className="card-header">
            <User size={20} className="text-primary" />
            <div>
              <h3>Contact Information</h3>
              <p>How employers and recruiters will reach you.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Alex Rivera" 
                value={resume.personal?.fullName || ''} 
                onChange={e => handlePersonalChange('fullName', e.target.value)} 
              />
            </div>
            <div className="form-group span-2">
              <label>Target Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Software Engineer" 
                value={resume.personal?.jobTitle || ''} 
                onChange={e => handlePersonalChange('jobTitle', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="alex.rivera@email.com" 
                value={resume.personal?.email || ''} 
                onChange={e => handlePersonalChange('email', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="+1 (555) 000-0000" 
                value={resume.personal?.phone || ''} 
                onChange={e => handlePersonalChange('phone', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>City, State / Location</label>
              <input 
                type="text" 
                placeholder="San Francisco, CA" 
                value={resume.personal?.location || ''} 
                onChange={e => handlePersonalChange('location', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile</label>
              <input 
                type="text" 
                placeholder="linkedin.com/in/username" 
                value={resume.personal?.linkedin || ''} 
                onChange={e => handlePersonalChange('linkedin', e.target.value)} 
              />
            </div>
          </div>
          <div className="wizard-actions">
            <div></div>
            <button className="btn btn-primary" onClick={() => setActiveStep('experiences')}>
              Next: Work History →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WORK HISTORY */}
      {activeStep === 'experiences' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <Briefcase size={20} className="text-primary" />
              <div>
                <h3>Work Experience</h3>
                <p>Add your recent employment history and accomplishments.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addExperience}>
              <Plus size={14} /> Add Job Position
            </button>
          </div>

          {(resume.experiences || []).map((exp, expIdx) => (
            <div key={exp.id} className="experience-item-card">
              <div className="exp-card-header">
                <h4>Position #{expIdx + 1}: {exp.jobTitle || 'Untitled Position'}</h4>
                <button className="btn-icon-danger" onClick={() => deleteExperience(exp.id)}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title</label>
                  <input 
                    type="text" 
                    placeholder="Software Engineer" 
                    value={exp.jobTitle} 
                    onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Company / Employer</label>
                  <input 
                    type="text" 
                    placeholder="Tech Corp Inc." 
                    value={exp.company} 
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YYYY" 
                    value={exp.startDate} 
                    onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="text" 
                    placeholder="Present or MM/YYYY" 
                    value={exp.endDate} 
                    onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} 
                  />
                </div>
              </div>

              {/* Bullets List */}
              <div className="bullets-section">
                <div className="bullets-header">
                  <label>Key Accomplishments & Responsibilities:</label>
                  <button 
                    className="btn-icon-ai"
                    title="INNOV AI Assistant & Content Library"
                    onClick={() => onOpenAISuggestions('bullet', exp.id)}
                  >
                    <Sparkles size={16} />
                  </button>
                </div>

                {(exp.bullets || []).map((b, bIdx) => (
                  <div key={bIdx} className="bullet-row">
                    <span className="bullet-dot">•</span>
                    <textarea 
                      value={b} 
                      placeholder="e.g. Spearheaded core initiatives as software developer..." 
                      onChange={e => handleBulletChange(exp.id, bIdx, e.target.value)}
                      rows={2}
                    />
                    <button className="btn-icon-del" onClick={() => deleteBullet(exp.id, bIdx)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button className="btn btn-outline btn-sm mt-2" onClick={() => addBullet(exp.id)}>
                  <Plus size={14} /> Add Bullet Point
                </button>
              </div>
            </div>
          ))}

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('personal')}>
              ← Back to Heading
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('projects')}>
              Next: Projects →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROJECTS */}
      {activeStep === 'projects' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <FolderGit2 size={20} className="text-primary" />
              <div>
                <h3>Personal & Academic Projects</h3>
                <p>Highlight your key projects, tech stacks, and live links.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addProject}>
              <Plus size={14} /> Add Project
            </button>
          </div>

          {(resume.projects || []).map((proj, pIdx) => (
            <div key={proj.id} className="experience-item-card">
              <div className="exp-card-header">
                <h4>Project #{pIdx + 1}: {proj.title || 'Untitled Project'}</h4>
                <button className="btn-icon-danger" onClick={() => deleteProject(proj.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Project Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tech Innovers — AI Tutor Platform" 
                    value={proj.title} 
                    onChange={e => updateProject(proj.id, 'title', e.target.value)} 
                  />
                </div>
                <div className="form-group span-2">
                  <label>Technologies Used</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Python · React.js · Node.js · REST APIs · Generative AI" 
                    value={proj.tech || ''} 
                    onChange={e => updateProject(proj.id, 'tech', e.target.value)} 
                  />
                </div>
                <div className="form-group span-2">
                  <label>Project Link / Repository URL</label>
                  <input 
                    type="text" 
                    placeholder="github.com/username/project" 
                    value={proj.link || ''} 
                    onChange={e => updateProject(proj.id, 'link', e.target.value)} 
                  />
                </div>
                <div className="form-group span-2">
                  <label>Project Description & Key Outcomes</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe what you built and the impact of the project..." 
                    value={proj.description || ''} 
                    onChange={e => updateProject(proj.id, 'description', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('experiences')}>
              ← Back to Work History
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('certifications')}>
              Next: Certifications →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CERTIFICATIONS */}
      {activeStep === 'certifications' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <Award size={20} className="text-primary" />
              <div>
                <h3>Certifications & Achievements</h3>
                <p>List accredited certifications, honors, and professional credentials.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addCertification}>
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {(resume.certifications || []).map((cert, cIdx) => (
            <div key={cIdx} className="bullet-row" style={{ marginBottom: '0.8rem' }}>
              <span className="bullet-dot">•</span>
              <input 
                type="text" 
                style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white' }}
                placeholder="e.g. Microsoft Certified Data Analyst" 
                value={cert} 
                onChange={e => updateCertification(cIdx, e.target.value)} 
              />
              <button className="btn-icon-del" onClick={() => deleteCertification(cIdx)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('projects')}>
              ← Back to Projects
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('education')}>
              Next: Education →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: EDUCATION */}
      {activeStep === 'education' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <GraduationCap size={20} className="text-primary" />
              <div>
                <h3>Education & Degrees</h3>
                <p>List academic degrees and relevant certifications.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addEducation}>
              <Plus size={14} /> Add School
            </button>
          </div>

          {(resume.education || []).map((edu, eduIdx) => (
            <div key={edu.id} className="experience-item-card">
              <div className="exp-card-header">
                <h4>Education #{eduIdx + 1}: {edu.degree || 'Degree'}</h4>
                <button className="btn-icon-danger" onClick={() => deleteEducation(edu.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Degree or Field of Study</label>
                  <input 
                    type="text" 
                    placeholder="B.S. in Computer Science" 
                    value={edu.degree} 
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)} 
                  />
                </div>
                <div className="form-group span-2">
                  <label>School / University</label>
                  <input 
                    type="text" 
                    placeholder="UC Berkeley" 
                    value={edu.institution} 
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Graduation Date</label>
                  <input 
                    type="text" 
                    placeholder="2019-05" 
                    value={edu.endDate} 
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>GPA / Honors (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="3.8 / 4.0" 
                    value={edu.gpa} 
                    onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('certifications')}>
              ← Back to Certifications
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('skills')}>
              Next: Skills →
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SKILLS WITH MANUAL PERCENTAGE CONTROL */}
      {activeStep === 'skills' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <Wrench size={20} className="text-primary" />
              <div>
                <h3>Structured Skills & Custom Percentage Levels</h3>
                <p>Customize exact proficiency percentages (0-100%) for each skill item.</p>
              </div>
            </div>
            <div className="action-group">
              <button className="btn btn-secondary btn-sm" onClick={addSkillCategory}>
                <Plus size={14} /> Add Category Group
              </button>
              <button 
                className="btn-icon-ai"
                title="INNOV AI Skill Library"
                onClick={() => onOpenAISuggestions('skill')}
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {(resume.skillCategories || []).map((catObj, catIdx) => (
            <div key={catIdx} className="skill-category-block" style={{ marginBottom: '1.5rem', background: 'var(--bg-dark)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div className="exp-card-header" style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={catObj.category} 
                  onChange={e => updateCategoryName(catIdx, e.target.value)}
                  style={{ fontWeight: 700, color: '#f97316', background: 'transparent', border: 'none', fontSize: '1.05rem', outline: 'none' }}
                />
                <button className="btn-icon-danger" onClick={() => deleteCategory(catIdx)}>
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Skills with Percentage Inputs */}
              <div className="tags-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.8rem' }}>
                {(catObj.items || []).map((item, idx) => {
                  const name = typeof item === 'string' ? item : item.name;
                  const level = typeof item === 'string' ? 90 : (item.level !== undefined ? item.level : 90);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ flex: 1, color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{name}</span>
                      
                      {/* Manual Percentage Control */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={level} 
                          onChange={e => updateSkillLevel(catIdx, idx, e.target.value)}
                          style={{ width: '80px', accentColor: '#f97316', cursor: 'pointer' }}
                        />
                        <input 
                          type="number" 
                          min="10" 
                          max="100" 
                          value={level} 
                          onChange={e => updateSkillLevel(catIdx, idx, e.target.value)}
                          style={{ width: '45px', padding: '0.15rem 0.3rem', borderRadius: '4px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.8rem', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 700 }}>%</span>
                      </div>

                      <button onClick={() => deleteSkillFromCategory(catIdx, idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 0.2rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Autocomplete Component */}
              <SkillAutocompleteInput 
                categoryName={catObj.category}
                onAddSkill={(sk, lvl) => addSkillToCategory(catIdx, sk, lvl)}
              />
            </div>
          ))}

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('education')}>
              ← Back to Education
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('summary')}>
              Next: Summary →
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: SUMMARY */}
      {activeStep === 'summary' && (
        <div className="editor-card">
          <div className="card-header flex-between">
            <div className="header-meta">
              <FileText size={20} className="text-primary" />
              <div>
                <h3>Professional Summary</h3>
                <p>Craft a high-impact 2-4 sentence overview of your career background and top strengths.</p>
              </div>
            </div>
            <button 
              className="btn-icon-ai"
              title="INNOV AI Summary Assistant"
              onClick={() => onOpenAISuggestions('summary')}
            >
              <Sparkles size={16} />
            </button>
          </div>

          <div className="form-group">
            <textarea 
              rows={6}
              placeholder="e.g. Results-driven Software Developer with 5+ years of experience designing scalable web applications and cloud architecture..."
              value={resume.summary || ''}
              onChange={e => setResume(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('skills')}>
              ← Back to Skills
            </button>
            <button className="btn btn-primary" onClick={() => setActiveStep('extra')}>
              Final Polish →
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: FINAL POLISH */}
      {activeStep === 'extra' && (
        <div className="editor-card">
          <div className="card-header">
            <CheckCircle size={20} className="text-emerald" />
            <div>
              <h3>Final Polish & Review</h3>
              <p>Review your template, run a final Resume Check, and download your PDF!</p>
            </div>
          </div>
          <div className="finish-banner">
            <h4>🎉 Your Resume is Ready!</h4>
            <p>Use the live paper preview on the right to verify your design layout and click <strong>Resume Check</strong> to make sure you pass all ATS algorithms.</p>
          </div>

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={() => setActiveStep('summary')}>
              ← Back to Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
