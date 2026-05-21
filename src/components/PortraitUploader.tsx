import { Upload, Sparkles, Image as ImageIcon, Sliders, AlertCircle, RefreshCw } from "lucide-react";
import React, { useState, useRef } from "react";

interface PortraitUploaderProps {
  onAnalyze: (imageData: string, theme: string) => Promise<void>;
  isAnalyzing: boolean;
  defaultRapperPath: string;
}

export function PortraitUploader({ onAnalyze, isAnalyzing, defaultRapperPath }: PortraitUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string>(defaultRapperPath);
  const [themeInput, setThemeInput] = useState("CEO Tuxedo Grind");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleThemes = [
    "CEO Tuxedo Grind",
    "Late Night Drive",
    "Underground Legacy",
    "Stardom & Red Carpets"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerAnalysis = () => {
    onAnalyze(selectedImage, themeInput);
  };

  return (
    <div id="portrait-uploader-card" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Hip-Hop Character Cast</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Portrait & Creative Song Settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        {/* Left column: Drag and Drop Portrait */}
        <div className="flex flex-col gap-3">
          <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
            Character Portrait
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerUploadClick}
            className={`cursor-pointer group aspect-square rounded-2xl border flex flex-col items-center justify-center text-center p-4 transition-all overflow-hidden relative ${
              dragActive
                ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : "border-white/5 bg-zinc-950/40 hover:border-purple-500/40 hover:bg-zinc-900/30"
            }`}
          >
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Selected dapper rapper"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/80 py-2 text-center text-[10px] text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  Drag / Click to Swap Image
                </div>
              </>
            ) : (
              <div className="space-y-2 p-2 text-zinc-500">
                <Upload className="w-8 h-8 mx-auto stroke-[1.5] text-zinc-650 group-hover:text-purple-400 transition-colors" />
                <div>
                  <p className="text-xs font-bold text-zinc-300">Drag your portrait here</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Accepts raw JPG, PNG, and camera shots</p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Quick presets list */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/50 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400">Pre-cast default matching model</span>
            </div>
            <button
              onClick={() => setSelectedImage(defaultRapperPath)}
              className="text-[10px] font-mono hover:text-purple-400 font-bold text-zinc-300 uppercase transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right column: Subject matter / lyrics configuration */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-2">
                Song Theme & Topic
              </label>
              <input
                type="text"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                placeholder="e.g. Billionaire Dream, Studio Hustle..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-205 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-2">
                Sample Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleThemes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setThemeInput(theme)}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-mono border transition-all ${
                      themeInput === theme
                        ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        : "bg-zinc-950/40 text-zinc-400 border-white/5 hover:border-zinc-800"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main call to action button */}
          <button
            onClick={handleTriggerAnalysis}
            disabled={isAnalyzing}
            className={`w-full py-4 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isAnalyzing
                ? "bg-purple-900/20 border border-purple-500/25 text-purple-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.01] hover:from-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(147,51,234,0.3)]"
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Song Timeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white fill-current" />
                <span>Compile Custom Rap Video</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
