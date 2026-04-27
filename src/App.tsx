/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { summarizeText } from './services/geminiService';
import { Loader2, ArrowRight, Type, AlignLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AnoAI from './components/ui/animated-shader-background';

export default function App() {
  const [text, setText] = useState('');
  const [wordLimit, setWordLimit] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setError('');
    setIsLoading(true);
    setSummary('');

    try {
      const limit = parseInt(wordLimit);
      const result = await summarizeText(text, isNaN(limit) ? undefined : limit);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-slate-200 font-sans selection:bg-white/30 overflow-x-hidden">
      {/* Shader Background */}
      <AnoAI />

      {/* Main UI Overlay */}
      <div className="relative z-10 w-full h-full min-h-screen p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-[float_6s_ease-in-out_infinite]">
          
          {/* Header */}
          <header className="space-y-4 pt-8 pb-4 text-center backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-lg">
              AI Text Summarizer
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto drop-shadow">
              Big text. Small time.
            </p>
          </header>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 backdrop-blur-md bg-white/5 border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl">
            
            {/* Left Column: Input */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="text-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2 drop-shadow">
                  <AlignLeft size={16} className="text-slate-300" /> Source Text
                </label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full h-80 lg:h-96 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner focus:ring-2 focus:ring-white/50 focus:border-white/30 focus:outline-none resize-none transition-all text-white placeholder-slate-400 leading-relaxed disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>

              <div className="flex sm:flex-row flex-col gap-4">
                <div className="flex-1 space-y-2">
                  <label htmlFor="word-limit" className="text-sm font-semibold text-slate-200 flex items-center gap-2 drop-shadow">
                    <Type size={16} className="text-slate-300" /> Word Limit <span className="text-slate-400 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="word-limit"
                    type="number"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    placeholder="e.g. 100"
                    min="1"
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 shadow-inner focus:ring-2 focus:ring-white/50 focus:border-white/30 focus:outline-none transition-all text-white placeholder-slate-400 disabled:opacity-50"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex-1 flex items-end">
                  <button
                    onClick={handleSummarize}
                    disabled={isLoading || !text.trim()}
                    className="w-full h-[58px] bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-colors focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        Summarize <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-4 rounded-xl bg-red-500/20 text-red-200 text-sm border border-red-500/30 flex items-start gap-3 backdrop-blur-sm">
                  <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Right Column: Output */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 drop-shadow">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></span> Result
              </label>
              <div className={`w-full h-80 lg:h-96 p-6 md:p-8 rounded-2xl bg-black/40 border border-white/10 shadow-inner overflow-y-auto transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'} ${!summary && !isLoading ? 'flex items-center justify-center' : ''}`}>
                
                {!summary && !isLoading && !error && (
                  <div className="text-center text-slate-400 max-w-xs mx-auto space-y-3">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      <AlignLeft size={24} className="text-slate-300 drop-shadow" />
                    </div>
                    <p className="text-sm font-medium">Your structured summary will crystallize here.</p>
                  </div>
                )}

                {isLoading && !summary && (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-white drop-shadow-[0_0_10px_white]" size={40} />
                      <p className="text-sm text-slate-300 animate-pulse">Processing insights...</p>
                    </div>
                  </div>
                )}

                {summary && (
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h2:text-white prose-h2:mb-4 prose-h3:text-slate-200 prose-p:leading-relaxed prose-li:my-1 prose-strong:font-semibold prose-strong:text-white">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
