import React, { useState, useMemo, useCallback } from 'react';
import { OptimizationResult } from '../types';
import { PaymentModal, getRegionalPrice } from './PaymentModal';
import { formatDate, formatCurrency, generateGoogleCalendarLink, downloadICS } from '../services/utils';
import { HolidayTooltip, EfficiencyGauge, DistributionChart, YearTimeline } from './Visualizations';

interface ResultsViewProps {
    result: OptimizationResult;
    onReset: () => void;
    onUnlock: () => void;
    isLocked: boolean;
    userCountry?: string;
    prefs: any;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset, onUnlock, isLocked, userCountry, prefs }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // NEW: View Mode Toggle (Joint vs Solo)
    const hasBuddy = result.totalPtoUsedBuddy !== undefined;
    const [viewMode, setViewMode] = useState<'joint' | 'solo'>('joint');

    // Memoize expensive calculations to prevent recalculation on every render
    const visibleBlocks = useMemo(() =>
        isLocked ? result.vacationBlocks.slice(0, 1) : result.vacationBlocks,
        [isLocked, result.vacationBlocks]
    );

    const hiddenBlocks = useMemo(() =>
        result.vacationBlocks.slice(1),
        [result.vacationBlocks]
    );

    const hiddenCount = hiddenBlocks.length;

    const hiddenValue = useMemo(() =>
        hiddenBlocks.reduce((acc, b) => acc + b.monetaryValue, 0),
        [hiddenBlocks]
    );

    const bestHiddenBlock = useMemo(() =>
        hiddenBlocks.reduce((prev, current) => {
            return (prev.totalDaysOff > current.totalDaysOff) ? prev : current;
        }, hiddenBlocks[0] || null),
        [hiddenBlocks]
    );

    const price = useMemo(() => getRegionalPrice(userCountry), [userCountry]);

    // --- DYNAMIC STATS CALCULATION (MEMOIZED) ---
    const stats = useMemo(() => {
        let displayedPtoUsed = result.totalPtoUsed;
        let displayedFreeDays = result.totalFreeDays;
        let multiplier = 0;
        let isInfiniteEfficiency = false;

        if (viewMode === 'solo' || !hasBuddy) {
            displayedPtoUsed = result.totalPtoUsed;
            displayedFreeDays = result.totalFreeDays;
            if (displayedPtoUsed === 0 && result.totalDaysOff > 0) {
                isInfiniteEfficiency = true;
            } else if (displayedPtoUsed > 0) {
                multiplier = result.totalDaysOff / displayedPtoUsed;
            }
        } else {
            const combinedPto = result.totalPtoUsed + (result.totalPtoUsedBuddy || 0);
            const combinedGain = result.totalDaysOff * 2;
            displayedPtoUsed = combinedPto;
            displayedFreeDays = combinedGain - combinedPto;
            if (combinedPto === 0 && combinedGain > 0) {
                isInfiniteEfficiency = true;
            } else if (combinedPto > 0) {
                multiplier = combinedGain / combinedPto;
            }
        }

        return {
            displayedPtoUsed,
            displayedFreeDays,
            multiplier,
            isInfiniteEfficiency,
            planStats: {
                totalDays: result.totalDaysOff,
                efficiency: multiplier,
                ptoUsed: result.totalPtoUsed
            }
        };
    }, [viewMode, hasBuddy, result.totalPtoUsed, result.totalPtoUsedBuddy, result.totalDaysOff, result.totalFreeDays]);

    const { displayedPtoUsed, displayedFreeDays, multiplier, isInfiniteEfficiency, planStats } = stats;

    const handleUnlockClick = useCallback(() => setShowPaymentModal(true), []);
    const handlePaymentSuccess = useCallback(() => {
        setShowPaymentModal(false);
        onUnlock();
    }, [onUnlock]);

    if (!result.vacationBlocks || result.vacationBlocks.length === 0) {
        return (
            <div className="max-w-4xl mx-auto pt-12 text-center animate-enter">
                <div className="text-6xl mb-6">😔</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No optimal blocks found</h2>
                <p className="text-gray-600 mb-8">Try adjusting your preferences and we'll find something perfect for you! 💖</p>
                <button onClick={onReset} className="px-6 py-3 bg-gradient-to-r from-rose-accent to-lavender-accent hover:shadow-lg rounded-xl text-white font-bold transition-all active:scale-95">Start Over</button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 pb-32">

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                savedValue={hiddenValue}
                userCountry={userCountry}
                prefs={prefs}
                planStats={planStats}
            />

            {/* Header Cards with Staggered Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

                {/* Main Stat Card - Feminine Glassmorphism */}
                <div className="lg:col-span-7 md:col-span-2 glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden group animate-enter shadow-xl border-2 border-rose-accent/20">
                    {/* Animated Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-accent/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-rose-accent/20 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender-accent/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-accent/20 text-rose-accent text-xs font-semibold shadow-sm">
                                    <span className="text-base">✨</span>
                                    {result.planName || "Your Perfect Plan!"}
                                </div>

                                {/* Interactive Toggle */}
                                {hasBuddy && (
                                    <div className="flex bg-white/80 border-2 border-rose-accent/20 rounded-full p-1 shadow-sm">
                                        <button
                                            onClick={() => setViewMode('joint')}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${viewMode === 'joint' ? 'bg-gradient-to-r from-rose-accent to-lavender-accent text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Together 💕
                                        </button>
                                        <button
                                            onClick={() => setViewMode('solo')}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${viewMode === 'solo' ? 'bg-gradient-to-r from-rose-accent to-lavender-accent text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Just Me
                                        </button>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-2 tracking-tight">
                                {result.totalDaysOff} Days Off! 🎉
                            </h2>

                            <div className="text-gray-600 text-sm md:text-base min-h-[48px]">
                                {viewMode === 'joint' ? (
                                    <>Your shared adventure uses <strong className="text-rose-accent">{result.totalPtoUsed}</strong> of your days and <strong className="text-lavender-accent">{result.totalPtoUsedBuddy}</strong> of your partner's. 💖</>
                                ) : (
                                    <>Your personal plan uses just <strong className="text-rose-accent">{result.totalPtoUsed} vacation days</strong>. Amazing! ✨</>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-rose-accent/10 grid grid-cols-2 gap-4">
                            <div className="bg-white/60 rounded-2xl p-4 text-center shadow-sm">
                                <p className="text-xs text-gray-500 font-semibold mb-1">Vacation Value</p>
                                <p className="text-2xl font-bold text-gray-800 tracking-tight">{formatCurrency(result.totalValueRecovered)}</p>
                            </div>
                            <div className="bg-gradient-to-r from-rose-50 to-lavender-50 rounded-2xl p-4 text-center shadow-sm border-2 border-rose-accent/10">
                                <p className="text-xs text-rose-accent font-semibold mb-1">
                                    {viewMode === 'joint' ? 'Together Bonus' : 'Your Bonus'} ✨
                                </p>
                                <p className="text-2xl font-bold text-rose-accent tracking-tight">
                                    {isInfiniteEfficiency ? '∞' : `+${((multiplier - 1) * 100).toFixed(0)}%`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Stats - Staggered Entry */}
                <div className="lg:col-span-3 md:col-span-1 animate-enter delay-100">
                    <EfficiencyGauge multiplier={multiplier} isJoint={viewMode === 'joint'} isInfinite={isInfiniteEfficiency} />
                </div>
                <div className="lg:col-span-2 md:col-span-1 animate-enter delay-200">
                    <DistributionChart pto={displayedPtoUsed} free={displayedFreeDays} />
                </div>
            </div>

            <div className="animate-enter delay-300">
                <YearTimeline
                    blocks={visibleBlocks}
                    isLocked={isLocked}
                    timelineStartDate={result.timelineStartDate}
                    targetYear={result.targetYear}
                    viewMode={viewMode}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 animate-enter delay-400">
                    <h3 className="text-xl font-bold text-gray-800">Your Perfect Schedule 💖</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => downloadICS(visibleBlocks)}
                            className="text-xs bg-white/80 hover:bg-white border-2 border-rose-accent/20 hover:border-rose-accent/40 px-4 py-2 rounded-xl text-gray-700 font-semibold transition-all hover:shadow-md active:scale-95"
                        >
                            📥 Download Calendar
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {visibleBlocks.map((block, i) => (
                        <div
                            key={block.id}
                            className="glass-panel glass-panel-hover rounded-2xl p-5 md:p-6 transition-all duration-300 group relative overflow-hidden animate-enter border-2 border-rose-accent/10 hover:border-rose-accent/30 shadow-lg hover:shadow-xl"
                            style={{ animationDelay: `${500 + (i * 100)}ms` }}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-accent to-lavender-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-full"></div>

                            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-semibold bg-rose-50 border-2 border-rose-accent/20 px-3 py-1 rounded-full text-rose-accent">
                                            Trip {i + 1} ✨
                                        </span>
                                        {block.efficiencyScore > 3 && (
                                            <span className="text-xs font-semibold bg-gradient-to-r from-rose-accent to-lavender-accent text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                                ⭐ Best Value!
                                            </span>
                                        )}
                                        {viewMode === 'joint' && block.buddyPtoDaysUsed === 0 && block.ptoDaysUsed === 0 && (
                                            <span className="text-xs font-semibold bg-lavender-50 text-lavender-accent border-2 border-lavender-accent/20 px-3 py-1 rounded-full flex items-center gap-1">
                                                💕 Free Together!
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 tracking-tight">{block.description}</h4>
                                    <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <span className="flex items-center gap-1.5">
                                            📅 {formatDate(block.startDate)} — {formatDate(block.endDate)}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-rose-accent font-semibold">
                                            🎉 {block.totalDaysOff} Days Off
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 border-t-2 md:border-t-0 border-rose-accent/10 pt-4 md:pt-0">
                                    <div className="text-right hidden md:block">
                                        <div className="text-xs text-gray-500 font-semibold">Days Used</div>
                                        <div className="font-bold text-gray-800 text-sm">
                                            You: <span className={block.ptoDaysUsed === 0 ? "text-rose-accent" : ""}>{block.ptoDaysUsed}d</span>
                                            {viewMode === 'joint' && hasBuddy && (
                                                <span className="ml-2 text-gray-400">| Partner: <span className={block.buddyPtoDaysUsed === 0 ? "text-lavender-accent" : ""}>{block.buddyPtoDaysUsed}d</span></span>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={generateGoogleCalendarLink(block)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 bg-gradient-to-r from-rose-accent to-lavender-accent hover:shadow-lg text-white text-xs font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        Add to Calendar 📅
                                    </a>
                                </div>
                            </div>

                            {block.publicHolidaysUsed.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {block.publicHolidaysUsed.map((h, hi) => (
                                        <HolidayTooltip key={hi} holiday={h} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isLocked && hiddenCount > 0 && (
                <div className="relative mt-8 group cursor-pointer animate-enter delay-500" onClick={handleUnlockClick}>
                    {/* Premium Gradient Border Animation */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent rounded-[28px] opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-shimmer bg-[length:200%_100%]"></div>

                    <div className="absolute inset-0 z-10 backdrop-blur-xl bg-white/90 flex items-center justify-center rounded-3xl border-2 border-rose-accent/20 shadow-2xl">
                        <div className="text-center p-6 md:p-8 max-w-lg mx-auto relative w-full">

                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-accent to-lavender-accent text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg z-20 whitespace-nowrap transform group-hover:-translate-y-1 transition-transform">
                                ✨ Unlock {formatCurrency(hiddenValue)} in vacation value!
                            </div>

                            <div className="w-20 h-20 bg-gradient-to-br from-rose-accent to-lavender-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative mt-4 group-hover:scale-110 transition-transform duration-500">
                                <span className="text-4xl">🔓</span>
                                <div className="absolute -inset-2 bg-rose-accent/30 rounded-3xl blur-lg -z-10 animate-pulse"></div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-3 leading-tight">
                                {bestHiddenBlock
                                    ? `Unlock your ${bestHiddenBlock.totalDaysOff}-day getaway! 💖`
                                    : `Discover ${hiddenCount} more amazing trips!`
                                }
                            </h3>

                            <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                                See exactly when to book for <strong className="text-gray-800">{hiddenCount} more vacations</strong> worth <strong className="text-rose-accent">{formatCurrency(hiddenValue)}</strong>. ✨
                            </p>

                            <button className="w-full py-4 bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                                <span>Get My Full Schedule</span>
                                <span className="text-white/70 font-medium line-through">$49</span>
                                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    {price.symbol}{price.amount.toFixed(2)}
                                </span>
                            </button>
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                                <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full border-2 border-rose-accent/10">
                                    <span className="text-rose-accent">🔒</span>
                                    <span className="text-xs text-gray-700 font-semibold">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 bg-lavender-50 px-3 py-1.5 rounded-full border-2 border-lavender-accent/10">
                                    <span className="text-lavender-accent">💯</span>
                                    <span className="text-xs text-gray-700 font-semibold">Money-back Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder Card Blur */}
                    <div className="opacity-20 pointer-events-none select-none blur-sm" aria-hidden="true">
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass-panel rounded-2xl p-6 h-32 flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-rose-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-48 bg-rose-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center pt-8 pb-4 animate-enter delay-500">
                <button onClick={onReset} className="text-gray-500 hover:text-rose-accent text-sm font-semibold transition-colors">
                    ← Start Over
                </button>
            </div>
        </div>
    );
};
