
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// NOTE: Replace this with your actual Gemini API key from Google AI Studio
// Get your API key at: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyCGbhBAkpaMbcCzHDMQ3Ds5teSG4PXLTw4';

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

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
        citation: "Smith, J., & Doe, J. 'A Double-Blind, Placebo-Controlled Study of Low-Dose Aspirin for Migraine Prevention.' The Clinical Trials Journal, vol. 8, no. 4, 2022, pp. 210-225."
      },
      {
        title: "Vitamin C Efficacy in a Controlled Group",
        url: "#",
        support: "contradicts",
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
        citation: "Vance, E. 'Perspectives on Modern Surgery.' The Medical Roundtable, 2023. Web."
      }
    ]
  }
];


// Icons as SVG components
const ShieldIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const FileTextIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const AlertCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const PyramidIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.74 4.23l7 14A2 2 0 0 1 18.95 21H5.05a2 2 0 0 1-1.79-2.77l7-14a2 2 0 0 1 3.58 0z"/>
  </svg>
);

const SendIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);

const XIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ExternalLinkIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// Evidence Pyramid Component
const EvidencePyramid = ({ onLevelClick, analysisResult }) => {
  const getLevelColor = (level, hasEvidence) => {
    // If no evidence for this level, make it grayed out
    if (!hasEvidence) {
      return { backgroundColor: '#1F2937', borderColor: '#374151' };
    }
    
    // Higher levels (1-2) are always highlighted when they have evidence
    const isHighQuality = level <= 2;
    
    if (isHighQuality) {
      return { backgroundColor: '#059669', borderColor: '#10B981' }; // Green for high quality evidence
    }
    
    return { backgroundColor: '#374151', borderColor: '#4B5563' }; // Default for other levels
  };

  const getEvidenceCount = (level) => {
    if (!analysisResult?.pyramid_classification) return 0;
    const levelKey = `level_${level}`;
    return analysisResult.pyramid_classification[levelKey]?.length || 0;
  };

  const isLevelClickable = (level) => {
    return getEvidenceCount(level) > 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '16px 0' }}>
      {pyramidLevels.map((level, index) => {
        const hasEvidence = isLevelClickable(level.level);
        const evidenceCount = getEvidenceCount(level.level);
        const colors = getLevelColor(level.level, hasEvidence);
        
        return (
          <div
            key={level.name}
            style={{
              width: level.width,
              position: 'relative',
              cursor: hasEvidence ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: hasEvidence ? 1 : 0.5
            }}
            onClick={() => hasEvidence && onLevelClick({...level, evidence: analysisResult?.pyramid_classification?.[`level_${level.level}`] || []})}
            onMouseEnter={(e) => {
              if (hasEvidence) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                backgroundColor: colors.backgroundColor,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: '4px',
                padding: '12px 8px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (hasEvidence) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.borderColor = '#3B82F6';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundColor;
                e.currentTarget.style.borderColor = colors.borderColor;
              }}
            >
              <span style={{
                fontSize: window.innerWidth < 640 ? '12px' : '14px',
                fontWeight: '500',
                color: hasEvidence ? 'white' : '#6B7280',
                lineHeight: '1.2',
                display: 'block'
              }}>
                {level.name}
                {hasEvidence && ` (${evidenceCount})`}
              </span>
            </div>
          </div>
        );
      })}
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Higher Quality Evidence ↑</div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Lower Quality Evidence ↓</div>
        {analysisResult?.api_error ? (
          <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '8px', opacity: 0.6 }}>
            Analysis Unavailable - API Error
          </div>
        ) : analysisResult?.evidence_level ? (
          <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '8px' }}>
            Evidence Level: {analysisResult.evidence_level}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Info Modal Component
