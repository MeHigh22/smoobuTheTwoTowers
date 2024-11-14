import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingForm from "./Bookings";
import BookingConfirmation from "./components/BookingConfirmation";
import DummyComponent from "./components/DummyComponent"
import StaticBookingConfirmation from "./components/TestBookingConfirmation"
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/dummy-component" element={<StaticBookingConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
