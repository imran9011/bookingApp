import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  async function verifyUser() {
    if (!user) {
      try {
        const { data } = await axios.get("/api/user/profile", { withCredentials: true });
        return data;
      } catch (error) {
        throw error;
      }
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      const data = await verifyUser();
      setUser(data);
      setReady(true);
    }
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready, setReady, verifyUser }}>
      <>{children}</>
    </UserContext.Provider>
  );
}
