import { useState } from "react";
import { HelpCircle, Sparkles, BookOpen, Music, Video, User, Sliders, ChevronDown, ChevronUp, Check } from "lucide-react";

interface HelpGuidesProps {
  onApplyRecipe: (recipe: {
    theme: string;
    camera: string;
    style: string;
    scenes?: {
      title: string;
      veoPrompt: string;
      camera: string;
      style: string;
    }[];
  }) => void;
}

const RECIPES = [
  {
    name: "Cyberpunk Underground",
    description: "Futuristic neon rain vibe, fast tracking cameras, and stark violet hues.",
    theme: "Cyberpunk Rebel",
    camera: "Tracking Head-On",
    style: "90s Cyber MTV",
    color: "border-purple-500/25 text-purple-400",
    scenes: [
      {
        title: "Neon Command Room",
        veoPrompt: "A slow orbiting lens sweep of a dapper gentleman with gold-tipped braids and a crisp high-collar jacket, sitting under high-contrast purple holographic screens displaying code streams, cyberpunk workspace, rain-slick reflections.",
        camera: "Orbiting Slow Pan",
        style: "90s Cyber MTV"
      },
      {
        title: "The Rain-Slick Sidewalk",
        veoPrompt: "Tracking head-on shot of an elegant artist walking down a misty neon city street, glowing violet-purple billboards, retro 1990s hip-hop music video style, slow-motion puddles splashing.",
        camera: "Tracking Head-On",
        style: "90s Cyber MTV"
      },
      {
        title: "Subway Platform Stage",
        veoPrompt: "A dramatic wide low-angle tilt of an artist under blinking halogen lights on an abandoned gritty subway platform, neon glowing spray-paint murals, deep ambient fog, cinematic 8k.",
        camera: "Tilt-Shift Close-Up",
        style: "Saturated Neon Retro"
      },
      {
        title: "Cyberpunk Rooftop Finale",
        veoPrompt: "Panoramic sweeping view of a high-tech retro skyscraper helipad under heavy rain, neon advertisements projecting giant golden tigers in the dark sky, backlighting lenses flaring.",
        camera: "High-Angle Drone Pullback",
        style: "90s Cyber MTV"
      }
    ]
  },
  {
    name: "Classic Film Noir",
    description: "Retro black-and-white high-contrast drama with misty streetlights.",
    theme: "Vintage Noir",
    camera: "Standard Static Wide",
    style: "Deep Shadows Film Noir",
    color: "border-zinc-500/25 text-zinc-300",
    scenes: [
      {
        title: "The Dressing Room Shroud",
        veoPrompt: "A dramatic dark high-contrast black-and-white scene. An elegant gentleman wearing a sharp double-breasted tuxedo adjusting his collar in front of a giant dressing room mirror, soft vanity lights, high shadow depth.",
        camera: "Orbiting Slow Pan",
        style: "Deep Shadows Film Noir"
      },
      {
        title: "Mist-Covered Alleyway",
        veoPrompt: "A classic head-on tracking shot of a dapper gentleman in sunglasses walking down a cobblestone alleyway in Chicago, tall dark brick walls, single glowing streetlamp casting long misty shadows, vintage film grain.",
        camera: "Tracking Head-On",
        style: "Deep Shadows Film Noir"
      },
      {
        title: "The Jazz Club Silhouettes",
        veoPrompt: "Retro close-up of a vintage microphone under a single bright spotlight on a smoky stage, slow smoke plumes drifting around, deep velvet shades, cinematic dramatic monochrome textures.",
        camera: "Standard Static Wide",
        style: "Deep Shadows Film Noir"
      },
      {
        title: "Misty Horizon Exit",
        veoPrompt: "Wide-scale cinematic silhouette of a dapper artist standing on a misty high rooftop looking out over the Chicago skyline at night, dim blinking headlights below, classic film look.",
        camera: "Drone Pullback",
        style: "Deep Shadows Film Noir"
      }
    ]
  },
  {
    name: "Golden Penthouse",
    description: "Sweeping drone sunset fly-overs and opulent glass towers.",
    theme: "Sunset Elite",
    camera: "High-Angle Drone Pullback",
    style: "Aerial Golden Hour",
    color: "border-amber-500/25 text-amber-500",
    scenes: [
      {
        title: "Penthouse Sunset Lounge",
        veoPrompt: "Establishing panoramic wide shot of a luxury penthouse interior looking out over Chicago skyscrapers at sunset. Brilliant orange-golden backlighting, soft smoke, elegant dress, warm lens flare.",
        camera: "Establishing Panoramic",
        style: "Aerial Golden Hour"
      },
      {
        title: "Helipad Runway Walk",
        veoPrompt: "Slow macro tracking shot of shiny leather boots walking confidently across a high penthouse helipad, reflection of golden clouds in the glass roof, luxury speed pacing.",
        camera: "Macro Pan Detail",
        style: "Warm Slow-Motion"
      },
      {
        title: "Skyline Overlook Stage",
        veoPrompt: "A majestic drone pullback shooting an artist in a tailored tuxedo looking down from a high glass balcony over glowing avenues, endless skyscrapers fading into soft twilight fog.",
        camera: "High-Angle Drone Pullback",
        style: "Aerial Golden Hour"
      },
      {
        title: "Golden Hour Glow Out",
        veoPrompt: "Classic cinematic close-up of gold-highlighted braids and sharp collar reflections under golden backlighting, glowing ambient dust particles floating in sunset lens flares.",
        camera: "Warm Slow-Motion",
        style: "Warm Slow-Motion"
      }
    ]
  }
];

