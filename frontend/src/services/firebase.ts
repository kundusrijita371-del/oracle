import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs 
} from "firebase/firestore";
import { StudentProfile, Quest, CalendarBlock, Campaign } from "./api";

// Firebase Configuration from Vite environment or safe defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDfMxecXC17JenhrF-IyWjdUJqI0bFHRI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "liferpg-subham-539.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "liferpg-subham-539",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "liferpg-subham-539.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "218334252087",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:218334252087:web:4a1174ffe55694f97b43b2"
};

// Initialize Firebase singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ================= AUTHENTICATION HELPERS =================

export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  await initNewUserFirestoreData(cred.user.uid, email, displayName || email.split('@')[0]);
  return cred.user;
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  // Check if user already has a profile doc in Firestore, if not initialize
  const userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);
  if (!snap.exists()) {
    await initNewUserFirestoreData(user.uid, user.email || "", user.displayName || "Novice Scholar");
  }
  return user;
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ================= FIRESTORE STORE REPOSITORY =================

export async function fetchUserProfileFromFirestore(userId: string): Promise<StudentProfile | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (err) {
    console.warn("Firestore fetchUserProfile error:", err);
  }
  return null;
}

export async function saveUserProfileToFirestore(userId: string, profile: Partial<StudentProfile>): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUserProfile error:", err);
  }
}

export async function fetchUserQuestsFromFirestore(userId: string): Promise<Quest[]> {
  try {
    const questsCol = collection(db, "users", userId, "quests");
    const snap = await getDocs(questsCol);
    return snap.docs.map(d => d.data() as Quest);
  } catch (err) {
    console.warn("Firestore fetchUserQuests error:", err);
    return [];
  }
}

export async function saveUserQuestToFirestore(userId: string, quest: Quest): Promise<void> {
  try {
    const questDoc = doc(db, "users", userId, "quests", quest.id);
    await setDoc(questDoc, quest, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUserQuest error:", err);
  }
}

export async function fetchUserCampaignsFromFirestore(userId: string): Promise<Campaign[]> {
  try {
    const campCol = collection(db, "users", userId, "campaigns");
    const snap = await getDocs(campCol);
    return snap.docs.map(d => d.data() as Campaign);
  } catch (err) {
    console.warn("Firestore fetchUserCampaigns error:", err);
    return [];
  }
}

export async function fetchUserCalendarFromFirestore(userId: string): Promise<CalendarBlock[]> {
  try {
    const calCol = collection(db, "users", userId, "calendar");
    const snap = await getDocs(calCol);
    return snap.docs.map(d => d.data() as CalendarBlock);
  } catch (err) {
    console.warn("Firestore fetchUserCalendar error:", err);
    return [];
  }
}

// Initial seed provisioner for brand new accounts
export async function initNewUserFirestoreData(userId: string, email: string, name: string): Promise<void> {
  const initialProfile: StudentProfile = {
    id: userId,
    name: name || "Grand Scholar",
    email: email,
    bio: "Adventurer in the realm of knowledge. Seeking mastery across all domains.",
    title: "Novice Apprentice",
    rank: "F",
    level: 1,
    xp: 0,
    next_level_xp: 500,
    gold: 150,
    credit_points: 100,
    streak_days: 1,
    streak_shield_active: false,
    dda_mode: "Dynamic Flow (Active)",
    rolling_mastery: 85.0,
    diagnostic_accuracy: 88,
    total_study_minutes: 0,
    quests_completed_count: 0,
    active_campaign_id: "camp-001",
    daily_available_hours: 4,
    exam_target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    character_class: "Chrono Mage",
    avatar_config: {
      hair_style: "layered",
      hair_color: "#6366f1",
      outfit_color: "#1e1b4b",
      skin_tone: "#ffd1a4",
      headphones: "cat-ears",
      accessory: "matrix-glasses",
      expression: "confident",
      mascot: "robot",
      background_aura: "aurora"
    },
    badges: [
      { id: "b1", name: "First Spark", icon: "Flame", desc: "Embark on the learning journey" },
      { id: "b2", name: "Scholar Novice", icon: "BookOpen", desc: "Completed initial registration" }
    ]
  };

  const initialCampaign: Campaign = {
    id: "camp-001",
    title: "Full-Stack AI Architecture & DSA Mastery",
    description: "Conquer advanced data structures, algorithms, and distributed systems architecture.",
    icon: "BrainCircuit",
    total_quests: 12,
    completed_quests: 2,
    target_date: initialProfile.exam_target_date,
    status: "active",
    category: "Computer Science"
  };

  const initialQuests: Quest[] = [
    {
      id: `q-${userId}-1`,
      campaign_id: "camp-001",
      title: "Two-Pointer Optimization Mastery",
      topic: "Algorithms",
      subtopic: "Two-Pointer Technique",
      difficulty: "Medium",
      xp_reward: 120,
      gold_reward: 35,
      estimated_minutes: 45,
      status: "in_progress",
      prerequisite_quest_ids: [],
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: "10:00 AM",
      is_remedial: false
    },
    {
      id: `q-${userId}-2`,
      campaign_id: "camp-001",
      title: "Consistent Hashing & Partitioning Ring",
      topic: "System Design",
      subtopic: "Consistent Hashing & Partitioning",
      difficulty: "Hard",
      xp_reward: 200,
      gold_reward: 60,
      estimated_minutes: 60,
      status: "pending",
      prerequisite_quest_ids: [`q-${userId}-1`],
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: "02:00 PM",
      is_remedial: false
    }
  ];

  await setDoc(doc(db, "users", userId), initialProfile);
  await setDoc(doc(db, "users", userId, "campaigns", initialCampaign.id), initialCampaign);
  for (const q of initialQuests) {
    await setDoc(doc(db, "users", userId, "quests", q.id), q);
  }
}
