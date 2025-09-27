
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCGbhBAkpaMbcCzHDMQ3Ds5teSG4PXLTw4"; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = `
We have an app that lets the general public evaluate the trustworthiness of medical claims and documents using the Evidence-based medicine pyramid from researchgate.net as the evaluation framework.

The app accepts ten types of inputs:
A question (e.g. does coffee cure cancer?)
A claim (e.g. coffee cures cancer)
Document(s) (in any popular file format such as pdf and word)
Article link(s)
A question AND document(s) AND article link(s)
A question AND document(s)
A question AND article link(s)
A claim AND document(s) AND article link(s)
A claim AND document(s)
A claim AND article link(s)

For any input WITHOUT a claim, the input should be converted into a claim. Here are some examples:
Does coffee cure cancer? → Coffee cures cancer
Is alcohol good for my liver? → Alcohol is positively affects the liver
[a document/article arguing that the minimum hours of sleep an adolescent should get per night is 8] → Adolescents should sleep at least 8 hours per night
[a document that argues that alcohol is good for digestion and another document that argues that alcohol is harmful to digestion] → Alcohol Is good for digestion
Create a claim out of a random one of the documents/articles provided 
If the input is nonsensical (it cannot read the file/article or is not related to the medical field), indicate that to the user and have them input something else

