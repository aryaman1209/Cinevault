import React from "react";
import { X } from "lucide-react"; // cross icon

export default function PlayerModal({ open, onClose, youtubeUrl }) {
  if (!open) return null;

  // Convert YouTube link into embeddable form
  const embed =
    youtubeUrl && youtubeUrl.includes("youtube.com")
      ? youtubeUrl.replace("watch?v=", "embed/")
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative w-full max-w-5xl rounded-lg bg-black overflow-hidden shadow-lg">
        {/* ❌ Close Button (shifted away from YouTube overlay) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
        >
          <X size={22} />
        </button>

        {/* 🎬 Video Player */}
        <div className="relative pb-[56.25%]">
          {embed ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embed + "?autoplay=1&mute=1&controls=1"}
              title="Player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
              Trailer not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
