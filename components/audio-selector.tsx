"use client";

import { useState, useRef, useEffect } from "react";
import { MusicNote, Microphone, Stop, Play, Pause, Trash, X, SpotifyLogo } from "@phosphor-icons/react";

function toSpotifyEmbedUrl(input: string): string | null {
  const match = input.match(/track[/:]([a-zA-Z0-9]{22})/);
  if (!match) return null;
  const id = match[1];
  const urlMatch = input.match(/\?(.+)/);
  const params = urlMatch ? `?${urlMatch[1]}&utm_source=generator` : "?utm_source=generator";
  return `https://open.spotify.com/embed/track/${id}${params}`;
}

export function AudioSelector() {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<"record" | "spotify">("spotify");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {}
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const clearAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div>
      {/* Trigger */}
      {!audioUrl && !spotifyEmbedUrl ? (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          <MusicNote size={18} />
          Add audio
        </button>
      ) : spotifyEmbedUrl ? (
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
          <SpotifyLogo size={20} className="text-[#1DB954]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-700">Spotify track added</p>
            <p className="text-xs text-gray-400">Plays when visitors open the board</p>
          </div>
          <button onClick={() => setShowModal(true)} className="text-xs text-gray-400 hover:text-gray-600">Change</button>
          <button onClick={() => { setSpotifyEmbedUrl(null); setSpotifyLink(""); }} className="text-gray-400 hover:text-red-500"><Trash size={14} /></button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
          <audio ref={audioRef} src={audioUrl!} onEnded={() => setIsPlaying(false)} />
          <button onClick={togglePlayback} className="text-gray-700 hover:text-gray-900">
            {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-700">Voice message — {formatTime(recordingTime)}</p>
            <p className="text-xs text-gray-400">Plays when visitors open the board</p>
          </div>
          <button onClick={() => setShowModal(true)} className="text-xs text-gray-400 hover:text-gray-600">Change</button>
          <button onClick={clearAudio} className="text-gray-400 hover:text-red-500"><Trash size={14} /></button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (!isRecording) setShowModal(false); }} />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">Add Audio</h3>
              <button onClick={() => { if (!isRecording) setShowModal(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { if (!isRecording) setTab("spotify"); }}
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  tab === "spotify" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <SpotifyLogo size={16} />
                Spotify
              </button>
              <button
                onClick={() => { if (!isRecording) setTab("record"); }}
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  tab === "record" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Microphone size={16} />
                Voice Note
              </button>
            </div>

            <div className="px-6 py-8">
              {/* Spotify tab */}
              {tab === "spotify" && (
                <div className="flex flex-col items-center">
                  {spotifyEmbedUrl ? (
                    <>
                      <iframe
                        src={spotifyEmbedUrl!}
                        width="100%"
                        height="152"
                        style={{ borderRadius: 12, border: "none" }}
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                      <button
                        onClick={() => { setSpotifyEmbedUrl(null); setSpotifyLink(""); }}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600"
                      >
                        Change song
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="line-input-wrapper w-full border-b border-gray-200">
                        <input
                          type="text"
                          value={spotifyLink}
                          onChange={(e) => setSpotifyLink(e.target.value)}
                          placeholder="Paste Spotify link..."
                          className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const id = toSpotifyEmbedUrl(spotifyLink);
                              if (id) setSpotifyEmbedUrl(id);
                            }
                          }}
                        />
                      </div>
                      <p className="mt-2 self-start text-xs text-gray-300">
                        open.spotify.com/track/... or spotify:track:...
                      </p>
                      <button
                        onClick={() => {
                          const id = toSpotifyEmbedUrl(spotifyLink);
                          if (id) setSpotifyEmbedUrl(id);
                        }}
                        disabled={!spotifyLink}
                        className="mt-6 w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-30"
                      >
                        Add Song
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Record tab */}
              {tab === "record" && (
                <div className="flex flex-col items-center">
                  {audioUrl ? (
                    <div className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                      <button onClick={togglePlayback} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                        {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{formatTime(recordingTime)}</p>
                      </div>
                      <button onClick={clearAudio} className="text-sm text-gray-400 hover:text-gray-600">Re-record</button>
                    </div>
                  ) : (
                    <>
                      {isRecording && (
                        <p className="mb-4 text-2xl font-light tabular-nums text-gray-900">
                          {formatTime(recordingTime)}
                        </p>
                      )}
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex size-16 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                          isRecording ? "bg-red-500 text-white" : "bg-gray-900 text-white"
                        }`}
                      >
                        {isRecording ? <Stop size={22} weight="fill" /> : <Microphone size={24} weight="fill" />}
                      </button>
                      <p className="mt-4 text-xs text-gray-300">
                        {isRecording ? "Tap to stop" : "Tap to record a voice greeting"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {(audioUrl || spotifyEmbedUrl) && (
              <div className="border-t border-gray-100 px-6 py-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
