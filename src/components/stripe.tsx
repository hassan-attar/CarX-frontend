import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Link, Navigate } from "react-router-dom";

import { useCarSelector, useFilterSelector } from "../store/hooks";

import { Button, Result } from "antd";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
const stripePromise = loadStripe(
  "pk_test_51PmqbxRp0kMLYuodo6GEboBunyisgpic6zye2zV0pUkRcaYMTKVhfXLS5wUrb59o8jMdYt0PBszeQWq38KVtTWHq00LXAaqKkk"
);

export const CheckoutForm = () => {
  const car = useCarSelector((state) => state.car.selectedCar);
  const filter = useFilterSelector((state) => state.filter);
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/v1/payments/checkout-session", {
      method: "POST",
      body: JSON.stringify({
        carId: car?.carId,
        from: filter.startDate,
        to: filter.endDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data.clientSecret;
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="p-4">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export const Return = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/v1/payments/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <Result
        status="success"
        title="Successfully rented your car!"
        extra={
          <Button>
            <Link to={"/"}>Back to Home Page</Link>
          </Button>
        }
      />
    );
  }

  return null;
};
