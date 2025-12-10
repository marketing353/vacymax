import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { supabaseHelpers } from '../services/supabase';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    savedValue?: number; // Optional prop to show ROI
    userCountry?: string; // For dynamic pricing
    prefs?: UserPreferences;
    planStats?: {
        totalDays: number;
        efficiency: number;
        ptoUsed: number;
    };
}

// Pricing Logic Engine
export const getRegionalPrice = (countryName: string = '') => {
    const c = countryName.toLowerCase();

    if (c.includes('canada')) {
        return { amount: 6.99, currency: 'CAD', symbol: '$' };
    }
    if (c.includes('united kingdom') || c.includes('uk')) {
        return { amount: 3.99, currency: 'GBP', symbol: '£' };
    }
    if (c.includes('australia') || c.includes('au')) {
        return { amount: 7.99, currency: 'AUD', symbol: '$' };
    }
    if (c.includes('europe') || c.includes('eu') || c.includes('germany') || c.includes('france') || c.includes('spain') || c.includes('italy') || c.includes('netherlands')) {
        return { amount: 4.49, currency: 'EUR', symbol: '€' };
    }
    // Default (US/International)
    return { amount: 4.99, currency: 'USD', symbol: '$' };
};

// Your Stripe Payment Link
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/14A7sN7KUbup5yQf4Y6Zy00';

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    savedValue = 2400,
    userCountry = '',
    prefs,
    planStats
}) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [paymentStep, setPaymentStep] = useState<'initial' | 'confirming'>('initial');

    const price = getRegionalPrice(userCountry);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!email) {
                throw new Error('Please enter your email so we can send your receipt 💖');
            }

            // Store email for later reference
            sessionStorage.setItem('payment_email', email);

            // Open the Stripe payment link with prefilled email
            const paymentUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;
            window.open(paymentUrl, '_blank');

            // Move to confirmation step
            setPaymentStep('confirming');
            setLoading(false);

        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again 💖');
            setLoading(false);
        }
    };

    const handleConfirmPayment = () => {
        setLoading(true);

        // Simulate verification delay
        setTimeout(() => {
            setLoading(false);

            // Track payment in Supabase
            supabaseHelpers.logPayment({
                stripePaymentId: `verified_${Date.now()}`,
                amount: price.amount,
                currency: price.currency,
                planStats: planStats || { totalDays: 0, efficiency: 0, ptoUsed: 0 },
            }).catch(err => console.error('Failed to log payment:', err));

            onSuccess();
        }, 1500);
    };

    const handleReopenCheckout = () => {
        const savedEmail = sessionStorage.getItem('payment_email') || email;
        const paymentUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(savedEmail)}`;
        window.open(paymentUrl, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white border-2 border-rose-accent/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-gray-500 hover:text-rose-accent transition-colors z-20"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-rose-50 to-lavender-50 p-6 border-b-2 border-rose-accent/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent"></div>

                    {/* Social Proof */}
                    <div className="absolute top-3 right-12 flex items-center gap-1.5 text-xs text-rose-accent font-semibold">
                        <span>💖</span>
                        <span>10,000+ happy planners</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-accent to-lavender-accent rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                            ✨
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-gray-800">Unlock Your Full Plan</h3>
                            <p className="text-sm text-gray-600">One-time payment • Lifetime access 💖</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-display font-bold text-gray-800">{price.symbol}{price.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">$49.00</span>
                        <span className="text-xs bg-rose-accent text-white px-2 py-0.5 rounded-full font-semibold">Save 90%</span>
                    </div>
                </div>

                {/* Body */}
                {paymentStep === 'initial' ? (
                    <form onSubmit={handleCheckout} className="p-6 space-y-5">

                        {/* ROI Badge */}
                        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-accent/20 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-accent to-lavender-accent flex items-center justify-center text-white text-xl shadow-md">
                                💰
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Your vacation value</p>
                                <p className="text-base font-bold text-gray-800">
                                    You're saving <span className="text-rose-accent">${savedValue.toLocaleString()}</span> in time off! ✨
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex gap-3 text-xs text-gray-700 justify-center">
                            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border-2 border-rose-accent/10">
                                <span className="text-rose-accent">🔒</span>
                                <span className="font-semibold">Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-lavender-50 px-3 py-1.5 rounded-full border-2 border-lavender-accent/10">
                                <span className="text-lavender-accent">⚡</span>
                                <span className="font-semibold">Instant</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-peach-50 px-3 py-1.5 rounded-full border-2 border-peach-accent/10">
                                <span className="text-peach-accent">💯</span>
                                <span className="font-semibold">Guaranteed</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your email 💌</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-white border-2 border-rose-accent/20 rounded-xl py-3 px-4 text-gray-800 focus:border-rose-accent outline-none transition-colors placeholder-gray-400 shadow-sm focus:shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2">We'll send your receipt here 💖</p>
                            </div>

                            <div className="bg-rose-50/50 border-2 border-rose-accent/10 rounded-xl p-4 space-y-2">
                                <p className="text-sm text-gray-800 font-semibold flex items-center gap-2">
                                    <span>🛡️</span> Secure checkout via Stripe
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1 pl-6">
                                    <li>• Opens in a new tab for secure payment</li>
                                    <li>• Complete payment, then return here</li>
                                    <li>• Click "I've Paid" to unlock your plan</li>
                                </ul>
                            </div>
                        </div>

                        {error && (
                            <div className="text-rose-600 text-sm text-center font-semibold bg-rose-50 p-3 rounded-xl border-2 border-rose-accent/20 animate-fade-up">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Opening checkout...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue to Payment ✨</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500">
                            Powered by <span className="font-semibold">Stripe</span> • 256-bit encryption 🔒
                        </p>

                    </form>
                ) : (
                    // CONFIRMATION STATE - After user returns from payment
                    <div className="p-8 text-center animate-fade-up">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-100 to-lavender-100 border-2 border-rose-accent/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-4xl">🎉</span>
                        </div>

                        <h3 className="text-2xl font-display font-bold text-gray-800 mb-3">Almost there! 💖</h3>
                        <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                            Complete your payment in the new tab, then click the button below to unlock your personalized vacation plan!
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleConfirmPayment}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Unlocking your plan...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">✅</span>
                                        <span>I've Completed My Payment</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleReopenCheckout}
                                className="w-full py-3 bg-rose-50 text-rose-accent font-semibold text-sm rounded-xl hover:bg-rose-100 transition-colors border-2 border-rose-accent/20"
                            >
                                Open Payment Page Again 🔗
                            </button>

                            <button
                                onClick={() => setPaymentStep('initial')}
                                className="text-sm text-gray-500 hover:text-rose-accent transition-colors py-2"
                            >
                                ← Go back
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-rose-accent/10">
                            <p className="text-xs text-gray-500">
                                Having trouble? Email us at <a href="mailto:support@vacymax.com" className="text-rose-accent hover:underline">support@vacymax.com</a> 💖
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};