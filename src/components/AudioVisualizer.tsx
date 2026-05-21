import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export function AudioVisualizer({ analyser, isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Clear with soft trails
      ctx.fillStyle = "rgba(10, 10, 12, 0.25)";
      ctx.fillRect(0, 0, width, height);

      if (!isPlaying || !analyser) {
        // Render idle wave
        ctx.beginPath();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.55)"; // Purple glow
        ctx.lineWidth = 2.5;
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.04 + Date.now() * 0.003) * 3;
          ctx.lineTo(i, y);
        }
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Render glowing audio bar spectrum
      const barWidth = (width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.85;

        // Custom pink to purple to orange gradient
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, "rgba(236, 72, 153, 0.2)");  // pink base
        gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.8)"); // vibrant purple glow
        gradient.addColorStop(1, "rgba(249, 115, 22, 1.0)");   // electric orange tip

        ctx.fillStyle = gradient;
        
        // Soft rounded top bars
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        // Reflection or top dots
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fillRect(x, height - barHeight - 2, barWidth - 2, 1.5);

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <div className="relative w-full h-11 bg-zinc-950 rounded-lg overflow-hidden border border-white/5 flex items-end">
      <canvas
        ref={canvasRef}
        width={380}
        height={44}
        className="w-full h-full block"
      />
      <div className="absolute top-2 left-3 flex items-center gap-1.5 pointer-events-none">
        <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-pink-500 animate-pulse animate-duration-700' : 'bg-zinc-650 bg-zinc-600'}`}></span>
        <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
          {isPlaying ? 'Beats Synthesizer Active' : 'Beats Synthesizer Standby'}
        </span>
      </div>
    </div>
  );
}
