// Cloudflare Worker entry point
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // Serve the React app for all other routes
    return serveReactApp(request);
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/analyze' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { prompt, mlaCitations } = body;
      
      // Use Google Gemini API for analysis
      const analysisResult = await analyzeWithGemini(prompt, mlaCitations, env);
      
      return new Response(JSON.stringify(analysisResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Analysis failed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
  
  return new Response('Not Found', { status: 404 });
}

async function analyzeWithGemini(prompt, mlaCitations, env) {
  const GEMINI_API_KEY = env.GEMINI_API_KEY || 'AIzaSyCGbhBAkpaMbcCzHDMQ3Ds5teSG4PXLTw4';
  
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
    // Try different model names in order of preference
    const modelNames = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ];
    
    for (const modelName of modelNames) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: analysisPrompt }] }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!generatedText) {
          throw new Error('No content generated by Gemini.');
        }

        // Parse the JSON from the generated text
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
        
        const analysisResult = JSON.parse(jsonText);
        
        // Apply whitelist filtering
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
        }
        
        return analysisResult;
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        continue; // Try next model
      }
    }
    
    throw new Error('All model attempts failed');
  } catch (error) {
    console.error('Gemini API analysis failed:', error);
    
    // Return fallback result
    return {
      evidence_level: null,
      source_analysis: "Unable to analyze source due to technical difficulties.",
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
      api_error: true
    };
  }
}

async function serveReactApp(request) {
  // Serve the built React app
  // This is a simplified version - in production you'd want to serve the actual built files
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="HealthCheck AI - Healthcare Article Credibility Evaluator" />
    <title>HealthCheck AI</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #111827;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .input-area {
            background: rgba(31, 41, 55, 0.3);
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 20px;
        }
        textarea {
            width: 100%;
            min-height: 120px;
            background: rgba(31, 41, 55, 0.5);
            border: 1px solid #4B5563;
            color: white;
            border-radius: 8px;
            padding: 24px;
            font-size: 18px;
            font-family: inherit;
            resize: none;
            box-sizing: border-box;
        }
        button {
            background: #2563EB;
            color: white;
            padding: 12px 32px;
            border-radius: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-top: 16px;
        }
        button:hover {
            background: #1D4ED8;
        }
        .result {
            background: #1F2937;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #374151;
            margin-top: 20px;
        }
        .loading {
            text-align: center;
            padding: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HealthCheck AI</h1>
            <p>Healthcare Article Credibility Evaluator</p>
        </div>
        
        <div class="input-area">
            <textarea id="prompt" placeholder="Paste an article URL, text excerpt, or ask about healthcare information credibility..."></textarea>
            <br>
            <button onclick="analyze()">Analyze</button>
        </div>
        
        <div id="result"></div>
    </div>

    <script>
        async function analyze() {
            const prompt = document.getElementById('prompt').value;
            if (!prompt.trim()) return;
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<div class="loading">Analyzing...</div>';
            
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        mlaCitations: false
                    })
                });
                
                const result = await response.json();
                displayResult(result);
            } catch (error) {
                resultDiv.innerHTML = '<div class="result">Error: ' + error.message + '</div>';
            }
        }
        
        function displayResult(result) {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = \`
                <div class="result">
                    <h3>Analysis Results</h3>
                    <p><strong>Source Analysis:</strong> \${result.source_analysis || 'No analysis available'}</p>
                    <p><strong>Evidence Review:</strong> \${result.evidence_review || 'No evidence review available'}</p>
                    <p><strong>Bias Detection:</strong> \${result.bias_detection || 'No bias analysis available'}</p>
                    <p><strong>Recommendations:</strong> \${result.recommendations || 'No recommendations available'}</p>
                </div>
            \`;
        }
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
