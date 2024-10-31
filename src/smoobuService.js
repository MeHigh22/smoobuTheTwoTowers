// src/smoobuService.js

const API_BASE_URL = 'https://api.smoobu.com/v1';  // Smoobu base API URL

export const fetchBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_SMOOBU_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching bookings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
