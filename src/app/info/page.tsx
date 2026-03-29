// Bersihkan username dan ulang sampai minimal panjang
const CONTRIBUTORS = [
  "@ariafatah0711",
  "@Rev3x1n",
  "@mayleneee01",
  "@Kapten_Joy",
];

// hapus @
const cleanedContributors = CONTRIBUTORS.map(u => u.replace("@", ""));

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

// ProfileAvatar versi aman
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

// Loop contributors
function ContributorsMarquee() {
  return (
    <div className="marquee-group relative w-full max-w-4xl overflow-hidden space-y-4">
      {/* Row 1 */}
      <div className="marquee marquee-left">
        <div className="marquee-track flex gap-2">
          {[...filledContributors, ...filledContributors].map((username, i) => (
            <a key={`top-${i}`} href={`https://github.com/${username}`} target="_blank" rel="noopener" className="flex items-center gap-2 shrink-0 group px-2">
              <ProfileAvatar username={username} />
              <span className="text-xs font-mono text-gray-300 group-hover:text-orange-400 transition">
                {username}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="marquee marquee-right">
        <div className="marquee-track flex gap-2">
          {[...filledContributors, ...filledContributors].map((username, i) => (
            <a key={`bot-${i}`} href={`https://github.com/${username}`} target="_blank" rel="noopener" className="flex items-center gap-2 shrink-0 group px-2">
              <ProfileAvatar username={username} />
              <span className="text-xs font-mono text-gray-300 group-hover:text-orange-400 transition">
                {username}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
