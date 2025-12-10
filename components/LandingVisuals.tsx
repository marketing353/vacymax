import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- PHASE 1: THE HOOK (Welcoming Hero) ---
export const PainHero = ({ onCta }: { onCta: () => void }) => {
    const [region, setRegion] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
    const [scannedDays, setScannedDays] = useState(0);

    const handleRegionSelect = (r: string) => {
        setRegion(r);
        setStatus('scanning');

        // Simulated scan effect
        let count = 0;
        const interval = setInterval(() => {
            count += 1;
            setScannedDays(count);
            if (count >= 14) {
                clearInterval(interval);
                setStatus('complete');
            }
        }, 100);
    };

    return (
        <div className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden bg-gradient-to-br from-light-100 via-light-200 to-light-300 min-h-[90vh] flex flex-col justify-center">
            {/* Soft Decorative Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/50 via-transparent to-lavender-100/30 z-0"></div>

            {/* Decorative Floating Elements */}
            <div className="absolute top-20 right-20 text-6xl opacity-20 animate-float">✨</div>
            <div className="absolute bottom-32 left-16 text-5xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>💖</div>
            <div className="absolute top-1/3 right-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🌸</div>

            {/* Ambient Glow */}
            <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] bg-rose-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-lavender-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Column: Copy */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border-2 border-rose-accent/30 bg-white/60 backdrop-blur-sm text-rose-accent text-xs font-semibold tracking-wide shadow-lg">
                        <span className="text-lg">✨</span>
                        Ready for 2026 Planning!
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-gray-800 leading-[1.1] mb-8">
                        Maximize Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent">Time Off</span> 💖
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed mb-10 font-medium">
                        You deserve more <strong className="text-gray-800">quality time</strong> for yourself.<br />
                        We help you plan smarter so <span className="text-rose-accent">10 vacation days</span> become <span className="text-rose-accent font-bold">24 days of freedom</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex flex-col items-center sm:items-start gap-3 w-full sm:w-auto">
                            <button
                                onClick={onCta}
                                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-rose-accent to-lavender-accent hover:shadow-2xl text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 group"
                            >
                                Plan My Perfect Year ✨
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                <span className="text-rose-accent text-lg">💖</span>
                                Free to start • No credit card needed
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-rose-accent/10 flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-11 h-11 rounded-full border-3 border-white bg-gradient-to-br from-rose-100 to-lavender-100 flex items-center justify-center text-xs shadow-md">
                                    <img src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${i + 20}`} className="w-full h-full rounded-full" alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex text-rose-accent mb-0.5 text-sm gap-0.5">
                                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                            </div>
                            <p className="text-gray-800 font-bold">14,203 Happy Planners</p>
                            <p className="text-gray-500">Creating their perfect balance</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Interactive Demo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-accent/10 to-lavender-accent/10 rounded-[2.5rem] blur-3xl -z-10 transform rotate-3"></div>
                    <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 border-2 border-rose-accent/20 relative overflow-hidden min-h-[480px] flex flex-col shadow-2xl bg-white/80 backdrop-blur-xl">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 border-b-2 border-rose-accent/10 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🗓️</span>
                                <span className="font-display font-bold text-gray-800">Quick Preview</span>
                            </div>
                            <div className="text-xs text-rose-accent font-semibold bg-rose-50 px-3 py-1.5 rounded-full border border-rose-accent/20">
                                ✨ 2026 Ready
                            </div>
                        </div>

                        {status === 'idle' && (
                            <div className="flex-1 flex flex-col justify-center animate-fade-up">
                                <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">Where do you live? 🌍</h3>
                                <p className="text-gray-600 mb-6">See how many extra days off you could get!</p>

                                <div className="space-y-3">
                                    {['United States', 'United Kingdom', 'Canada', 'Australia', 'Europe'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => handleRegionSelect(r)}
                                            className="w-full text-left px-6 py-5 rounded-2xl bg-white/60 hover:bg-gradient-to-r hover:from-rose-50 hover:to-lavender-50 border-2 border-rose-accent/10 hover:border-rose-accent/30 transition-all flex justify-between items-center group shadow-sm hover:shadow-md"
                                        >
                                            <span className="text-gray-800 font-semibold group-hover:text-rose-accent transition-colors">{r}</span>
                                            <span className="text-rose-accent/50 group-hover:text-rose-accent transition-colors">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {status === 'scanning' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 to-lavender-100/30 animate-pulse rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 border-4 border-rose-100 border-t-rose-accent rounded-full animate-spin mb-8"></div>
                                    <h4 className="text-2xl font-display font-bold text-gray-800 mb-2">Finding your opportunities... ✨</h4>
                                    <p className="text-gray-600 mb-8 text-sm">Analyzing {region} holidays</p>
                                    <div className="text-6xl font-display font-bold text-rose-accent tabular-nums">
                                        {scannedDays}
                                    </div>
                                    <p className="text-gray-600 text-sm font-semibold mt-2">bonus days found!</p>
                                </div>
                            </div>
                        )}

                        {status === 'complete' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
                                <div className="w-20 h-20 bg-gradient-to-br from-rose-accent to-lavender-accent rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-xl rotate-3">
                                    🎉
                                </div>
                                <h4 className="text-3xl font-display font-bold text-gray-800 mb-4">Amazing news! 💖</h4>
                                <div className="bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-accent/20 rounded-2xl p-6 mb-8 w-full shadow-inner">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 text-sm font-semibold">Your vacation days</span>
                                        <span className="text-gray-800 font-bold">10 days</span>
                                    </div>
                                    <div className="w-full h-px bg-rose-accent/20 my-3"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-rose-accent text-sm font-semibold">Your time off</span>
                                        <span className="text-rose-accent font-bold text-2xl">24 days! ✨</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onCta}
                                    className="w-full py-4 bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold font-display tracking-wide rounded-2xl hover:shadow-xl transition-all shadow-lg"
                                >
                                    Create My Personal Plan 💖
                                </button>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-sm text-gray-500 hover:text-rose-accent font-semibold transition-colors"
                                >
                                    Try another country
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- PHASE 2: THE VALUE CALCULATOR ---
export const BurnCalculator = () => {
    const [salary, setSalary] = useState(85000);
    const [daysLeft, setDaysLeft] = useState(8);

    // Calculation: (Salary / 260 working days) * Days Left
    const dailyRate = salary / 260;
    const value = Math.round(dailyRate * daysLeft);

    return (
        <div className="w-full bg-gradient-to-br from-rose-50/50 via-white to-lavender-50/50 border-y-2 border-rose-accent/10 py-32 relative overflow-hidden">
            {/* Soft Pattern Background */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,157,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-20 text-4xl opacity-20">💰</div>
            <div className="absolute bottom-16 left-24 text-3xl opacity-15">✨</div>

            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 border-2 border-rose-accent/20 rounded-full text-rose-accent text-sm font-semibold">
                        💡 Did you know?
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 leading-[1.2]">
                        Your time off is<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-accent to-lavender-accent">worth so much</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                        When you don't use your vacation days wisely, you're leaving value on the table. Let us help you maximize every single day! 💖
                    </p>

                    <div className="flex gap-8">
                        <div className="bg-white/80 rounded-2xl p-5 shadow-lg border-2 border-rose-accent/10">
                            <p className="text-3xl font-display font-bold text-gray-800">{Math.round((260 - daysLeft) / 260 * 100)}%</p>
                            <p className="text-xs text-gray-500 font-semibold">of your year working</p>
                        </div>
                        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 rounded-2xl p-5 shadow-lg border-2 border-rose-accent/20">
                            <p className="text-3xl font-display font-bold text-rose-accent">${value.toLocaleString()}</p>
                            <p className="text-xs text-rose-accent/70 font-semibold">vacation value</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[2rem] p-10 border-2 border-rose-accent/20 relative shadow-2xl bg-white/90">
                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700">Your annual salary</label>
                                <span className="text-rose-accent font-bold">${salary.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="30000"
                                max="300000"
                                step="5000"
                                value={salary}
                                onChange={(e) => setSalary(Number(e.target.value))}
                                className="w-full h-2.5 bg-rose-100 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700">Days you have left</label>
                                <span className="text-lavender-accent font-bold">{daysLeft} days</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={daysLeft}
                                onChange={(e) => setDaysLeft(Number(e.target.value))}
                                className="w-full h-2.5 bg-lavender-100 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="pt-8 border-t-2 border-rose-accent/10">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm font-bold text-gray-700">Value of your time off</p>
                                <p className="text-xs text-rose-accent font-semibold bg-rose-50 px-3 py-1 rounded-full">✨ Worth it!</p>
                            </div>
                            <div className="text-5xl font-display font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-rose-accent to-lavender-accent mb-8">
                                ${value.toLocaleString()}
                            </div>
                            <button
                                onClick={() => document.getElementById('wizard-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full py-5 bg-gradient-to-r from-rose-accent to-lavender-accent text-white text-lg rounded-2xl transition-all font-bold flex items-center justify-center gap-2 hover:shadow-xl shadow-lg"
                            >
                                Maximize My Time 💖
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PHASE 3: THE BENEFITS (Bento Grid) ---
export const SolutionGrid = () => {
    return (
        <div className="w-full bg-gradient-to-b from-white to-light-100 py-32 px-6 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lavender-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-lavender-50 border-2 border-lavender-accent/20 rounded-full text-lavender-accent text-sm font-semibold">
                        ✨ How it works
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6">Smart planning for<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent">your perfect balance</span></h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We've made vacation planning simple, beautiful, and incredibly effective. Here's how we help you get more out of life. 💖
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1: Smart Matching */}
                    <div className="md:col-span-2 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-rose-accent/10 hover:border-rose-accent/30 transition-all duration-500 rounded-3xl p-10 flex flex-col justify-between group relative overflow-hidden min-h-[380px] shadow-lg hover:shadow-xl">
                        <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">🗓️</div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-lavender-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">💫</div>
                            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Smart Day Matching</h3>
                            <p className="text-gray-600 text-base leading-relaxed max-w-md">
                                We find the perfect days to take off - the ones that connect weekends and holidays - so 1 vacation day can become 4 days off! It's like magic. ✨
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Weekend Protection */}
                    <div className="md:col-span-1 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-lavender-accent/10 hover:border-lavender-accent/30 transition-all rounded-3xl p-8 flex flex-col justify-center gap-5 group shadow-lg hover:shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-peach-100 rounded-xl flex items-center justify-center text-2xl shadow-md">🛡️</div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-gray-800 mb-2">Weekend Protected</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We never suggest using vacation days on weekends - those are already yours! 💖
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Easy Export */}
                    <div className="md:col-span-1 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-peach-accent/10 hover:border-peach-accent/30 transition-all rounded-3xl p-8 flex flex-col justify-center gap-5 group shadow-lg hover:shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-peach-100 to-rose-100 rounded-xl flex items-center justify-center text-2xl shadow-md">📱</div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-gray-800 mb-2">One-Click Sync</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Add your perfect schedule to Google, Outlook, or Apple Calendar instantly!
                            </p>
                        </div>
                    </div>

                    {/* Feature 4: Never Miss Out */}
                    <div className="md:col-span-2 bg-gradient-to-r from-rose-50 to-lavender-50 hover:from-rose-100 hover:to-lavender-100 border-2 border-rose-accent/10 hover:border-rose-accent/20 transition-all rounded-3xl p-10 flex items-center gap-8 group relative overflow-hidden shadow-lg hover:shadow-xl">
                        <div className="absolute -right-10 -bottom-10 text-8xl opacity-10">🌟</div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-display font-bold text-gray-800 mb-3">Never lose a day 💖</h3>
                            <p className="text-gray-600 leading-relaxed max-w-md">
                                Year ending soon? We prioritize your expiring days first, making sure you use every single one for the experiences you deserve.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PHASE 4: SOCIAL PROOF (Testimonials) ---
export const BattleTestedMarquee = () => {
    const testimonials = [
        "Turned 12 days into 35 days off - finally took that trip to Italy! 🇮🇹",
        "My friends can't believe how smart my vacation planning is now 💖",
        "Already planned all of 2026. So excited for my getaways! ✨",
        "This is exactly what I needed for work-life balance",
        "Simple, beautiful, and actually works!",
        "Finally using all my vacation days wisely 🎉",
        "Perfect for planning girls' trips with friends!",
    ];

    return (
        <div className="w-full bg-gradient-to-r from-rose-50 via-white to-lavender-50 border-y-2 border-rose-accent/10 py-10 overflow-hidden relative">
            <div className="flex gap-16 animate-scroll w-max hover:[animation-play-state:paused] relative z-10">
                {[...testimonials, ...testimonials, ...testimonials].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity cursor-default">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-accent to-lavender-accent"></div>
                        <span className="text-gray-700 font-semibold text-lg whitespace-nowrap font-display tracking-tight">"{text}"</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
