import express from "express";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite frontend URL
  })
);

app.use(express.json());

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get rates endpoint
app.get("/api/rates", async (req, res) => {
  try {
    const { apartments, start_date, end_date } = req.query;

    // Create cache key
    const cacheKey = `rates-${apartments}-${start_date}-${end_date}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get("https://login.smoobu.com/api/rates", {
      headers: {
        "Api-Key": "UZFV5QRY0ExHUfJi3c1DIG8Bpwet1X4knWa8rMkj6o",
        "Content-Type": "application/json",
      },
      params: {
        apartments: apartments,
        start_date: start_date,
        end_date: end_date,
      },
    });

    // Store in cache
    cache.set(cacheKey, response.data);
    setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching rates:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || "Failed to fetch rates",
    });
  }
});

// Create reservation endpoint
app.post("/api/reservations", async (req, res) => {
  try {
    const response = await axios.post(
      "https://login.smoobu.com/api/reservations",
      req.body,
      {
        headers: {
          "Api-Key": "UZFV5QRY0ExHUfJi3c1DIG8Bpwet1X4knWa8rMkj6o",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating reservation:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || "Failed to create reservation",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
