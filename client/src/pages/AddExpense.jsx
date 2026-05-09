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
      setSupportError("Your browser does not support voice recognition. Please try Chrome, Edge, or Safari.");
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
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Add New Expense</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Track your spending manually or with your voice.</p>
      </div>

      {/* Voice Assistant UI */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-3xl p-8 md:p-10 mb-8 border border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-700 rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-200 mb-3 flex items-center justify-center sm:justify-start gap-2 tracking-tight">
              <Mic className="text-indigo-600 dark:text-indigo-400" size={28} /> Voice Assistant
            </h3>
            <p className="text-indigo-700 dark:text-indigo-300 font-medium text-base max-w-sm leading-relaxed">
              Tap the microphone and say something like <span className="text-indigo-900 dark:text-indigo-100 font-bold bg-white/50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md">"Spent 45 dollars on Food yesterday"</span> to autofill the form!
            </p>
          </div>

          <button
            onClick={startListening}
            title="Click to speak"
            className={`w-24 h-24 rounded-[2rem] flex shrink-0 items-center justify-center transition-all duration-300 shadow-xl border-4 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 scale-110 border-rose-200 ring-8 ring-rose-500/20'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30 hover:scale-105 border-indigo-100 hover:rotate-6'
            }`}
          >
            <Mic size={36} />
          </button>
        </div>

        {supportError && (
          <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm">
            <AlertCircle size={20} className="text-rose-500 shrink-0" /> {supportError}
          </div>
        )}

        {transcript && (
          <div className="mt-8 p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-100 dark:border-indigo-800/40 shadow-md relative overflow-hidden">
            <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/50"></span>
              Speech Recognized:
            </p>
            <p className="text-slate-800 dark:text-slate-100 font-bold italic text-xl tracking-tight">"{transcript}"</p>
            {parsedData && (
              <div className="absolute top-4 right-4 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full shadow-sm">
                <Sparkles size={16} />
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
