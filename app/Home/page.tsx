"use client";
import React, { useState, useEffect } from 'react';
import styles from './home.module.css'

const HomePage = () => {
  const [tables, setTables] = useState([]); // Original table data
  const [filteredTables, setFilteredTables] = useState([]); // Data to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch('http://localhost:5000/table/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTables(data.data);
        setFilteredTables(data.data); // Display all data initially
      } catch (error:any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  // Handle filtering
  const handleFilter = () => {
    let filtered = tables;

    if (dateFilter) {
      filtered = filtered.filter((table:any) => table.availableDate === dateFilter);
    }

    if (timeFilter) {
      filtered = filtered.filter((table:any) => table.availableTime === timeFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((table:any) => table.category === categoryFilter);
    }

    setFilteredTables(filtered);
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
        </select>
        <button className={styles.filterButton} onClick={handleFilter}>
          Apply Filters
        </button>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Display table data as cards */}
      <div className={styles.cardContainer}>
        {filteredTables.length > 0 ? (
          filteredTables.map((table:any, index) => (
            <div className={styles.card} key={index}>
              <p><strong>Date:</strong> {table.availableDate}</p>
              <p><strong>Time:</strong> {table.availableTime}</p>
              <p><strong>Table Type:</strong> {table.tableType}</p>
              <p><strong>Capacity:</strong> {table.capacity}</p>
              <p><strong>Category:</strong> {table.category}</p>
              <p><strong>Status:</strong> {table.isbooked ? 'Booked' : 'Available'}</p>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No tables match the filters.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
