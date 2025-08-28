// hooks/useUser.js
import { useState, useEffect } from "react";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("current_user") ||
      sessionStorage.getItem("current_user");

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        setUser(null);
      }
    }
  }, []);

  return user;
};

export default useUser;
