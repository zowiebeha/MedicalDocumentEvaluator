import React, { useState } from 'react';
import './App.css';

// Mock Lucide icons as simple SVGs
const Shield = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const FileText = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const Send = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);

const AlertCircle = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Pyramid = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 20h20L12 2z"/>
  </svg>
);

// Mock UI Components with inline styles
const Button = ({ children, onClick, disabled, variant = 'default', style, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: variant === 'outline' ? '1px solid #4B5563' : 'none',
      backgroundColor: variant === 'outline' ? 'transparent' : '#2563EB',
      color: variant === 'outline' ? '#D1D5DB' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s',
      ...style
    }}
    onMouseOver={(e) => {
      if (!disabled) {
        e.target.style.backgroundColor = variant === 'outline' ? '#1F2937' : '#1D4ED8';
      }
    }}
    onMouseOut={(e) => {
      if (!disabled) {
        e.target.style.backgroundColor = variant === 'outline' ? 'transparent' : '#2563EB';
      }
    }}
    {...props}
  >
    {children}
  </button>
);

const Textarea = ({ value, onChange, placeholder, style, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      maxWidth: '100%',
      minHeight: '150px',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #4B5563',
      backgroundColor: '#374151',
      color: 'white',
      boxSizing: 'border-box',
      fontSize: '18px',
      resize: 'none',
      outline: 'none',
      ...style
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#3B82F6';
      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#4B5563';
      e.target.style.boxShadow = 'none';
    }}
    {...props}
  />
);

const Switch = ({ id, checked, onCheckedChange }) => (
  <label
    htmlFor={id}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: '24px',
      width: '44px',
      alignItems: 'center',
      borderRadius: '12px',
      backgroundColor: checked ? '#2563EB' : '#4B5563',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }}
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      style={{ display: 'none' }}
    />
    <span
      style={{
        display: 'inline-block',
        height: '16px',
        width: '16px',
        borderRadius: '8px',
        backgroundColor: 'white',
        transform: checked ? 'translateX(24px)' : 'translateX(4px)',
        transition: 'transform 0.2s'
      }}
    />
  </label>
);

