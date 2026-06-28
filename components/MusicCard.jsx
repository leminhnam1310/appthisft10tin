"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { songs } from "@/components/data/songs";

const DEFAULT_COVER = "/music/default-cover.jpg";

export default function MusicCard() {
  //--------------------------------------------------
  // STATE
  //--------------------------------------------------

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

  //--------------------------------------------------
  // SAFE CURRENT SONG (FIX CRASH)
  //--------------------------------------------------

  const currentSong = useMemo(() => {
    return songs[currentIndex] || songs[0];
  }, [currentIndex]);

  //--------------------------------------------------
  // FILTER SONGS
  //--------------------------------------------------

  const filteredSongs = useMemo(() => {
    const keyword = search.toLowerCase();

    return songs.filter((song) => {
      return (
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  //--------------------------------------------------
  // FORMAT TIME
  //--------------------------------------------------

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";

    const minute = Math.floor(sec / 60);
    const second = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");

    return `${minute}:${second}`;
  };

  //--------------------------------------------------
  // LIKE TOGGLE
  //--------------------------------------------------

  const toggleLike = (title) => {
    setLiked((prev) =>
      prev.includes(title)
        ? prev.filter((x) => x !== title)
        : [...prev, title]
    );
  };

  //--------------------------------------------------
  // AUDIO EVENTS
  //--------------------------------------------------

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
  }, [currentIndex, volume]);

  //--------------------------------------------------
  // PLAY / PAUSE SAFE FIX
  //--------------------------------------------------

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing, currentIndex]);

  //--------------------------------------------------
  // VOLUME SYNC FIX
  //--------------------------------------------------

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
    <div className="relative overflow-hidden rounded-[32px] glass p-6 shadow-2xl">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-violet-500/10 via-pink-500/5 to-cyan-500/10" />

      {/* HEADER */}
      <div className="relative">
        <h2 className="text-2xl font-bold">🎵 Góc Chill</h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Âm nhạc giúp tâm trí thư giãn hơn 🌱
        </p>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm bài hát..."
          className="mt-5 w-full rounded-2xl bg-white/60 dark:bg-slate-800 px-4 py-3 outline-none backdrop-blur border border-white/30"
        />
      </div>

      {/* PLAYLIST */}
      <div className="relative mt-6 space-y-3 max-h-[330px] overflow-y-auto pr-1">

        {filteredSongs.map((song) => {
          const active = song.url === currentSong.url;

          return (
            <div
              key={song.url}
              onClick={() => {
                const realIndex = songs.findIndex(
                  (s) => s.url === song.url
                );

                setCurrentIndex(realIndex);
                setPlaying(true);
              }}
              className={`
w-full flex items-center gap-4 rounded-3xl p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer

${
  active
    ? "bg-violet-500/20 border border-violet-400"
    : "bg-white/20 hover:bg-white/30"
}
`}
            >
              {/* COVER */}
              <img
                src={song.cover || DEFAULT_COVER}
                className="w-14 h-14 rounded-2xl object-cover shadow"
              />

              {/* INFO */}
              <div className="flex-1 text-left">
                <div className="font-semibold">
                  {song.title}
                </div>

                <div className="text-xs text-slate-500">
                  {song.artist}
                </div>

                {song.mood && (
                  <div className="mt-1 text-[11px] text-violet-500">
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
                className="text-xl transition hover:scale-125"
              >
                {liked.includes(song.title) ? "❤️" : "🤍"}
              </button>
            </div>
          );
        })}
      </div>
            {/* NOW PLAYING */}
      <div className="mt-6 rounded-3xl bg-white/20 dark:bg-slate-800/40 p-4 backdrop-blur border border-white/30 shadow-lg">

        <div className="flex gap-4 items-center">

          {/* COVER */}
          <img
            src={
              currentSong?.cover || DEFAULT_COVER
            }
            className="w-16 h-16 rounded-2xl object-cover shadow"
          />

          {/* INFO */}
          <div className="flex-1">
            <div className="font-bold">
              {currentSong?.title}
            </div>

            <div className="text-xs text-slate-500">
              {currentSong?.artist}
            </div>

            <div className="text-[11px] text-violet-500 mt-1">
              🎧 Đang phát
            </div>
          </div>

          {/* LIKE */}
          <button
            onClick={() => toggleLike(currentSong?.title)}
            className="text-xl transition hover:scale-125"
          >
            {liked.includes(currentSong?.title) ? "❤️" : "🤍"}
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime || 0}
            onChange={(e) => {
              const time = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = time;
              }
              setCurrentTime(time);
            }}
            className="w-full accent-violet-500"
          />

          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between mt-5">

        {/* SHUFFLE */}
        <button
          onClick={() => setShuffle((v) => !v)}
          className={`text-lg transition ${
            shuffle ? "text-violet-500" : "text-slate-400"
          }`}
        >
          🔀
        </button>

        {/* PREV */}
        <button
          onClick={() => {
            setCurrentIndex((prev) =>
              (prev - 1 + songs.length) % songs.length
            );
            setPlaying(true);
          }}
          className="text-2xl hover:scale-110 transition"
        >
          ⏮
        </button>

        {/* PLAY / PAUSE */}
        <button
          onClick={() => setPlaying((v) => !v)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-2xl shadow-xl hover:scale-110 active:scale-95 transition"
        >
          {playing ? "⏸" : "▶"}
        </button>

        {/* NEXT */}
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
            setPlaying(true);
          }}
          className="text-2xl hover:scale-110 transition"
        >
          ⏭
        </button>

        {/* REPEAT */}
        <button
          onClick={() => setRepeat((v) => !v)}
          className={`text-lg transition ${
            repeat ? "text-violet-500" : "text-slate-400"
          }`}
        >
          🔁
        </button>
      </div>

      {/* VOLUME */}
      <div className="mt-5">
        <div className="text-xs text-slate-500 mb-1">
          🔊 Âm lượng
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            if (audioRef.current) {
              audioRef.current.volume = v;
            }
          }}
          className="w-full accent-violet-500"
        />
      </div>

      {/* FOOTER */}
      <div className="mt-5 text-center text-xs text-slate-400">
        🌿 Âm nhạc là nơi tâm trí nghỉ ngơi
      </div>

      {/* HIDDEN AUDIO */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onEnded={() => {
          if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
          }

          if (shuffle) {
            const random = Math.floor(Math.random() * songs.length);
            setCurrentIndex(random);
            setPlaying(true);
            return;
          }

          setCurrentIndex((prev) => (prev + 1) % songs.length);
          setPlaying(true);
        }}
      />
    </div>
  );
}