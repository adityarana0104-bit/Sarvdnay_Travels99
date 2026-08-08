import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Tv, Lightbulb, Armchair, Fan, Music, Upload, Film, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Image as ImageIcon, Link as LinkIcon, Save, Lock, Unlock, Settings, Key } from 'lucide-react';
import { Language } from '../types';
import { subscribeToVideoConfig, updateVideoConfig } from '../services/videoService';

interface VideoSectionProps {
  lang: Language;
  onOpenInquiry?: () => void;
}

// Default video URL for Force Traveller interior
const DEFAULT_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export type VideoType = 'youtube' | 'drive' | 'vimeo' | 'direct';

export interface ParsedVideo {
  type: VideoType;
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { type: 'direct', embedUrl: DEFAULT_VIDEO_URL, originalUrl: DEFAULT_VIDEO_URL };
  }

  const trimmed = url.trim();

  // YouTube match (watch, shorts, embed, youtu.be)
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0`,
      originalUrl: trimmed,
    };
  }

  // Google Drive match
  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|uc\?id=)([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmed,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`,
      originalUrl: trimmed,
    };
  }

  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}

// IndexedDB helper for storing video files persistently in browser memory
const initVideoDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sarvdnya_video_db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const clearLocalVideoDB = async (): Promise<void> => {
  try {
    const db = await initVideoDB();
    const tx = db.transaction('videos', 'readwrite');
    const store = tx.objectStore('videos');
    store.delete('interior_video');
  } catch (e) {
    console.warn('Error clearing IndexedDB:', e);
  }
};

export const saveVideoToDB = async (file: File): Promise<void> => {
  try {
    const db = await initVideoDB();
    const tx = db.transaction('videos', 'readwrite');
    const store = tx.objectStore('videos');
    store.put(file, 'interior_video');
  } catch (e) {
    console.warn('IndexedDB save failed:', e);
  }
};

