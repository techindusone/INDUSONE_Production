import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const CREATE_PAYMENT_KEY = gql`
  mutation makePayment($amount: Int!, $currency: String!, $token: String!) {
    makePayment(amount: $amount, currency: $currency, token: $token) {
      clientSecret
    }
  }
`;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [makePayment, { data }] = useMutation(CREATE_PAYMENT_KEY, {
    update(proxy, result) {
      // console.log(result.data.makePayment.clientSecret)
    },
    onError(err) {
      console.log('Error creating a new student.', err);
      // setError(err)
    },
    variables: {
      amount: 100,
      currency: 'inr',
      token: 'test',
    },
  });

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    await makePayment()
      .then(async (res) => {
        const clientSecret = res.data.makePayment.clientSecret;
        // console.log(clientSecret)
        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          console.log('Stripe Not Loaded Yet!');
          return;
        }
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Jenny Rosen',
            },
          },
        });
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // console.log(result.paymentIntent.amount);
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
          }
        }
      })
      .catch((err) => {
        console.error(`Error making a payment ${err}`);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        paddingTop: '5vh',
        width: '50%',
      }}
    >
      <CardSection />
      <button
        className="btn"
        style={{ borderRadius: '0px', backgroundColor: '#7971ea', color: 'white' }}
        disabled={!stripe}
      >
        Confirm order
      </button>
    </form>
  );
}
