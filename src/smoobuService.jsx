import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAvailability = async (apartmentId, startDate, endDate) => {
    try {
      const response = await axios.get('http://localhost:3000/api/rates', {
        params: {
          apartments: [apartmentId],
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  };