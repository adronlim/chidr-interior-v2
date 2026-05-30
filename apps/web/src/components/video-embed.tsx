import { useState } from 'react';
import { Play } from 'lucide-react';

interface Props {
  url: string;
  title?: string;
}

const PATTERNS = [
  /youtu\.be\/([\w-]+)/,
  /youtube\.com\/watch\?v=([\w-]+)/,
  /youtube\.com\/embed\/([\w-]+)/,
  /youtube\.com\/v\/([\w-]+)/,
];

function parseYouTubeId(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  for (const pattern of PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoEmbed({ url, title = 'Project walkthrough' }: Props) {
  const [playing, setPlaying] = useState(false);

  // Guard: don't render anything for an empty / non-YouTube URL.
  const id = parseYouTubeId(url);
  if (!id) return null;

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${title}`}
        className="group relative block w-full aspect-video overflow-hidden bg-ink"
      >
        <img
          src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
          alt={title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          }}
          className="image-hover w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bone/95 text-ink shadow-lg group-hover:bg-bone transition">
            <Play size={28} className="ml-1" fill="currentColor" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="w-full aspect-video bg-ink">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
