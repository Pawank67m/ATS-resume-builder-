import React, { useState } from 'react';
import { Upload, FileText, Check, X, Sparkles, AlertCircle, Loader2, Key } from 'lucide-react';
import { parseResumeContent, extractTextFromDocxBuffer } from '../../utils/resumeParser';
import { extractResumeWithAI } from '../../utils/aiExtractor';

export default function UploadResumeModal({ isOpen, onClose, onImportData }) {
  if (!isOpen) return null;

  const [importType, setImportType] = useState('file'); // 'file' | 'text'
  const [rawText, setRawText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini'); // 'gemini' | 'microsoft' | 'openai'
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleImportText = async () => {
    if (!rawText.trim()) {
      setStatusMsg('Please paste resume text first.');
      return;
    }
    setLoading(true);
    let parsed = null;
    if (apiKey.trim()) {
      parsed = await extractResumeWithAI(rawText, apiKey, aiProvider);
    }
    if (!parsed) {
      parsed = parseResumeContent(rawText);
    }
    onImportData(parsed);
    setLoading(false);
    onClose();
  };

  // Direct Async File Reader (NO setTimeout delay!)
  const processFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setStatusMsg('');
    setFileName(file.name);

    try {
      let extractedText = '';

      // 1. JSON Backup File
      if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const parsed = JSON.parse(evt.target.result);
            onImportData(parsed);
            setLoading(false);
            onClose();
          } catch (err) {
            setStatusMsg('Invalid JSON file format.');
            setLoading(false);
          }
        };
        reader.readAsText(file);
        return;
      }

      // 2. Word DOCX/DOC File (.docx, .doc)
      if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc') || file.type.includes('word')) {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await extractTextFromDocxBuffer(arrayBuffer);
      } 
      // 3. PDF File (.pdf)
      else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let pdfText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            pdfText += content.items.map(item => item.str).join(' ') + '\n';
          }
          extractedText = pdfText;
        }
      } 
      // 4. Plain Text (.txt, .rtf, .md)
      else {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          extractedText = evt.target.result;
          let parsed = null;
          if (apiKey.trim()) {
            parsed = await extractResumeWithAI(extractedText, apiKey, aiProvider);
          }
          if (!parsed) {
            parsed = parseResumeContent(extractedText, file.name);
          }
          onImportData(parsed);
          setLoading(false);
          onClose();
        };
        reader.readAsText(file);
        return;
      }

      let parsed = null;
      if (apiKey.trim() && extractedText.trim()) {
        parsed = await extractResumeWithAI(extractedText, apiKey, aiProvider);
      }
      if (!parsed) {
        parsed = parseResumeContent(extractedText, file.name);
      }

      onImportData(parsed);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Extraction error:', err);
      const parsed = parseResumeContent('', file.name);
      onImportData(parsed);
      setLoading(false);
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zety-upload-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Upload className="icon-emerald" size={22} />
            <div>
              <h3>INNOV Resume Importer</h3>
              <p>Auto-populates Name, Email, Phone, Work Experience & Skills into exact editor fields</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* AI Provider & API Key Banner */}
        <div className="api-key-banner" style={{ background: 'var(--bg-dark)', padding: '0.6rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Key size={14} style={{ color: '#f97316' }} />
          <select 
            value={aiProvider}
            onChange={e => setAiProvider(e.target.value)}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="gemini">Google Gemini AI API</option>
            <option value="microsoft">Microsoft Graph / Azure AI</option>
            <option value="openai">OpenAI / ChatGPT API</option>
          </select>
          <input 
            type="password" 
            placeholder={`Paste ${aiProvider === 'microsoft' ? 'Microsoft Graph / Azure' : aiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API Key (Optional)...`}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}
          />
        </div>

        <div className="role-selector-bar">
          <button 
            className={`btn btn-sm ${importType === 'file' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setImportType('file')}
          >
            Upload Resume File (.docx, .pdf, .txt)
          </button>
          <button 
            className={`btn btn-sm ${importType === 'text' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setImportType('text')}
          >
            Paste Raw Text Directly
          </button>
        </div>

        <div className="modal-body">
          {statusMsg && (
            <div className="status-banner-danger" style={{ color: '#ef4444', marginBottom: '0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} /> {statusMsg}
            </div>
          )}

          {importType === 'file' ? (
            <div 
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderColor: isDragging ? '#f97316' : 'var(--border-color)',
                backgroundColor: isDragging ? 'rgba(249, 115, 22, 0.08)' : 'var(--bg-dark)'
              }}
            >
              {loading ? (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader2 size={32} className="animate-spin text-primary" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: 'white', fontWeight: 600 }}>
                    {apiKey ? `Extracting with ${aiProvider.toUpperCase()} AI...` : `Auto-populating fields from ${fileName}...`}
                  </p>
                </div>
              ) : (
                <>
                  <Upload size={44} style={{ color: isDragging ? '#10b981' : '#f97316', marginBottom: '0.5rem', transition: 'transform 0.2s', transform: isDragging ? 'scale(1.2)' : 'scale(1)' }} />
                  <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>
                    {isDragging ? 'Drop Your Resume File Here!' : 'Drag & Drop Your Resume File Here'}
                  </h4>
                  <p className="hint-text" style={{ marginBottom: '1rem' }}>
                    Supports <strong>Word (.docx, .doc)</strong>, <strong>PDF (.pdf)</strong>, <strong>TXT</strong>
                  </p>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Browse Files
                    <input 
                      type="file" 
                      accept=".docx,.doc,.pdf,.txt,.rtf,.json"
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label>Paste Existing Resume Content:</label>
              <textarea 
                rows={10} 
                placeholder="Paste your current resume content here... Our INNOV AI parser will extract your sections automatically into their respective fields."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
              <button className="btn btn-primary mt-3" style={{ marginTop: '1rem' }} onClick={handleImportText}>
                <Sparkles size={16} /> Parse & Auto-Fill Editor Fields
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