// Evidence Pyramid Component
const EvidencePyramid = ({ onLevelClick }) => {
  const levels = [
    { name: 'Systematic Reviews', color: '#10B981', description: 'Meta-analyses of RCTs' },
    { name: 'Randomized Trials', color: '#3B82F6', description: 'Individual RCTs' },
    { name: 'Cohort Studies', color: '#8B5CF6', description: 'Observational studies' },
    { name: 'Case Reports', color: '#F59E0B', description: 'Individual cases' },
    { name: 'Expert Opinion', color: '#EF4444', description: 'Professional judgment' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      {levels.map((level, index) => (
        <div
          key={level.name}
          onClick={() => onLevelClick(level)}
          style={{
            width: `${100 - index * 15}%`,
            padding: '12px',
            backgroundColor: level.color,
            color: 'white',
            textAlign: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: index < 2 ? '14px' : '12px',
            fontWeight: '600',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {level.name}
        </div>
      ))}
    </div>
  );
};

// Info Modal Component
const InfoModal = ({ level, isOpen, onClose }) => {
  if (!isOpen || !level) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1F2937',
          padding: '32px',
          borderRadius: '16px',
          maxWidth: '500px',
          margin: '20px',
          border: '1px solid #374151'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          {level.name}
        </h3>
        <p style={{ color: '#D1D5DB', lineHeight: '1.6', marginBottom: '24px' }}>
          {level.description}
        </p>
        <Button onClick={onClose} style={{ width: '100%' }}>
          Close
        </Button>
      </div>
    </div>
  );
};

const sampleResult = {
  overall_score: 7,
  source_analysis: "The article is from a reputable medical journal, but the author has ties to a pharmaceutical company, suggesting a potential conflict of interest.",
  evidence_review: "The claims are supported by a large-scale randomized controlled trial, which is a high level of evidence.",
  bias_detection: "Language used is mostly neutral, but some phrases appear to favor the sponsored drug.",
  recommendations: "While the evidence is strong, consider looking for a systematic review for a more comprehensive understanding and be mindful of the author's potential bias.",
  citations: "Doe, J. (2023). 'A new frontier in cardiology.' Journal of Modern Medicine, 45(2), 123-135."
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [mlaCitations, setMlaCitations] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState(null);

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(sampleResult);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const handlePyramidClick = (level) => {
    setSelectedPyramidLevel(level);
  };

  const closeModal = () => {
    setSelectedPyramidLevel(null);
  };

  const handleReset = () => {
    setResult(null);
    setPrompt('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <InfoModal level={selectedPyramidLevel} isOpen={!!selectedPyramidLevel} onClose={closeModal} />
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1F2937', backgroundColor: '#111827', padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>HealthCheck AI</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>Healthcare Article Credibility Evaluator</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {!result ? (
          <>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <FileText style={{ width: '40px', height: '40px', color: '#60A5FA' }} />
              </div>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '24px', lineHeight: '1.2' }}>
                Evaluate Healthcare Information Credibility
              </h2>
              <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '768px', margin: '0 auto', lineHeight: '1.6' }}>
                Paste a healthcare article URL, text excerpt, or ask questions about medical 
                information credibility. Our AI will analyze the content for accuracy, bias, source 
                reliability, and evidence quality.
              </p>
            </div>

            {/* Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '64px' }}>
              {[
                { title: 'Source Analysis', desc: 'Evaluate publication credibility and author expertise' },
                { title: 'Evidence Review', desc: 'Check citations, studies, and supporting evidence' },
                { title: 'Bias Detection', desc: 'Identify potential conflicts of interest and bias' }
              ].map((feature, index) => (
                <div key={index} style={{ textAlign: 'center', backgroundColor: 'rgba(31, 41, 55, 0.2)', padding: '24px', borderRadius: '12px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '50%', margin: '0 auto 16px' }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>{feature.title}</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Results Section */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>Analysis Results</h2>
              <Button variant="outline" onClick={handleReset}>
                New Analysis
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              {/* Left Side: Text Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '16px', padding: '24px', border: '1px solid #374151' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#60A5FA', marginBottom: '8px' }}>
                      {result.overall_score}/10
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '18px' }}>Credibility Score</div>
                  </div>
                </div>
                
                {[
                  { title: 'Source Analysis', content: result.source_analysis, icon: Shield },
                  { title: 'Evidence Review', content: result.evidence_review, icon: FileText },
                  { title: 'Bias Detection', content: result.bias_detection, icon: AlertCircle }
                ].map((section, index) => (
                  <div key={index} style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '24px', border: '1px solid #374151' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <section.icon style={{ width: '20px', height: '20px', color: '#60A5FA' }} />
                      {section.title}
                    </h3>
                    <p style={{ color: '#D1D5DB', lineHeight: '1.6' }}>{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Right Side: Pyramid */}
              <div>
                <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '16px', padding: '24px', border: '1px solid #374151', position: 'sticky', top: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Pyramid style={{ width: '20px', height: '20px', color: '#60A5FA' }} />
                    Evidence Pyramid
                  </h3>
                  <EvidencePyramid onLevelClick={handlePyramidClick} />
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '24px', textAlign: 'center' }}>Click a level to learn more.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!result && (
          <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.3)', borderRadius: '16px', padding: '32px', border: '1px solid #374151' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste an article URL, text excerpt, or ask about healthcare information credibility..."
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Switch
                    id="mla-citations"
                    checked={mlaCitations}
                    onCheckedChange={setMlaCitations}
                  />
                  <label htmlFor="mla-citations" style={{ color: '#9CA3AF', fontSize: '14px' }}>MLA Citations</label>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isAnalyzing}
                  style={{ minWidth: '140px' }}
                >
                  {isAnalyzing ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: '20px', height: '20px' }} />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer style={{ borderTop: '1px solid #1F2937', backgroundColor: '#111827', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', lineHeight: '1.6' }}>
            This tool provides AI-powered analysis for educational purposes only. Always consult healthcare professionals for medical decisions. 
            Do not share personal health information or sensitive data.
          </p>
        </div>
      </footer>

      {/* Add spinning animation for loading */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;