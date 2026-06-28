"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { songs } from "@/components/data/songs";

export default function MusicCard() {
  const audioRef = useRef(null);

  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const [liked, setLiked] = useState([]);
  const [volume, setVolume] = useState(1);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // CURRENT SONG
  const currentSong = useMemo(() => {
    return songs[currentIndex] || songs[0];
  }, [currentIndex]);

  // FILTER
  const filteredSongs = useMemo(() => {
    const key = search.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(key) ||
        s.artist.toLowerCase().includes(key)
    );
  }, [search]);

  // FORMAT TIME
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // LIKE
  const toggleLike = (title) => {
    setLiked((p) =>
      p.includes(title)
        ? p.filter((x) => x !== title)
        : [...p, title]
    );
  };

  // AUDIO EVENTS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const update = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  // PLAY / PAUSE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, currentIndex]);

  // VOLUME SYNC
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // NEXT / PREV
  const nextSong = () => {
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentIndex((p) => (p + 1) % songs.length);
    }
    setPlaying(true);
  };

  const prevSong = () => {
    setCurrentIndex((p) => (p - 1 + songs.length) % songs.length);
    setPlaying(true);
  };

  // UI
  return (
    <div className="relative overflow-hidden rounded-[32px] p-6 shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">🎵 Góc Chill</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm bài hát..."
          className="mt-4 w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800 outline-none"
        />
      </div>

      {/* LIST (NO IMAGE) */}
      <div className="mt-5 max-h-[320px] overflow-y-auto space-y-2 pr-1">

        {filteredSongs.map((song) => {
          const active = song.url === currentSong.url;

          return (
            <div
              key={song.url}
              onClick={() => {
                const i = songs.findIndex((s) => s.url === song.url);
                setCurrentIndex(i);
                setPlaying(true);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition
                ${active ? "bg-violet-500/20" : "hover:bg-white/20"}
              `}
            >
              {/* INFO ONLY */}
              <div>
                <div className="font-semibold text-sm">
                  {song.title}
                </div>

                <div className="text-xs opacity-60">
                  {song.artist}
                </div>

                {song.mood && (
                  <div className="text-[11px] text-violet-500 mt-1">
                    {song.mood}
                  </div>
                )}
              </div>

              {/* LIKE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(song.title);
                }}
                className="text-xl"
              >
                {liked.includes(song.title) ? "❤️" : "🤍"}
              </button>
            </div>
          );
        })}
      </div>

      {/* NOW PLAYING */}
      <div className="mt-6 p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30">

        <div className="flex justify-between items-center">

          <div>
            <div className="font-bold text-sm">
              {currentSong?.title}
            </div>

            <div className="text-xs opacity-60">
              {currentSong?.artist}
            </div>
          </div>

          <button
            onClick={() =>
              toggleLike(currentSong?.title)
            }
          >
            {liked.includes(currentSong?.title)
              ? "❤️"
              : "🤍"}
          </button>
        </div>

        {/* PROGRESS */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          onChange={(e) => {
            const t = Number(e.target.value);
            audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
          className="w-full mt-3 accent-violet-500"
        />

        <div className="flex justify-between text-xs mt-1 opacity-60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between items-center mt-5">

        <button onClick={() => setShuffle((v) => !v)}>
          🔀
        </button>

        <button onClick={prevSong}>⏮</button>

        <button
          onClick={() => setPlaying((v) => !v)}
          className="w-14 h-14 rounded-full bg-violet-500 text-white"
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button onClick={nextSong}>⏭</button>

        <button onClick={() => setRepeat((v) => !v)}>
          🔁
        </button>
      </div>

      {/* VOLUME */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-full mt-4 accent-violet-500"
      />

      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onEnded={() => {
          if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            nextSong();
          }
        }}
      />
    </div>
  );
}