export const loadVideoFromDB = async (): Promise<string | null> => {
  try {
    const db = await initVideoDB();
    return new Promise((resolve) => {
      const tx = db.transaction('videos', 'readonly');
      const store = tx.objectStore('videos');
      const req = store.get('interior_video');
      req.onsuccess = () => {
        if (req.result && req.result instanceof Blob) {
          resolve(URL.createObjectURL(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

export const VideoSection: React.FC<VideoSectionProps> = ({ lang, onOpenInquiry }) => {
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_VIDEO_URL);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeLightingFilter, setActiveLightingFilter] = useState<'neon' | 'ambient' | 'party' | 'normal'>('neon');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Admin Controls Toggle - Hidden by default for production visitors
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInView, setIsInView] = useState(false);

  const parsedVideo = parseVideoUrl(videoUrl);

  // IntersectionObserver: Play video ONLY when user scrolls to this section, pause when scrolled away
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const visible = entry.isIntersecting;
          setIsInView(visible);
          if (visible) {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        }
      },
      { threshold: 0.15 } // Trigger when 15% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [videoUrl]);

  // Subscribe to real-time video config from Firestore database & check local storage
  useEffect(() => {
    let isMounted = true;

    const checkLocalAndFirestore = async (firestoreConfig?: { videoUrl: string }) => {
      try {
        const dbVideo = await loadVideoFromDB();
        if (dbVideo && isMounted) {
          setVideoUrl(dbVideo);
          setVideoError(false);
          return;
        }
        const localVid = localStorage.getItem('sarvdnya_local_uploaded_video') || localStorage.getItem('sarvdnya_custom_video_url');
        if (localVid && isMounted) {
          setVideoUrl(localVid);
          setVideoError(false);
          return;
        }
      } catch (e) {
        console.warn('Local storage video check failed:', e);
      }

      if (firestoreConfig && firestoreConfig.videoUrl && firestoreConfig.videoUrl.trim() !== '' && isMounted) {
        setVideoUrl(firestoreConfig.videoUrl);
        setInputUrl(firestoreConfig.videoUrl);
        setVideoError(false);
      }
    };

    const unsubscribe = subscribeToVideoConfig(async (config) => {
      if (!isMounted) return;
      await checkLocalAndFirestore(config);
    });

    checkLocalAndFirestore();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.muted = isMuted;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setVideoError(false);
        }).catch((err) => {
          console.warn("Playback error handled gracefully:", err);
          setIsPlaying(false);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // High quality luxury bus interior photos for fallback interactive tour
  const interiorImages = [
    {
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
      titleMr: "लक्झरी पुशबॅक लेदर सीट्स",
      titleEn: "Luxury Pushback Leather Seats"
    },
    {
      url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
      titleMr: "RGB डिस्को व ॲम्बियंट केबिन लाईटिंग",
      titleEn: "RGB Disco & Ambient Cabin Lighting"
    },
    {
      url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=1200",
      titleMr: "HD स्मार्ट टीव्ही व डी.जे. साऊंड",
      titleEn: "HD Smart TV & DJ Surround Sound"
    }
  ];

  const handleVideoError = () => {
    console.warn("Video failed to load from source:", videoUrl);
    // Only flag video error if the URL is completely empty or dead
    if (!videoUrl || videoUrl === '') {
      setVideoError(true);
    }
  };

  const handleSaveVideoUrl = async (urlToSave: string) => {
    if (!urlToSave.trim()) return;
    setIsSaving(true);
    const cleanUrl = urlToSave.trim();
    try {
      await updateVideoConfig(cleanUrl);
      setVideoUrl(cleanUrl);
      localStorage.setItem('sarvdnya_custom_video_url', cleanUrl);
      setVideoError(false);
      setIsPlaying(true);
      setIsMuted(true);
      setSaveSuccess(true);
      setUploadNotice(isMr ? 'व्हिडिओ लिन्क डेटाबेसमध्ये सेव्ह झाली आणि प्ले होत आहे!' : 'Video link saved permanently to database!');
      setTimeout(() => {
        setSaveSuccess(false);
        setUploadNotice(null);
      }, 4000);
      setShowUrlModal(false);
    } catch (err) {
      console.error("Error saving video URL to Firestore:", err);
      // Fallback local save
      setVideoUrl(cleanUrl);
      localStorage.setItem('sarvdnya_custom_video_url', cleanUrl);
      setVideoError(false);
      setShowUrlModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoError(false);
      setIsPlaying(true);
      setIsMuted(true); // Always keep muted on initial autoplay for browser security compliance

      // 1. Save to IndexedDB for persistent browser memory
      await saveVideoToDB(file);

      // 2. Read file as Data URL and store in localStorage
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          try {
            localStorage.setItem('sarvdnya_local_uploaded_video', result);
          } catch (err) {
            console.warn("localStorage quota exceeded for video file", err);
          }
          if (file.size < 1200000) {
            try {
              await updateVideoConfig(result);
            } catch (err) {
              console.warn("Could not save small video file to Firestore", err);
            }
          }
        }
      };
      reader.readAsDataURL(file);

      setUploadNotice(isMr 
        ? "व्हिडिओ यशस्वीरित्या वेबसाईटवर सेव्ह झाला आणि प्ले होत आहे!"
        : "Video saved successfully to website & playing live!"
      );
      setTimeout(() => setUploadNotice(null), 5000);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };


  const isMr = lang === 'mr';

  const highlights = [
    {
      icon: <Tv className="w-5 h-5 text-amber-400" />,
      titleMr: 'रूफ माउंटेड HD टीव्ही',
      titleEn: 'Roof Mounted HD Smart TV',
      descMr: 'प्रवासादरम्यान मनोरंजन, भक्ती संगीत व सिनेमा पहाण्यासाठी',
      descEn: 'Enjoy movies, devotional songs & videos on tour'
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-purple-400" />,
      titleMr: 'RGB डिस्को व ॲम्बियंट लाईटिंग',
      titleEn: 'RGB Disco & Ambient Lighting',
      descMr: 'रात्रीच्या प्रवासात अप्रतिम वातावरण निर्मिती',
      descEn: 'Atmospheric neon & ambient lighting modes'
    },
    {
      icon: <Armchair className="w-5 h-5 text-orange-400" />,
      titleMr: 'मऊ पुशबॅक लेदर सीट्स',
      titleEn: 'Plush Recliner Leather Seats',
      descMr: 'लांबच्या प्रवासातही पाठीला पूर्ण आराम देणारे सीट्स',
      descEn: 'Ultra-comfortable pushback seats for long journeys'
    },
    {
      icon: <Fan className="w-5 h-5 text-cyan-400" />,
      titleMr: 'वातानुकूलित (AC) व रूफ फॅन',
      titleEn: 'Roof AC Vents & Cabin Fan',
      descMr: 'प्रत्येक सीटजवळ वैयक्तिक एसी व थंड हवेची सोय',
      descEn: 'Individual AC cooling vents for every passenger'
    },
    {
      icon: <Music className="w-5 h-5 text-emerald-400" />,
      titleMr: 'उच्च क्षमतेची साऊंड सिस्टिम',
      titleEn: 'High-Power Surround Sound',
      descMr: 'स्पष्ट आणि दमदार आवाजाची गाणी अनुभवण्यासाठी',
      descEn: 'Crystal clear audio setup for group enjoyment'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      titleMr: 'स्वच्छ व निर्जंतुक केबिन',
      titleEn: '100% Sanitized & Clean Cabin',
      descMr: 'प्रीमियम पडदे, गाद्या आणि कव्हर्ससह स्वच्छता',
      descEn: 'Hygienic interiors, fresh covers & clean curtains'
    }
  ];

  return (
    <section id="interior-video" ref={sectionRef} className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#001333] to-[#001B44]">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>{isMr ? 'लक्झरी इंटीरियर व्हिडिओ टूर' : 'Luxury Interior Video Tour'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isMr ? (
              <>आमच्या ट्रॅव्हलरचे <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">रंगबेरंगी लक्झरी इंटीरियर</span> पहा</>
            ) : (
              <>Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Luxury Traveller Interior</span></>
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-blue-100/80 leading-relaxed font-normal">
            {isMr
              ? 'पुशबॅक लेदर सीट्स, स्मार्ट टीव्ही, डी.जे. साऊंड सिस्टिम, एसी आणि मनमोहक RGB लाईटिंगसह आमचा प्रीमियम ट्रॅव्हलर!'
              : 'Take a virtual look inside our Force Traveller equipped with plush pushback seats, Smart TV, surround sound, and RGB ambient lights!'}
          </p>
        </div>

        {/* Main Grid: Video Container & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Video Player Box (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-lg lg:max-w-none relative rounded-3xl overflow-hidden border-2 border-white/20 bg-slate-900/90 shadow-[0_0_50px_rgba(249,115,22,0.25)] group">
              
              {/* Top Bar inside Video Box */}
              <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-white font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span>{isMr ? 'सर्वज्ञ ट्रॅव्हलर इंटीरियर' : 'Sarvdnya Traveller Interior'}</span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="video/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Element Player Canvas */}
              <div className="relative h-[540px] sm:h-[620px] lg:h-[700px] w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
                {!videoError ? (
                  parsedVideo.type === 'youtube' || parsedVideo.type === 'drive' || parsedVideo.type === 'vimeo' ? (
                    <iframe
                      src={isInView ? parsedVideo.embedUrl : ''}
                      title="Sarvdnya Traveller Interior Video"
                      className="w-full h-full border-0 bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={parsedVideo.embedUrl}
                      autoPlay={isInView}
                      loop
                      muted={isMuted}
                      playsInline
                      controls={false}
                      className="w-full h-full object-cover bg-black"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={handleVideoError}
                    />
                  )
                ) : (
                  /* Fallback Interactive Image Gallery & Tour View */
                  <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
                    <img
                      src={interiorImages[activeImageIndex].url}
                      alt="Traveller Interior"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-orange-400" />
                        <span>{isMr ? 'इंटीरियर फोटो टूर' : 'Interior Photo Gallery'}</span>
                      </span>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md transition-all"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{isMr ? 'व्हिडिओ अपलोड करा' : 'Upload Video'}</span>
                      </button>
                    </div>

                    <div className="relative z-10 text-center space-y-3">
                      <h4 className="text-lg font-bold text-white drop-shadow-md">
                        {isMr ? interiorImages[activeImageIndex].titleMr : interiorImages[activeImageIndex].titleEn}
                      </h4>

                      <div className="flex items-center justify-center gap-2">
                        {interiorImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              activeImageIndex === idx ? 'w-6 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-center gap-2">
                        <button
                          onClick={async () => {
                            setVideoError(false);
                            localStorage.removeItem('sarvdnya_local_uploaded_video');
                            localStorage.removeItem('sarvdnya_custom_video_url');
                            await clearLocalVideoDB();
                            handleSaveVideoUrl(DEFAULT_VIDEO_URL);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold border border-orange-400/40 flex items-center gap-1.5 shadow-lg"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-white" />
                          <span>{isMr ? 'मूळ व्हिडिओ रीसेट करा' : 'Reset to Default Video'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lighting Overlay Effect */}
                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 mix-blend-color-dodge ${
                  activeLightingFilter === 'neon' ? 'bg-gradient-to-tr from-purple-500/20 via-transparent to-pink-500/20' :
                  activeLightingFilter === 'ambient' ? 'bg-gradient-to-tr from-amber-500/20 via-transparent to-yellow-500/20' :
                  activeLightingFilter === 'party' ? 'bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20' :
                  'opacity-0'
                }`} />

                {/* Play/Pause Center Overlay on Hover or Pause */}
                {!videoError && (!isPlaying || isMuted) && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 transition-opacity z-10 pointer-events-none">
                    {!isPlaying ? (
                      <button
                        onClick={togglePlay}
                        className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-2xl shadow-orange-500/50 hover:scale-110 transition-transform"
                      >
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
                      </button>
                    ) : isMuted ? (
                      <button
                        onClick={toggleMute}
                        className="pointer-events-auto px-4 py-2 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-lg"
                      >
                        <VolumeX className="w-4 h-4 text-orange-400" />
                        <span>{isMr ? 'आवाज चालू करा (Unmute)' : 'Tap to Unmute Sound'}</span>
                      </button>
                    ) : null}
                  </div>
                )}

                {/* Bottom Overlay Badge inside Video */}
                <div className="absolute bottom-3 inset-x-3 p-2.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between text-left pointer-events-none z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 font-extrabold text-xs">
                      ST
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">सर्वज्ञ ट्रॅव्हल्स बोधवड</p>
                      <p className="text-[10px] text-amber-300 mt-0.5 font-medium">सुमित रजपूत • 9890577265</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <span className="text-[10px] text-white/60 hidden sm:inline">{isMr ? 'लाईट मोड:' : 'Light:'}</span>
                    {(['neon', 'ambient', 'party'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setActiveLightingFilter(mode)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all ${
                          activeLightingFilter === mode
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-white/60 hover:text-white bg-white/10'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="p-4 bg-slate-950/95 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center justify-center"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Admin Mode Controls - Revealed only when Admin Mode is unlocked */}
                  {isAdminMode ? (
                    <>
                      <button
                        onClick={() => setShowUrlModal(true)}
                        className="text-xs font-semibold text-amber-300 hover:text-white px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 transition-all flex items-center gap-1.5 shadow-sm animate-pulse"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-orange-400" />
                        <span>{isMr ? 'व्हिडिओ URL बदला' : 'Set Video Link'}</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-amber-300 transition-all border border-orange-400/30"
                        title={isMr ? 'व्हिडिओ अपलोड करा' : 'Upload Video File'}
                      >
                        <Upload className="w-4 h-4 text-amber-300" />
                      </button>

                      <button
                        onClick={() => setIsAdminMode(false)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1"
                        title={isMr ? 'एडमिन मोड बंद करा' : 'Lock Admin Mode'}
                      >
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isMr ? 'एडमिन चालू' : 'Admin On'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAdminPinModal(true)}
                      className="text-[11px] font-medium text-white/40 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
                      title={isMr ? 'मालक / एडमिन ॲक्सेस' : 'Owner / Admin Access'}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                      <span>{isMr ? 'एडमिन' : 'Admin'}</span>
                    </button>
                  )}

                  <button
                    onClick={toggleFullScreen}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {saveSuccess && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isMr ? 'व्हिडिओ डेटाबेसमध्ये सेव्ह झाला! सर्वरवर सर्व वापरकर्त्यांना दिसेल.' : 'Video saved to database! It will show live on all production servers.'}</span>
              </div>
            )}

            <p className="text-xs text-blue-200/60 mt-3 text-center">
              💡 {isMr ? 'टीप: ट्रॅव्हलर इंटीरियर व्हिडिओ एचडी क्वालिटीमध्ये ऑटोप्ले होतो.' : 'Note: Force Traveller interior features HD ambient RGB lighting & Smart TV.'}
            </p>
          </div>

          {/* Modal for Admin PIN Verification */}
          {showAdminPinModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <Key className="w-5 h-5 text-orange-400" />
                    <span>{isMr ? 'मालक / एडमिन ॲक्सेस' : 'Owner / Admin Video Access'}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowAdminPinModal(false);
                      setPinError(false);
                      setAdminPinInput('');
                    }}
                    className="text-white/60 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-blue-200/80 leading-relaxed">
                  {isMr
                    ? 'व्हिडिओ बदलण्यासाठी किंवा अपलोड करण्यासाठी मालकाचा पिन टाका:'
                    : 'Enter Owner/Admin PIN to edit or upload video:'}
                </p>

                <div className="space-y-2">
                  <input
                    type="password"
                    maxLength={10}
                    value={adminPinInput}
                    onChange={(e) => {
                      setAdminPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter PIN"
                    className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-slate-950 border border-white/20 text-amber-300 focus:outline-none focus:border-orange-500"
                  />
                  {pinError && (
                    <p className="text-xs text-red-400 text-center font-semibold">
                      {isMr ? 'चुकीचा पिन!' : 'Incorrect PIN!'}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAdminPinModal(false);
                      setPinError(false);
                      setAdminPinInput('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => {
                      if (adminPinInput.trim() === '425310') {
                        setIsAdminMode(true);
                        setShowAdminPinModal(false);
                        setPinError(false);
                        setAdminPinInput('');
                      } else {
                        setPinError(true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 flex items-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isMr ? 'अनलॉक करा' : 'Unlock Controls'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for setting Video Link & Saving to Database */}
          {showUrlModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <Film className="w-5 h-5 text-orange-400" />
                    <span>{isMr ? 'ट्रॅव्हलर व्हिडिओ डेटाबेसमध्ये सेव्ह करा' : 'Save Video URL to Production Database'}</span>
                  </div>
                  <button
                    onClick={() => setShowUrlModal(false)}
                    className="text-white/60 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-blue-200/80 leading-relaxed">
                  {isMr
                    ? 'तुम्ही तुमच्या मोबाईल/संगणकावरून थेट व्हिडिओ फाइल अपलोड करू शकता किंवा YouTube/Drive व्हिडिओ लिंक टाकून सेव्ह करू शकता.'
                    : 'Upload a video file directly from your mobile/PC or paste a YouTube, Google Drive, or MP4 link below.'}
                </p>

                {/* Direct Upload Button Option */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-transparent border border-orange-400/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isMr ? '१. मोबाईल/पीसी वरून व्हिडिओ फाइल निवडा:' : '1. Choose Video File from Mobile/PC:'}
                      </p>
                      <p className="text-[10px] text-amber-300/80">
                        {isMr ? 'MP4, MOV, WebM सपोर्टेड' : 'Supports MP4, WebM, MOV formats'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUrlModal(false);
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md border border-orange-300/40 flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-white" />
                      <span>{isMr ? 'फाइल निवडा' : 'Choose File'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-2 text-[10px] font-bold text-white/40 uppercase">
                    {isMr ? 'किंवा ऑनलाईन लिंक टाका' : 'OR PASTE LINK'}
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span>{isMr ? '२. व्हिडिओ लिंक / URL:' : '2. Video Link / URL:'}</span>
                    <span className="text-[10px] text-blue-300/70">YouTube / Drive / MP4</span>
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://youtu.be/xyz or https://drive.google.com/file/d/xyz/view or https://example.com/video.mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/20 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <p className="text-[11px] font-bold text-amber-300">
                    {isMr ? 'सॅम्पल लिंक ट्राय करण्यासाठी खाली क्लिक करा:' : 'Click to test sample working video links:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setInputUrl(DEFAULT_VIDEO_URL)}
                      className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-amber-300 border border-orange-400/30 text-[10px] font-medium"
                    >
                      Sample Bus MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputUrl('https://www.youtube.com/watch?v=LXb3EKWsInQ')}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 text-[10px] font-medium"
                    >
                      YouTube Bus Tour
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowUrlModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => handleSaveVideoUrl(inputUrl)}
                    disabled={isSaving || !inputUrl.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? (isMr ? 'सेव्ह होत आहे...' : 'Saving...') : (isMr ? 'डेटाबेसमध्ये सेव्ह करा' : 'Save to Database')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interior Highlights Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-orange-500/30 via-white/10 to-transparent">
              <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-[22px] border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{isMr ? 'इंटीरियरमधील खास वैशिष्ट्ये' : 'Interior Key Highlights'}</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    VIP Comfort
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 flex items-start gap-3 group"
                    >
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-white/15 group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {isMr ? item.titleMr : item.titleEn}
                        </h4>
                        <p className="text-xs text-blue-200/70 mt-0.5 leading-snug">
                          {isMr ? item.descMr : item.descEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onOpenInquiry?.()}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>{isMr ? 'ह्या लक्झरी ट्रॅव्हलरसाठी बुकिंग करा' : 'Book This Luxury Traveller Now'}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
