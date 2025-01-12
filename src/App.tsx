import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, RefreshCw, Settings2 } from 'lucide-react';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

function App() {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Customization options
  const [size, setSize] = useState(400);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState(2);

  const generateQR = useCallback(async (value: string) => {
    if (!value) return;
    
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(value, {
        width: size,
        margin,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [size, darkColor, lightColor, errorLevel, margin]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    generateQR(value);
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      alert('QR Code URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSettingsChange = () => {
    if (text) {
      generateQR(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <QrCode className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">QR Code Generator</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              title="Customize QR Code"
            >
              <Settings2 className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (px)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      handleSettingsChange();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{size}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margin
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={margin}
                    onChange={(e) => {
                      setMargin(Number(e.target.value));
                      handleSettingsChange();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{margin} blocks</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Color
                  </label>
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => {
                      setDarkColor(e.target.value);
                      handleSettingsChange();
                    }}
                    className="h-9 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => {
                      setLightColor(e.target.value);
                      handleSettingsChange();
                    }}
                    className="h-9 w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Error Correction Level
                  </label>
                  <select
                    value={errorLevel}
                    onChange={(e) => {
                      setErrorLevel(e.target.value as ErrorCorrectionLevel);
                      handleSettingsChange();
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Enter text or URL
              </label>
              <textarea
                id="text"
                value={text}
                onChange={handleTextChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
                placeholder="Enter the text or URL you want to convert to a QR code..."
              />
            </div>

            {qrUrl && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {isGenerating ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={qrUrl}
                      alt="Generated QR Code"
                      className="border-4 border-white shadow-lg rounded-lg"
                      style={{ width: Math.min(size, 400), height: Math.min(size, 400) }}
                    />
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;