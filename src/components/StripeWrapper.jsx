import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QHmafIhkftuEy3nUnQeADHtSgrHJDHFtkQDfKK7dtkN8XwYw4qImtQTAgGiV0o9TR2m2DZfHhc4VmugNUw0pEuF009YsiV98I"
);

const StripeWrapper = ({ clientSecret, children, onSuccess, onError }) => {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#668E73", // Changed to match your green color theme
      },
    },
  };

  // Clone children with additional props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onSuccess, onError });
    }
    return child;
  });

  return (
    <Elements stripe={stripePromise} options={options}>
      {childrenWithProps}
    </Elements>
  );
};

export default StripeWrapper;
