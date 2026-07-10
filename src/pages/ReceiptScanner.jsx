import { useState } from 'react';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import {
  Upload, FileText, Image as ImageIcon, Loader2,
  CheckCircle, RefreshCw, Sparkles, AlertCircle, ScanLine, Zap,
} from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import { Link } from 'react-router-dom';

const ReceiptScanner = () => {
  const { isDark } = useTheme();
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState('');
  const [scanning, setScanning] = useState(false);
  const [error,    setError]    = useState('');
  const [ocrData,  setOcrData]  = useState(null);
  const [saved,    setSaved]    = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) pick(f);
  };

  const pick = (f) => {
    // Stores the selected receipt file and shows a local preview.
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOcrData(null);
    setError('');
    setSaved(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    const formData = new FormData();
    formData.append('receiptImage', file);
    try {
      // Sends the image to the backend OCR route for text extraction.
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

  /* ── Saved state ── */
  if (saved) {
    return (
      <div style={{ width: '100%', paddingBottom: '48px' }}>
        <PageHeader />
        <div style={{
          maxWidth: '560px', margin: '48px auto 0',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '28px',
          padding: '56px 40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(13,148,136,0.10)',
        }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'rgba(16,185,129,0.12)',
            border: '2px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <CheckCircle size={48} style={{ color: '#10b981' }} />
          </div>
          <h2 style={{
            margin: '0 0 12px', fontSize: '32px', fontWeight: 900,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>
            Expense Saved!
          </h2>
          <p style={{
            margin: '0 0 36px', fontSize: '15px', fontWeight: 500,
            color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            Your receipt has been successfully digitized and stored in your expenses.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/expenses" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '14px',
              background: 'var(--bg-subtle)', color: 'var(--text-primary)',
              border: '1px solid var(--border-card)', textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              View All Expenses
            </Link>
            <button onClick={resetScanner} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '14px',
              background: 'linear-gradient(135deg, var(--teal-600), var(--teal-500))',
              color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
              transition: 'all 0.2s',
            }}>
              <RefreshCw size={18} /> Scan Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes scan-line {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(600%); opacity: 0; }
        }
        @keyframes rs-spin { to { transform: rotate(360deg); } }
        @keyframes rs-pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes rs-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        .drop-zone { transition: all 0.2s ease; }
        .drop-zone:hover, .drop-zone.dragging {
          border-color: var(--teal-500) !important;
          background: rgba(13,148,136,0.05) !important;
        }
        .scan-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(13,148,136,0.45) !important;
        }
        .scan-btn:active:not(:disabled) { transform: translateY(0); }
        .reset-btn:hover { background: rgba(239,68,68,0.10) !important; color: #ef4444 !important; }
      `}</style>

      <div style={{ width: '100%', paddingBottom: '48px' }}>
        <PageHeader />

        {/* ── Feature chips ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px',
        }}>
          {[
            { icon: <Zap size={13} />,      label: 'AI-Powered OCR'         },
            { icon: <ScanLine size={13} />, label: 'JPG · PNG · PDF'        },
            { icon: <Sparkles size={13} />, label: 'Auto-fills expense form' },
          ].map((c) => (
            <span key={c.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: 'rgba(13,148,136,0.10)',
              border: '1px solid rgba(13,148,136,0.20)',
              color: 'var(--teal-600)',
              fontSize: '12px', fontWeight: 700,
            }}>
              {c.icon} {c.label}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* ── LEFT: Upload panel ── */}
          <div className="cashly-card" style={{ borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Card title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '11px',
                background: 'rgba(13,148,136,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--teal-600)',
              }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>
                  Image Upload
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Drop or select your receipt
                </p>
              </div>
            </div>

            {/* Drop zone / preview */}
            {!preview ? (
              <label
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  flex: 1, minHeight: '320px',
                  border: `2px dashed ${dragging ? 'var(--teal-500)' : 'rgba(13,148,136,0.35)'}`,
                  borderRadius: '18px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: '32px',
                  background: dragging
                    ? 'rgba(13,148,136,0.06)'
                    : isDark ? 'rgba(13,148,136,0.03)' : 'rgba(13,148,136,0.02)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 4px 16px rgba(13,148,136,0.10)',
                  animation: 'rs-float 3s ease-in-out infinite',
                }}>
                  <Upload size={30} style={{ color: 'var(--teal-500)' }} />
                </div>
                <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>
                  Click or drag receipt here
                </p>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 500, color: '#9ca3af' }}>
                  Drop a file anywhere in this box to upload
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px', borderRadius: '999px',
                  background: 'rgba(13,148,136,0.10)',
                  border: '1px solid rgba(13,148,136,0.22)',
                  fontSize: '12px', fontWeight: 700,
                  color: 'var(--teal-600)',
                }}>
                  Supports JPG, PNG, PDF · Max 5MB
                </span>
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileChange} />
              </label>
            ) : (
              <div style={{
                flex: 1, minHeight: '320px', position: 'relative',
                borderRadius: '18px', overflow: 'hidden',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={preview} alt="Receipt Preview"
                  style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
                />
                {/* Scan line animation when scanning */}
                {scanning && (
                  <div style={{
                    position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: '3px',
                      background: 'linear-gradient(90deg, transparent, var(--teal-400), transparent)',
                      boxShadow: '0 0 16px 4px rgba(13,148,136,0.5)',
                      animation: 'scan-line 2s ease-in-out infinite',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(13,148,136,0.06)',
                    }} />
                  </div>
                )}
                {/* Remove button */}
                {!scanning && (
                  <button
                    className="reset-btn"
                    onClick={resetScanner}
                    title="Remove Image"
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontWeight: 700, fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '13px 16px', borderRadius: '14px',
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444', fontSize: '13px', fontWeight: 700,
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            {/* Scan button */}
            {preview && !ocrData && (
              <button
                className="scan-btn"
                onClick={handleScan}
                disabled={scanning}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: '16px', border: 'none',
                  background: scanning
                    ? 'rgba(13,148,136,0.5)'
                    : 'linear-gradient(135deg, var(--teal-600), var(--teal-500))',
                  color: '#fff', fontWeight: 800, fontSize: '15px',
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: scanning ? 'none' : '0 6px 20px rgba(13,148,136,0.35)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {scanning ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'rs-spin 0.7s linear infinite' }} />
                    Analyzing Receipt with AI…
                  </>
                ) : (
                  <>
                    <ScanLine size={20} /> Scan Receipt via OCR
                  </>
                )}
              </button>
            )}
          </div>

          {/* ── RIGHT: Results panel ── */}
          <div>

            {/* Idle */}
            {!ocrData && !scanning && (
              <div className="cashly-card" style={{
                borderRadius: '24px', padding: '28px',
                minHeight: '420px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
              }}>
                {/* Animated icon */}
                <div style={{
                  width: '100px', height: '100px', borderRadius: '28px',
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(13,148,136,0.05))',
                  border: '1px solid rgba(13,148,136,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                  animation: 'rs-float 3s ease-in-out infinite',
                }}>
                  <Sparkles size={44} style={{ color: 'var(--teal-500)' }} />
                </div>
                <h3 style={{
                  margin: '0 0 10px', fontSize: '24px', fontWeight: 900,
                  color: 'var(--text-primary)', letterSpacing: '-0.01em',
                }}>
                  Awaiting Receipt
                </h3>
                <p style={{
                  margin: '0 0 28px', fontSize: '14px', fontWeight: 500,
                  color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px',
                }}>
                  Upload an image and click scan. Our AI will automatically extract the merchant, total amount, and date.
                </p>

                {/* Step hints */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                  {[
                    { n: '1', text: 'Upload your receipt image' },
                    { n: '2', text: 'Click "Scan Receipt via OCR"' },
                    { n: '3', text: 'Review & save the expense' },
                  ].map((s) => (
                    <div key={s.n} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-card)',
                    }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                        background: 'var(--teal-500)',
                        color: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 900,
                      }}>
                        {s.n}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {s.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scanning */}
            {scanning && (
              <div className="cashly-card" style={{
                borderRadius: '24px', padding: '28px',
                minHeight: '420px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
              }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '28px' }}>
                  {/* Outer ring */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    border: '3px solid var(--border-card)',
                    borderRadius: '50%',
                  }} />
                  {/* Spinning ring */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    border: '3px solid transparent',
                    borderTopColor: 'var(--teal-500)',
                    borderRadius: '50%',
                    animation: 'rs-spin 0.9s linear infinite',
                  }} />
                  {/* Center icon */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ScanLine size={36} style={{ color: 'var(--teal-500)', animation: 'rs-pulse 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
                <h3 style={{
                  margin: '0 0 10px', fontSize: '24px', fontWeight: 900,
                  color: 'var(--text-primary)', letterSpacing: '-0.01em',
                }}>
                  Processing with AI…
                </h3>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: 500,
                  color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '260px',
                }}>
                  Running optical character recognition. This usually takes 2–5 seconds.
                </p>

                {/* Progress dots */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: 'var(--teal-500)',
                      animation: `rs-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* OCR Results */}
            {ocrData && (
              <div className="cashly-card" style={{
                borderRadius: '24px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Teal header */}
                <div style={{
                  background: 'linear-gradient(135deg, #065f46, #0d9488)',
                  padding: '22px 28px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
                  }} />
                  <h3 style={{
                    margin: '0 0 4px', fontSize: '18px', fontWeight: 900,
                    color: '#ffffff', letterSpacing: '-0.01em',
                    display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1,
                  }}>
                    <CheckCircle size={22} style={{ color: '#a7f3d0' }} />
                    Verification Needed
                  </h3>
                  <p style={{
                    margin: 0, fontSize: '13px', fontWeight: 500,
                    color: 'rgba(255,255,255,0.75)', position: 'relative', zIndex: 1,
                  }}>
                    Review the extracted details, select a category, and save.
                  </p>
                </div>

                {/* Form */}
                <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
                  {/* OCR fills the form, but the user confirms before saving. */}
                  <ExpenseForm
                    initialData={{ ...ocrData.suggestedExpense, _id: null }}
                    onSuccess={() => setSaved(true)}
                  />

                  {/* Raw text accordion */}
                  <div style={{
                    marginTop: '20px', padding: '16px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-card)',
                  }}>
                    <h4 style={{
                      margin: '0 0 12px', fontSize: '11px', fontWeight: 800,
                      color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <FileText size={14} /> Raw Extracted Text
                    </h4>
                    <div style={{
                      padding: '14px', borderRadius: '10px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      fontSize: '11px', fontFamily: 'monospace',
                      color: 'var(--text-muted)',
                      maxHeight: '140px', overflowY: 'auto',
                      whiteSpace: 'pre-wrap', lineHeight: 1.6,
                    }}>
                      {ocrData.extractedText || 'No readable text found.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PageHeader = () => (
  <div style={{ marginBottom: '24px' }}>
    <h1 style={{
      fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em',
      color: 'var(--text-primary)', margin: 0,
    }}>
      Receipt Scanner
    </h1>
    <p style={{ marginTop: '6px', fontWeight: 500, fontSize: '15px', color: '#9ca3af' }}>
      Use AI to automatically extract expense details from your receipts.
    </p>
  </div>
);

export default ReceiptScanner;
