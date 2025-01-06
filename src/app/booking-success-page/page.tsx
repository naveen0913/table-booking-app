/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './booking-success.module.css';

interface BookingData {
  // bookingId: string;
  // userId: string;
  // tableId: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  contact: string;
  updatedAt: string;
  createdAt: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    }
  }, []);

  return (
    <div className={styles.main}>
      <img className={styles.img} src="/success-logo.png" alt="Booking Success" />
      <h3 className={styles.heading}>Table Booking Successful</h3>

      {bookingData ? (
        <div className={styles.details}>
          {/* <p><strong>Booking ID:</strong> {bookingData.bookingId}</p> */}
          <p><strong>Name : </strong> {bookingData.name}</p>
          <p><strong>Contact : </strong> {bookingData.contact}</p>
          <p><strong>Date : </strong> {bookingData.date}</p>
          <p><strong>Time : </strong> {bookingData.time}</p>
          <p><strong>Guests : </strong> {bookingData.guests}</p>
          {/* <p><strong>Table ID:</strong> {bookingData.tableId}</p> */}
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}

      <div className={styles.div}>
        <button onClick={() => router.push('/bookings')} className={styles.booking}>My Bookings</button>
        <button onClick={() => router.push('/')} className={styles.button}>Home Page</button>
      </div>
    </div>
  );
};

export default SuccessPage;

