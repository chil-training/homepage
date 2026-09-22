import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase_config";

export const AuthContext = createContext({
  user: null,
  userMeta: null,
  setUser: () => {},
  setUserMeta: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userMeta, setUserMeta] = useState(null);

  useEffect(() => {
    if (!auth || !db) return undefined;

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserMeta(null);

      if (currentUser) {
        const userRecord = await getDoc(doc(db, "users", currentUser.uid));
        if (userRecord.exists()) setUserMeta(userRecord.data());
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userMeta, setUserMeta }}>
      {children}
    </AuthContext.Provider>
  );
}
