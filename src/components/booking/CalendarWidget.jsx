import React from "react";

export const CalendarWidget = ({ calendarIframe }) => {
  return (
    <div id="smoobuCalendarIframe" className="mt-4">
      {/* Add the external stylesheet */}
      <link
        rel="stylesheet"
        type="text/css"
        href="https://login.smoobu.com/css/singleCalendarWidgetIframe.css"
      />
      {/* Responsive iframe for small devices */}
      <iframe
        className="smallDevices"
        style={{
          height: "540px", // Default height for small devices
          width: "100%", // Full width
        }}
        src={calendarIframe.smallDevices}
      ></iframe>
      {/* Responsive iframe for big devices */}
      <iframe
        className="bigDevices last"
        style={{
          height: "600px", // Default height for large devices
          width: "100%", // Full width
        }}
        src={calendarIframe.bigDevices}
      ></iframe>

      {/* Responsive Styles with Media Queries */}
      <style>
        {`
          #smoobuCalendarIframe iframe {
            max-width: 100%; /* Prevent overflow */
            border: none; /* Remove iframe border */
          }
          @media (max-width: 768px) {
            #smoobuCalendarIframe .smallDevices {
              display: block;
            }
            #smoobuCalendarIframe .bigDevices {
              display: none;
            }
          }
          @media (min-width: 769px) {
            #smoobuCalendarIframe .smallDevices {
              display: none;
            }
            #smoobuCalendarIframe .bigDevices {
              display: block;
            }
          }
          @media screen and (max-width: 500px) {
            .calendar > .singleCalendarWidget > .last {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};
