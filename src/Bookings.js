import React, { useEffect, useState } from 'react';
import { fetchBookings } from './smoobuService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getBookings();
  }, []);

  return (
    <div>
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>{booking.propertyName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
