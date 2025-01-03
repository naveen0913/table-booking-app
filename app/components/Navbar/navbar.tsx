"use client";

import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/navigation'


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.navContent}>
        <span className={styles.navName}>Table Booking</span>
        <div className={styles.navButtons}>
          <button onClick={()=>router.push("/Login")} className={styles.loginButton}>Login</button>
          <button onClick={()=>router.push("/Signup")} className={styles.signupButton}>Signup</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
