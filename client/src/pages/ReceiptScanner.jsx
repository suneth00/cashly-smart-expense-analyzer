import React, { useState } from 'react';
import axios from '../api/axios';
import { Upload, FileText, Image as ImageIcon, Loader2, CheckCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import { Link } from 'react-router-dom';

const ReceiptScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [ocrData, setOcrData] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setOcrData(null);
      setError('');
      setSaved(false);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    const formData = new FormData();
    formData.append('receiptImage', file);
    try {
      const res = await axios.post('/ocr/receipt', formData);
      setOcrData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan receipt. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreview('');
    setOcrData(null);
    setSaved(false);
    setError('');
  };

  return (
    <div className="w-full pb-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Receipt Scanner</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
          Use AI to automatically extract expense details from your receipts.
        </p>
      </div>

      {/* ── Saved Success State ── */}
      {saved ? (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center max-w-2xl mx-auto mt-12">
          <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100 dark:border-emerald-800/50 relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 dark:opacity-10"></div>
            <CheckCircle size={56} className="relative z-10" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Expense Saved!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-semibold text-lg leading-relaxed">
            Your receipt has been successfully digitized and safely stored in your expenses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/expenses"
              className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all"
            >
              View All Expenses
            </Link>
            <button
              onClick={resetScanner}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <RefreshCw size={22} /> Scan Another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Upload Section ── */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-700/50 h-full flex flex-col group">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner border border-indigo-100/50 dark:border-indigo-800/30">
                  <ImageIcon size={24} />
                </div>
                Image Upload
              </h3>

              {/* Drop zone */}
              {!preview ? (
                <label className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all duration-300 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer group/upload min-h-[350px]">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-slate-700 group-hover/upload:border-indigo-200 dark:group-hover/upload:border-indigo-700 group-hover/upload:scale-110 group-hover/upload:-rotate-6 transition-transform duration-300">
                    <Upload size={36} className="text-slate-400 dark:text-slate-500 group-hover/upload:text-indigo-600 dark:group-hover/upload:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-black mb-2 text-xl tracking-tight">Click or drag receipt here</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold bg-slate-200/50 dark:bg-slate-700/50 px-4 py-1.5 rounded-full mt-2">
                    Supports JPG, PNG, PDF (Max 5MB)
                  </p>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                </label>
              ) : (
                /* Image preview */
                <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center min-h-[350px] group/preview shadow-inner">
                  <img src={preview} alt="Receipt Preview" className="max-h-[450px] object-contain w-full" />
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
                  <button
                    onClick={resetScanner}
                    className="absolute top-4 right-4 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-colors z-10 font-bold border border-slate-200 dark:border-slate-700"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-100 dark:border-rose-800/50 flex items-center gap-3 shadow-sm">
                  <AlertCircle size={20} className="shrink-0 text-rose-500" /> {error}
                </div>
              )}

              {/* Scan button */}
              {preview && !ocrData && (
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
                >
                  {scanning ? (
                    <><Loader2 size={24} className="animate-spin" /> Analyzing Receipt with AI...</>
                  ) : (
                    <><FileText size={24} /> Scan Receipt via OCR</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── Results Section ── */}
          <div className="space-y-6">

            {/* Idle state */}
            {!ocrData && !scanning && (
              <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-700/50 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-indigo-100/50 dark:border-indigo-800/30">
                  <Sparkles size={48} className="text-indigo-400 dark:text-indigo-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Awaiting Receipt</h3>
                <p className="text-slate-500 dark:text-slate-400 font-semibold max-w-sm leading-relaxed text-lg">
                  Upload an image and click scan. Our AI will automatically extract the merchant, total amount, and date.
                </p>
              </div>
            )}

            {/* Scanning / loading state */}
            {scanning && (
              <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-700/50 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="relative w-32 h-32 mb-10">
                  <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <FileText size={48} className="absolute inset-0 m-auto text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Processing AI...</h3>
                <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-sm text-lg">
                  Running optical character recognition. This usually takes 2–5 seconds depending on the image size.
                </p>
              </div>
            )}

            {/* OCR results + form */}
            {ocrData && (
              <div className="bg-white dark:bg-slate-800/60 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col h-full">
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 border-b border-indigo-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-3 relative z-10 tracking-tight">
                    <CheckCircle size={28} className="text-indigo-200" /> Verification Needed
                  </h3>
                  <p className="text-indigo-100 mt-2 font-medium leading-relaxed relative z-10">
                    We've extracted the details below. Please verify, select a category, and save.
                  </p>
                </div>

                {/* Form + raw text */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <ExpenseForm
                    initialData={{ ...ocrData.suggestedExpense, _id: null }}
                    onSuccess={() => setSaved(true)}
                  />

                  <div className="mt-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/50 shadow-inner">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FileText size={16} /> Raw Extracted Text
                    </h4>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-mono h-40 overflow-y-auto whitespace-pre-wrap shadow-sm leading-relaxed">
                      {ocrData.extractedText || 'No readable text found.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
