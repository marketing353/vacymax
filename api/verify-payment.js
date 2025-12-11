import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * SERVERLESS FUNCTION: Verify Stripe Payment
 *
 * This endpoint verifies that a Stripe Checkout Session has been paid.
 * Used for manual verification when the redirect flow fails.
 */
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.setHeader('Allow', 'GET').status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ error: 'Session ID is required', paid: false });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Check if the payment was successful
        const isPaid = session.payment_status === 'paid';

        res.status(200).json({
            paid: isPaid,
            status: session.payment_status,
            customerEmail: session.customer_email,
        });
    } catch (err) {
        console.error('Payment verification error:', err);

        // If the session doesn't exist or there's an error, return not paid
        res.status(200).json({
            paid: false,
            error: err.message || 'Failed to verify payment'
        });
    }
}
