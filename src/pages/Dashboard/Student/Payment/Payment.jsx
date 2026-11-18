import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import CheckoutPayment from './CheckoutPayment';
import { Navigate, useLocation } from 'react-router-dom';
import './Payment.css';
// Created once at module level so Stripe.js is not re-initialised on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

const Payment = () => {
    const location = useLocation();
    const price = location.state?.price;
    const cartItm = location.state?.itemId;
    if (!price) {
        return <Navigate to="/dashboard/my-selected" replace />
    }

    return (
        <div className="my-40 stripe-custom-class">
            <Elements stripe={stripePromise}>
                <CheckoutPayment price={price} cartItm={cartItm} />
            </Elements>
        </div>
    );
};

export default Payment;