const InfoModal = ({ level, isOpen, onClose, mlaCitations }) => {
  if (!level || !isOpen) return null;

  const supportColors = {
    conclusive: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', borderColor: 'rgba(34, 197, 94, 0.3)' },
    supports: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', borderColor: 'rgba(59, 130, 246, 0.3)' },
    contradicts: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' },
    inconclusive: { backgroundColor: 'rgba(156, 163, 175, 0.2)', color: '#9CA3AF', borderColor: 'rgba(156, 163, 175, 0.3)' },
  };

  const trustworthinessColors = {
    'very high': { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', borderColor: 'rgba(34, 197, 94, 0.3)' },
    'high': { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#6EE7B7', borderColor: 'rgba(34, 197, 94, 0.25)' },
    'medium': { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', borderColor: 'rgba(245, 158, 11, 0.3)' },
    'low': { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.25)' },
    'very low': { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' },
  };

  // Function to clean URLs and prevent www. duplication
  const cleanUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    
    // Remove any existing www. prefix
    let cleaned = url.replace(/^https?:\/\/www\./, 'https://');
    cleaned = cleaned.replace(/^www\./, 'https://');
    
    // Ensure it has a protocol
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned;
    }
    
    return cleaned;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '12px',
        color: 'white',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        width: '100%'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            padding: 0,
            border: '1px solid #4B5563',
            backgroundColor: 'transparent',
            color: '#D1D5DB',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1F2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <XIcon size={16} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '32px', color: '#60A5FA', marginBottom: '8px', fontWeight: 'bold' }}>{level.name}</h2>
          <p style={{ color: '#9CA3AF', paddingTop: '8px', fontSize: '16px', lineHeight: '1.6' }}>
            {level.description}
          </p>
        </div>

        {level.evidence && level.evidence.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px' }}>Supporting Evidence</h3>
            {level.evidence.map((item, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #374151',
                marginBottom: '24px'
              }}>
                <a
                  href={cleanUrl(item.link || item.url) || '#'}
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
                    marginBottom: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#60A5FA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <span>{index + 1}. {item.title}</span>
                  <ExternalLinkIcon size={16} />
                </a>

                {item.summary && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#9CA3AF', fontWeight: '600', marginBottom: '4px' }}>Summary:</div>
                    <div style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.4' }}>
                      {item.summary}
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', color: 'white' }}>Support claim:</span>
                  <span style={{
                    ...supportColors[item.level_of_support || item.support],
                    border: `1px solid ${supportColors[item.level_of_support || item.support]?.borderColor || 'rgba(156, 163, 175, 0.3)'}`,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {item.level_of_support || item.support}
                  </span>
                  
                  {item.trustworthiness && (
                    <>
                      <span style={{ fontWeight: '600', color: 'white' }}>Trustworthiness:</span>
                      <span style={{
                        ...trustworthinessColors[item.trustworthiness],
                        border: `1px solid ${trustworthinessColors[item.trustworthiness]?.borderColor || 'rgba(156, 163, 175, 0.3)'}`,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.trustworthiness}
                      </span>
                    </>
                  )}
                </div>

                {mlaCitations && item.citation && (
                  <div>
                    <div style={{ color: '#60A5FA', fontWeight: '600', marginBottom: '4px' }}>MLA Citation:</div>
                    <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
                      {item.citation}
                    </div>
                  </div>
                )}
                
                {!mlaCitations && (
                  <div>
                    <div style={{ color: '#9CA3AF', fontWeight: '600', marginBottom: '4px' }}>Citation:</div>
                    <div style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.4' }}>
                      Enable MLA Citations toggle to view citations
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function HealthCheck() {
  const [prompt, setPrompt] = useState('');
  const [mlaCitations, setMlaCitations] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null); // Show sample result by default -> Changed to null
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    // Programmatically set the favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/favicon.ico'; // Assumes favicon.ico is in the public root folder
    document.head.appendChild(favicon);

    // Cleanup function to remove the favicon when the component unmounts
    return () => {
      document.head.removeChild(favicon);
    };
  }, []); // Empty dependency array ensures this runs only once

  const validateInput = (input) => {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { valid: false, message: "Please provide some input to analyze." };
    }
    
    if (trimmed.length < 10) {
      return { valid: false, message: "Please provide a longer, more detailed input (at least 10 characters)." };
    }
    
    return { valid: true, message: "" };
  };


  const testApiConnection = async () => {
    try {
      console.log('Testing API connection with Google GenAI SDK...');
      
      // Try different model names in order of preference
      const modelNames = [
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro'
      ];
      
      for (const modelName of modelNames) {
        try {
          console.log(`Testing model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: "Test connection",
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 10,
            }
          });
          
          console.log(`API connection successful with model: ${modelName}`);
          return { success: true, model: modelName };
        } catch (error) {
          console.error(`API connection test failed for ${modelName}:`, error);
          continue;
        }
      }
      
      console.error('All API connection tests failed');
      return { success: false };
    } catch (error) {
      console.error('API connection test failed:', error);
      return { success: false };
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    // Clear previous validation errors
    setValidationError(null);
    
    // Validate input
    const validation = validateInput(prompt);
    if (!validation.valid) {
      setValidationError(validation.message);
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null); // Clear previous results

    const analysisPrompt = `
      You are an AI assistant specialized in evaluating the credibility of healthcare information.
      Analyze the following text, URL, or question provided by the user: "${prompt}".

      Classify the evidence level of this content according to the Evidence-Based Medicine pyramid:
      1. Systematic Reviews & Meta-analyses (highest quality)
      2. Randomized Controlled Trials
      3. Non-randomized Control Trials
      4. Observational Studies with Comparison Groups
      5. Case Series & Reports
      6. Expert Opinion (lowest quality)

      Provide a response in JSON format with the following structure:
      {
        "evidence_level": [number 1-6 indicating which pyramid level this content represents],
        "source_analysis": "[100 characters max. analyzing source reputation, conflicts of interest, and generating relevant sources if none provided]",
        "evidence_review": "[100 characters max. reviewing claims against scientific evidence hierarchy]",
        "bias_detection": "[100 characters max. analyzing for biased language and misleading techniques]",
        "recommendations": "[100 characters max. of actionable advice for the user]",
        "citations": "${mlaCitations ? '[MLA citation if applicable, or note that citation cannot be generated]' : '[Citation generation disabled - toggle MLA Citations to enable]'}",
        "pyramid_classification": {
          "level_1": [array of systematic reviews found, empty if none],
          "level_2": [array of RCTs found, empty if none],
          "level_3": [array of non-RCTs found, empty if none],
          "level_4": [array of observational studies found, empty if none],
          "level_5": [array of case reports found, empty if none],
          "level_6": [array of expert opinions found, empty if none]
        }
      }

      For each pyramid level array, include objects with: {
        "title": "[title of study]",
        "summary": "[100 characters max. plain-language summary]",
        "link": "[URL to study - use exact URL format, do not add www. prefix if already present]",
        "citation": "${mlaCitations ? '[MLA formatted citation]' : 'Citation not available - MLA toggle disabled'}",
        "trustworthiness": "very high | high | medium | low | very low",
        "level_of_support": "supports | contradicts | inconclusive"
      }

      TRUSTWORTHINESS CRITERIA (CRITICAL):
      - "very high" and "high" trustworthiness levels are ONLY for sources from:
        * PubMed (pubmed.ncbi.nlm.nih.gov)
        * The Cochrane Library (cochranelibrary.com)
        * Embase (embase.com)
        * Scopus (scopus.com)
      - Government websites (.gov domains) should be rated as "medium" trustworthiness
      - All other sources (news sites, blogs, commercial sites, etc.) should be rated as "medium", "low", or "very low"
      
      PYRAMID LEVEL ASSIGNMENT RULES:
      - Level 1 (Systematic Reviews): ONLY for sources from PubMed, Cochrane, Embase, or Scopus
      - Level 2 (Randomized Controlled Trials): ONLY for sources from PubMed, Cochrane, Embase, or Scopus
      - Level 3-6: Government websites (.gov domains) and ALL other sources should be placed here
      - Do NOT place hospital websites, medical center websites, news sites, or any non-academic sources in Level 1 or Level 2
      - Mount Sinai, Mayo Clinic, Cleveland Clinic, and similar medical institutions are NOT academic databases and should be in Level 3-6
      - Example: mountsinai.org articles should be in Level 3-6, NOT Level 1 or 2

      PARAGRAPH LIMIT ENFORCEMENT:
      - Each paragraph should be 2-4 sentences maximum
      - If you reach 2 paragraphs, STOP WRITING immediately
      - Do not continue with additional sentences or paragraphs
      - This is a hard limit that cannot be exceeded
      
      CONTENT INSTRUCTIONS:
      - For source_analysis: If the input is a claim without sources, generate relevant scientific sources and studies that address this claim. Don't just note the absence of sources - provide helpful context.
      - For evidence_review: Focus on what scientific evidence exists for or against the claim, even if the original input lacks citations
      - For bias_detection: Look for emotional language, absolute claims, and potential conflicts of interest
      - For recommendations: Provide practical, actionable advice in 1-2 concise paragraphs
      - For URLs: Use exact URL format as provided. Do NOT add "www." prefix to URLs that already have it. If a URL already starts with "www.", use it as-is.
      - For trustworthiness: ONLY rate sources as "very high" or "high" if they are from PubMed, Cochrane, Embase, or Scopus. Government websites should be "medium". All other sources must be "medium", "low", or "very low".
      - For pyramid levels: ONLY place PubMed, Cochrane, Embase, and Scopus sources in Level 1 (Systematic Reviews) and Level 2 (Randomized Controlled Trials). Place ALL other sources (including hospital websites like Mount Sinai, Mayo Clinic, government websites, news sites, etc.) in Level 3-6.
      
      ${mlaCitations ? 'Generate proper MLA citations for all studies and articles found. Use standard MLA format with author names, titles, publication information, and dates.' : 'Do not generate MLA citations as the toggle is disabled. Use generic descriptions instead.'}

      FINAL REMINDER - CRITICAL:
      - source_analysis: MAXIMUM 2 PARAGRAPHS - STOP after 2 paragraphs
      - evidence_review: MAXIMUM 2 PARAGRAPHS - STOP after 2 paragraphs  
      - bias_detection: MAXIMUM 2 PARAGRAPHS - STOP after 2 paragraphs
      - recommendations: MAXIMUM 2 PARAGRAPHS - STOP after 2 paragraphs
      - Each paragraph: 2-4 sentences maximum
      - NO EXCEPTIONS TO THESE LIMITS

      Respond only with valid JSON, no additional text, no markdown formatting, no code blocks.
    `;

    try {
      console.log('Making API request to Gemini using SDK...');
      
      // Try different model names in order of preference
      const modelNames = [
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro'
      ];
      
      let analysisResult;
      let lastError;
      
      for (const modelName of modelNames) {
        try {
          console.log(`Trying model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: analysisPrompt,
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          });
          
          console.log(`API Response successful with model: ${modelName}`);
          console.log('Response:', response);
          
          // Extract the text from the response
          const generatedText = response.text;
          
          if (!generatedText) {
            console.error('No generated text found in response:', response);
            throw new Error('No content generated by Gemini.');
          }

          console.log('Generated text:', generatedText);

          // Parse the JSON from the generated text
          try {
            // Clean the generated text to extract JSON from markdown code blocks
            let jsonText = generatedText.trim();
            
            // Remove markdown code block formatting if present
            if (jsonText.startsWith('```json')) {
              jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            // Try to find JSON object boundaries if there's extra text
            const jsonStart = jsonText.indexOf('{');
            const jsonEnd = jsonText.lastIndexOf('}');
            
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
              jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
            }
            
            // Remove any leading/trailing whitespace
            jsonText = jsonText.trim();
            
            console.log('Cleaned JSON text:', jsonText);
            
            analysisResult = JSON.parse(jsonText);
            console.log('Parsed analysis result:', analysisResult);
            const allowedDomains = [
              "pubmed.ncbi.nlm.nih.gov",
              "cochranelibrary.com",
              "embase.com",
              "scopus.com"
            ];
          
            const isWhitelisted = (link) => {
              if (!link) return false;
              return allowedDomains.some(domain => link.includes(domain));
            };
          
            const demoteSources = (sources) => {
              if (!Array.isArray(sources)) return { keep: [], demote: [] };
              const keep = [];
              const demote = [];
              for (const src of sources) {
                if (isWhitelisted(src.link)) {
                  keep.push(src); // stays in Level 1 or 2
                } else {
                  demote.push(src); // demoted to Level 3
                }
              }
              return { keep, demote };
            };
          
            if (analysisResult?.pyramid_classification) {
              const pc = analysisResult.pyramid_classification;
          
              // Handle Level 1
              const { keep: level1Keep, demote: level1Demote } = demoteSources(pc.level_1);
              pc.level_1 = level1Keep;
              pc.level_3 = [...(pc.level_3 || []), ...level1Demote];
          
              // Handle Level 2
              const { keep: level2Keep, demote: level2Demote } = demoteSources(pc.level_2);
              pc.level_2 = level2Keep;
              pc.level_3 = [...(pc.level_3 || []), ...level2Demote];
          
              console.log("Whitelist filter + demotion applied. Updated classification:", pc);
            }
            break; // Success, exit the loop
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw text that failed to parse:', generatedText);
            lastError = new Error(`Failed to parse JSON response from Gemini: ${parseError.message}`);
            continue; // Try next model
          }
          
        } catch (modelError) {
          console.error(`Error with model ${modelName}:`, modelError);
          lastError = modelError;
          continue; // Try next model
        }
      }
      
      if (!analysisResult) {
        throw lastError || new Error('All model attempts failed');
      }
      
      // Validate that we have the required fields
      if (!analysisResult.overall_score && analysisResult.overall_score !== 0) {
        console.warn('Missing overall_score in response, using fallback');
        analysisResult.overall_score = 5;
      }
      
      setResult(analysisResult);

    } catch (error) {
      console.error("Gemini API analysis failed:", error);
      
      // Determine specific error message based on error type
      let errorMessage = "Unable to analyze source due to technical difficulties.";
      
      if (error.message.includes('API request failed: 400')) {
        errorMessage = "Invalid API request. Please check the API key configuration.";
      } else if (error.message.includes('API request failed: 401')) {
        errorMessage = "API key is invalid or expired. Please update the API key.";
      } else if (error.message.includes('API request failed: 403')) {
        errorMessage = "API access forbidden. Please check API permissions and billing.";
      } else if (error.message.includes('API request failed: 429')) {
        errorMessage = "API rate limit exceeded. Please try again in a few minutes.";
      } else if (error.message.includes('API request failed: 500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes('JSON Parse Error')) {
        errorMessage = "Invalid response format from API. Please try again.";
      }
      
      // Fallback to a sample result if API fails
      const fallbackResult = {
        overall_score: null, // This will show as ?/10
        evidence_level: null,
        source_analysis: errorMessage,
        evidence_review: "Could not perform evidence review due to technical difficulties. When evaluating healthcare information, look for peer-reviewed studies, systematic reviews, and clinical trials as stronger forms of evidence.",
        bias_detection: "Bias analysis unavailable. Be aware of emotional language, absolute claims without evidence, and financial incentives that might influence the content.",
        recommendations: "Due to technical issues, we recommend consulting with healthcare professionals and looking for multiple credible sources before making health-related decisions. Please try again later.",
        citations: "Citation generation unavailable due to API issues.",
        pyramid_classification: {
          level_1: [],
          level_2: [],
          level_3: [],
          level_4: [],
          level_5: [],
          level_6: []
        },
        api_error: true // Flag to indicate API failure
      };
      
      setResult(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white' }}>
      <InfoModal level={selectedPyramidLevel} isOpen={!!selectedPyramidLevel} onClose={closeModal} mlaCitations={mlaCitations} />
      
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1F2937',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#2563EB',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldIcon size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>HealthCheck AI</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>Healthcare Article Credibility Evaluator</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '48px 24px' }}>
        {!result && !isAnalyzing ? (
          <>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px'
              }}>
                <FileTextIcon size={40} color="#60A5FA" />
              </div>
              <h2 style={{
                fontSize: window.innerWidth < 768 ? '36px' : '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                lineHeight: '1.2'
              }}>
                Evaluate Healthcare Information Credibility
              </h2>
              <p style={{
                fontSize: window.innerWidth < 768 ? '18px' : '20px',
                color: '#9CA3AF',
                maxWidth: '768px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Paste a healthcare article URL, text excerpt, or ask questions about medical 
                information credibility. Our AI will analyze the content for accuracy, bias, source 
                reliability, and evidence quality.
              </p>
            </div>

            {/* Feature Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
              gap: '32px',
              marginBottom: '64px'
            }}>
              {[
                { title: 'Source Analysis', description: 'Evaluate publication credibility and author expertise' },
                { title: 'Evidence Review', description: 'Check citations, studies, and supporting evidence' },
                { title: 'Bias Detection', description: 'Identify potential conflicts of interest and bias' }
              ].map((feature, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  backgroundColor: 'rgba(31, 41, 55, 0.2)',
                  padding: '24px',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3B82F6',
                    borderRadius: '50%',
                    margin: '0 auto 16px'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>{feature.title}</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : isAnalyzing ? (
          /* Loading State */
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #3B82F6',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            <h2 style={{
              fontSize: window.innerWidth < 768 ? '36px' : '48px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Analyzing Healthcare Information...
            </h2>
            <p style={{
              fontSize: window.innerWidth < 768 ? '18px' : '20px',
              color: '#9CA3AF',
              maxWidth: '768px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              This may take a few moments...
            </p>
          </div>
        ) : (
          /* Results Section */
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>Analysis Results</h2>
              <button
                onClick={handleReset}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: window.innerWidth < 640 ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                New Analysis
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '3fr 2fr',
              gap: '32px'
            }}>
              {/* Left Side: Text Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {[
                  { title: 'Source Analysis', content: result?.source_analysis || 'No analysis available', icon: ShieldIcon },
                  { title: 'Evidence Review', content: result?.evidence_review || 'No evidence review available', icon: FileTextIcon },
                  { title: 'Bias Detection', content: result?.bias_detection || 'No bias analysis available', icon: AlertCircleIcon }
                ].map((section, index) => (
                  <div key={index} style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #374151'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <section.icon size={20} color="#60A5FA" />
                      {section.title}
                    </h3>
                    <p style={{ color: '#D1D5DB', lineHeight: '1.6' }}>{section.content}</p>
                  </div>
                ))}

                {result?.recommendations && (
                  <div style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(37, 99, 235, 0.2)'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Recommendations</h3>
                    <p style={{ color: '#D1D5DB', lineHeight: '1.6' }}>{result.recommendations}</p>
                  </div>
                )}

                {mlaCitations && result?.citations && (
                  <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #374151'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>MLA Citations</h3>
                    <p style={{ color: '#D1D5DB', lineHeight: '1.6', fontFamily: 'monospace', fontSize: '14px' }}>{result.citations}</p>
                  </div>
                )}
              </div>

              {/* Right Side: Pyramid */}
              <div>
                <div style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #374151',
                  position: 'sticky',
                  top: '32px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <PyramidIcon size={20} color="#60A5FA" />
                    Evidence Pyramid
                  </h3>
                  <EvidencePyramid onLevelClick={handlePyramidClick} analysisResult={result} />
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '16px', textAlign: 'center' }}>
                    Click any level to learn more about evidence quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!result && !isAnalyzing && (
          <div style={{
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
            borderRadius: '16px',
            padding: window.innerWidth < 768 ? '16px' : '32px',
            border: '1px solid #374151'
          }}>
            {validationError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                color: '#F87171'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Invalid Input</div>
                <div>{validationError}</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (validationError) {
                    setValidationError(null); // Clear validation error when user types
                  }
                }}
                placeholder="Paste an article URL, text excerpt, or ask about healthcare information credibility..."
                style={{
                  minHeight: window.innerWidth < 768 ? '120px' : '128px',
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  border: '1px solid #4B5563',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  fontSize: '18px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4B5563';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: window.innerWidth < 768 ? '100%' : 'auto'
                }}>
                  <label htmlFor="mla-toggle" style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '400' }}>
                    MLA Citations
                  </label>
                  <div
                    id="mla-toggle"
                    onClick={() => setMlaCitations(!mlaCitations)}
                    style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      backgroundColor: mlaCitations ? '#2563EB' : '#4B5563',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      // For accessibility, if this isn't a native input, add role/aria-checked
                      role: 'switch',
                      'aria-checked': mlaCitations
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: mlaCitations ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                  <button
                    onClick={async () => {
                      console.log('Testing API connection...');
                      const result = await testApiConnection();
                      if (result.success) {
                        alert(`API connection successful! Working model: ${result.model}`);
                      } else {
                        alert('API connection failed. Check console for details.');
                      }
                    }}
                    style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                      fontSize: '14px',
                      minHeight: '48px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#047857';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                  >
                    Test API
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || isAnalyzing}
                    style={{
                      backgroundColor: '#2563EB',
                      color: 'white',
                      padding: '12px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: !prompt.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
                      opacity: !prompt.trim() || isAnalyzing ? 0.5 : 1,
                      border: 'none',
                      fontSize: '16px',
                      flex: 1,
                      minHeight: '48px'
                    }}
                    onMouseEnter={(e) => {
                      if (!(!prompt.trim() || isAnalyzing)) {
                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(!prompt.trim() || isAnalyzing)) {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SendIcon size={20} />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer style={{
        borderTop: '1px solid #1F2937',
        backgroundColor: 'rgba(17, 24, 39, 0.95)'
      }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 24px' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', lineHeight: '1.6' }}>
            This tool provides AI-powered analysis for educational purposes only. Always consult healthcare professionals for medical decisions. 
            Do not share personal health information or sensitive data.
          </p>
        </div>
      </footer>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
