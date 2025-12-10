import React from 'react';

interface HowItWorksProps {
    onBack: () => void;
    onLaunch: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onLaunch }) => {
    return (
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-24 animate-fade-up">

            {/* Header - Simple Style */}
            <div className="text-center space-y-6 max-w-4xl mx-auto relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#0F1014] border border-lime-accent/30 rounded-sm text-lime-accent text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(132,204,22,0.1)]">
                    <span className="w-2 h-2 bg-lime-accent animate-pulse"></span>
                    The Strategy
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1]">
                    The 3-Step <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-accent to-emerald-400">Holiday Hack.</span>
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    We don't just "show you a calendar". We use a graph traversal algorithm to find the optimal path through the year, maximizing your time off while minimizing PTO usage.
                </p>
            </div>

            {/* The Visualizer */}
            <div className="relative w-full max-w-5xl mx-auto">
                {/* Blueprint Grid Background */}
                <div className="absolute inset-0 border border-white/5 rounded-3xl bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="relative z-10 bg-[#050505]/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Simple Breakdown */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-lime-accent/10 flex items-center justify-center text-lime-accent text-sm border border-lime-accent/20">1</span>
                                    Identify Anchors
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-11">
                                    We map out every weekend and public holiday in your region. These are your "Anchors"—the foundation of your leave.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-lime-accent/10 flex items-center justify-center text-lime-accent text-sm border border-lime-accent/20">2</span>
                                    Locate Bridges
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-11">
                                    We search for "Bridges"—short 1-2 day gaps between Anchors. Filling these gaps connects separate time-off blocks into one massive vacation.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-lime-accent/10 flex items-center justify-center text-lime-accent text-sm border border-lime-accent/20">3</span>
                                    Calculate ROI
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-11">
                                    We rank every opportunity by "Day Off Efficiency". If a trip gives you 3 days off for 1 PTO day, it gets a high score.
                                </p>
                            </div>
                        </div>

                        {/* Right: The Visualizer */}
                        <div className="relative h-[400px] bg-[#0F1014] border border-white/10 rounded-xl flex items-center justify-center p-8 overflow-hidden group">
                            {/* Abstract Node Graph */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                                <svg width="400" height="300" viewBox="0 0 400 300" className="stroke-white/20">
                                    <line x1="50" y1="150" x2="350" y2="150" strokeWidth="2" />
                                    <line x1="100" y1="50" x2="100" y2="250" strokeWidth="1" strokeDasharray="5,5" />
                                    <line x1="200" y1="50" x2="200" y2="250" strokeWidth="1" strokeDasharray="5,5" />
                                    <line x1="300" y1="50" x2="300" y2="250" strokeWidth="1" strokeDasharray="5,5" />
                                    <circle cx="50" cy="150" r="4" fill="#334155" />
                                    <circle cx="350" cy="150" r="4" fill="#334155" />
                                </svg>
                            </div>

                            {/* Active Calculation Overlay */}
                            <div className="relative z-10 w-full max-w-sm bg-dark-900 border border-lime-accent/30 rounded-lg p-4 font-mono text-xs shadow-[0_0_30px_rgba(132,204,22,0.1)]">
                                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                                    <span className="text-lime-accent font-bold">VACATION_PLANNER</span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-pulse"></span>
                                        SEARCHING
                                    </span>
                                </div>
                                <div className="space-y-2 text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Checking May 23rd...</span>
                                        <span className="text-red-400 bg-red-400/10 px-1 rounded">WORKDAY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Checking May 24th...</span>
                                        <span className="text-lime-accent bg-lime-accent/10 px-1 rounded">WEEKEND</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Checking May 26th...</span>
                                        <span className="text-brand-violet bg-brand-violet/10 px-1 rounded">HOLIDAY</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 mt-2 text-lime-accent font-bold">
                                        {'>> OPPORTUNITY DETECTED!'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1 bg-lime-accent flex-1 rounded-full"></div>
                                        <span className="text-white">Efficiency: 400%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        icon: "⚙️",
                        title: "Smart Matching",
                        desc: "We don't just guess. We use the actual calendar data to find the best dates."
                    },
                    {
                        icon: "📈",
                        title: "Value Calculator",
                        desc: "Your time is money. We show you exactly how much your vacation days are worth."
                    },
                    {
                        icon: "🔒",
                        title: "Private & Safe",
                        desc: "Your data stays on your device. We don't store your personal information."
                    },
                ].map((item, i) => (
                    <div key={i} className="bg-[#0F1014] border border-white/10 p-8 rounded-2xl hover:border-lime-accent/30 transition-colors group">
                        <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">{item.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Final CTA */}
            <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-accent/10 blur-[80px] rounded-full pointer-events-none"></div>

                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 relative z-10">Stop guessing. Start planning.</h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                    <button
                        onClick={onLaunch}
                        className="px-10 py-5 bg-lime-accent text-dark-900 text-xl font-bold font-display rounded-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(190,242,100,0.4)] transition-all duration-300"
                    >
                        Start My Plan
                    </button>
                    <button
                        onClick={() => {
                            // We need to trigger a reset here if possible, but simplest is just ensuring
                            // the user goes back to a fresh state or just navigates back.
                            // Ideally we pass a reset handler, but for now just Back implies re-entry.
                            onBack();
                        }}
                        className="px-8 py-5 text-slate-400 font-bold hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>

        </div>
    );
};