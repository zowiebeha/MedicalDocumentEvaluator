import React, { useState } from 'react';
import { Send, Shield, FileText, AlertCircle, Pyramid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { InvokeLLM } from '@/integrations/Core';
import EvidencePyramid from '../components/health/EvidencePyramid';
import InfoModal from '../components/health/InfoModal';

const sampleResult = {
  overall_score: 7,
  source_analysis: "The article is from a reputable medical journal, but the author has ties to a pharmaceutical company, suggesting a potential conflict of interest.",
  evidence_review: "The claims are supported by a large-scale randomized controlled trial, which is a high level of evidence.",
  bias_detection: "Language used is mostly neutral, but some phrases appear to favor the sponsored drug.",
  recommendations: "While the evidence is strong, consider looking for a systematic review for a more comprehensive understanding and be mindful of the author's potential bias.",
  citations: "Doe, J. (2023). 'A new frontier in cardiology.' Journal of Modern Medicine, 45(2), 123-135."
};

export default function HealthCheck() {
  const [prompt, setPrompt] = useState('');
  const [mlaCitations, setMlaCitations] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState(null);

  const handleSubmit = async () => {
    // This is a mock function. In a real scenario, you'd call the LLM.
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
    <div className="min-h-screen bg-gray-900 text-white">
      <InfoModal level={selectedPyramidLevel} isOpen={!!selectedPyramidLevel} onClose={closeModal} />
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HealthCheck AI</h1>
              <p className="text-gray-400 text-sm">Healthcare Article Credibility Evaluator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {!result ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Evaluate Healthcare Information Credibility
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Paste a healthcare article URL, text excerpt, or ask questions about medical 
                information credibility. Our AI will analyze the content for accuracy, bias, source 
                reliability, and evidence quality.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16">
              <div className="text-center bg-gray-800/20 p-6 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full mb-4 mx-auto"></div>
                <h3 className="text-xl font-semibold text-white mb-3">Source Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Evaluate publication credibility and author expertise
                </p>
              </div>
              
              <div className="text-center bg-gray-800/20 p-6 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full mb-4 mx-auto"></div>
                <h3 className="text-xl font-semibold text-white mb-3">Evidence Review</h3>
                <p className="text-gray-400 leading-relaxed">
                  Check citations, studies, and supporting evidence
                </p>
              </div>
              
              <div className="text-center bg-gray-800/20 p-6 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full mb-4 mx-auto"></div>
                <h3 className="text-xl font-semibold text-white mb-3">Bias Detection</h3>
                <p className="text-gray-400 leading-relaxed">
                  Identify potential conflicts of interest and bias
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold">Analysis Results</h2>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full sm:w-auto"
              >
                New Analysis
              </Button>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Side: Text Results */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-blue-400 mb-2">
                        {result.overall_score}/10
                      </div>
                      <div className="text-gray-400 text-lg">Credibility Score</div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Source Analysis
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{result.source_analysis}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Evidence Review
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{result.evidence_review}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    Bias Detection
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{result.bias_detection}</p>
                </div>
              </div>

              {/* Right Side: Pyramid */}
              <div className="lg:col-span-2">
                 <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 sticky top-8">
                    <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
                      <Pyramid className="w-5 h-5 text-blue-400" />
                      Evidence Pyramid
                    </h3>
                    <EvidencePyramid onLevelClick={handlePyramidClick} />
                    <p className="text-xs text-gray-500 mt-6 text-center">Click a level to learn more.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!result && (
          <div className="bg-gray-800/30 rounded-2xl p-4 md:p-8 border border-gray-700">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste an article URL, text excerpt, or ask about healthcare information credibility..."
                  className="min-h-[120px] md:min-h-32 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none focus:border-blue-500 focus:ring-blue-500 text-lg p-6"
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Switch
                    id="mla-citations"
                    checked={mlaCitations}
                    onCheckedChange={setMlaCitations}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <label htmlFor="mla-citations" className="text-gray-400 text-sm">MLA Citations</label>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
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
      <footer className="border-t border-gray-800 bg-gray-900/95">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-gray-500 text-sm text-center leading-relaxed">
            This tool provides AI-powered analysis for educational purposes only. Always consult healthcare professionals for medical decisions. 
            Do not share personal health information or sensitive data.
          </p>
        </div>
      </footer>
    </div>
  );
}