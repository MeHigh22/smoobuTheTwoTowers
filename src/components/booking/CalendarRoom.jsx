import React, { useEffect } from "react";

export const CalendarRoom = () => {
  useEffect(() => {
    // Dynamically load the script
    const script = document.createElement("script");
    script.src = "https://login.smoobu.com/js/Apartment/CalendarWidget.js";
    script.type = "text/javascript";
    script.async = true;

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="smoobuApartment2428698de"
      className="calendarWidget"
      style={{ height: "500px", overflow: "hidden" }}
    >
      <div
        className="calendarContent"
        data-load-calendar-url="https://login.smoobu.com/de/cockpit/widget/single-calendar/2428698"
        data-verification="b0f41e1cdaa98e3e16052ad9121912d4c5971e3457de260cd25d5a54de7fc73e"
        data-baseurl="https://login.smoobu.com"
        data-disable-css="false"
      ></div>
      <style>
        {`
          .multiCalendarWidget .logo {
            display: none !important;
          }
          @media screen and (max-width: 500px) {
            .calendar .singleCalendarWidget .last {
              display: none !important;
            }
          }
          .multiCalendarWidget .singleCalendarWidget table td {
              border: 1px solid #d1d5db !important;
            }
        `}
      </style>
    </div>
  );
};
