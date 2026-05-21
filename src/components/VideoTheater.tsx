import { Maximize2, Sparkles, Sliders, Music, Zap, Video, CheckCircle, Flame } from "lucide-react";
import { Scene, LyricLine } from "../types";
import React, { useEffect, useRef, useState } from "react";

interface VideoTheaterProps {
  activeScene: Scene | undefined;
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  characterImage: string;
  activeVideoUrl?: string | null;
  renderingStatus?: {
    sceneId: string | null;
    progress: number;
    prompt: string;
    isRendering: boolean;
    style: "keyframe" | "video" | null;
  };
  uploadedAudio?: { fileUrl: string; name: string; bpm: number; duration: number; base64?: string } | null;
  isCompiling?: boolean;
  compilingProgress?: number;
  compilingLog?: string;
  onCompileVideo?: () => void;
  onClearCompiledVideo?: () => void;
  themePreset?: string;
}

export function VideoTheater({
  activeScene,
  lyrics,
  currentTime,
  isPlaying,
  onTimeChange,
  characterImage,
  activeVideoUrl,
  renderingStatus,
  uploadedAudio,
  isCompiling = false,
  compilingProgress = 0,
  compilingLog = "",
  onCompileVideo,
  onClearCompiledVideo,
  themePreset = "Space Violet",
}: VideoTheaterProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pulseKick, setPulseKick] = useState(false);
  const [mouthTick, setMouthTick] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Performer Live Calibration & Performance Rig States
  const [cinematicMode, setCinematicMode] = useState(true);
  const [characterZoom, setCharacterZoom] = useState(125);
  const [characterY, setCharacterY] = useState(15);
  const [mouthAlignX, setMouthAlignX] = useState(48);
  const [mouthAlignY, setMouthAlignY] = useState(54);
  const [mouthW, setMouthW] = useState(16);
  const [mouthH, setMouthH] = useState(11);
  const [nodIntensity, setNodIntensity] = useState(120);
  const [showTuningOverlay, setShowTuningOverlay] = useState(false);

  // Sync rapid mouth syllable speech tick
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setMouthTick((prev) => (prev + 1) % 4);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setMouthTick(0);
    }
  }, [isPlaying]);

  // Sync human eye blinking tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 2800 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync video playback state based on active master playhead isPlaying
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((e) => console.log("Video playback sync issue:", e));
    } else {
      video.pause();
    }
  }, [isPlaying, activeVideoUrl]);

  // Sync video timeline seek times
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 1.2) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Hook up beat-reactive visual strobe kicks
  useEffect(() => {
    if (isPlaying) {
      // Create a rapid pulsing loop tied roughly to HipHop BPM
      const interval = setInterval(() => {
        setPulseKick(true);
        setTimeout(() => setPulseKick(false), 80);
      }, 640); // fits ~94 BPM
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = Math.max(0, Math.min(35, Math.floor(percentage * 35)));
    onTimeChange(seekTime);
  };

  // Find active lyric bar
  let activeLyric = "";
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeLyric = lyrics[i].text;
    }
  }

  // Map scene styles to CSS filters
  const getFilterStyle = (styleName: string | undefined): string => {
    switch (styleName) {
      case "90s Cyber MTV":
        return "hue-rotate-15 brightness-110 contrast-125 saturate-150 shadow-[inset_0_0_80px_rgba(139,92,246,0.35)]";
      case "Aerial Golden Hour":
        return "sepia-25 saturate-125 brightness-105 contrast-100 hue-rotate--10 shadow-[inset_0_0_80px_rgba(245,158,11,0.25)]";
      case "Warm Slow-Motion":
        return "contrast-115 sepia-30 brightness-95 saturate-110 shadow-[inset_0_0_100px_rgba(180,83,9,0.4)]";
      case "Vintage VHS Glitch":
        return "hue-rotate-30 saturate-140 contrast-130 brightness-115 blur-[0.4px]";
      case "Cyberpunk Neon Rain":
        return "hue-rotate-60 saturate-180 contrast-120 brightness-105 shadow-[inset_0_0_90px_rgba(236,72,153,0.35)]";
      case "Noir High-Contrast":
        return "grayscale-90 contrast-150 brightness-90";
      default: // Luxury Cinematic
        return "brightness-105 contrast-110 saturate-105";
    }
  };

  // Map camera movements to CSS transition transforms
  const getCameraAnimationClass = (cameraName: string | undefined): string => {
    if (!isPlaying) return "scale-[1.02] translate-y-0 translate-x-0 rotate-0";
    switch (cameraName) {
      case "Orbiting Slow Pan":
        return "animate-[orbit_12s_infinite_linear] scale-105";
      case "Tracking Head-On":
        return "animate-[tracking_10s_infinite_ease-in-out] scale-110";
      case "Drone Pullback":
        return "animate-[pullback_14s_infinite_ease-out] scale-100";
      case "Macro Pan Detail":
        return "animate-[macropan_8s_infinite_alternate_ease-in-out] scale-[1.35]";
      case "Crane Tilting Shot":
        return "animate-[crane_12s_infinite_alternate_ease-out] scale-108";
      case "Handheld Shakeycam":
        return "animate-[shake_0.5s_infinite] scale-[1.04]";
      case "Quick Dolly Zoom":
        return "animate-[dolly_6s_infinite] scale-115";
      default:
        return "scale-100";
    }
  };

  const activeImage = activeScene?.imageUrl || characterImage;

  return (
    <div id="video-theater-card" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full">
      
      {/* Top Deck Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Video className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 font-sans tracking-tight">Veo Live Visualizer</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Real-Time Camera & LUT Compositor</p>
          </div>
        </div>

        {/* Audio Intake Status Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {activeVideoUrl ? (
            <button
              onClick={onClearCompiledVideo}
              className="px-2.5 py-1 text-rose-400 hover:text-rose-300 font-mono text-[10px] uppercase border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 rounded-lg tracking-wider font-bold transition-all"
              title="Clear compiled session feed to view individual storyboard blocks"
            >
              Reset to Storyboards
            </button>
          ) : (
            <button
              onClick={onCompileVideo}
              disabled={isCompiling}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-[10px] font-mono font-bold rounded-lg border border-purple-500/25 shadow-md active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
              title="Stitch and compile all 4 storyboard keyframes into a continuous 35s video timeline with active music transitions"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>COMPILE FULL VIDEO</span>
            </button>
          )}

          {uploadedAudio ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] text-[10px] font-mono font-bold rounded-lg animate-pulse">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
              <Music className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>ACTIVE AUDIO: INGESTED ({uploadedAudio.name})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/5 border border-amber-500/15 text-amber-400 text-[10px] font-mono">
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span>SOUND SOURCE: LOCAL SYNTH BEATS</span>
            </div>
          )}

          {activeScene && (
            <span className="text-[10px] font-mono bg-zinc-950 border border-white/5 text-purple-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
              CAM: {activeScene.camera}
            </span>
          )}
        </div>
      </div>

      {/* Primary Video Screen */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/5 flex flex-col justify-between group shadow-inner">
        
        {/* Full Timeline Compilation progress HUD overlay */}
        {isCompiling && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40 animate-fade-in text-center">
            <div className="max-w-md w-full space-y-4">
              
              <div className="flex justify-center flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-full animate-ping duration-[1200ms]" />
                  <div className="w-16 h-16 bg-zinc-950 rounded-full border border-pink-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.4)]">
                    <Flame className="w-7 h-7 text-pink-400 animate-pulse" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-pink-500 uppercase font-black block">
                  SYSTEM TIME-COMPILER
                </span>
                <h4 className="text-sm font-bold text-white mt-1 leading-tight font-sans">
                  {compilingProgress === 100 
                    ? "🎉 SUCCESS: 35S MASTER RAP VIDEO COMPILED" 
                    : "STITCHING TIMELINE SCENES & AUDIO CORE..."}
                </h4>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Target: Web Audio & WebGL Composer</span>
                  <span className="text-pink-400 font-bold">{compilingProgress}%</span>
                </div>
                
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full transition-all duration-200 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                    style={{ width: `${compilingProgress}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-950/90 rounded-xl border border-pink-500/20 text-[10px] text-pink-300 font-mono text-left leading-relaxed">
                <span className="text-zinc-500 block uppercase font-bold text-[8px] not-italic mb-1">CURRENT PIPELINE PROCESS:</span>
                <span className="text-zinc-300 font-semibold">&gt; </span>{compilingLog}
              </div>

              {compilingProgress === 100 && (
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider animate-bounce mt-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Success: Full Rap Video Deployed!</span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Generative Rendering Progress HUD Overlay */}
        {renderingStatus?.isRendering && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-fade-in text-center">
            <div className="max-w-md w-full space-y-4">
              
              {/* Spinning / Pulsing icon based on style */}
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full animate-ping duration-1000" />
                  <div className="w-14 h-14 bg-zinc-950 rounded-full border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    {renderingStatus.style === "keyframe" ? (
                      <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    ) : (
                      <Video className="w-6 h-6 text-pink-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Title Header */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold block">
                  {renderingStatus.style === "keyframe" ? "Storyboarding Pipeline Active" : "Veo Generative Render Core"}
                </span>
                
                <h4 className="text-sm font-bold text-white mt-1 leading-tight font-sans">
                  {renderingStatus.progress === 100 
                    ? "✨ DEPLOYING CINEMATIC FRAMES..." 
                    : `RENDERING: ${renderingStatus.style === "keyframe" ? "HD Still Keyframe" : "Veo Slo-Mo Video Loop"}`}
                </h4>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Engine: Google Veo Alpha 2</span>
                  <span className="text-purple-400 font-bold">{renderingStatus.progress}%</span>
                </div>
                
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-550 from-purple-500 via-pink-500 to-[#00E5FF] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                    style={{ width: `${renderingStatus.progress}%` }}
                  />
                </div>
              </div>

              {/* Active Prompt Details */}
              <div className="p-3 bg-zinc-950/85 rounded-xl border border-white/5 text-[10px] text-zinc-400 font-mono italic leading-relaxed text-left">
                <span className="text-zinc-500 block uppercase font-bold text-[9px] mb-1 not-italic">RENDER PROMPT TARGET:</span>
                "{renderingStatus.prompt}"
              </div>

              {/* Complete success pop when progress equals 100 */}
              {renderingStatus.progress === 100 && (
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider animate-bounce mt-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Success: Cinematic Frame Loaded!</span>
                </div>
              )}

            </div>
          </div>
        )}
               {/* Toggle Button to calibrate artist alignment overlay */}
        <button
          onClick={() => setShowTuningOverlay(!showTuningOverlay)}
          className="absolute top-12 right-4 z-40 p-2 bg-black/85 hover:bg-black/95 text-zinc-300 hover:text-white rounded-xl border border-white/10 shadow-lg text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>{showTuningOverlay ? "Hide Control Deck" : "🔧 Tuning Deck"}</span>
        </button>

        {/* Floating Calibration Controls panel */}
        {showTuningOverlay && (
          <div className="absolute left-4 top-12 bottom-12 w-64 bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-xl p-3 z-30 flex flex-col gap-2.5 text-left overflow-y-auto max-h-[85%] shadow-2xl">
            <div className="border-b border-white/10 pb-1.5 flex justify-between items-center">
              <div>
                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest font-black block leading-none">VE SYSTEM TUNER</span>
                <h5 className="text-[10px] font-bold text-white uppercase font-sans mt-0.5">Performance Rig</h5>
              </div>
              <span className="text-[8px] font-mono bg-purple-550/20 bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">CALIBRATOR</span>
            </div>

            {/* Display Mode Toggle */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-zinc-400 uppercase">Aesthetic Framing:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setCinematicMode(true)}
                  className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded border transition-all ${cinematicMode ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  📺 widescreen
                </button>
                <button
                  onClick={() => setCinematicMode(false)}
                  className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded border transition-all ${!cinematicMode ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  🎴 platinum card
                </button>
              </div>
            </div>

            {/* Scale Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-zinc-400">Artist Zoom Scale:</span>
                <span className="text-purple-400 font-bold">{characterZoom}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="250"
                value={characterZoom}
                onChange={(e) => setCharacterZoom(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Y Offset Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-zinc-400">Position offset Y:</span>
                <span className="text-purple-400 font-bold">{characterY}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={characterY}
                onChange={(e) => setCharacterY(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* X Align Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-zinc-400 font-medium">Mouth Center X:</span>
                <span className="text-[#00E5FF] font-bold">{mouthAlignX}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={mouthAlignX}
                onChange={(e) => setMouthAlignX(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Y Align Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-zinc-400 font-medium">Mouth Center Y:</span>
                <span className="text-[#00E5FF] font-bold">{mouthAlignY}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={mouthAlignY}
                onChange={(e) => setMouthAlignY(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Warp Scale (W/H) */}
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-zinc-400">Warp Width:</span>
                  <span className="text-pink-400 font-bold">{mouthW}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={mouthW}
                  onChange={(e) => setMouthW(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-zinc-400">Warp Height:</span>
                  <span className="text-pink-400 font-bold">{mouthH}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={mouthH}
                  onChange={(e) => setMouthH(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Bob Intensity */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-zinc-400">Nod Bob Intensity:</span>
                <span className="text-purple-400 font-bold">{nodIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={nodIntensity}
                onChange={(e) => setNodIntensity(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <p className="text-[7.5px] font-mono text-zinc-500 leading-normal border-t border-white/5 pt-1.5 mt-1.5">
              Alignment Help: Drags crosshair directly over your uploaded character’s lips, then click spacebar or play to witness organic lyric singing!
            </p>
          </div>
        )}

        {/* Hidden SVG Filter Core for fluid face mesh talking deformation */}
        <svg className="absolute w-0 h-0" width="0" height="0">
          <defs>
            <filter id="rap-vocal-warp">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.03 0.15" 
                numOctaves="2" 
                result="warpNoise" 
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="warpNoise" 
                scale={isPlaying && activeLyric ? (14 + (mouthTick * 5) + (pulseKick ? 8 : 0)) : 0} 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
          </defs>
        </svg>

        {/* Cinematic Image or Video Frame with active 3D movement and color-LUT filters */}
        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
          {/* Main Ambient Backdrop Layer - uses the uploaded photo blurred & highly atmospheric */}
          <div className="absolute inset-0 opacity-40 transition-all duration-700 bg-zinc-950 pointer-events-none scale-110">
            <img
              src={characterImage}
              alt="Veo ambient backdrop"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover filter blur-xl saturate-[1.6] contrast-[1.1] transition-all duration-1000 ${isPlaying ? 'animate-[pulse-scale_4s_infinite_ease-in-out]' : ''}`}
            />
          </div>

          {/* Theme-based animated particle environment streams */}
          {themePreset === "Space Violet" && (
            <div className="absolute inset-0 pointer-events-none opacity-65 mix-blend-screen z-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
              <div className="absolute w-2 h-2 rounded-full bg-purple-400/30 top-1/4 left-1/3 animate-ping duration-[4s]" />
              <div className="absolute w-3 h-3 rounded-full bg-pink-500/20 top-2/3 left-2/3 animate-ping duration-[6s]" />
            </div>
          )}

          {themePreset === "Cyberpunk Gold" && (
            <div className="absolute inset-0 pointer-events-none opacity-45 mix-blend-color-dodge z-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/10 via-orange-500/5 to-transparent" />
              <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full top-[15%] left-[20%] animate-ping" />
              <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-[80%] left-[75%] animate-ping" />
            </div>
          )}

          {themePreset === "Matrix Emerald" && (
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(rgba(16,185,129,0)_50%,_rgba(0,0,0,0.85)_50%)] bg-[length:100%_8px] animate-[matrix-scroll_3s_infinite_linear] z-0" />
          )}

          {themePreset === "Crimson Velvet" && (
            <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay z-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.2)_0%,transparent_80%)]" />
              <div className="absolute w-full h-[2px] bg-rose-500/40 top-1/3 animate-pulse duration-[2s]" />
              <div className="absolute w-full h-[2px] bg-rose-500/40 top-2/3 animate-pulse duration-[3.5s]" />
            </div>
          )}

          {/* Rapping Custom Character - occupies the full display container */}
          {activeVideoUrl && activeVideoUrl.startsWith("http") ? (
            <div className="absolute inset-0 w-full h-full bg-zinc-950 flex items-center justify-center z-10">
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                loop
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              id="vocal-puppet-card"
            className={
              cinematicMode 
                ? `absolute inset-0 w-full h-full overflow-hidden bg-zinc-950 transition-all duration-500 transform`
                : `relative z-10 w-full max-w-sm aspect-[4/5] rounded-3xl border-2 overflow-hidden bg-zinc-950 transition-all duration-500 transform shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-end items-center mb-6
                  ${themePreset === "Space Violet" ? "border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.35)]" : ""}
                  ${themePreset === "Cyberpunk Gold" ? "border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.35)]" : ""}
                  ${themePreset === "Matrix Emerald" ? "border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.35)]" : ""}
                  ${themePreset === "Crimson Velvet" ? "border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.35)]" : ""}
                `
            }
            style={{ 
              margin: cinematicMode ? "0" : "auto",
              transform: isPlaying 
                ? `translate3d(0, ${pulseKick ? -(10 * (nodIntensity / 100)) : 0}px, 0) scale(${pulseKick ? 1 + (0.015 * (nodIntensity / 100)) : 1})` 
                : "none",
              animation: isPlaying && nodIntensity > 0
                ? `performance-nod 0.8s infinite ease-in-out alternate` 
                : "none",
              transformOrigin: 'bottom center',
            }}
          >
            {/* Character Face/Body Image styled in alignment with current LUT filter & Camera Zoom */}
            <img
              src={characterImage}
              alt="Custom rapping artist"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover absolute inset-0 transition-all duration-1000 ${getFilterStyle(activeScene?.style || "Luxury Cinematic")} ${getCameraAnimationClass(activeScene?.camera || "Orbiting Slow Pan")}`}
              style={{
                transform: `scale(${characterZoom / 100}) translateY(${characterY}px)`,
                transformOrigin: 'center center'
              }}
            />

            {/* Simulated Neon Accessory Glasses mapped to the Theme set */}
            {themePreset === "Space Violet" && (
              <div className="absolute top-[34%] w-[42%] h-[12%] bg-purple-500/25 border-2 border-purple-400 rounded-full flex items-center justify-between px-2.5 shadow-[0_0_20px_rgba(168,85,247,0.85)] backdrop-blur-[1px] animate-[pulse-scale_2s_infinite] pointer-events-none z-20">
                <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping" />
                <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping" />
              </div>
            )}

            {themePreset === "Cyberpunk Gold" && (
              <div className="absolute top-[33%] w-[46%] h-[14%] bg-amber-500/30 border-2 border-amber-400 rounded-lg flex items-center justify-around shadow-[0_0_20px_rgba(245,158,11,0.85)] backdrop-blur-[1px] z-20">
                <span className="w-3.5 h-0.5 bg-amber-300 rounded-sm" />
                <span className="w-3.5 h-0.5 bg-amber-300 rounded-sm" />
              </div>
            )}

            {themePreset === "Matrix Emerald" && (
              <div className="absolute top-[35%] w-[40%] h-[11%] bg-zinc-950/95 border-2 border-emerald-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.7)] z-20">
                <div className="text-[7px] font-mono text-emerald-400 select-none tracking-widest font-bold">1010</div>
              </div>
            )}

            {themePreset === "Crimson Velvet" && (
              <div className="absolute top-[32%] w-[44%] h-[12%] bg-rose-900/40 border-2 border-rose-500 rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(244,63,94,0.75)] backdrop-blur-[1px] z-20">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
              </div>
            )}

            {/* Matrix rain effect directly on Avatar */}
            {themePreset === "Matrix Emerald" && (
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(16,185,129,0)_50%,_rgba(0,0,0,0.8)_50%)] bg-[length:100%_12px] animate-[matrix-scroll_3s_infinite_linear] z-10" />
            )}

            {/* Space Violet Scanlines */}
            {themePreset === "Space Violet" && (
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_90%,rgba(168,85,247,0.8)_95%)] bg-[length:100%_40px] animate-[scanline-scroll_4s_infinite_linear] z-10" />
            )}

            {/* Holographic Glowing Crown for Crimson Velvet */}
            {themePreset === "Crimson Velvet" && (
              <div className="absolute top-[4%] -translate-y-1/2 flex justify-center w-full pointer-events-none animate-[float_2s_infinite_ease-in-out] z-20">
                <div className="px-3 py-1 bg-rose-950/90 border border-rose-500 text-rose-400 font-mono text-[8px] uppercase tracking-widest rounded-full shadow-[0_0_12px_rgba(244,63,94,0.65)] font-bold">
                  👑 ROYAL MVT
                </div>
              </div>
            )}

            {/* Cyberpunk HUD Ring for Custom Gold */}
            {themePreset === "Cyberpunk Gold" && (
              <div className="absolute top-[8%] w-12 h-12 border border-amber-500/50 rounded-full animate-spin border-t-amber-400 flex items-center justify-center opacity-50 z-20">
                <div className="w-8 h-8 border border-dashed border-amber-500 rounded-full" />
              </div>
            )}

            {/* Real-time organic eye blinking overlay */}
            {isBlinking && (
              <div 
                className="absolute top-[37%] left-[36%] w-[28%] h-[3.5%] bg-black/55 backdrop-blur-[1px] border-b border-black/40 rounded-full animate-fade-in pointer-events-none z-20"
                style={{ mixBlendMode: "multiply" }}
              />
            )}

            {/* Visual alignment helper target bounding crosshair */}
            {showTuningOverlay && (
              <div 
                className="absolute border-2 border-dashed border-[#00E5FF] rounded-full pointer-events-none z-30 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                style={{
                  top: `${mouthAlignY}%`,
                  left: `${mouthAlignX}%`,
                  width: `${mouthW}%`,
                  height: `${mouthH}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="w-4 h-[1px] bg-[#00E5FF] absolute" />
                <span className="h-4 w-[1px] bg-[#00E5FF] absolute" />
                <span className="text-[7px] font-mono text-[#00E5FF] absolute -bottom-5 bg-black/90 px-1 rounded border border-cyan-500/30 whitespace-nowrap">
                  LIP-SYNC WARP SECTOR
                </span>
              </div>
            )}

            {/* Organic Fluid-Lips Lip-Sync Vocal deformation layer overlays */}
            {isPlaying && activeLyric && (
              <div 
                className="absolute rounded-full overflow-hidden pointer-events-none z-20"
                style={{
                  top: `${mouthAlignY}%`,
                  left: `${mouthAlignX}%`,
                  width: `${mouthW}%`,
                  height: `${mouthH}%`,
                  filter: "url(#rap-vocal-warp)",
                  transform: `translate(-50%, -50%) scaleY(${1.04 + (mouthTick * 0.05) + (pulseKick ? 0.09 : 0)}) scaleX(${1.01 + (pulseKick ? 0.04 : 0)})`,
                  transition: "transform 100ms ease-out"
                }}
              >
                {/* Dynamically calculated overlapping parent aligned crop layer */}
                <img
                  src={characterImage}
                  alt="Vocal mouth mesh"
                  referrerPolicy="no-referrer"
                  className="object-cover absolute pointer-events-none max-w-none"
                  style={{
                    width: `${(10000 / mouthW).toFixed(2)}%`,
                    height: `${(10000 / mouthH).toFixed(2)}%`,
                    left: `${(-mouthAlignX * (100 / mouthW)).toFixed(2)}%`,
                    top: `${(-mouthAlignY * (100 / mouthH)).toFixed(2)}%`,
                    transform: `scale(${characterZoom / 100}) translateY(${characterY}px)`,
                    transformOrigin: 'top left'
                  }}
                />
              </div>
            )}

            {/* Idle mouth bar placeholder */}
            {!isPlaying && (
              <div 
                className="absolute h-1 w-6 bg-zinc-900 border border-zinc-650 rounded-full opacity-70 z-20" 
                style={{
                  top: `${mouthAlignY}%`,
                  left: `${mouthAlignX}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}

            {/* Beautiful real-time interactive voice meter waveform inside character footer */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-4 flex items-end justify-center gap-0.5 opacity-60 mix-blend-screen z-20">
              {isPlaying ? (
                Array.from({ length: 12 }).map((_, idx) => {
                  const styleDuration = 0.5 + Math.random() * 0.5;
                  return (
                    <span 
                      key={idx} 
                      className="w-[2px] bg-purple-400 rounded-full animate-pulse" 
                      style={{ 
                        height: `${30 + Math.random() * 70}%`, 
                        animationDuration: `${styleDuration}s`,
                        backgroundColor: themePreset === "Space Violet" ? "#C084FC" : themePreset === "Cyberpunk Gold" ? "#F59E0B" : themePreset === "Matrix Emerald" ? "#10B981" : "#F43F5E"
                      }}
                    />
                  );
                })
              ) : (
                <div className="h-[2px] w-full bg-zinc-800 animate-pulse" />
              )}
            </div>

            {/* Interactive Theme-reactive Holographic Performance Microphone */}
            <div 
              className={`absolute bottom-[2px] left-1/2 -translate-x-1/2 w-28 h-28 pointer-events-none z-30 transition-all duration-500
                ${isPlaying ? "animate-[mic-bounce_0.71s_infinite_ease-in-out_alternate_reverse]" : ""}
              `}
            >
              {themePreset === "Space Violet" && (
                <div className="w-full h-full flex flex-col items-center justify-end">
                  {/* Glowing purple mic head */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-pink-500 to-purple-600 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)] flex items-center justify-center relative">
                    <span className="w-5 h-5 border border-purple-300/30 rounded-full animate-ping absolute" />
                    <div className="w-6 h-5 border-b border-purple-300/45 rounded-full" />
                  </div>
                  {/* Handle */}
                  <div className="w-3.5 h-14 bg-zinc-800 border-x border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.3)] relative">
                    <div className="absolute top-1 inset-x-1 h-2 bg-purple-500/80 animate-pulse" />
                    <div className="absolute top-6 inset-x-1.5 h-1 bg-pink-400" />
                  </div>
                </div>
              )}

              {themePreset === "Cyberpunk Gold" && (
                <div className="w-full h-full flex flex-col items-center justify-end">
                  {/* Studio cage shell */}
                  <div className="w-8 h-10 bg-zinc-950 border border-amber-500/80 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center relative p-1">
                    {/* Golden grill inside */}
                    <div className="w-full h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg flex flex-col gap-0.5 p-0.5 justify-around">
                      <span className="h-[2px] w-full bg-zinc-950/40" />
                      <span className="h-[2px] w-full bg-zinc-950/40" />
                      <span className="h-[2px] w-full bg-zinc-950/40" />
                    </div>
                    {/* Ring bracket */}
                    <div className="absolute -inset-1.5 border-2 border-amber-400/30 rounded-full animate-spin duration-[8s]" />
                  </div>
                  {/* Heavy mounting arm */}
                  <div className="w-4 h-10 bg-zinc-900 border-x border-amber-500 shadow-md relative">
                    <div className="absolute inset-x-0.5 top-1.5 h-1 bg-amber-400" />
                    <div className="absolute inset-x-0.5 top-5 h-1 bg-amber-400" />
                  </div>
                </div>
              )}

              {themePreset === "Matrix Emerald" && (
                <div className="w-full h-full flex flex-col items-center justify-end">
                  {/* Retro square green mic */}
                  <div className="w-7 h-9 bg-zinc-950 border-2 border-emerald-500/90 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.7)] flex flex-col items-center p-1 relative">
                    <div className="w-full h-3 bg-emerald-950 border border-emerald-500/60 rounded flex items-center justify-around font-mono text-[4px] text-emerald-400">
                      <span>DEC</span>
                      <span className="animate-pulse text-emerald-300">01</span>
                    </div>
                    <div className="w-4 h-2.5 flex flex-col gap-0.5 mt-1">
                      <span className="h-[1px] w-full bg-emerald-400/70" />
                      <span className="h-[1px] w-full bg-emerald-400/75" />
                    </div>
                  </div>
                  {/* Digital green vector bar stand */}
                  <div className="w-2.5 h-12 bg-zinc-950 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                </div>
              )}

              {themePreset === "Crimson Velvet" && (
                <div className="w-full h-full flex flex-col items-center justify-end">
                  {/* Vintage bullet silver/rose microphone */}
                  <div className="w-8 h-10 bg-zinc-900 border border-rose-500/70 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center justify-center relative p-1">
                    <div className="w-full h-full bg-gradient-to-b from-rose-500 to-rose-700 rounded-full flex flex-row items-stretch justify-around p-0.5 opacity-90 border border-rose-400">
                      <span className="w-[2px] bg-white/50" />
                      <span className="w-[2px] bg-white/50" />
                      <span className="w-[1px] bg-white/50" />
                    </div>
                    <div className="absolute top-[40%] inset-x-0 h-[2px] bg-black/60" />
                  </div>
                  {/* Classic metal stand base rod */}
                  <div className="w-2 h-12 bg-rose-950 border-x border-rose-500" />
                </div>
              )}
            </div>

            {/* Glowing neon audio bar base acting as body cutout fade shadow */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none flex items-center justify-end flex-col pb-1">
              <span className="text-[7.5px] font-mono text-zinc-300 uppercase tracking-widest bg-zinc-950/90 px-2.5 py-0.5 rounded-full border border-white/10 font-black scale-[0.85]">
                {themePreset}: ARTIST LIVE V2
              </span>
            </div>
          </div>
          )}

          {/* Master Output Hud watermarks if active compiled format is simulated */}
          {activeVideoUrl && (
            <div className="absolute top-4 left-4 z-30 font-mono text-[8px] tracking-widest uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded animate-pulse font-bold">
              4K MASTER CUT ACTIVE: PERFORMER IN THE THEMATIC GRID
            </div>
          )}
        </div>

        {/* Cyber Punk VHS Glitch overlays if active style */}
        {activeScene?.style === "Vintage VHS Glitch" && isPlaying && (
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-35 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%] animate-[flicker_0.15s_infinite]" />
        )}

        {/* Ambient Overlay Sparks / Dust floating in golden scenes */}
        {activeScene?.style === "Warm Slow-Motion" && isPlaying && (
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_100%)]">
            <div className="absolute w-2 h-2 rounded-full bg-purple-400/50 top-1/4 left-1/3 blur-sm animate-ping duration-[4s]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-pink-300/40 top-2/3 left-2/3 blur-sm animate-ping duration-[6s]" />
            <div className="absolute w-3 h-3 rounded-full bg-purple-600/30 top-1/2 left-1/2 blur-lg animate-pulse" />
          </div>
        )}

        {/* Beat Reactive Strobe Aura */}
        {isPlaying && pulseKick && (
          <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay transition-opacity duration-75" />
        )}

        {/* Glowing Letterbox Vignette bar top & bottom */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/75 to-transparent pointer-events-none flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
            <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-350 text-zinc-300">
              {isPlaying ? 'rec 1080p 24fps' : 'ready'}
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-wider text-zinc-300 uppercase">
            {activeScene?.style || 'Standard Color LUT'}
          </span>
        </div>

        {/* Central Overlay Box displaying kinetic synced lyric captions */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none flex flex-col justify-end items-center">
          {activeLyric ? (
            <div className="text-center max-w-[85%] animate-fade-in">
              <p className="text-sm md:text-base font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wide leading-relaxed">
                {activeLyric}
              </p>
              <p className="text-[9px] font-mono tracking-widest uppercase text-purple-400/90 mt-1">
                {activeScene?.title || 'GEN VIDEO FEED'}
              </p>
            </div>
          ) : (
            <div className="text-zinc-500 text-xs font-mono">
              [Music Track Ready. Play to trigger visualizer]
            </div>
          )}
        </div>
      </div>

      {/* Live Timeline Scrubber Track */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1.5">
          <span>T {currentTime}s</span>
          <span className="text-purple-450 text-purple-400 font-bold">VEO PROMPT TIMELINE</span>
          <span>T 35s</span>
        </div>

        {/* Clicking here seeks playhead */}
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          className="relative h-2.5 bg-zinc-950 rounded-full border border-white/5 cursor-pointer overflow-hidden group/bar mb-2.5"
        >
          {/* Main filled progress bar */}
          <div
            className="h-full bg-gradient-to-r from-purple-550 from-purple-500 via-pink-500 to-orange-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(168,85,247,0.5)]"
            style={{ width: `${(currentTime / 35) * 100}%` }}
          />
          {/* Grid ticks for 4 scenes */}
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            <div className="h-full w-[1px] bg-white/5 ml-[17%]" /> {/* 6s */}
            <div className="h-full w-[1px] bg-white/5 ml-[45%]" /> {/* 16s */}
            <div className="h-full w-[1px] bg-white/5 ml-[74%]" /> {/* 26s */}
          </div>
        </div>
      </div>

      {/* Styled Scene Details Panel footer */}
      <div className="p-3.5 bg-zinc-950/50 rounded-xl border border-white/5 mt-1">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 mt-0.5">
            <Sliders className="w-3 h-3" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">
              Active Scene: {activeScene?.title || "None Selected"}
            </h4>
            <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
              <span className="text-purple-400">Veo prompt pipeline:</span> {activeScene?.veoPrompt || "Load an image or click preview on any scene block."}
            </p>
          </div>
        </div>
      </div>

      {/* Embedding necessary visual styling classes as keyframe definitions */}
      <style>{`
        @keyframes orbit {
          0% { transform: scale(1.05) rotate(0deg) translate3d(0, 0, 0); }
          50% { transform: scale(1.08) rotate(1deg) translate3d(4px, -2px, 0); }
          100% { transform: scale(1.05) rotate(0deg) translate3d(0, 0, 0); }
        }
        @keyframes tracking {
          0% { transform: scale(1.1) translate2d(0, -5px); }
          50% { transform: scale(1.06) translate2d(0, 5px); }
          100% { transform: scale(1.1) translate2d(0, -5px); }
        }
        @keyframes pullback {
          0% { transform: scale(1.15); }
          100% { transform: scale(1.01); }
        }
        @keyframes macropan {
          0% { transform: scale(1.3) translate3d(-10px, -5px, 0); }
          50% { transform: scale(1.38) translate3d(10px, 5px, 0); }
          100% { transform: scale(1.3) translate3d(-10px, -5px, 0); }
        }
        @keyframes crane {
          0% { transform: scale(1.05) translate3d(0, 10px, 0); }
          100% { transform: scale(1.12) translate3d(0, -10px, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-0.5deg); }
          40% { transform: translate(1px, -1px) rotate(0.5deg); }
          60% { transform: translate(-1px, 2px) rotate(0.1deg); }
          80% { transform: translate(2px, 1px) rotate(-0.1deg); }
        }
        @keyframes dolly {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1.02); }
        }
        @keyframes flicker {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        @keyframes bob-hiphop {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          100% { transform: translateY(-12px) rotate(1.8deg) scale(1.03); }
        }
        @keyframes mic-bounce {
          0% { transform: translate(-50%, 0) scale(1) rotate(0deg); }
          100% { transform: translate(-50%, 6px) scale(0.97) rotate(-1.5deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateY(0); }
          50% { transform: translateY(-50%) translateY(-6px); }
        }
        @keyframes mouthWave {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
        @keyframes mouthWaveHeight {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 240px; }
        }
        @keyframes scanline-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 400px; }
        }
      `}</style>
    </div>
  );
}
