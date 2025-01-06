/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import styles from "./bookings.module.css";
import { useRouter } from "next/navigation";
import { constants } from "../../lib/constants";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserBookings = async () => {
      const userToken: unknown = localStorage.getItem("token");
      if (!userToken) {
        router.push("/Login");
        return;
      }

      try {
        const response = await fetch(
          `${constants.baseUrl}/booking/user/${userToken}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBookings(data.bookings);
        console.log("data",data.bookings);
        
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [router]);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const deleteBooking = async (bookingId: string, tableId: string) => {
    try {
      setLoading(true); // Showing loading during API call
      const response = await fetch(
        `${constants.baseUrl}/booking/${bookingId}/${tableId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      // Removing the booking data from UI
      setBookings((prevBookings) =>
        prevBookings.filter((booking: any) => booking.bookingId !== bookingId)
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={styles.container}>
  <p className={styles.back} onClick={() => router.push("/")}>
    Back to home
  </p>
  <div className={styles.grid}>
    {bookings.length > 0 ? (
      bookings.map((booking: any, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.name}>{booking.name}</h2>
            <div className={styles.bookingInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>{booking.date}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Time:</span>
                <span className={styles.value}>{booking.time}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Guests:</span>
                <span className={styles.value}>{booking.guests} members</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Contact:</span>
                <span className={styles.value}>{booking.contact}</span>
              </div>
            </div>
            <div className={styles.tableInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Table Type:</span>
                <span className={styles.value}>{booking.table.tableType}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Category:</span>
                <span className={styles.value}>{booking.table.category}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Capacity:</span>
                <span className={styles.value}>{booking.table.capacity}</span>
              </div>
            </div>
          </div>
          <button
            className={styles.deleteButton}
            onClick={() => deleteBooking(booking.bookingId, booking.table.table_id)}
          >
            Delete Booking
          </button>
        </div>
      ))
    ) : (
      <p>No bookings found.</p>
    )}
  </div>
</div>

  );
}

export default Bookings;
