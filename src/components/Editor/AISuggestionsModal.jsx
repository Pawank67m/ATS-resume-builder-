import React, { useState } from 'react';
import { Sparkles, X, Plus, Search, Check } from 'lucide-react';
import { JOB_TITLES, ZETY_SUGGESTIONS } from '../../data/zetySuggestions';

export default function AISuggestionsModal({ isOpen, onClose, onInsertBullet, onInsertSummary, onInsertSkill, mode = 'bullet' }) {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState("Software Developer");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState({});

  const roleData = ZETY_SUGGESTIONS[selectedRole] || ZETY_SUGGESTIONS["Software Developer"];

  const handleAdd = (item, type, index) => {
    if (type === 'bullet') onInsertBullet(item);
    if (type === 'summary') onInsertSummary(item);
    if (type === 'skill') onInsertSkill(item);

    setAddedItems(prev => ({ ...prev, [`${type}-${index}`]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [`${type}-${index}`]: false }));
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zety-suggestions-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles className="icon-gold" size={20} />
            <div>
              <h3>INNOV AI Content Suggestions</h3>
              <p>Select your target role to browse expert-vetted achievements and skills.</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="role-selector-bar">
          <label>Target Role:</label>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            {JOB_TITLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="modal-body">
          {mode === 'summary' ? (
            <div className="suggestions-section">
              <h4>Professional Summaries for {selectedRole}</h4>
              <div className="suggestions-list">
                {roleData.summary.map((sum, idx) => (
                  <div key={idx} className="suggestion-card">
                    <p>{sum}</p>
                    <button 
                      className={`btn btn-sm ${addedItems[`summary-${idx}`] ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleAdd(sum, 'summary', idx)}
                    >
                      {addedItems[`summary-${idx}`] ? <><Check size={14} /> Added</> : <><Plus size={14} /> Use Summary</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : mode === 'skill' ? (
            <div className="suggestions-section">
              <h4>Recommended Skills for {selectedRole}</h4>
              <div className="skills-grid-suggestions">
                {roleData.skills.map((skill, idx) => (
                  <button 
                    key={idx} 
                    className={`skill-pill-btn ${addedItems[`skill-${idx}`] ? 'added' : ''}`}
                    onClick={() => handleAdd(skill, 'skill', idx)}
                  >
                    {addedItems[`skill-${idx}`] ? <Check size={12} /> : <Plus size={12} />} {skill}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="suggestions-section">
              <h4>High-Impact Work Accomplishments ({selectedRole})</h4>
              <div className="suggestions-list">
                {roleData.bullets.map((bullet, idx) => (
                  <div key={idx} className="suggestion-card">
                    <p>• {bullet}</p>
                    <button 
                      className={`btn btn-sm ${addedItems[`bullet-${idx}`] ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleAdd(bullet, 'bullet', idx)}
                    >
                      {addedItems[`bullet-${idx}`] ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add Bullet</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
