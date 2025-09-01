import React from "react";

export default function PlayerModal({ open, onClose, youtubeUrl }) {
  if (!open) return null;

  // If youtubeUrl is a full youtube link, we embed.
  const embed = youtubeUrl && youtubeUrl.includes("youtube.com") ? youtubeUrl.replace("watch?v=", "embed/") : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-black overflow-hidden">
        <div className="relative pb-[56.25%]">
          {embed ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embed + "?autoplay=1&mute=1&controls=1"}
              title="Player"
              allow="autoplay; encrypted-media"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
              Trailer not available
            </div>
          )}
        </div>

        <div className="p-3 flex justify-end">
          <button onClick={onClose} className="text-sm text-zinc-300 hover:text-white">Close</button>
        </div>
      </div>
    </div>
  );
}
