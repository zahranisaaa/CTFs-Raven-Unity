// ============================
// ContributorsMarquee.tsx
// ============================
import { useEffect, useRef } from "react";
import { useState } from "react";

// Daftar contributor
const CONTRIBUTORS = [
  "@Rev3x1n",
  "@mayleneee01",
  "@Kapten_Joy",
];

// Bersihkan @
const cleanedContributors = CONTRIBUTORS.map(u => u.replace("@", ""));

// Ulang sampai minimal panjang
function fillContributors(list: string[], minLength = 14) {
  if (list.length === 0) return [];
  const result: string[] = [];
  let i = 0;
  while (result.length < minLength) {
    result.push(list[i % list.length]);
    i++;
  }
  return result;
}

const filledContributors = fillContributors(cleanedContributors, 14);

// ============================
// ProfileAvatar Aman
// ============================
function ProfileAvatar({ username, size = 36 }: { username: string; size?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const url = `https://github.com/${username}.png`;

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setErrored(false);
    const img = new Image();
    img.src = url;
    img.onload = () => { if (!cancelled) setLoaded(true); }
    img.onerror = () => { if (!cancelled) setErrored(true); }
    return () => { cancelled = true; }
  }, [url]);

  const sizeClass = `w-[${size}px] h-[${size}px] rounded-full`;

  if (errored) {
    return (
      <div className={`${sizeClass} bg-gray-500 flex items-center justify-center text-white text-sm font-bold`}>
        ?
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`${username} avatar`}
      className={`${sizeClass} grayscale group-hover:grayscale-0 transition-opacity duration-200`}
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}

// ============================
// Marquee Row Component
// ============================
function MarqueeRow({ contributors, reverse = false }: { contributors: string[], reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let offset = 0;
    const speed = 0.5; // pixels per frame
    const animate = () => {
      offset = (offset + speed) % el.scrollWidth;
      el.style.transform = `translateX(${reverse ? offset : -offset}px)`;
      requestAnimationFrame(animate);
    };
    animate();
  }, [reverse]);

  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-4" ref={trackRef}>
        {[...contributors, ...contributors].map((username, i) => (
          <div key={`marquee-${username}-${i}`} className="flex items-center gap-2 shrink-0">
            <ProfileAvatar username={username} />
            <span className="text-xs font-mono text-gray-300">{username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================
// ContributorsMarquee
// ============================
export default function ContributorsMarquee() {
  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <MarqueeRow contributors={filledContributors} reverse={false} />
      <MarqueeRow contributors={filledContributors} reverse={true} />
    </div>
  );
}
