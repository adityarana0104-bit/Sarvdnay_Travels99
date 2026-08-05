import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InquiryRecord, InquiryStatus } from '../types';

const INQUIRIES_COLLECTION = 'inquiries';

export async function createInquiry(data: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const newInquiry: Omit<InquiryRecord, 'id'> = {
    ...data,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), newInquiry);
  return docRef.id;
}

export function subscribeToInquiries(callback: (inquiries: InquiryRecord[]) => void): () => void {
  const q = query(
    collection(db, INQUIRIES_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: InquiryRecord[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<InquiryRecord, 'id'>),
      }));
      callback(items);
    },
    (error) => {
      console.error('Error listening to Firestore inquiries:', error);
      // Fallback: try without orderBy if index is missing
      const fallbackQuery = collection(db, INQUIRIES_COLLECTION);
      onSnapshot(fallbackQuery, (snapshot) => {
        const items: InquiryRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InquiryRecord, 'id'>),
        }));
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        callback(items);
      });
    }
  );
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteInquiryRecord(id: string): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
}
