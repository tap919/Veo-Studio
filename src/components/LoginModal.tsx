import { useState } from "react";
import { UserProfile } from "../types";
import { X, Mail, User, ShieldCheck, LogOut, LogIn, Award, BarChart3, Palette, Check } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  "from-purple-500 to-pink-500",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-700",
  "from-blue-500 to-indigo-600",
  "from-red-500 to-rose-700",
  "from-pink-500 to-rose-400"
];

export function LoginModal({ isOpen, onClose, profile, onUpdateProfile }: LoginModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatarColor);
  const [isSignMode, setIsSignMode] = useState(!profile.signedIn);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      username,
      email,
      avatarColor: avatar,
      signedIn: true,
    });
    setMessage("Profile updated successfully!");
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1200);
  };

  const handleToggleAuth = () => {
    if (profile.signedIn) {
      // Log out
      onUpdateProfile({
        ...profile,
        signedIn: false,
      });
      setIsSignMode(true);
      setMessage("Logged out securely.");
      setTimeout(() => setMessage(null), 2000);
    } else {
      // Log in / Sign up
      if (!username || !email) {
        setMessage("Please fill out both username and email.");
        return;
      }
      onUpdateProfile({
        ...profile,
        username,
        email,
        avatarColor: avatar,
        signedIn: true,
      });
      setIsSignMode(false);
      setMessage("Logged in securely!");
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="login-modal-container"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl transition-all"
      >
        {/* Background glow lines */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${avatar} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
              {username.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-zinc-100 uppercase">
                {profile.signedIn ? "Studio Profile" : "Access Credentials required"}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                {profile.signedIn ? "Authenticated Member" : "Local Playground Mode"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message notification */}
        {message && (
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-center text-xs text-purple-300 font-mono mb-4 animate-pulse">
            {message}
          </div>
        )}

        {/* Settings/Fields tabs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">Profile Handle</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. DapperMC"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">Studio Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@studio.com"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-2">Avatar Colorway</label>
            <div className="flex gap-2.5">
              {AVATAR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAvatar(color)}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${color} border flex items-center justify-center transition-all ${
                    avatar === color ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                >
                  {avatar === color && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {profile.signedIn && (
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 mb-2.5 border-b border-white/5 pb-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] tracking-widest font-mono text-zinc-400 uppercase font-bold">Studio Performance Statistics</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                  <span className="block text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Tempo Mods</span>
                  <span className="font-bold text-zinc-200 text-sm">{profile.stats.bpmCount}</span>
                </div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                  <span className="block text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Bar Edits</span>
                  <span className="font-bold text-zinc-200 text-sm">{profile.stats.barsGenerated}</span>
                </div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                  <span className="block text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Renders</span>
                  <span className="font-bold text-zinc-200 text-sm">{profile.stats.videoRenders}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              onClick={handleToggleAuth}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 border transition-all ${
                profile.signedIn 
                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
                  : "bg-purple-600 border-purple-500 text-white hover:bg-purple-500 shadow-md shadow-purple-950/20"
              }`}
            >
              {profile.signedIn ? (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  Logout Session
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  Lock In Account
                </>
              )}
            </button>
            {profile.signedIn && (
              <button
                onClick={handleSave}
                className="flex-1 py-2 px-3 bg-white text-black hover:bg-zinc-100 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 tracking-wide"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Sync Updates
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
