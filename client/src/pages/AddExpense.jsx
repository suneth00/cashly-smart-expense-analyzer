import { useRef, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { AlertCircle, CheckCircle2, Mic, Sparkles } from 'lucide-react';
import { parseVoiceExpense } from '../utils/voiceExpenseParser';
import { useTheme } from '../context/ThemeContext';

const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

const getRecognitionLanguage = () => {
  const languages = navigator.languages || [navigator.language].filter(Boolean);
  return languages.some((language) => language.toLowerCase() === 'en-lk') ? 'en-LK' : 'en-US';
};

const getSpeechErrorMessage = (error) => {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'Microphone access was denied. Please allow microphone access and try again.';
  }

  if (error === 'no-speech') {
    return 'I did not hear anything. Please try again in a quiet place.';
  }

  if (error === 'audio-capture') {
    return 'No microphone was found. Please connect a microphone and try again.';
  }

  if (error === 'network') {
    return 'Speech recognition had a network issue. Please try again.';
  }

  return 'Voice input stopped unexpectedly. Please try again.';
};

const getConfidenceStyle = (confidence, isDark) => {
  if (confidence === 'high') {
    return {
      background: isDark ? 'rgba(34,197,94,0.16)' : '#dcfce7',
      border: `1px solid ${isDark ? 'rgba(134,239,172,0.35)' : '#86efac'}`,
      color: isDark ? '#86efac' : '#15803d',
    };
  }

  if (confidence === 'medium') {
    return {
      background: isDark ? 'rgba(245,158,11,0.16)' : '#fef3c7',
      border: `1px solid ${isDark ? 'rgba(251,191,36,0.35)' : '#fde68a'}`,
      color: isDark ? '#fbbf24' : '#92400e',
    };
  }

  return {
    background: isDark ? 'rgba(239,68,68,0.14)' : '#fee2e2',
    border: `1px solid ${isDark ? 'rgba(248,113,113,0.32)' : '#fecaca'}`,
    color: isDark ? '#f87171' : '#b91c1c',
  };
};