export function HelpGuides({ onApplyRecipe }: HelpGuidesProps) {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'recipes' | 'shortcuts'>('walkthrough');
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleApply = (recipe: typeof RECIPES[0]) => {
    onApplyRecipe({
      theme: recipe.theme,
      camera: recipe.camera,
      style: recipe.style,
      scenes: recipe.scenes
    });
    setSelectedRecipe(recipe.name);
    setTimeout(() => setSelectedRecipe(null), 1500);
  };

  return (
    <div id="help-guides-container" className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
      <div>
        {/* Help Headers */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-300">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Studio Director's Guide</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Workflow & Cinematic Recipe Decks</p>
            </div>
          </div>
          <div className="flex gap-1.5 p-0.5 bg-zinc-950 rounded-lg border border-white/5">
            {(['walkthrough', 'recipes', 'shortcuts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-md font-bold transition-all ${
                  activeTab === tab
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'walkthrough' && (
          <div className="space-y-3 mr-1 mt-1 scrollbar-thin">
            <div className="flex gap-3 items-start p-3 bg-zinc-950/40 rounded-xl border border-white/5">
              <div className="w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 font-mono text-[10px] font-bold">1</div>
              <div>
                <h4 className="text-[11px] font-mono tracking-wide text-zinc-300 font-bold uppercase">Cast the Artist Portrait</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5">
                  Upload an image of an artist or rapper. Gemini's visual processor reads their outfit, styling details, and braids to map their unique identity description.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-zinc-950/40 rounded-xl border border-white/5">
              <div className="w-5 h-5 rounded-md bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-mono text-[10px] font-bold">2</div>
              <div>
                <h4 className="text-[11px] font-mono tracking-wide text-zinc-300 font-bold uppercase">Synthesize & Adjust BPM</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5">
                  Adjust the beat speed (BPM) and selected drum deck category. Clicking "Randomize Track Style" automatically shuffles custom instrument presets.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-zinc-950/40 rounded-xl border border-white/5">
              <div className="w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 font-mono text-[10px] font-bold">3</div>
              <div>
                <h4 className="text-[11px] font-mono tracking-wide text-zinc-300 font-bold uppercase">Render Storyboard Keyframes</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5">
                  Deploy camera directions or edit the Veo prompts inside the timeline. Press "Camera" to render keyframe illustrations or "Video" to lock in the slow-motion simulated loops!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-3 mt-1">
            <p className="text-[9px] text-zinc-400 font-mono tracking-wide uppercase px-1">Click a quick-start card to instantly load studio parameters:</p>
            <div className="grid grid-cols-1 gap-2">
              {RECIPES.map((recipe) => (
                <button
                  key={recipe.name}
                  onClick={() => handleApply(recipe)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-purple-500/30 transition-all flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="space-y-1 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${recipe.color}`}>{recipe.name}</span>
                      {selectedRecipe === recipe.name && (
                        <span className="flex items-center gap-0.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" /> Applied
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal max-w-[85%]">{recipe.description}</p>
                    <div className="flex gap-2 text-[9px] font-mono text-zinc-400 pt-1">
                      <span className="font-bold">{recipe.style}</span>
                      <span>•</span>
                      <span>{recipe.camera}</span>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-zinc-700 group-hover:text-purple-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div className="space-y-2 mt-1 px-1 text-[10px] font-mono">
            <div className="flex justify-between items-center py-2 border-b border-white/5 text-zinc-400">
              <span>Spacebar</span>
              <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-white font-bold text-[9px]">Toggle Playback</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 text-zinc-400">
              <span>Shift + L</span>
              <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-white font-bold text-[9px]">Open Settings</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 text-zinc-400">
              <span>Left / Right Arrows</span>
              <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-white font-bold text-[9px]">Seek Timeline</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 text-zinc-400">
              <span>Tuning Controls</span>
              <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-white font-bold text-[9px]">Drag Vol Slider</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
        <span>Studio Guide Deck v1.4</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> Auto-sync enabled</span>
      </div>
    </div>
  );
}
