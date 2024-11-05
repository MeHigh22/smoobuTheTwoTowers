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
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

// Discount settings stored in backend
const discountSettings = {
  1946276: {
    // apartmentId
    cleaningFee: 0,
    prepayment: 0,
    minDaysBetweenBookingAndArrival: 1,
    extraGuestsPerNight: 20,
    startingAtGuest: 2,
    maxGuests: 4,
    extraChildPerNight: 20,
    lengthOfStayDiscount: {
      minNights: 2,
      discountPercentage: 40,
    },
  },
  // Add more apartments with their settings as needed
};

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// New endpoint to get discount settings
app.get("/api/discount-settings/:apartmentId", (req, res) => {
  const { apartmentId } = req.params;
  const settings = discountSettings[apartmentId];

  if (!settings) {
    return res
      .status(404)
      .json({ error: "Discount settings not found for this apartment" });
  }

  res.json(settings);
});

const calculatePriceWithSettings = (
  rates,
  startDate,
  endDate,
  numberOfGuests,
  numberOfChildren,
  settings
) => {
  let totalPrice = 0;
  let numberOfNights = 0;
  const currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);

  // Calculate base price and nights
  while (currentDate < endDateTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayRate = rates[dateStr];

    if (dayRate && dayRate.price !== null && dayRate.available === 1) {
      totalPrice += dayRate.price;
      numberOfNights++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate extra guests fee
  const extraGuests = Math.max(0, numberOfGuests - settings.startingAtGuest);
  const extraGuestsFee =
    extraGuests * settings.extraGuestsPerNight * numberOfNights;

  // Calculate extra children fee
  const extraChildrenFee =
    numberOfChildren * settings.extraChildPerNight * numberOfNights;

  // Calculate length of stay discount
  let discount = 0;
  if (numberOfNights >= settings.lengthOfStayDiscount.minNights) {
    discount =
      (totalPrice * settings.lengthOfStayDiscount.discountPercentage) / 100;
  }

  const priceElements = [
    {
      type: "basePrice",
      name: "Base price",
      amount: totalPrice,
      currencyCode: "EUR",
    },
  ];

  if (extraGuestsFee > 0) {
    priceElements.push({
      type: "addon",
      name: "Extra guests fee",
      amount: extraGuestsFee,
      currencyCode: "EUR",
    });
  }

  if (extraChildrenFee > 0) {
    priceElements.push({
      type: "addon",
      name: "Extra children fee",
      amount: extraChildrenFee,
      currencyCode: "EUR",
    });
  }

  if (settings.cleaningFee > 0) {
    priceElements.push({
      type: "cleaningFee",
      name: "Cleaning fee",
      amount: settings.cleaningFee,
      currencyCode: "EUR",
    });
  }

  if (discount > 0) {
    priceElements.push({
      type: "longStayDiscount",
      name: `Long stay discount (${settings.lengthOfStayDiscount.discountPercentage}%)`,
      amount: -discount,
      currencyCode: "EUR",
    });
  }

  const subtotal =
    totalPrice + extraGuestsFee + extraChildrenFee + settings.cleaningFee;
  const finalPrice = subtotal - discount;

  return {
    originalPrice: totalPrice,
    extraGuestsFee,
    extraChildrenFee,
    cleaningFee: settings.cleaningFee,
    discount,
    finalPrice,
    numberOfNights,
    priceElements,
    settings,
  };
};

app.get("/api/rates", async (req, res) => {
  try {
    const { apartments, start_date, end_date, adults, children } = req.query;
    const apartmentId = Array.isArray(apartments) ? apartments[0] : apartments;
    const settings = discountSettings[apartmentId];

    if (!settings) {
      return res
        .status(404)
        .json({ error: "Settings not found for this apartment" });
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

    if (response.data.data && response.data.data[apartmentId]) {
      const priceData = calculatePriceWithSettings(
        response.data.data[apartmentId],
        start_date,
        end_date,
        parseInt(adults) || 1,
        parseInt(children) || 0,
        settings
      );

      res.json({
        ...response.data,
        priceDetails: priceData,
      });
    } else {
      res.json(response.data);
    }
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

app.post("/api/reservations", async (req, res) => {
  try {
    console.log("Received reservation request:", req.body);

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

    // Log the successful response
    console.log("Smoobu reservation response:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating reservation:",
      error.response?.data || error.message
    );

    // Send a more detailed error response
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || "Failed to create reservation",
      details: error.response?.data || {},
      message: error.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