The app sends a request to the Google Gemini API which will give an output depending on the type of input:
Articles and their trustworthiness 
Articles and their trustworthiness 
Trustworthiness 
Trustworthiness 
An evidence-based medicine pyramid where document(s) and article(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the generated claim
An evidence-based medicine pyramid where document(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the generated claim
An evidence-based medicine pyramid where article(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the generated claim
An evidence-based medicine pyramid where document(s) and article(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the claim
An evidence-based medicine pyramid where document(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the claim
An evidence-based medicine pyramid where article(s) are grouped into each section of the pyramid based on their trustworthiness AND the level of support for the claim

The trustworthiness of an article/link is grouped into three different categories:
Very High (Systematic Reviews)
High (Random Controlled Trials)
Moderate High (Non-randomized Controlled Trials)
Moderate (Observational Studies with Comparison Groups)
Moderate Low (Cohort Studies)
Low (Case Series and Reports)
Very Low (Expert Opinion)

The level of support an article/link has for a claim is grouped into three different categories:
Supports (Fully agrees with the claim)
Inconclusive (Mixed agreement and disagreement with the claim)
Contradicts (Fully disagree with the claim)

Here is how the json should be formatted:
{
  "claim": "<restated claim in clear language>",
  "evidence": {
    "systematic_reviews": [
      {
        "title": "<title of study>",
        "summary": "<1–2 sentence plain-language summary>",
        "link": "<URL to study>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "very high",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "rcts": [
      {
        "title": "<title of randomized controlled trial>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "high",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "non_randomized_controlled_trials": [
      {
        "title": "<title of non-randomized controlled trial>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "moderate high",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "observational_with_comparison": [
      {
        "title": "<title of observational study with comparison group>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "moderate",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "cohort_studies": [
      {
        "title": "<title of cohort study>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "moderate low",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "case_series_and_reports": [
      {
        "title": "<title of case series/report>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "low",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ],
    "expert_opinion": [
      {
        "title": "<title of expert commentary or opinion>",
        "summary": "<summary>",
        "link": "<URL>",
        "citation": "<MLA formatted citation>",
        "trustworthiness": "very low",
        "level_of_support": "supports | contradicts | inconclusive"
      }
    ]
  },
  "overall_summary": "<plain-language paragraph summarizing what the evidence means for the general public>"
}
`;

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

const sampleResult = {
  overall_score: 7,
  source_analysis: "The article is from a reputable medical journal, but the author has ties to a pharmaceutical company, suggesting a potential conflict of interest.",
  evidence_review: "The claims are supported by a large-scale randomized controlled trial, which is a high level of evidence.",
  bias_detection: "Language used is mostly neutral, but some phrases appear to favor the sponsored drug.",
  recommendations: "While the evidence is strong, consider looking for a systematic review for a more comprehensive understanding and be mindful of the author's potential bias.",
  citations: "Doe, J. (2023). 'A new frontier in cardiology.' Journal of Modern Medicine, 45(2), 123-135."
};

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
const EvidencePyramid = ({ onLevelClick }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '16px 0' }}>
      {pyramidLevels.map((level, index) => (
        <div
          key={level.name}
          style={{
            width: level.width,
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => onLevelClick(level)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
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
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.borderColor = '#3B82F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.borderColor = '#4B5563';
            }}
          >
            <span style={{
              fontSize: window.innerWidth < 640 ? '12px' : '14px',
              fontWeight: '500',
              color: 'white',
              lineHeight: '1.2',
              display: 'block'
            }}>
              {level.name}
            </span>
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

// Info Modal Component
const InfoModal = ({ level, isOpen, onClose }) => {
  if (!level || !isOpen) return null;

  const supportColors = {
    conclusive: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', borderColor: 'rgba(34, 197, 94, 0.3)' },
    supports: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', borderColor: 'rgba(59, 130, 246, 0.3)' },
    contradicts: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' },
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: 'white' }}>Support claim:</span>
                  <span style={{
                    ...supportColors[item.support],
                    border: `1px solid ${supportColors[item.support].borderColor}`,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {item.support}
                  </span>
                </div>

                <div>
                  <div style={{ color: '#60A5FA', fontWeight: '600', marginBottom: '4px' }}>MLA Citation:</div>
                  <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
                    {item.citation}
                  </div>
                </div>
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
  const [result, setResult] = useState(sampleResult); // Show sample result by default
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState(null);

  useEffect(() => {
    // Programmatically set the favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = './favicon.ico'; // Assumes favicon.ico is in the public root folder
    document.head.appendChild(favicon);

    // Cleanup function to remove the favicon when the component unmounts
    return () => {
      document.head.removeChild(favicon);
    };
  }, []); // Empty dependency array ensures this runs only once

//   const handleSubmit = async () => {
//     if (!prompt.trim()) return;
    
//     setIsAnalyzing(true);
//     // Simulate API call
//     setTimeout(() => {
//       setResult(sampleResult);
//       setIsAnalyzing(false);
//     }, 1500);
//   };
    const handleSubmit = async () => {
    const hardcodedPrompt = "Explain the importance of evidence-based practice in healthcare.";
    
    setIsAnalyzing(true);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(hardcodedPrompt);
        const response = await result.response;
        const text = response.text();

        setResult(text);
    } catch (error) {
        console.error("Gemini API call failed:", error);
        setResult("An error occurred while analyzing. Please try again.");
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
      <InfoModal level={selectedPyramidLevel} isOpen={!!selectedPyramidLevel} onClose={closeModal} />
      
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
        {!result ? (
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
                <div style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #374151'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#60A5FA', marginBottom: '8px' }}>
                      {result.overall_score}/10
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '18px' }}>Credibility Score</div>
                  </div>
                </div>

                {[
                  { title: 'Source Analysis', content: result.source_analysis, icon: ShieldIcon },
                  { title: 'Evidence Review', content: result.evidence_review, icon: FileTextIcon },
                  { title: 'Bias Detection', content: result.bias_detection, icon: AlertCircleIcon }
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

                {result.recommendations && (
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

                {mlaCitations && result.citations && (
                  <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #374151'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Citations</h3>
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
                  <EvidencePyramid onLevelClick={handlePyramidClick} />
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '16px', textAlign: 'center' }}>
                    Click any level to learn more about evidence quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!result && (
          <div style={{
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
            borderRadius: '16px',
            padding: window.innerWidth < 768 ? '16px' : '32px',
            border: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
                  <label htmlFor="mla-toggle" style={{ color: '#9CA3AF', fontSize: '14px' }}>MLA Citations</label>
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
                    width: window.innerWidth < 768 ? '100%' : 'auto',
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
      `}</style>
    </div>
  );
}
