/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./home.module.css";
import { useRouter } from "next/navigation";
import { constants } from "../lib/constants";
import Image from "next/image";



export default function Home() {
  const [tables, setTables] = useState([]); // Original table data
  const [filteredTables, setFilteredTables] = useState([]); // Data to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const router = useRouter();

  // Filter states
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [bookedFilter, setBookedFilter] = useState("");

  // Modal form states
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formGuests, setFormGuests] = useState("");
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`${constants.baseUrl}/table/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTables(data.data);
        setFilteredTables(data.data);
      } catch (error: unknown) {
        // setError('');
        console.log("error");

      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  // scrolling condition 
  useEffect(() => {
    // Add/remove the "no-scroll" class on <body> when modal state changes
    if (isModalOpen) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
    return () => document.body.classList.remove(styles.noScroll);
  }, [isModalOpen]);

  // Handle filtering
  const handleFilter = () => {
    let filtered = tables;

    if (dateFilter) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((table: any) => table.availableDate === dateFilter);
    }

    if (timeFilter) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((table: any) => table.availableTime === timeFilter);
    }

    if (categoryFilter) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((table: any) => table.category === categoryFilter);
    }
    if (bookedFilter !== "") {
      // Converting bookedFilter to a boolean for comparison
      const isBooked = bookedFilter === "true"; // Converting string to boolean
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((table: any) => table.isbooked === isBooked);
    }

    setFilteredTables(filtered);
  };

  const clearFilters = () => {
    setDateFilter("");
    setTimeFilter("");
    setCategoryFilter("");
    setBookedFilter("");
    setFilteredTables(tables);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookNow = (table: any) => {
    setSelectedTable(table);
    // autofilling form fields with the table's data
    setFormDate(table.availableDate);
    setFormTime(table.availableTime);
    setFormGuests(table.capacity);
    setFormName("");
    setFormContact("");
    setIsModalOpen(true);
    setTableId(table.table_id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token") || "";

    if (!formName) {
      return alert("Enter Name")
    }

    if (!formContact) {
      return alert("Enter Contact number")
    }

    const bookingPaylaod = {
      date: formDate,
      time: formTime,
      name: formName,
      contact: formContact,
      guests: formGuests,
    }

    if (!userToken) {
      alert("Login to reserve the table");
      router.push('/login');
    }

    try {
      const response = await fetch(`${constants.baseUrl}/booking/create/${tableId}/${userToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPaylaod),
      });
      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }

      const data = await response.json();
      sessionStorage.setItem('bookingData', JSON.stringify(data.data));

      router.push("/booking-success-page")

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="date"
          className={styles.filterInput}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          placeholder="Filter by Date"
        />
        <input
          type="time"
          className={styles.filterInput}
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          placeholder="Filter by Time"
        />
        <select
          className={styles.filterInput}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="normal">Normal</option>
          <option value="vip">VIP</option>
          <option value="special">Special</option>
          <option value="private">Private</option>

        </select>
        <select
          className={styles.filterInput}
          value={bookedFilter}
          onChange={(e) => setBookedFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="false">Available</option>
          <option value="true">Unavailable</option>

        </select>
        <button className={styles.filterButton} onClick={handleFilter}>
          Apply Filters
        </button>
        <button className={styles.clearButton} onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Display table data as cards */}
      <div className={styles.cardContainer}>
        {filteredTables.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredTables.map((table: any, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardImage}>
                <img
                  src=
                  "https://img.freepik.com/free-photo/table-set-dinning-table_1339-6412.jpg?ga=GA1.1.1338387062.1735995170&semt=ais_hybrid"
                  
                  alt="Table"
                  className={styles.image}
                />
              </div>
              <div className={styles.cardDetails}>
                <div>
                  <p>
                    <strong>Date : </strong> {table.availableDate}
                  </p>
                  <p>
                    <strong>Time : </strong> {table.availableTime}
                  </p>
                  <p>
                    <strong>Table Type : </strong> {table.tableType}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Capacity : </strong> {table.capacity}
                  </p>
                  <p>
                    <strong>Category : </strong> {table.category}
                  </p>
                  <p>
                    <strong>Status : </strong>{" "}
                    {table.isbooked ? "Booked" : "Available"}
                  </p>
                </div>
              </div>

              <div className={styles.btnContainer}>
                <hr />
                {!table.isbooked && (
                  <button
                    className={styles.bookButton}
                    onClick={() => handleBookNow(table)}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No table data available at the moment.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (

        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          id="error-modal"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="mt-2">
                    <form onSubmit={handleSubmitBooking}>
                      <div className={styles.formGroup}>
                        <label htmlFor="date">Date</label>
                        <input
                          type="date"
                          id="date"
                          className={styles.formInput}
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          required
                          disabled
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="time">Time</label>
                        <input
                          type="time"
                          id="time"
                          className={styles.formInput}
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          required
                          disabled
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          className={styles.formInput}
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact">Contact</label>
                        <input
                          type="text"
                          id="contact"
                          className={styles.formInput}
                          value={formContact}
                          onChange={(e) => setFormContact(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="guests">Guests</label>
                        <select
                          id="guests"
                          className={styles.formInput}
                          value={formGuests}
                          onChange={(e) => setFormGuests(e.target.value)}
                          required
                        >
                          <option value="">Select</option>
                          {[...Array(selectedTable?.capacity || 0).keys()].map((i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.btnModal}>
                        <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button type="submit" onClick={handleSubmitBooking} className={styles.submitButton}>
                          Book Now
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};
