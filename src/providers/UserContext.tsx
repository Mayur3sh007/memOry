import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';
import { setPersistence, browserLocalPersistence, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type UserContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  username: string | null;
  email: string | null;
  avatarURL: string | null;
  uid: string | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error: any) {
        console.error('Setting persistence error:', error.message);
      }
    };

    setAuthPersistence();

    const getUser = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUsername(userData.username || null);
            setEmail(userData.email || null);
            setAvatarURL(userData.avatarURL || null);
            setUid(currentUser.uid || null);
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error.message);
        }
      } else {
        router.push('/sign-up');
      }
    });

    return () => getUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, username, email, avatarURL, uid }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
