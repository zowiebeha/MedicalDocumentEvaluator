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
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #4B5563',
      backgroundColor: '#374151',
      color: 'white',
      fontSize: '16px',
      resize: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
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
  const pyramidLevels = [
    {
      name: 'Systematic Reviews',
      width: '30%',
      description: 'The highest level of evidence. These studies collect and critically analyze multiple research studies or papers on a specific topic, providing a comprehensive summary of the current evidence.',
      level: 1,
      evidence: [
        {
          title: "The Efficacy of New Drug X: A Meta-Analysis",
          url: "#",
          support: "conclusive",
          trustworthiness: "high",
          citation: "Review Board, A. et al. 'The Efficacy of New Drug X: A Meta-Analysis.' Journal of Meta-Analyses, vol. 15, no. 2, 2023, pp. 45-60."
        }
      ]
    },
    {
      name: 'Randomized Controlled Trials',
      width: '45%',
      description: 'Considered the gold standard for clinical trials. Participants are randomly assigned to an experimental group or a control group to compare the effects of an intervention against a control.',
      level: 2,
      evidence: [
        {
          title: "A Double-Blind Study of Aspirin for Headache Prevention",
          url: "#",
          support: "supports",
          trustworthiness: "high",
          citation: "Smith, J., & Doe, J. 'A Double-Blind, Placebo-Controlled Study of Low-Dose Aspirin for Migraine Prevention.' The Clinical Trials Journal, vol. 8, no. 4, 2022, pp. 210-225."
        },
        {
          title: "Vitamin C Efficacy in a Controlled Group",
          url: "#",
          support: "contradicts",
          trustworthiness: "medium",
          citation: "Granger, H. 'Re-evaluating Vitamin C Supplementation: A Randomized Trial.' Journal of Nutritional Science, vol. 12, no. 1, 2021, pp. 35-48."
        }
      ]
    },
    {
      name: 'Non-randomized Control Trials',
      width: '60%',
      description: 'Similar to RCTs but participants are not randomly assigned to groups. These are often used when randomization is not ethical or feasible.',
      level: 3,
      evidence: []
    },
    {
      name: 'Observational Studies with Comparison Groups',
      width: '75%',
      description: 'Researchers observe participants to assess health outcomes, comparing a group that received an exposure to one that did not. Examples include cohort studies and case-control studies.',
      level: 4,
      evidence: [
         {
          title: "Long-Term Coffee Consumption and Heart Disease: A Cohort Study",
          url: "#",
          support: "supports",
          trustworthiness: "medium",
          citation: "Chen, L. et al. 'Coffee Consumption and Risk of Cardiovascular Diseases: A Large-Scale Observational Study.' American Journal of Epidemiology, vol. 190, no. 8, 2019, pp. 1516-1525."
        }
      ]
    },
    {
      name: 'Case Series & Reports',
      width: '90%',
      description: 'Collections of reports on the treatment of individual patients or a report on a single patient. They can be helpful for identifying new diseases or rare side effects but have no control group for comparison.',
      level: 5,
      evidence: []
    },
    {
      name: 'Expert Opinion',
      width: '100%',
      description: 'The lowest level of evidence. This is based on the personal experience and beliefs of an expert in the field. It is not based on scientific studies and is prone to bias.',
      level: 6,
      evidence: [
        {
          title: "An Interview with Dr. Eleanor Vance on Modern Surgical Techniques",
          url: "#",
          support: "supports",
          trustworthiness: "low",
          citation: "Vance, E. 'Perspectives on Modern Surgery.' The Medical Roundtable, 2023. Web."
        }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '16px 0' }}>
      {pyramidLevels.map((level, index) => (
        <div
          key={level.name}
          style={{
            position: 'relative',
            cursor: 'pointer',
            width: level.width,
            transition: 'all 0.3s ease'
          }}
          onClick={() => onLevelClick(level)}
          onMouseEnter={(e) => {
            const levelDiv = e.currentTarget;
            const tooltip = levelDiv.querySelector('.tooltip');
            levelDiv.style.transform = 'scale(1.05)';
            if (tooltip) tooltip.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const levelDiv = e.currentTarget;
            const tooltip = levelDiv.querySelector('.tooltip');
            levelDiv.style.transform = 'scale(1)';
            if (tooltip) tooltip.style.opacity = '0';
          }}
        >
          <div
            style={{
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '4px',
              padding: '12px 8px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563EB';
              e.target.style.borderColor = '#3B82F6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#374151';
              e.target.style.borderColor = '#4B5563';
            }}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              display: 'block',
              lineHeight: '1.2'
            }}>
              {level.name}
            </span>
          </div>
          
          {/* Hover tooltip */}
          <div
            className="tooltip"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              padding: '12px',
              backgroundColor: '#1F2937',
              color: 'white',
              fontSize: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              opacity: '0',
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: 10,
              width: '192px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Level {level.level}</div>
            <div style={{ color: '#D1D5DB' }}>Click to learn more</div>
            {/* Tooltip arrow */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1F2937'
            }} />
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Higher Quality Evidence ↑</div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Lower Quality Evidence ↓</div>
      </div>
    </div>
  );
};

// Additional icons
const X = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ExternalLink = ({ className, ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// Badge Component
const Badge = ({ children, variant, className, style }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid',
    ...style
  };
  
  return <span style={baseStyle} className={className}>{children}</span>;
};

const supportColors = {
  conclusive: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', borderColor: 'rgba(34, 197, 94, 0.3)' },
  supports: { backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#60A5FA', borderColor: 'rgba(37, 99, 235, 0.3)' },
  contradicts: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' },
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
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#111827',
          border: '1px solid #374151',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #4B5563',
            backgroundColor: 'transparent',
            color: '#D1D5DB',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1F2937'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        <div style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#60A5FA', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
              {level.name}
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.6', marginTop: '8px' }}>
              {level.description}
            </p>
          </div>

          {/* Supporting Evidence */}
          {level.evidence && level.evidence.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px' }}>
                Supporting Evidence
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {level.evidence.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.5)', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      border: '1px solid #374151' 
                    }}
                  >
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '18px', 
                        fontWeight: '500', 
                        color: 'white', 
                        textDecoration: 'none',
                        marginBottom: '12px',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#60A5FA'}
                      onMouseOut={(e) => e.target.style.color = 'white'}
                    >
                      <span>{index + 1}. {item.title}</span>
                      <ExternalLink style={{ width: '16px', height: '16px' }} />
                    </a>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '600', color: 'white' }}>Support claim:</span>
                      <Badge style={supportColors[item.support]}>
                        {item.support}
                      </Badge>
                    </div>

                    <div>
                      <div style={{ color: '#60A5FA', fontWeight: '600', marginBottom: '4px' }}>
                        MLA Citation:
                      </div>
                      <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
                        {item.citation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
          <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.3)', borderRadius: '16px', padding: '24px', border: '1px solid #374151', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste an article URL, text excerpt, or ask about healthcare information credibility..."
                />
              </div>
              
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