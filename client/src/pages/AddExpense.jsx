import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { Mic, AlertCircle, Sparkles } from 'lucide-react';
import { parseVoiceInput } from '../utils/voiceParser';

const AddExpense = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [supportError, setSupportError] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      setSupportError('Your browser does not support voice recognition. Please try Chrome, Edge, or Safari.');
      return;
    }
    setSupportError('');
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => { setIsListening(true); setTranscript(''); setParsedData(null); };
    recognition.onresult = (event) => {
      const recognizedText = event.results[event.resultIndex][0].transcript;
      setTranscript(recognizedText);
      setParsedData(parseVoiceInput(recognizedText));
    };
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      setSupportError('Microphone error or permission denied. Please allow microphone access.');
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="w-full max-w-3xl pb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Add New Expense</h1>
        <p className="mt-2 font-medium text-lg" style={{ color: 'var(--text-muted)' }}>
          Track your spending manually or with your voice.
        </p>
      </div>

      {/* Voice Assistant UI */}
      <div
        className="rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg group"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
          border: '1px solid #bbf7d0',
          boxShadow: '0 2px 12px rgba(13,148,136,0.08)',
        }}
      >
        {/* Decorative blob */}
        <div
          className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-500"
          style={{ background: 'var(--teal-400)' }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center sm:text-left">
            <h3
              className="text-2xl font-black mb-3 flex items-center justify-center sm:justify-start gap-2 tracking-tight"
              style={{ color: 'var(--teal-800)' }}
            >
              <Mic size={26} style={{ color: 'var(--teal-600)' }} /> Voice Assistant
            </h3>
            <p className="font-medium text-base max-w-sm leading-relaxed" style={{ color: 'var(--teal-700)' }}>
              Tap the microphone and say something like{' '}
              <span
                className="font-bold px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--teal-800)' }}
              >
                "Spent 45 dollars on Food yesterday"
              </span>{' '}
              to autofill the form!
            </p>
          </div>

          <button
            onClick={startListening}
            title="Click to speak"
            className={`w-24 h-24 rounded-[2rem] flex shrink-0 items-center justify-center transition-all duration-300 shadow-xl border-4 ${
              isListening
                ? 'animate-pulse scale-110'
                : 'hover:scale-105 hover:rotate-3'
            }`}
            style={
              isListening
                ? {
                    background: '#ef4444',
                    color: '#fff',
                    borderColor: '#fca5a5',
                    boxShadow: '0 0 0 12px rgba(239,68,68,0.15), 0 8px 24px rgba(239,68,68,0.35)',
                  }
                : {
                    background: 'var(--teal-600)',
                    color: '#fff',
                    borderColor: '#ccfbf1',
                    boxShadow: '0 8px 24px rgba(13,148,136,0.35)',
                  }
            }
          >
            <Mic size={34} />
          </button>
        </div>

        {supportError && (
          <div
            className="mt-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3"
            style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626' }}
          >
            <AlertCircle size={18} className="shrink-0" /> {supportError}
          </div>
        )}

        {transcript && (
          <div
            className="mt-8 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #d1fae5', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--teal-600)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--lime-400)' }} />
              Speech Recognized:
            </p>
            <p className="font-bold italic text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>"{transcript}"</p>
            {parsedData && (
              <div
                className="absolute top-4 right-4 p-1.5 rounded-full"
                style={{ background: '#dcfce7', color: '#16a34a' }}
              >
                <Sparkles size={15} />
              </div>
            )}
          </div>
        )}
      </div>

      <ExpenseForm voiceData={parsedData} />
    </div>
  );
};

export default AddExpense;
