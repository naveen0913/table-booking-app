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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div className={styles.container}>
      <p className={styles.back} onClick={() => router.push("/")}>
        Back to home
      </p>
      <div className={styles.grid}>
        {bookings.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bookings.map((booking:any, index) => (
            <div key={index} className={styles.card}>
              <h2 className={styles.name}>{booking.name}</h2>
              <p>
                <strong>Date : </strong> {booking.date}
              </p>
              <p>
                <strong>Time : </strong> {booking.time}
              </p>
              <p>
                <strong>Guests : </strong> {booking.guests} members
              </p>
              <p>
                <strong>Contact : </strong> {booking.contact}
              </p>
              <div className={styles.tableInfo}>
                <p>
                  <strong>Table Type : </strong> {booking.table.tableType}
                </p>
                <p>
                  <strong>Category : </strong> {booking.table.category}
                </p>
                <p>
                  <strong>Capacity : </strong> {booking.table.capacity}
                </p>
              </div>
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
