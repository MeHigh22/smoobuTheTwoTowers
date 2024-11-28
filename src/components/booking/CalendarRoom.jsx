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
      className="calendarWidget overflow-hidden h-[350px] xl:h-[450px] lg:h-[320px] md:h-[400px] sm:h-[370px]"
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

            @media screen and (max-width: 1012px) {
            .multiCalendarWidget .fullCalendar.smallDevices:nth-of-type(1) {
                padding: 1rem 0;
            }
            .multiCalendarWidget .fullCalendar.smallDevices:nth-of-type(2) {
                display: none;
            }

            .multiCalendarWidget .btn-prev.smallDevices,
            .multiCalendarWidget .btn-next.smallDevices {
                top: 10px !important;
                left: 170px;
            }
            }

            .multiCalendarWidget .btn-prev.smallDevices {
            left: -20px !important;
            }

            .multiCalendarWidget .singleCalendarWidget table td {
            border: 1px solid #d1d5db !important;
            color: black;
            }

            .multiCalendarWidget .btn-next {
            right: -25px !important;
            }

            .multiCalendarWidget .btn-prev {
            left: -5px !important;
            }

            .header {
            margin-bottom: 1rem;
            justify-content: space-evenly;
            }
        `}
      </style>
    </div>
  );
};
