import { StudioSettings } from "../types";
import { X, Sliders, Volume2, Monitor, RefreshCw, Palette, HelpCircle, Check, Sparkles } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onUpdateSettings: (s: StudioSettings) => void;
}

const QUALITY_OPTIONS = ["Ultra (4K)", "Standard (1080p)", "Draft (480p)"] as const;
const SEED_OPTIONS = ["Constant", "Randomized"] as const;
const THEMES = [
  { name: "Space Violet", value: "Space Violet", color: "bg-purple-600" },
  { name: "Cyberpunk Gold", value: "Cyberpunk Gold", color: "bg-amber-500" },
  { name: "Matrix Emerald", value: "Matrix Emerald", color: "bg-emerald-500" },
  { name: "Crimson Velvet", value: "Crimson Velvet", color: "bg-rose-600" }
] as const;

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }: SettingsModalProps) {
  if (!isOpen) return null;

  const updateField = <K extends keyof StudioSettings>(key: K, val: StudioSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: val
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        id="settings-modal"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl transition-all"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-zinc-100 uppercase">Studio Preferences</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Render & Audio Hardware Engine Settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configurations list */}
        <div className="space-y-4 font-sans text-xs">
          
          {/* Theme selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>UI Accent Theme Preset</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateField("themePreset", t.value)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left font-mono tracking-wide transition-all ${
                    settings.themePreset === t.value
                      ? "bg-purple-950/25 border-purple-500 text-purple-200"
                      : "bg-zinc-950/50 border-white/5 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                  <span className="text-[10px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Canvas Quality */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                <span>Veo Visualizer Quality</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 font-bold">{settings.visualQuality}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-white/5">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => updateField("visualQuality", q)}
                  className={`text-center py-2 px-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all ${
                    settings.visualQuality === q
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {q.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Seed Type */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Diffusion Generative Seed</span>
              </div>
              <span className="text-[10px] font-mono text-purple-404 text-purple-400 font-bold">{settings.seedType}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-white/5">
              {SEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateField("seedType", s)}
                  className={`text-center py-2 px-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all ${
                    settings.seedType === s
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sound hardware routing toggle styles */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono uppercase tracking-wider text-[9px] font-bold border-b border-white/5 pb-1">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Web Audio DSP routing</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[11px] font-mono font-medium text-zinc-300">Continuous Loop mode</span>
                <span className="block text-[9px] text-zinc-500">Auto-repeat tracks continuously</span>
              </div>
              <button
                type="button"
                onClick={() => updateField("loopActive", !settings.loopActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  settings.loopActive ? 'bg-purple-600' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                    settings.loopActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[11px] font-mono font-medium text-zinc-300">Impulse Reverb Filter</span>
                <span className="block text-[9px] text-zinc-500">Inject high depth space echoes</span>
              </div>
              <button
                type="button"
                onClick={() => updateField("reverbActive", !settings.reverbActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  settings.reverbActive ? 'bg-purple-600' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                    settings.reverbActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5 flex gap-2 text-[10px] text-zinc-500 leading-relaxed font-mono">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>Theme Preset updates our UI's glow accents colorway seamlessly across all visual panels.</span>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white text-zinc-950 hover:bg-zinc-100 font-mono font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-black/40 transition-all active:scale-[0.98]"
            >
              Apply Studio Tuning
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
