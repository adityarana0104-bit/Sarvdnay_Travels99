import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const VIDEO_SETTINGS_DOC = 'settings/video_config';

export interface VideoConfig {
  videoUrl: string;
  title: string;
  updatedAt: string;
}

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  title: 'Sarvdnya Travels Bodwad Force Traveller Interior',
  updatedAt: new Date().toISOString(),
};

/**
 * Subscribe to video configuration changes from Firestore.
 */
export function subscribeToVideoConfig(callback: (config: VideoConfig) => void): () => void {
  const docRef = doc(db, 'settings', 'video_config');
  
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as VideoConfig);
      } else {
        callback(DEFAULT_VIDEO_CONFIG);
      }
    },
    (error) => {
      console.warn('Firestore video listener fallback:', error);
      callback(DEFAULT_VIDEO_CONFIG);
    }
  );
}

/**
 * Update video configuration in Firestore database.
 */
export async function updateVideoConfig(videoUrl: string, title?: string): Promise<void> {
  const docRef = doc(db, 'settings', 'video_config');
  const payload: VideoConfig = {
    videoUrl,
    title: title || 'Sarvdnya Travels Bodwad Force Traveller Interior',
    updatedAt: new Date().toISOString(),
  };
  
  await setDoc(docRef, payload, { merge: true });
}
