/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from 'next/navigation';
import styles from './booking-success.module.css';

const SuccessPage = () => {

    const router = useRouter();

  return (
    <div className={styles.main}>
      <img className={styles.img} src="/success-logo.png" alt="Booking Success"/>
      <h3 className={styles.heading}>Table Booking Successful</h3>
      <div className={styles.div}>
        <button onClick={()=>router.push('/bookings')} className={styles.button}>My Bookings</button>
        <button onClick={()=>router.push('/')} className={styles.button}>Home Page</button>
      </div>
    </div>
  );
};

export default SuccessPage;
