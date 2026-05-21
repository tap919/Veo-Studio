import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Video, Image as ImageIcon, FileText, Check, Sparkles,
  MessageSquare, Trash2, Send, Clock, User, Compass, HelpCircle
} from "lucide-react";
import { Asset, Scene, LyricLine } from "../types";

interface AssetVaultAndLocalScannerProps {
  onSelectCharacterImage: (img: string) => void;
  onUpdateSceneImage: (sceneId: string, img: string) => void;
  onApplyLocalStoryboard: (lyrics: LyricLine[], scenes: Scene[]) => void;
  scenes: Scene[];
  lyrics: LyricLine[]; // Current active lyrics which we will preserve unchanged
  activeTheme: {
    textClass: string;
    gradientClass: string;
    glowClass: string;
    pulseDot: string;
    creditsBg: string;
    creditsBorder: string;
  };
  onFeedCustomVideo: (videoUrl: string | null) => void;
  activeVideoUrl: string | null;
}

interface ChatMessage {
  id: string;
  sender: "user" | "director";
  text: string;
  timestamp: string;
  suggestedScenes?: Scene[];
}

export function AssetVaultAndLocalScanner({
  onSelectCharacterImage,
  onUpdateSceneImage,
  onApplyLocalStoryboard,
  scenes,
  lyrics,
  activeTheme,
  onFeedCustomVideo,
  activeVideoUrl
}: AssetVaultAndLocalScannerProps) {
  // Tab management: 'vault' | 'chat_ideas'
  const [activeTab, setActiveTab] = useState<'vault' | 'chat_ideas'>('chat_ideas');
  const [assetFilter, setAssetFilter] = useState<'all' | 'video' | 'image'>('all');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Asset list storage
  const [assets, setAssets] = useState<Asset[]>(() => {
    const stored = localStorage.getItem("veo_uploaded_assets_simplified");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [
      {
        id: "sample-chicago-street",
        name: "rainy-chicago-subway.mp4",
        type: "video",
        dataUrl: "", // blank stands for simulated background overlay in visualizer
        size: "4.2 MB",
        uploadedAt: new Date().toLocaleDateString()
      }
    ];
  });

  // Chat message state
  const [chatLog, setChatLog] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem("veo_chat_log");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [
      {
        id: "msg-welcome",
        sender: "director",
        text: "Yo! I am your Veo Storyboard Assistant. 🎬 Just tell me what concept, vibe, or camera angles you want for your 35-second music video. For example: 'neon cyberpunk rain street' or 'retro 90s vintage film grain'. I'll instantly outline 4 custom scene compositions with lighting directions and camera choreography for your timeline!",
        timestamp: "11:45 AM"
      }
    ];
  });

  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("veo_uploaded_assets_simplified", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("veo_chat_log", JSON.stringify(chatLog));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // Asset handlers
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
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(1)} KB`;

    if (file.type.startsWith("image/")) {
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const newAsset: Asset = {
            id: `img-${Date.now()}`,
            name: file.name,
            type: "image",
            dataUrl: reader.result,
            size: sizeStr,
            uploadedAt: new Date().toLocaleDateString()
          };
          setAssets(prev => [newAsset, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const objectUrl = URL.createObjectURL(file);
      const newAsset: Asset = {
        id: `vid-${Date.now()}`,
        name: file.name,
        type: "video",
        dataUrl: objectUrl,
        size: sizeStr,
        uploadedAt: new Date().toLocaleDateString()
      };
      setAssets(prev => [newAsset, ...prev]);
    }
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

  const deleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const asset = assets.find(a => a.id === id);
    if (asset?.type === "video" && asset.dataUrl.startsWith("blob:")) {
      URL.revokeObjectURL(asset.dataUrl);
    }
    if (activeVideoUrl === asset?.dataUrl) {
      onFeedCustomVideo(null);
    }
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Pre-configured storyboard templates relative to text prompt keywords
  const generateSuggestedScenes = (prompt: string): Scene[] => {
    const cleanPrompt = prompt.toLowerCase();

    if (cleanPrompt.includes("cyber") || cleanPrompt.includes("neon") || cleanPrompt.includes("rain") || cleanPrompt.includes("purple") || cleanPrompt.includes("violet")) {
      return [
        {
          id: "sc-ch-1",
          timeStart: 0,
          timeEnd: 6,
          title: "Neon Command Deck",
          veoPrompt: "A slow orbiting lens sweep of an artist under high-contrast purple holographic screens with rain-slick reflections outside the floor-to-ceiling windows.",
          camera: "Orbiting Slow Pan",
          style: "90s Cyber MTV",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-c1/640/360`
        },
        {
          id: "sc-ch-2",
          timeStart: 6,
          timeEnd: 16,
          title: "Rain-Slick Sidewalk",
          veoPrompt: "Tracking head-on shot of a dapper artist walking down a misty neon city street, glowing violet-purple billboards, water puddles splashing in slow-motion.",
          camera: "Tracking Head-On",
          style: "90s Cyber MTV",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-c2/640/360`
        },
        {
          id: "sc-ch-3",
          timeStart: 16,
          timeEnd: 26,
          title: "Subway Platform Glow",
          veoPrompt: "A dramatic wide low-angle tilt of an artist under blinking halogen lights on an abandoned subway platform with neon spray-paint graffiti murals.",
          camera: "Tilt-Shift Close-Up",
          style: "Saturated Neon Retro",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-c3/640/360`
        },
        {
          id: "sc-ch-4",
          timeStart: 26,
          timeEnd: 35,
          title: "Cyber City Rooftop",
          veoPrompt: "Wide panoramic view of a high-tech retro skyscraper helipad under heavy rain, neon advertisements projecting giant golden tigers in the night sky.",
          camera: "High-Angle Drone Pullback",
          style: "90s Cyber MTV",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-c4/640/360`
        }
      ];
    }

    if (cleanPrompt.includes("noir") || cleanPrompt.includes("vintage") || cleanPrompt.includes("classic") || cleanPrompt.includes("retro") || cleanPrompt.includes("dark")) {
      return [
        {
          id: "sc-ch-1",
          timeStart: 0,
          timeEnd: 6,
          title: "The Backstage Mirror",
          veoPrompt: "A dramatic dark high-contrast black-and-white scene. An artist adjustments a sharp tuxedo collar in front of a giant cosmetic dressing mirror.",
          camera: "Orbiting Slow Pan",
          style: "Deep Shadows Film Noir",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-n1/640/360`
        },
        {
          id: "sc-ch-2",
          timeStart: 6,
          timeEnd: 16,
          title: "The Midnight Alleyway",
          veoPrompt: "Classic head-on tracking shot down a cobblestone alleyway, single streetlamp casting long misty shadows, heavy film grain, cinematic dramatic shadow depths.",
          camera: "Tracking Head-On",
          style: "Deep Shadows Film Noir",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-n2/640/360`
        },
        {
          id: "sc-ch-3",
          timeStart: 16,
          timeEnd: 26,
          title: "Spotlight Solitude",
          veoPrompt: "Retro close-up of a vintage microphone under a single bright spotlight on a smoky stage, slow smoke plumes drifting around, deep monochromatic textures.",
          camera: "Standard Static Wide",
          style: "Deep Shadows Film Noir",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-n3/640/360`
        },
        {
          id: "sc-ch-4",
          timeStart: 26,
          timeEnd: 35,
          title: "Misty Horizon Escape",
          veoPrompt: "Cinematic silhouette of a dapper artist standing on a misty high concrete rooftop looking out over a foggy glowing cityscape skyline at night.",
          camera: "Drone Pullback",
          style: "Deep Shadows Film Noir",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-n4/640/360`
        }
      ];
    }

    if (cleanPrompt.includes("sunset") || cleanPrompt.includes("gold") || cleanPrompt.includes("penthouse") || cleanPrompt.includes("luxury") || cleanPrompt.includes("rich") || cleanPrompt.includes("beach")) {
      return [
        {
          id: "sc-ch-1",
          timeStart: 0,
          timeEnd: 6,
          title: "Golden Hour Balcony",
          veoPrompt: "A majestic slow camera fly-past of a luxury penthouse interior looking out over city skyscrapers at sunset, beautiful orange-golden lense flares.",
          camera: "Establishing Panoramic",
          style: "Aerial Golden Hour",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-g1/640/360`
        },
        {
          id: "sc-ch-2",
          timeStart: 6,
          timeEnd: 16,
          title: "The Helipad Runway",
          veoPrompt: "Slow macro tracking shot of shiny leather boots walking confidently across a private helipad with glowing orange sky reflections in the skyline glass.",
          camera: "Macro Pan Detail",
          style: "Warm Slow-Motion",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-g2/640/360`
        },
        {
          id: "sc-ch-3",
          timeStart: 16,
          timeEnd: 26,
          title: "Skyscraper Overlook",
          veoPrompt: "Drone pullback showing an artist in a tailored tuxedo looking down from a high glass deck balcony over glowing city avenues fading into twilight fog.",
          camera: "High-Angle Drone Pullback",
          style: "Aerial Golden Hour",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-g3/640/360`
        },
        {
          id: "sc-ch-4",
          timeStart: 26,
          timeEnd: 35,
          title: "Endless Twilight Glow",
          veoPrompt: "Warm slow-motion close up of gold-highlighted braids and jewelry reflecting beautiful sunset backlighting with dust particles shifting.",
          camera: "Warm Slow-Motion",
          style: "Warm Slow-Motion",
          imageUrl: `https://picsum.photos/seed/${Date.now()}-g4/640/360`
        }
      ];
    }

    // Default dynamic templates mapping the user's custom concept!
    const concept = prompt || "vibrant music video vibe";
    return [
      {
        id: "sc-ch-1",
        timeStart: 0,
        timeEnd: 6,
        title: "Establishing Concept Shot",
        veoPrompt: `An atmospheric establishing panoramic shot featuring ${concept}, stylized with deep rich ambient lighting and elegant cinematography layout.`,
        camera: "Establishing Panoramic",
        style: "Luxury Cinematic",
        imageUrl: `https://picsum.photos/seed/${Date.now()}-d1/640/360`
      },
      {
        id: "sc-ch-2",
        timeStart: 6,
        timeEnd: 16,
        title: "Subject Close-Up Profile",
        veoPrompt: `A highly stylized macro tracking pan detail showing an artist fully immersed in the theme of ${concept}, warm backlighting highlights.`,
        camera: "Macro Pan Detail",
        style: "Warm Slow-Motion",
        imageUrl: `https://picsum.photos/seed/${Date.now()}-d2/640/360`
      },
      {
        id: "sc-ch-3",
        timeStart: 16,
        timeEnd: 26,
        title: "High-Energy Performance",
        veoPrompt: `Handheld tracking movement of an artist performing with backlighting lens-flares, reflecting the core theme of ${concept}.`,
        camera: "Tracking Head-On",
        style: "90s Cyber MTV",
        imageUrl: `https://picsum.photos/seed/${Date.now()}-d3/640/360`
      },
      {
        id: "sc-ch-4",
        timeStart: 26,
        timeEnd: 35,
        title: "Stunning Finale Drone Split",
        veoPrompt: `Widescale aerial drone pullback flying away from high skyline, majestic cinematic textures representing ${concept} dissolving into mist.`,
        camera: "Drone Pullback",
        style: "Luxury Cinematic",
        imageUrl: `https://picsum.photos/seed/${Date.now()}-d4/640/360`
      }
    ];
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, userMsg]);
    setIsGenerating(true);
    const textQuery = userInput;
    setUserInput("");

    setTimeout(() => {
      const suggestions = generateSuggestedScenes(textQuery);
      const formattedResponse = `I love that vision! I've designed 4 custom scenes for a "${textQuery}" theme to populate your active storyboard.\n\nI mapped out a sequence featuring: \n1️⃣ **Scene 1: ${suggestions[0].title}**\n2️⃣ **Scene 2: ${suggestions[1].title}**\n3️⃣ **Scene 3: ${suggestions[2].title}**\n4️⃣ **Scene 4: ${suggestions[3].title}** \n\nClick the button below to apply this custom visual timeline into your active workspace. This leaves your current extracted audio lyrics intact!`;

      const assistantMsg: ChatMessage = {
        id: `msg-dir-${Date.now()}`,
        sender: "director",
        text: formattedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedScenes: suggestions
      };

      setChatLog(prev => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1500);
  };

  const applyScenesFromChat = (scenesArray: Scene[]) => {
    // Merge lyrics list safely to only replace storyboard scenes as requested!
    onApplyLocalStoryboard(lyrics, scenesArray);
  };

  return (
    <div id="asset-scanner-bento-card" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between h-auto lg:h-[500px]">
      
      {/* Top Deck tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('chat_ideas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat_ideas'
                ? "bg-purple-600 text-white shadow-md border border-purple-500/25"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Storyboard Ideas Chat
          </button>
          
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? "bg-purple-600 text-white shadow-md border border-purple-500/25"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Media & Portrait Vault
          </button>
        </div>

        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
          Director Suite
        </span>
      </div>

      {activeTab === 'chat_ideas' ? (
        <div className="flex flex-col justify-between h-full overflow-hidden flex-1 min-h-[360px] lg:min-h-[auto]">
          
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[280px] lg:max-h-[290px] font-sans pb-2">
            {chatLog.map((message) => {
              const isDirector = message.sender === "director";
              
              return (
                <div key={message.id} className={`flex items-start gap-2.5 ${!isDirector ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Portrait Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold border ${pfpStyles(message.sender)}`}>
                    {isDirector ? "🎬" : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message body bubble */}
                  <div className={`flex flex-col space-y-1 max-w-[85%] ${!isDirector ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-2xl text-[11.5px] leading-relaxed shadow-sm ${
                      isDirector
                        ? "bg-zinc-950/90 text-zinc-200 border border-white/5 rounded-tl-none font-sans"
                        : "bg-purple-600/20 text-purple-200 border border-purple-500/10 rounded-tr-none font-medium"
                    }`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                      
                      {/* One Click Storyboard Inject Button */}
                      {message.suggestedScenes && (
                        <div className="mt-3.5 border-t border-white/5 pt-3">
                          <button
                            onClick={() => applyScenesFromChat(message.suggestedScenes!)}
                            className="bg-gradient-to-r from-purple-600 to-[#00E5FF] text-white hover:opacity-95 text-[10.5px] font-bold font-mono py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                          >
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            Apply Scenes to Visual Timeline
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 px-1">{message.timestamp}</span>
                  </div>

                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] pl-10 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>Assistant is scouting locations & camera choreography...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat text box input */}
          <div className="pt-3 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === "Enter") handleSendMessage(); }}
              placeholder="Ask for 'cyberpunk heavy neon street' or custom camera vibes..."
              className="flex-1 bg-zinc-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-purple-500 font-sans"
              disabled={isGenerating}
            />
            <button
              onClick={handleSendMessage}
              disabled={isGenerating || !userInput.trim()}
              className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-transform shrink-0 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Sub-filters & upload actions */}
          <div className="flex items-center justify-between gap-1.5 bg-zinc-950/40 p-2 rounded-xl border border-white/5 flex-wrap">
            <div className="flex gap-1.5">
              {(['all', 'video', 'image'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAssetFilter(f)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono capitalize transition-all ${
                    assetFilter === f
                      ? "bg-white/10 text-white font-bold"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  {f === 'all' ? 'All Files' : `${f}s`}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 hover:bg-white/5 border border-white/10 rounded text-[10px] font-mono font-bold text-zinc-350 hover:text-white flex items-center gap-1 uppercase tracking-wide transition-all"
            >
              Upload raw file
            </button>
          </div>

          {/* Drag & Drop Upload Space */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group py-5 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/5 bg-zinc-950/45 hover:border-white/10 hover:bg-zinc-900/30"
            }`}
          >
            <Upload className="w-7 h-7 text-zinc-500 group-hover:text-purple-400 mb-2 transition-colors stroke-[1.5]" />
            <p className="text-xs font-bold text-zinc-300">Drag & Drop visual reference backgrounds or raw footage here</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*,image/*"
              className="hidden"
            />
          </div>

          {/* Custom Files Grid/List */}
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] pr-2 max-h-[140px]">
            {assets.filter(a => assetFilter === 'all' || a.type === assetFilter).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-650 font-mono py-6">
                <p>No uploaded {assetFilter !== 'all' ? `${assetFilter} ` : ''}assets stored</p>
              </div>
            ) : (
              assets
                .filter(a => assetFilter === 'all' || a.type === assetFilter)
                .map(asset => (
                  <div
                    key={asset.id}
                    className={`flex items-center justify-between p-2 rounded-lg bg-zinc-950/70 border transition-all ${
                      activeVideoUrl === asset.dataUrl && asset.dataUrl
                        ? "border-emerald-500 bg-emerald-990/5" 
                        : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate w-[75%]">
                      {asset.type === "video" ? <Video className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <ImageIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                      
                      <div className="truncate">
                        <p className="font-bold text-zinc-300 truncate text-[11px]">{asset.name}</p>
                        <p className="text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <span>{asset.size}</span>
                          {activeVideoUrl === asset.dataUrl && asset.dataUrl && (
                            <span className="text-emerald-400 font-extrabold uppercase text-[7.5px] bg-emerald-400/15 px-1 border border-emerald-500/20 rounded">Cast on TV monitor</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {asset.type === "video" && (
                        <button
                          onClick={() => {
                            if (activeVideoUrl === asset.dataUrl) {
                              onFeedCustomVideo(null);
                            } else {
                              onFeedCustomVideo(asset.dataUrl || "https://assets.mixkit.co/videos/preview/mixkit-subway-car-at-night-with-flashing-lights-42517-large.mp4");
                            }
                          }}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            activeVideoUrl === asset.dataUrl
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {activeVideoUrl === asset.dataUrl ? "unmount" : "Play loop"}
                        </button>
                      )}

                      {asset.type === "image" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onSelectCharacterImage(asset.dataUrl)}
                            className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[8px] font-bold uppercase"
                          >
                            Cast
                          </button>
                          <button
                            onClick={() => {
                              if(scenes[0]) {
                                onUpdateSceneImage(scenes[0].id, asset.dataUrl);
                              }
                            }}
                            className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 text-zinc-300 rounded text-[8px] font-bold uppercase"
                          >
                            Set Scene
                          </button>
                        </div>
                      )}

                      <button
                        onClick={(e) => deleteAsset(asset.id, e)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="border-t border-white/5 pt-2.5">
            <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-white/5 text-[9.5px] text-zinc-500 leading-normal font-sans">
              💡 Feed custom background reference footage straight into the main monitor video player deck by uploading custom MP4 files and clicking <span className="text-emerald-400 font-bold">\"Play loop\"</span>!
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

function pfpStyles(sender: "user" | "director") {
  return sender === "director" 
    ? "bg-purple-600/10 text-purple-400 border-purple-500/20" 
    : "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20";
}
