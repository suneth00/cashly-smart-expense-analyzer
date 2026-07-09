import { useRef, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { AlertCircle, CheckCircle2, Mic } from 'lucide-react';
import { parseVoiceExpense } from '../utils/voiceExpenseParser';
import { useTheme } from '../context/ThemeContext';

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

const AddExpense = () => {
  const { isDark } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [confirmedVoiceData, setConfirmedVoiceData] = useState(null);
  const [voiceResultApplied, setVoiceResultApplied] = useState(false);
  const [supportError, setSupportError] = useState('');

  const formSectionRef = useRef(null);
  const heardSpeechRef = useRef(false);
  const hadSpeechErrorRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const scrollToForm = () => {
    window.setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const applyParsedTranscript = (text) => {
    const finalText = text.trim();
    if (!finalText) return;

    const parsed = parseVoiceExpense(finalText);
    setTranscript(finalText);
    setParsedResult(parsed);
    setConfirmedVoiceData(parsed.fields);
    setVoiceResultApplied(true);
    setSupportError('');
    scrollToForm();
  };

  const clearVoiceResult = () => {
    setTranscript('');
    setInterimTranscript('');
    setParsedResult(null);
    setConfirmedVoiceData(null);
    setVoiceResultApplied(false);
    setSupportError('');
  };

  const handleVoiceExpenseSaved = () => {
    clearVoiceResult();
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

  const voiceAssistantContent = (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <Mic size={22} style={{ color: 'var(--teal-600)' }} />
            Voice Assistant
          </h3>
          <p className="mt-1 text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {isListening
              ? 'Listening... Say something like: I spent 850 rupees on food today'
              : 'Use voice to fill the form, then review and save manually.'}
          </p>
        </div>

        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          title="Start voice input"
          className={`shrink-0 rounded-2xl flex items-center justify-center gap-2 px-5 py-3 transition-all duration-300 border-2 font-black text-sm ${
            isListening ? 'animate-pulse cursor-wait' : 'hover:scale-105'
          }`}
          style={
            isListening
              ? {
                  background: '#ef4444',
                  color: '#fff',
                  borderColor: '#fca5a5',
                  boxShadow: '0 0 0 8px rgba(239,68,68,0.12)',
                }
              : {
                  background: 'var(--teal-600)',
                  color: '#fff',
                  borderColor: isDark ? '#1a3d3d' : '#ccfbf1',
                  boxShadow: '0 8px 22px rgba(13,148,136,0.28)',
                }
          }
        >
          <Mic size={18} />
          {isListening ? 'Listening...' : 'Start Voice Input'}
        </button>
      </div>

      {supportError && (
        <div
          className="p-3 rounded-2xl text-sm font-bold flex items-center gap-3"
          style={{
            background: isDark ? 'rgba(239,68,68,0.13)' : '#fee2e2',
            border: `1px solid ${isDark ? 'rgba(248,113,113,0.32)' : '#fca5a5'}`,
            color: isDark ? '#f87171' : '#dc2626',
          }}
        >
          <AlertCircle size={17} className="shrink-0" />
          {supportError}
        </div>
      )}

      {(transcript || interimTranscript) && (
        <div className="text-sm">
          <p className="text-[10px] mb-1 font-black uppercase tracking-widest" style={{ color: 'var(--teal-600)' }}>
            Transcript
          </p>
          <p className="font-bold italic line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            "{transcript || interimTranscript}"
          </p>
        </div>
      )}

      {voiceResultApplied && (
        <div
          className="p-3 rounded-2xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: isDark ? 'rgba(34,197,94,0.13)' : '#dcfce7',
            border: `1px solid ${isDark ? 'rgba(134,239,172,0.35)' : '#86efac'}`,
            color: isDark ? '#86efac' : '#15803d',
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Voice details added. Please review and save.</p>
              {parsedResult?.warnings?.length > 0 && (
                <p className="mt-1 text-xs font-semibold">
                  {parsedResult.warnings.join(' ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
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
              Clear Voice Input
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-3xl pt-4 pb-10 sm:pt-6 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Add New Expense</h1>
        <p className="mt-2 font-medium text-lg" style={{ color: '#9ca3af' }}>
          Track your spending manually or with your voice.
        </p>
      </div>

      <div ref={formSectionRef} className="scroll-mt-28">
        <ExpenseForm
          voiceData={confirmedVoiceData}
          onSuccess={voiceResultApplied ? handleVoiceExpenseSaved : undefined}
          topContent={voiceAssistantContent}
        />
      </div>
    </div>
  );
};

export default AddExpense;
