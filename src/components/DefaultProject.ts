import { RapProject } from "../types";

export const DEFAULT_PROJECT: RapProject = {
  characterImage: "/src/assets/images/dapper_rapper_1779336173945.png",
  characterDescription: "African American gentleman dressed in an immaculate high-fashion black tuxedo and bow tie, wearing long, pristine braids styled with gold-blonde highlighted tips.",
  theme: "CEO Tuxedo Grind",
  bpm: 94,
  beatType: "Trap",
  lyrics: [],
  scenes: [
    {
      id: "sc-1",
      timeStart: 0,
      timeEnd: 6,
      title: "The Mirror Reveal",
      veoPrompt: "A slow orbiting cinematic shot of a dapper gentleman with gold-tipped braids and a classic black tuxedo. Shimmering dressing room with golden spotlights and luxury tall mirrors, cinematic lighting, 8k resolution, deep focus.",
      camera: "Orbiting Slow Pan",
      style: "Luxury Cinematic",
      imageUrl: "/src/assets/images/dapper_rapper_1779336173945.png" // use default rapper initially
    },
    {
      id: "sc-2",
      timeStart: 6,
      timeEnd: 16,
      title: "The Neon Block Walk",
      veoPrompt: "A slow tracking head-on shot of an elegant African American gentleman wearing a dapper black suit, walking confidently down a misty night city sidewalk lined with glowing violet-purple and blue neon lights, cinematic film grain, MTV retro rap aesthetic.",
      camera: "Tracking Head-On",
      style: "90s Cyber MTV",
      imageUrl: "/src/assets/images/dapper_rapper_1779336173945.png"
    },
    {
      id: "sc-3",
      timeStart: 16,
      timeEnd: 26,
      title: "The High Rise Roof Stage",
      veoPrompt: "A dramatic drone pullback shot of a sleek-dressed gentleman on a high-tech penthouse helipad in Chicago at golden sunset twilight hours. Gigantic shining glass skyscrapers in the backdrop, panning epic scale video.",
      camera: "Drone Pullback",
      style: "Aerial Golden Hour",
      imageUrl: "/src/assets/images/dapper_rapper_1779336173945.png"
    },
    {
      id: "sc-4",
      timeStart: 26,
      timeEnd: 35,
      title: "The Golden Fade Out",
      veoPrompt: "A premium macro tilt-up panning detail of long, intricate braided dreadlocks with glowing gold-blonde highlights, ambient soft glowing dust particles moving through warm backlighting lens flares.",
      camera: "Macro Pan Detail",
      style: "Warm Slow-Motion",
      imageUrl: "/src/assets/images/dapper_rapper_1779336173945.png"
    }
  ]
};
