import express from "express";
import cors from "cors";
import axios from "axios";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const stripe = new Stripe(
  "sk_test_51QHmafIhkftuEy3nihoW4ZunaXVY1D85r176d91x9BAhGfvW92zG7r7A5rVeGuL1ysHVMOzflF0jwoCpyKJl760n00GC9ZYSJ4"
);
const pendingBookings = new Map();

// Discount settings
const discountSettings = {
  2467648: {
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
  2467653: {
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
};

// Calculate price with settings
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

  // Special handling for departure-arrival day
  const startDateStr = currentDate.toISOString().split("T")[0];
  const prevDay = new Date(currentDate);
  prevDay.setDate(prevDay.getDate() - 1);
  const prevDayStr = prevDay.toISOString().split("T")[0];

  // If starting on a departure day, don't count it as unavailable
  const isDepartureDay =
    (!rates[prevDayStr] || rates[prevDayStr].available === 0) &&
    rates[startDateStr] &&
    rates[startDateStr].available === 1;

  console.log("Calculating price for dates:", {
    startDate: startDateStr,
    endDate: endDateTime.toISOString().split("T")[0],
    numberOfGuests,
    numberOfChildren,
  });

  while (currentDate < endDateTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayRate = rates[dateStr];

    if (dayRate) {
      // Allow booking if it's either available or it's a departure-arrival day
      if (
        dayRate.available === 1 ||
        (dateStr === startDateStr && isDepartureDay)
      ) {
        totalPrice += dayRate.price;
        numberOfNights++;
        console.log(`Adding price for ${dateStr}:`, dayRate.price);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("Base calculation:", {
    totalPrice,
    numberOfNights,
  });

  // Calculate long stay discount only on the base room price
  let discount = 0;
  if (numberOfNights >= settings.lengthOfStayDiscount.minNights) {
    discount =
      (totalPrice * settings.lengthOfStayDiscount.discountPercentage) / 100;
    console.log("Long stay discount:", {
      numberOfNights,
      minimumNights: settings.lengthOfStayDiscount.minNights,
      discountPercentage: settings.lengthOfStayDiscount.discountPercentage,
      discountAmount: discount,
    });
  }

  // Guest fees
  const extraGuests = Math.max(0, numberOfGuests - settings.startingAtGuest);
  const extraGuestsFee =
    extraGuests * settings.extraGuestsPerNight * numberOfNights;
  const extraChildrenFee =
    numberOfChildren * settings.extraChildPerNight * numberOfNights;

  console.log("Guest fees:", {
    extraGuests,
    extraGuestsFee,
    extraChildrenFee,
    extraGuestsPerNight: settings.extraGuestsPerNight,
    extraChildPerNight: settings.extraChildPerNight,
  });

  // Build price elements array
  const priceElements = [
    {
      type: "basePrice",
      name: "Prix de base",
      amount: totalPrice,
      currencyCode: "EUR",
    },
  ];

  if (extraGuestsFee > 0) {
    priceElements.push({
      type: "addon",
      name: "Frais de personne supplémentaire",
      amount: extraGuestsFee,
      currencyCode: "EUR",
    });
  }

  if (extraChildrenFee > 0) {
    priceElements.push({
      type: "addon",
      name: "Frais d'enfants supplémentaires",
      amount: extraChildrenFee,
      currencyCode: "EUR",
    });
  }

  if (settings.cleaningFee > 0) {
    priceElements.push({
      type: "cleaningFee",
      name: "Frais de nettoyage",
      amount: settings.cleaningFee,
      currencyCode: "EUR",
    });
  }

  if (discount > 0) {
    priceElements.push({
      type: "longStayDiscount",
      name: `Réduction long séjour (${settings.lengthOfStayDiscount.discountPercentage}%)`,
      amount: -discount,
      currencyCode: "EUR",
    });
  }

  // Calculate final price
  const subtotal =
    totalPrice + extraGuestsFee + extraChildrenFee + settings.cleaningFee;
  const finalPrice = subtotal - discount;

  console.log("Final price calculation:", {
    basePrice: totalPrice,
    extraGuestsFee,
    extraChildrenFee,
    cleaningFee: settings.cleaningFee,
    subtotal,
    discount,
    finalPrice,
    numberOfNights,
    priceElements,
  });

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

// Webhook endpoint must come before JSON middleware
// Helper function for delays
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    console.log("Received webhook call");

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_d9b86273072de6b319134fbc08752e2b4e66bae72aaa2cf4cb7db1411974c20a"
      );

      console.log("Webhook event verified:", event.type);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const bookingReference = paymentIntent.metadata.bookingReference;
        const bookingData = pendingBookings.get(bookingReference);

        console.log("Retrieved booking data:", bookingData);

        if (!bookingData) {
          console.error(
            "No booking data found for reference:",
            bookingReference
          );
          return res.status(400).json({ error: "Booking data not found!" });
        }

        try {
          // First create the main booking
          const smoobuResponse = await axios.post(
            "https://login.smoobu.com/api/reservations",
            {
              arrivalDate: bookingData.arrivalDate,
              departureDate: bookingData.departureDate,
              channelId: bookingData.channelId,
              apartmentId: bookingData.apartmentId,
              firstName: bookingData.firstName,
              lastName: bookingData.lastName,
              email: bookingData.email,
              phone: bookingData.phone,
              notice: bookingData.notice,
              adults: Number(bookingData.adults),
              children: Number(bookingData.children),
              price: Number(bookingData.price),
              priceStatus: 1,
              deposit: Number(bookingData.deposit),
              depositStatus: 1,
              language: "en",
            },
            {
              headers: {
                "Api-Key": "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Smoobu booking created:", smoobuResponse.data);
          const reservationId = smoobuResponse.data.id;

          // Add initial delay after booking creation
          await wait(2000);

          // Process extras if they exist
          if (bookingData.extras && bookingData.extras.length > 0) {
            console.log("Creating extras as price elements...");

            for (const extra of bookingData.extras) {
              let retryCount = 0;
              const maxRetries = 3;

              while (retryCount < maxRetries) {
                try {
                  // Add base extra
                  if (!extra.name.includes("Personne supplémentaire")) {
                    const extraResponse = await axios.post(
                      `https://login.smoobu.com/api/reservations/${reservationId}/price-elements`,
                      {
                        type: "addon",
                        name: extra.name,
                        amount: extra.amount,
                        quantity: extra.quantity,
                        currencyCode: "EUR",
                      },
                      {
                        headers: {
                          "Api-Key":
                            "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    console.log(
                      `Added base extra: ${extra.name}`,
                      extraResponse.data
                    );
                  }

                  // If there are extra persons, add them as a separate price element
                  if (extra.extraPersonQuantity > 0 && extra.extraPersonPrice) {
                    await wait(1000); // Wait between requests
                    const extraPersonResponse = await axios.post(
                      `https://login.smoobu.com/api/reservations/${reservationId}/price-elements`,
                      {
                        type: "addon",
                        name: `${extra.name} - Personne supplémentaire`,
                        amount:
                          extra.extraPersonPrice * extra.extraPersonQuantity,
                        quantity: extra.extraPersonQuantity,
                        currencyCode: "EUR",
                      },
                      {
                        headers: {
                          "Api-Key":
                            "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    console.log(
                      `Added extra person charges for: ${extra.name}`,
                      extraPersonResponse.data
                    );
                  }

                  break; // Success - exit retry loop
                } catch (extraError) {
                  retryCount++;
                  console.log(`Retry ${retryCount} for extra ${extra.name}`);

                  if (retryCount === maxRetries) {
                    console.error(
                      `Failed to add extra ${extra.name} after ${maxRetries} attempts:`,
                      extraError.response?.data || extraError.message
                    );
                  } else {
                    await wait(2000 * retryCount); // Exponential backoff
                    continue;
                  }
                }
              }
            }
          }

          // Clean up the pending booking after successful processing
          pendingBookings.delete(bookingReference);
          console.log(
            "Successfully processed booking and removed from pending bookings"
          );
        } catch (error) {
          console.error(
            "Error creating Smoobu booking:",
            error.response?.data || error.message
          );
          return res.status(500).json({
            error: "Failed to create booking in Smoobu",
            details: error.response?.data || error.message,
          });
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// Use JSON parsing and CORS for all other routes
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/api/apartments", async (req, res) => {
  try {
    const response = await axios.get(
      "https://login.smoobu.com/api/apartments",
      {
        headers: {
          "Api-Key": "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: error.response?.status,
      title: error.response?.data?.title || "Error",
      detail: error.response?.data?.detail || "Failed to fetch apartments",
    });
  }
});

app.get("/api/apartments/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://login.smoobu.com/api/apartments/${req.params.id}`,
      {
        headers: {
          "Api-Key": "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
          "Content-Type": "application/json",
        },
      }
    );

    // Smoobu API returns images in the response
    const images = response.data.images || [];
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch apartment images" });
  }
});

// Get rates endpoint
// In your server file where you handle /api/rates endpoint
app.get("/api/rates", async (req, res) => {
  try {
    const { apartments, start_date, end_date, adults, children } = req.query;

    console.log("Processing rates request:", {
      apartments,
      start_date,
      end_date,
      adults,
      children,
    });

    const response = await axios.get("https://login.smoobu.com/api/rates", {
      headers: {
        "Api-Key": "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
        "Content-Type": "application/json",
      },
      params: {
        apartments: Array.isArray(apartments) ? apartments : [apartments],
        start_date,
        end_date,
      },
    });

    if (!response.data || !response.data.data) {
      return res.status(404).json({ error: "No rates found" });
    }

    const formattedData = {};
    const priceDetailsByApartment = {};

    // Helper function to calculate nights
    const calculateNumberOfNights = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.floor((end - start) / (1000 * 60 * 60 * 24));
    };

    // Process each apartment
    (Array.isArray(apartments) ? apartments : [apartments]).forEach(
      (apartmentId) => {
        const apartmentData = response.data.data[apartmentId];
        formattedData[apartmentId] = apartmentData;

        const settings = discountSettings[apartmentId];
        if (!settings) return;

        // Calculate base price
        let totalPrice = 0;
        const dates = Object.keys(apartmentData).sort();
        dates.forEach((date) => {
          if (apartmentData[date].available === 1) {
            totalPrice += apartmentData[date].price;
          }
        });

        // Calculate numbers of nights and discount
        const numberOfNights = calculateNumberOfNights(start_date, end_date);
        let discount = 0;
        if (numberOfNights >= settings.lengthOfStayDiscount.minNights) {
          discount =
            (totalPrice * settings.lengthOfStayDiscount.discountPercentage) /
            100;
        }

        // Calculate extra guest fees
        const extraGuests = Math.max(
          0,
          parseInt(adults) - settings.startingAtGuest
        );
        const extraGuestsFee =
          extraGuests * settings.extraGuestsPerNight * numberOfNights;
        const extraChildrenFee =
          parseInt(children) * settings.extraChildPerNight * numberOfNights;

        // Store price details for this apartment
        priceDetailsByApartment[apartmentId] = {
          originalPrice: totalPrice,
          extraGuestsFee,
          extraChildrenFee,
          cleaningFee: settings.cleaningFee,
          discount,
          finalPrice:
            totalPrice +
            extraGuestsFee +
            extraChildrenFee +
            settings.cleaningFee -
            discount,
          numberOfNights,
          pricePerNight: Math.round(totalPrice / numberOfNights),
          settings,
          priceElements: [
            {
              type: "basePrice",
              name: "Prix de base",
              amount: totalPrice,
              currencyCode: "EUR",
            },
          ],
        };

        // Add extra fees to price elements if they exist
        if (extraGuestsFee > 0) {
          priceDetailsByApartment[apartmentId].priceElements.push({
            type: "addon",
            name: "Frais de personne supplémentaire",
            amount: extraGuestsFee,
            currencyCode: "EUR",
          });
        }

        if (extraChildrenFee > 0) {
          priceDetailsByApartment[apartmentId].priceElements.push({
            type: "addon",
            name: "Frais d'enfants supplémentaires",
            amount: extraChildrenFee,
            currencyCode: "EUR",
          });
        }

        if (settings.cleaningFee > 0) {
          priceDetailsByApartment[apartmentId].priceElements.push({
            type: "cleaningFee",
            name: "Frais de nettoyage",
            amount: settings.cleaningFee,
            currencyCode: "EUR",
          });
        }

        if (discount > 0) {
          priceDetailsByApartment[apartmentId].priceElements.push({
            type: "discount",
            name: `Réduction long séjour (${settings.lengthOfStayDiscount.discountPercentage}%)`,
            amount: -discount,
            currencyCode: "EUR",
          });
        }
      }
    );

    console.log("Sending response with price details:", {
      apartmentCount: Object.keys(priceDetailsByApartment).length,
      priceDetails: priceDetailsByApartment,
    });

    res.json({
      data: formattedData,
      priceDetails: priceDetailsByApartment,
    });
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({
      error: "Failed to fetch rates",
      details: error.message,
    });
  }
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { price, bookingData } = req.body;

    const bookingReference = `BOOKING-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log("Generated booking reference:", bookingReference);

    // Store booking data for webhook
    pendingBookings.set(bookingReference, bookingData);
    console.log("Stored booking data with extras:", bookingData);

    // Create payment intent with total price (including extras and discounts)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingReference: bookingReference,
        basePrice: bookingData.basePrice.toString(),
        extrasTotal: (price - bookingData.basePrice).toString(),
        longStayDiscount: bookingData.priceDetails.discount.toString(),
        couponDiscount: (bookingData.couponApplied?.discount || "0").toString(),
      },
    });

    console.log("Created payment intent:", paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      bookingReference: bookingReference,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

app.get("/api/bookings/:paymentIntentId", async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Fetch the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const bookingReference = paymentIntent.metadata.bookingReference;
    const bookingData = pendingBookings.get(bookingReference);

    if (!bookingData) {
      return res.status(404).json({
        error: "Booking details not found",
        paymentIntent: paymentIntentId,
        bookingReference: bookingReference,
      });
    }

    // Récupérer les montants des réductions depuis les metadata
    const basePrice = parseFloat(paymentIntent.metadata.basePrice);
    const extrasTotal = parseFloat(paymentIntent.metadata.extrasTotal || 0);
    const longStayDiscount = parseFloat(
      paymentIntent.metadata.longStayDiscount || 0
    );
    const couponDiscount = parseFloat(
      paymentIntent.metadata.couponDiscount || 0
    );

    // Calculer le total final
    const subtotalBeforeDiscounts = basePrice + extrasTotal;
    const finalTotal =
      subtotalBeforeDiscounts - longStayDiscount - couponDiscount;

    const responseData = {
      ...bookingData,
      basePrice: basePrice,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
      priceBreakdown: {
        basePrice: basePrice,
        extrasTotal: extrasTotal,
        longStayDiscount: longStayDiscount,
        couponDiscount: couponDiscount,
        totalPrice: finalTotal,
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      error: "Failed to fetch booking details",
      message: error.message,
    });
  }
});

// Test Smoobu endpoint
app.post("/api/test-smoobu", async (req, res) => {
  try {
    const testBooking = {
      arrivalDate: "2024-11-10",
      departureDate: "2024-11-12",
      channelId: 3960043,
      apartmentId: 2402388,
      firstName: "Test",
      lastName: "Booking",
      email: "test@example.com",
      phone: "1234567890",
      adults: 1,
      children: 0,
      price: 100,
      priceStatus: 1,
      deposit: 0,
      depositStatus: 1,
      language: "en",
    };

    console.log("Testing Smoobu API with data:", testBooking);

    const response = await axios.post(
      "https://login.smoobu.com/api/reservations",
      testBooking,
      {
        headers: {
          "Api-Key": "nWi4dEUcB2ZCbBgSuoVJjB14o9wPBDQIuLbnfG1u72",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Smoobu test response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Smoobu test error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Smoobu test failed",
      details: error.response?.data,
    });
  }
});

// Debug endpoint to check pending bookings
app.get("/api/pending-bookings", (req, res) => {
  const bookings = Array.from(pendingBookings.entries());
  res.json(bookings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Webhook endpoint ready at /webhook");
});
