"use client";

import { Users } from "lucide-react";

const CONTRIBUTORS = ["@Rev3x1n", "@mayleneee01", "@joyakinanti"];

// =========================================
// Helpers
// =========================================
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

const filledContributors = fillContributors(CONTRIBUTORS, 14);

// =========================================
// ProfileAvatar
// =========================================
function ProfileAvatar({ username, size = 36 }: { username: string; size?: number }) {
  const url = `https://github.com/${username}.png`;

  return (
    <img
      src={url}
      alt={`${username} avatar`}
      width={size}
      height={size}
      className="rounded-full grayscale group-hover:grayscale-0 transition-opacity duration-500 ease-in-out object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://via.placeholder.com/36?text=?";
      }}
    />
  );
}

// =========================================
// MarqueeRow
// =========================================
function MarqueeRow({ contributors, reverse = false }: { contributors: string[]; reverse?: boolean }) {
  // Duplicate content for seamless scroll
  const duplicated = [...contributors, ...contributors];

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className={`flex gap-4 whitespace-nowrap animate-marquee ${
          reverse ? "animate-marquee-reverse" : ""
        }`}
      >
        {duplicated.map((name, i) => {
          const username = name.replace("@", "");
          return (
            <a
              key={i}
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 group px-2"
            >
              <ProfileAvatar username={username} size={36} />
              <span className="text-xs font-mono text-gray-300 group-hover:text-orange-400 transition">
                {username}
              </span>
            </a>
          );
        })}
      </div>

      {/* Tailwind marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-reverse {
          display: inline-flex;
          animation: marquee-reverse 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

// =========================================
// InfoPage
// =========================================
export default function InfoPage() {
  const repeatedContributors = [...filledContributors, ...filledContributors];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center p-6">
      <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Users size={20} /> Contributors
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-4xl">
        <MarqueeRow contributors={repeatedContributors} reverse={false} />
        <MarqueeRow contributors={repeatedContributors} reverse={true} />
      </div>
    </div>
  );
}
