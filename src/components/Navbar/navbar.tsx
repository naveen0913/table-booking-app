"use client";

import React, { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);

    const handleUserLogin = () => {
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogin);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.dispatchEvent(new Event("userLogout"));
    router.push("/");
  };

  return (
    <nav className={`${styles.navbar} ${isSticky ? styles.sticky : ""}`}>
      <div className={styles.navContent}>
        <span onClick={() => router.push("/")} className={styles.navName}>
          Table Reservation System
        </span>
        <div className={styles.navButtons}>
          {token ? (
            <>
              <button
                onClick={() => router.push("/bookings")}
                className={styles.booking}
              >
                My Bookings
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className={styles.loginButton}
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className={styles.signupButton}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
