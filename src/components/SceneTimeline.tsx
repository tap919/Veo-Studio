import { Film, RefreshCw, Camera, Video, MonitorPlay, AlertTriangle, Eye } from "lucide-react";
import { Scene } from "../types";
import { useState } from "react";

interface SceneTimelineProps {
  scenes: Scene[];
  activeSceneId: string;
  onUpdateScene: (updatedScene: Scene) => void;
  onSelectScene: (id: string, time: number) => void;
  onGenerateKeyframe: (sceneId: string, prompt: string) => Promise<void>;
  onTriggerRealVeoGen: (sceneId: string, prompt: string) => Promise<void>;
}

export function SceneTimeline({
  scenes,
  activeSceneId,
  onUpdateScene,
  onSelectScene,
  onGenerateKeyframe,
  onTriggerRealVeoGen,
}: SceneTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrompt, setTempPrompt] = useState("");
  const [tempCamera, setTempCamera] = useState("");
  const [tempStyle, setTempStyle] = useState("");

  const handleEditStart = (scene: Scene) => {
    setEditingId(scene.id);
    setTempPrompt(scene.veoPrompt);
    setTempCamera(scene.camera);
    setTempStyle(scene.style);
  };

  const handleSave = (id: string) => {
    const original = scenes.find((s) => s.id === id);
    if (original) {
      onUpdateScene({
        ...original,
        veoPrompt: tempPrompt,
        camera: tempCamera,
        style: tempStyle,
      });
    }
    setEditingId(null);
  };

  const cameraOptions = [
    "Orbiting Slow Pan",
    "Tracking Head-On",
    "Drone Pullback",
    "Macro Pan Detail",
    "Crane Tilting Shot",
    "Handheld Shakeycam",
    "Quick Dolly Zoom"
  ];

  const styleOptions = [
    "Luxury Cinematic",
    "90s Cyber MTV",
    "Aerial Golden Hour",
    "Warm Slow-Motion",
    "Vintage VHS Glitch",
    "Cyberpunk Neon Rain",
    "Noir High-Contrast"
  ];

  return (
    <div id="scene-timeline-card" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Film className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Veo Video Prompt Pipeline</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Generative Storyboard Timeline</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          Total Duration: 35s | 4 Keyframe Blocks
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {scenes.map((scene) => {
          const isActive = scene.id === activeSceneId;
          const isEditing = scene.id === editingId;

          return (
            <div
              key={scene.id}
              className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                isActive
                  ? "bg-purple-600/15 border-purple-500/55 shadow-[0_0_25px_rgba(168,85,247,0.2)] scale-[1.01]"
                  : "bg-zinc-950/50 border-white/5 hover:border-zinc-800"
              }`}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <h4 className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest leading-tight">
                    {scene.title}
                  </h4>
                  <p className="text-[10px] text-purple-403 text-purple-400 font-bold mt-0.5">
                    T {scene.timeStart}s - {scene.timeEnd}s
                  </p>
                </div>
                <button
                  onClick={() => onSelectScene(scene.id, scene.timeStart)}
                  className={`text-[10px] font-mono font-bold flex items-center gap-1 py-1 px-2.5 rounded-md transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/35"
                      : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/5"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>PREVIEW</span>
                </button>
              </div>

              {/* Central image keyframe indicator */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-zinc-950 flex items-center justify-center mb-3">
                {scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-zinc-600">
                    <Camera className="w-6 h-6 stroke-[1.5] mb-1 opacity-70" />
                    <span className="text-[10px] font-mono">No Image Framed</span>
                  </div>
                )}

                {/* Status indicators */}
                {scene.isGenerating && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                    <span className="text-[8px] font-mono tracking-widest text-purple-350 text-purple-300 animate-pulse uppercase">
                      synthesizing ...
                    </span>
                  </div>
                )}

                <div className="absolute bottom-1 right-1 flex gap-1">
                  <span className="text-[8px] font-mono bg-zinc-900/95 text-zinc-400 py-0.5 px-1.5 rounded-md border border-white/5">
                    {scene.camera}
                  </span>
                  <span className="text-[8px] font-mono bg-pink-500/10 text-pink-300 py-0.5 px-1.5 rounded-md border border-pink-500/20">
                    {scene.style}
                  </span>
                </div>
              </div>

              {/* Custom interactive text details / editing panel */}
              {isEditing ? (
                <div className="space-y-3 bg-zinc-950/95 p-2.5 rounded-lg border border-white/5 mb-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                      Veo Prompt Prompt
                    </label>
                    <textarea
                      value={tempPrompt}
                      onChange={(e) => setTempPrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-900 border border-white/5 rounded px-2 py-1 text-[10px] font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase mb-0.5">
                        Camera Move
                      </label>
                      <select
                        value={tempCamera}
                        onChange={(e) => setTempCamera(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded text-[9px] font-mono text-zinc-350 text-zinc-300 p-1 cursor-pointer focus:outline-none focus:border-purple-500"
                      >
                        {cameraOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase mb-0.5">
                        Lut Mood
                      </label>
                      <select
                        value={tempStyle}
                        onChange={(e) => setTempStyle(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded text-[9px] font-mono text-zinc-300 p-1 cursor-pointer focus:outline-none focus:border-purple-500"
                      >
                        {styleOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 border-t border-zinc-900 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(scene.id)}
                      className="text-[9px] font-mono px-2.5 py-1 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:scale-[1.01]"
                    >
                      Deploy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-3 text-[10px] text-zinc-400 font-mono flex-1 flex flex-col justify-between">
                  <div>
                    <p className="line-clamp-3 mb-2 italic">"{scene.veoPrompt}"</p>
                  </div>
                  <button
                    onClick={() => handleEditStart(scene)}
                    className="self-start text-[9px] hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-500 font-bold"
                  >
                    Edit Script & Camera Direction
                  </button>
                </div>
              )}

              {/* Operational Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                <button
                  onClick={() => onGenerateKeyframe(scene.id, scene.veoPrompt)}
                  disabled={scene.isGenerating}
                  className="bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono text-zinc-350 text-zinc-300 hover:text-purple-400 py-1.5 rounded-lg border border-white/5 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                  title="Generate a stylized high-resolution frame of this scene in this environment"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>STORYBOARD</span>
                </button>

                <button
                  onClick={() => onTriggerRealVeoGen(scene.id, scene.veoPrompt)}
                  disabled={scene.isGenerating}
                  className="bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 text-[10px] font-mono text-pink-300 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:pointer-events-none font-medium"
                  title="Generate real Veo generative video clips"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>VEO CLIPS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
