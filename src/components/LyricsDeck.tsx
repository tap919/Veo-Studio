import { Edit2, Sparkles, AlertCircle, Music, CheckCircle } from "lucide-react";
import { LyricLine } from "../types";
import React, { useState, useEffect, useRef } from "react";

interface LyricsDeckProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek: (time: number) => void;
  onUpdateLyrics: (newLyrics: LyricLine[]) => void;
}

export function LyricsDeck({ lyrics, currentTime, onSeek, onUpdateLyrics }: LyricsDeckProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showExtractedNotice, setShowExtractedNotice] = useState(false);
  const prevLyricsLength = useRef(lyrics.length);

  useEffect(() => {
    // When lyrics go from empty to populated, show a glorious success notice!
    if (lyrics.length > 0 && prevLyricsLength.current === 0) {
      setShowExtractedNotice(true);
      const timer = setTimeout(() => setShowExtractedNotice(false), 5000);
      return () => clearTimeout(timer);
    }
    prevLyricsLength.current = lyrics.length;
  }, [lyrics]);

  const handleStartEdit = (idx: number, text: string) => {
    setEditingIndex(idx);
    setEditText(text);
  };

  const handleSaveEdit = (idx: number) => {
    const updated = [...lyrics];
    updated[idx] = { ...updated[idx], text: editText };
    onUpdateLyrics(updated);
    setEditingIndex(null);
  };

  // Find the currently active line index based on playhead time
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  return (
    <div id="lyrics-deck-container" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
            <Music className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Rap Lyric Deck</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Dynamic Text-Sequenced Bars</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-950 border border-white/5 text-[10px] font-mono text-zinc-400">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>AUTOSYNC</span>
        </div>
      </div>

      {showExtractedNotice && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 animate-pulse">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide">
            Lyric Sync Active: vocal patterns deployed mapping time starts!
          </p>
        </div>
      )}

      {lyrics.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
          <AlertCircle className="w-8 h-8 opacity-45 mb-2 text-[#00E5FF] animate-pulse" />
          <p className="text-xs font-mono font-bold uppercase text-zinc-350 tracking-wider">No extracted lyrics loaded</p>
          <p className="text-[10px] mt-1.5 max-w-xs leading-relaxed text-zinc-550">
            Upload a song in the <span className="text-[#00E5FF] font-semibold">"Uploaded Song Ingestor"</span> below, then click "Extract & Populate" to transcribe your soundtrack's vocal bar timings!
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[360px] pr-2 custom-scrollbar">
          {lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => onSeek(line.time)}
                className={`group relative p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
                    : "bg-zinc-950/40 border-white/5 hover:bg-zinc-900/30 hover:border-zinc-805 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {line.section}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      T +{line.time}s
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(idx, line.text);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800/60 rounded transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>

                {editingIndex === idx ? (
                  <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-zinc-950 border border-purple-500/50 rounded-lg p-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1.5 mt-1.5">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-2.5 py-1 rounded text-[10px] font-mono hover:bg-zinc-800 text-zinc-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="px-2.5 py-1 rounded text-[10px] font-mono bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-505 hover:to-pink-505 hover:from-purple-500 hover:to-pink-500 font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs ml-1 leading-relaxed transition-colors ${
                    isActive ? "text-purple-100 font-medium" : "text-zinc-300"
                  }`}>
                    {line.text}
                  </p>
                )}

                {/* Left active absolute neon bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-lg shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