const AddExpense = () => {
  const { isDark } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [voiceDraft, setVoiceDraft] = useState(null);
  const [confirmedVoiceData, setConfirmedVoiceData] = useState(null);
  const [voiceResultApplied, setVoiceResultApplied] = useState(false);
  const [supportError, setSupportError] = useState('');

  const formSectionRef = useRef(null);
  const heardSpeechRef = useRef(false);
  const hadSpeechErrorRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');

  const formKey = confirmedVoiceData ? JSON.stringify(confirmedVoiceData) : 'manual';
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const previewInputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1.5px solid var(--border-card)',
    background: isDark ? '#0d2020' : '#f0fdf4',
    color: 'var(--text-primary)',
    fontSize: 13,
    fontWeight: 600,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const applyParsedTranscript = (text) => {
    const finalText = text.trim();
    if (!finalText) return;

    const parsed = parseVoiceExpense(finalText);
    setTranscript(finalText);
    setParsedResult(parsed);
    setVoiceDraft(parsed.fields);
    setVoiceResultApplied(false);
  };

  const updateVoiceDraft = (field, value) => {
    setVoiceDraft((current) => ({ ...current, [field]: value }));
  };

  const useDetectedExpense = () => {
    if (!voiceDraft) return;
    setConfirmedVoiceData({ ...voiceDraft });
    setVoiceResultApplied(true);

    window.setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const clearVoiceResult = () => {
    setTranscript('');
    setInterimTranscript('');
    setParsedResult(null);
    setVoiceDraft(null);
    setVoiceResultApplied(false);
    setSupportError('');
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setSupportError('Your browser does not support voice recognition. Please try Chrome or Edge.');
      return;
    }

    setSupportError('');
    setTranscript('');
    setInterimTranscript('');
    setParsedResult(null);
    setVoiceDraft(null);
    setVoiceResultApplied(false);
    heardSpeechRef.current = false;
    hadSpeechErrorRef.current = false;
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getRecognitionLanguage();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = 0; i < event.results.length; i += 1) {
        const phrase = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += `${phrase} `;
        } else {
          interimText += `${phrase} `;
        }
      }

      if (finalText.trim() || interimText.trim()) {
        heardSpeechRef.current = true;
      }

      finalTranscriptRef.current = finalText.trim();
      interimTranscriptRef.current = interimText.trim();
      setTranscript(finalTranscriptRef.current);
      setInterimTranscript(interimTranscriptRef.current);

      if (finalTranscriptRef.current) {
        applyParsedTranscript(finalTranscriptRef.current);
      }
    };

    recognition.onerror = (event) => {
      hadSpeechErrorRef.current = true;
      setIsListening(false);
      setSupportError(getSpeechErrorMessage(event.error));
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');

      if (!finalTranscriptRef.current && interimTranscriptRef.current) {
        applyParsedTranscript(interimTranscriptRef.current);
      }

      if (!heardSpeechRef.current && !hadSpeechErrorRef.current) {
        setSupportError('I did not hear anything. Please try again.');
      }
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-3xl pb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Add New Expense</h1>
        <p className="mt-2 font-medium text-lg" style={{ color: '#9ca3af' }}>
          Track your spending manually or with your voice.
        </p>
      </div>

      <div
        className="rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg group"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f2323, #123332)'
            : 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
          border: `1px solid ${isDark ? '#1a3d3d' : '#bbf7d0'}`,
          boxShadow: isDark
            ? '0 12px 30px rgba(0,0,0,0.18)'
            : '0 2px 12px rgba(13,148,136,0.08)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500"
          style={{ background: 'var(--teal-400)', opacity: isDark ? 0.12 : 0.3 }}
        />
        <div
          className="absolute -bottom-16 left-8 w-44 h-44 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'var(--teal-400)', opacity: isDark ? 0.08 : 0.16 }}
        />

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
          <div className="min-w-0 flex-1">
            <h3
              className="text-2xl font-black mb-3 flex items-center gap-2 tracking-tight"
              style={{ color: isDark ? 'var(--text-primary)' : 'var(--teal-800)' }}
            >
              <Mic size={26} style={{ color: 'var(--teal-600)' }} /> Voice Assistant
            </h3>
            <p className="font-medium text-base max-w-xl leading-relaxed" style={{ color: isDark ? '#9ca3af' : 'var(--teal-700)' }}>
              {isListening
                ? 'Listening... Say something like: I spent 850 rupees on food today'
                : 'Say an expense naturally, then review the detected details before using them.'}
            </p>
          </div>

          <button
            onClick={startListening}
            disabled={isListening}
            title="Start voice input"
            className={`shrink-0 rounded-2xl flex items-center justify-center gap-2 px-5 py-4 transition-all duration-300 shadow-xl border-2 font-black text-sm ${
              isListening
                ? 'animate-pulse cursor-wait'
                : 'hover:scale-105'
            }`}
            style={
              isListening
                ? {
                    background: '#ef4444',
                    color: '#fff',
                    borderColor: '#fca5a5',
                    boxShadow: '0 0 0 10px rgba(239,68,68,0.14), 0 8px 24px rgba(239,68,68,0.28)',
                  }
                : {
                    background: 'var(--teal-600)',
                    color: '#fff',
                    borderColor: isDark ? '#1a3d3d' : '#ccfbf1',
                    boxShadow: '0 8px 24px rgba(13,148,136,0.35)',
                  }
            }
          >
            <Mic size={20} />
            {isListening ? 'Listening...' : 'Start Voice Input'}
          </button>
        </div>

        {supportError && (
          <div
            className="mt-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 relative z-10"
            style={{
              background: isDark ? 'rgba(239,68,68,0.13)' : '#fee2e2',
              border: `1px solid ${isDark ? 'rgba(248,113,113,0.32)' : '#fca5a5'}`,
              color: isDark ? '#f87171' : '#dc2626',
            }}
          >
            <AlertCircle size={18} className="shrink-0" /> {supportError}
          </div>
        )}

        {(transcript || interimTranscript) && (
          <div
            className={`${voiceResultApplied ? 'mt-5 p-3' : 'mt-6 p-5'} rounded-2xl relative z-10`}
            style={{
              background: isDark ? 'rgba(15,35,35,0.92)' : 'rgba(255,255,255,0.85)',
              border: `1px solid ${isDark ? '#1a3d3d' : '#d1fae5'}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className={`${voiceResultApplied ? 'text-[10px] mb-1' : 'text-[10px] mb-2'} font-black uppercase tracking-widest flex items-center gap-2`} style={{ color: 'var(--teal-600)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--lime-400)' }} />
              {voiceResultApplied ? 'Voice transcript' : 'You said:'}
            </p>
            <p className={`${voiceResultApplied ? 'text-sm line-clamp-2' : 'text-lg'} font-bold italic tracking-tight`} style={{ color: 'var(--text-primary)' }}>
              "{transcript || interimTranscript}"
            </p>
          </div>
        )}

        {voiceResultApplied && (
          <div
            className="mt-5 p-4 rounded-2xl relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              background: isDark ? 'rgba(34,197,94,0.13)' : '#dcfce7',
              border: `1px solid ${isDark ? 'rgba(134,239,172,0.35)' : '#86efac'}`,
              color: isDark ? '#86efac' : '#15803d',
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-bold">
                Voice details added to the form. Please review and save.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={clearVoiceResult}
                className="px-3 py-2 rounded-xl text-xs font-black"
                style={{
                  background: isDark ? 'rgba(15,35,35,0.78)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(134,239,172,0.28)' : '#86efac'}`,
                  color: isDark ? '#bbf7d0' : '#15803d',
                }}
              >
                Clear Voice Result
              </button>
              <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                className="px-3 py-2 rounded-xl text-xs font-black"
                style={{
                  background: isDark ? 'rgba(15,35,35,0.78)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(134,239,172,0.28)' : '#86efac'}`,
                  color: isDark ? '#bbf7d0' : '#15803d',
                  opacity: isListening ? 0.7 : 1,
                  cursor: isListening ? 'not-allowed' : 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {parsedResult && voiceDraft && !voiceResultApplied && (
          <div
            className="mt-6 p-5 rounded-2xl relative z-10"
            style={{
              background: isDark ? 'rgba(15,35,35,0.92)' : 'rgba(255,255,255,0.88)',
              border: `1px solid ${isDark ? '#1a3d3d' : '#d1fae5'}`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: 'var(--teal-500)' }} />
                <p className="font-black" style={{ color: 'var(--text-primary)' }}>
                  Detected details
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                style={getConfidenceStyle(parsedResult.confidence, isDark)}
              >
                {parsedResult.confidence}
              </span>
            </div>

            <p className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              {parsedResult.confidenceMessage}
            </p>

            {parsedResult.warnings.length > 0 && (
              <div className="space-y-2 mb-4">
                {parsedResult.warnings.map((warning) => (
                  <div
                    key={warning}
                    className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
                    style={{
                      background: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb',
                      border: `1px solid ${isDark ? 'rgba(251,191,36,0.30)' : '#fde68a'}`,
                      color: isDark ? '#fbbf24' : '#92400e',
                    }}
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    {warning}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={voiceDraft.amount}
                  onChange={(event) => updateVoiceDraft('amount', event.target.value)}
                  style={{ ...previewInputStyle, marginTop: 8 }}
                  className="input-teal"
                  placeholder="Enter amount"
                />
              </label>
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                Category
                <select
                  value={voiceDraft.category}
                  onChange={(event) => updateVoiceDraft('category', event.target.value)}
                  style={{ ...previewInputStyle, marginTop: 8, appearance: 'none' }}
                  className="input-teal"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                Title
                <input
                  type="text"
                  value={voiceDraft.title}
                  onChange={(event) => updateVoiceDraft('title', event.target.value)}
                  style={{ ...previewInputStyle, marginTop: 8 }}
                  className="input-teal"
                  placeholder="Expense title"
                />
              </label>
              <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                Date
                <input
                  type="date"
                  value={voiceDraft.date}
                  onChange={(event) => updateVoiceDraft('date', event.target.value)}
                  style={{ ...previewInputStyle, marginTop: 8 }}
                  className="input-teal"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={useDetectedExpense}
                className="btn-teal px-5 py-3 text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={17} />
                Use This Expense
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={formSectionRef} className="scroll-mt-6">
        <ExpenseForm key={formKey} voiceData={confirmedVoiceData} />
      </div>
    </div>
  );
};

export default AddExpense;
