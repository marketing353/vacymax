import React, { useState, useEffect } from 'react';
import { UserPreferences, OptimizationStrategy, TimeframeType } from '../types';
import { StepHeader, NavButtons, SelectionCard, DebouncedInput } from './Shared';

const TOTAL_STEPS = 4;

// --- CONSTANTS & STATIC DATA ---
const DAILY_VALUE_ESTIMATE = 460;
const EFFICIENCY_MULTIPLIER = 2.8;

const COUNTRIES = [
    { name: "United States", flag: "🇺🇸", code: "US", holidays: 11 },
    { name: "United Kingdom", flag: "🇬🇧", code: "UK", holidays: 8 },
    { name: "Canada", flag: "🇨🇦", code: "CA", holidays: 10 },
    { name: "Australia", flag: "🇦🇺", code: "AU", holidays: 10 },
    { name: "Europe", flag: "🇪🇺", code: "EU", holidays: 11 }
];

const STRATEGIES = [
    {
        id: OptimizationStrategy.BALANCED,
        title: 'Balanced Mix 💖',
        desc: 'A perfect blend of long getaways and refreshing mini-breaks.',
        roi: 'Most Popular',
        color: 'from-rose-500/10 to-lavender-500/10',
        tooltip: "We'll create a healthy mix: 1-2 week-long vacations plus several optimized long weekends. Perfect for 10-20 PTO days."
    },
    {
        id: OptimizationStrategy.LONG_WEEKENDS,
        title: 'Frequent Breaks ✨',
        desc: 'Lots of 3-4 day weekends to recharge regularly.',
        roi: 'Self-Care',
        color: 'from-lavender-500/10 to-peach-500/10',
        tooltip: "Maximizes your break frequency. Great for preventing burnout and maintaining work-life balance throughout the year."
    },
    {
        id: OptimizationStrategy.EXTENDED,
        title: 'Big Adventures 🌍',
        desc: 'Focus on longer 2+ week trips for amazing experiences.',
        roi: 'Dream Trips',
        color: 'from-peach-500/10 to-rose-500/10',
        tooltip: "Quality over quantity. We'll combine your days for those dream destination trips you've been planning."
    },
    {
        id: OptimizationStrategy.MINI_BREAKS,
        title: 'Regular Resets 🌸',
        desc: 'A week off every couple months for consistent self-care.',
        roi: 'Wellness',
        color: 'from-rose-500/10 to-lavender-500/10',
        tooltip: "Consistency is key for wellbeing. We'll space your time off evenly throughout the year for regular rejuvenation."
    },
];

interface StepProps {
    prefs: UserPreferences;
    updatePrefs: <K extends keyof UserPreferences>(
        key: K,
        value: UserPreferences[K]
    ) => void;
    onNext: () => void;
    onBack?: () => void;
}

const LocationSelector = React.memo(({
    label,
    countryValue,
    regionValue,
    onCountryChange,
    onRegionChange,
    accentColor = 'lime',
    isBuddy = false,
    onCopyMine
}: {
    label: string,
    countryValue: string,
    regionValue: string,
    onCountryChange: (val: string) => void,
    onRegionChange: (val: string) => void,
    accentColor?: 'lime' | 'violet',
    isBuddy?: boolean,
    onCopyMine?: () => void
}) => {
    const isLime = accentColor === 'lime';
    const activeText = isLime ? 'text-rose-accent' : 'text-lavender-accent';
    const activeBg = isLime ? 'bg-rose-accent' : 'bg-lavender-accent';
    const borderClass = isLime ? 'border-rose-accent' : 'border-lavender-accent';
    const shadowClass = isLime ? 'shadow-rose-accent/20' : 'shadow-lavender-accent/20';
    return (
        <div className={`${isBuddy ? 'bg-lavender-50 border-2 border-lavender-accent/20' : ''} rounded-3xl p-6 transition-all duration-500`}>
            <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center gap-2 text-xs font-bold ${activeText} uppercase tracking-widest pl-1`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeBg}`}></div>
                    {label}
                </div>
                {onCopyMine && (
                    <button
                        onClick={onCopyMine}
                        className="text-[10px] font-bold bg-lavender-50 text-lavender-accent hover:bg-lavender-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-lavender-100"
                    >
                        <span>Same as mine</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {COUNTRIES.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => onCountryChange(c.name)}
                        className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${countryValue === c.name
                            ? `bg-white ${borderClass} ${shadowClass} shadow-lg scale-[1.02]`
                            : 'bg-white/60 border-rose-accent/10 hover:bg-white hover:border-rose-accent/30'
                            }`}
                    >
                        <span className="text-4xl mb-3 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{c.flag}</span>
                        <span className={`text-xs font-bold ${countryValue === c.name ? 'text-gray-800' : 'text-gray-600'}`}>{c.code}</span>

                        {countryValue === c.name && (
                            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${activeBg}`}></div>
                        )}
                    </button>
                ))}
            </div>

            <div className={`transition-all duration-500 ${countryValue ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2 pointer-events-none'}`}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                    Specific State / Region (Optional)
                </label>
                <DebouncedInput
                    value={regionValue}
                    onChange={onRegionChange}
                    placeholder="e.g. California, Victoria..."
                    isLime={isRose}
                    className="text-sm py-2.5 bg-white"
                />
            </div>
        </div>
    );
});


// --- STEP COMPONENTS ---

const normalizePtoValue = (rawValue: string) => {
    const parsed = parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 365);
};

export const Step1PTO: React.FC<StepProps> = React.memo(({ prefs, updatePrefs, onNext }) => {
    const userDays = prefs.ptoDays;
    const buddyDays = prefs.buddyPtoDays || 0;

    const [localPto, setLocalPto] = useState<string>(userDays.toString());
    const [localBuddyPto, setLocalBuddyPto] = useState<string>(buddyDays.toString());

    useEffect(() => {
        setLocalPto(userDays.toString());
    }, [userDays]);

    useEffect(() => {
        if (prefs.hasBuddy) setLocalBuddyPto(buddyDays.toString());
    }, [buddyDays, prefs.hasBuddy]);

    const handlePtoChange = (valStr: string) => {
        setLocalPto(valStr);
        updatePrefs('ptoDays', normalizePtoValue(valStr));
    };

    const handleBuddyPtoChange = (valStr: string) => {
        setLocalBuddyPto(valStr);
        updatePrefs('buddyPtoDays', normalizePtoValue(valStr));
    };

    const totals = React.useMemo(() => {
        const total = userDays + (prefs.hasBuddy ? buddyDays : 0);
        const safeTotal = Number.isFinite(total) ? total : 0;

        return {
            totalDays: safeTotal,
            valueEstimate: safeTotal * DAILY_VALUE_ESTIMATE,
            potentialDays: Math.round(safeTotal * EFFICIENCY_MULTIPLIER),
        };
    }, [buddyDays, prefs.hasBuddy, userDays]);

    const { totalDays, valueEstimate, potentialDays } = totals;
    const canProceed = totalDays > 0;

    // Manual next button is still good for inputs
    const handleNextClick = () => {
        if (!canProceed) return;
        onNext();
    };

    const PRESETS = [10, 15, 20, 25];

    return (
        <div className="flex flex-col h-full relative pb-32">
            <div className="pt-2">
                <StepHeader
                    stepNumber={1}
                    totalSteps={TOTAL_STEPS}
                    title="Your Days Off 💖"
                    subtitle="How many vacation days do you have available?"
                />
            </div>

            <div className="flex flex-col justify-start w-full mt-2 md:mt-4 pb-4 pr-1 flex-1">
                {/* Buddy Toggle */}
                <div className="flex items-center gap-3 mb-8 bg-lavender-50 w-max px-4 py-2.5 rounded-full border-2 border-lavender-accent/20 hover:border-lavender-accent/40 transition-colors shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">Planning with someone special? 💕</span>
                    <button
                        onClick={() => updatePrefs('hasBuddy', !prefs.hasBuddy)}
                        className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-accent focus-visible:ring-offset-2 ${prefs.hasBuddy ? 'bg-gradient-to-r from-rose-accent to-lavender-accent' : 'bg-gray-300'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${prefs.hasBuddy ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className={`grid gap-8 ${prefs.hasBuddy ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>

                    {/* User Input Card */}
                    <div className="relative group w-full bg-gradient-to-br from-rose-50 to-lavender-50 rounded-3xl p-6 border-2 border-rose-accent/20 focus-within:border-rose-accent/50 transition-all duration-300 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                {prefs.hasBuddy && <span className="bg-gradient-to-r from-rose-accent to-lavender-accent text-white text-xs font-semibold px-3 py-1 rounded-full">You 💖</span>}
                                <label className="text-sm font-semibold text-gray-700">Days Available</label>
                            </div>
                            {/* Quick Select Chips */}
                            <div className="flex gap-2">
                                {PRESETS.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => handlePtoChange(preset.toString())}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-colors ${userDays === preset ? 'bg-gradient-to-r from-rose-accent to-lavender-accent text-white border-transparent' : 'bg-white text-gray-600 border-rose-accent/20 hover:border-rose-accent/40'}`}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex items-baseline gap-2 mb-6">
                            <input
                                type="number"
                                min={0}
                                max={60}
                                value={localPto}
                                onChange={(e) => handlePtoChange(e.target.value)}
                                className="bg-transparent text-7xl font-display font-bold text-gray-800 focus:outline-none placeholder-gray-300 tracking-tighter w-full"
                                placeholder="0"
                            />
                            <span className="text-xl font-bold text-gray-400 absolute right-0 bottom-4 pointer-events-none">Days</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={userDays}
                            onChange={(e) => handlePtoChange(e.target.value)}
                            className="w-full h-2.5 bg-rose-100 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Buddy Input Card */}
                    {prefs.hasBuddy && (
                        <div className="relative group w-full bg-gradient-to-br from-lavender-50 to-peach-50 rounded-3xl p-6 border-2 border-lavender-accent/20 focus-within:border-lavender-accent/50 transition-all duration-300 animate-fade-up shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="bg-gradient-to-r from-lavender-accent to-peach-accent text-white text-xs font-semibold px-3 py-1 rounded-full">Partner 💕</span>
                                    <label className="text-sm font-semibold text-gray-700">Days Available</label>
                                </div>
                            </div>

                            <div className="relative flex items-baseline gap-2 mb-6">
                                <input
                                    type="number"
                                    min={0}
                                    max={60}
                                    value={localBuddyPto}
                                    onChange={(e) => handleBuddyPtoChange(e.target.value)}
                                    className="bg-transparent text-7xl font-display font-bold text-gray-800 focus:outline-none placeholder-gray-300 tracking-tighter w-full"
                                    placeholder="0"
                                    style={{ color: '#4B5563' }} // Force dark text
                                />
                                <span className="text-xl font-bold text-gray-400 absolute right-0 bottom-4 pointer-events-none">Days</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={buddyDays}
                                onChange={(e) => handleBuddyPtoChange(e.target.value)}
                                className="w-full h-2.5 bg-lavender-100 rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                <div className={`mt-8 transition-all duration-500 transform ${totalDays > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-center text-sm text-gray-600 font-semibold mb-4">✨ Your potential results</p>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="bg-white/80 border-2 border-rose-accent/10 rounded-2xl p-5 text-center shadow-lg">
                            <p className="text-2xl font-display font-bold text-gray-800">~${valueEstimate.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 font-semibold">in vacation value</p>
                        </div>
                        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-accent/20 rounded-2xl p-5 text-center shadow-lg">
                            <p className="text-2xl font-display font-bold text-rose-accent">~{potentialDays} Days 💖</p>
                            <p className="text-xs text-rose-accent/70 font-semibold">of time off!</p>
                        </div>
                    </div>
                </div>
            </div>

            <NavButtons onNext={handleNextClick} nextDisabled={!canProceed} nextLabel="Confirm Balance" />
        </div>
    );
});

export const Step2Timeframe: React.FC<StepProps> = React.memo(({ prefs, updatePrefs, onNext, onBack }) => {
    const options = [
        { value: TimeframeType.CALENDAR_2026, label: '2026 ✨', desc: 'Plan your amazing year ahead!', tag: 'Recommended' },
        { value: TimeframeType.CALENDAR_2025, label: '2025', desc: 'Use remaining days this year', tag: 'Ending Soon' },
        { value: TimeframeType.ROLLING_12, label: 'Next 12 Months', desc: 'Flexible rolling calendar', tag: 'Flexible' },
    ];

    const handleSelection = (val: TimeframeType) => {
        updatePrefs('timeframe', val);
    };

    return (
        <div className="flex flex-col h-full justify-between pb-32 md:pb-24 relative">
            <StepHeader
                stepNumber={2}
                totalSteps={TOTAL_STEPS}
                title="Choose Your Year 📅"
                subtitle="Which calendar should we plan for you?"
            />

            <div className="grid grid-cols-1 gap-4 max-w-3xl mb-8 pr-1">
                {options.map((opt) => (
                    <SelectionCard
                        key={opt.value}
                        selected={prefs.timeframe === opt.value}
                        onClick={() => handleSelection(opt.value)}
                        title={opt.label}
                        desc={opt.desc}
                        tag={opt.tag}
                    />
                ))}
            </div>

            <NavButtons onNext={onNext} onBack={onBack} nextLabel="Next" />
        </div>
    );
});

export const Step3Strategy: React.FC<StepProps> = React.memo(({ prefs, updatePrefs, onNext, onBack }) => {

    const handleSelection = (id: string) => {
        updatePrefs('strategy', id as any);
    };

    return (
        <div className="flex flex-col h-full justify-between pb-32 md:pb-24 relative">
            <StepHeader
                stepNumber={3}
                totalSteps={TOTAL_STEPS}
                title="Your Style 💫"
                subtitle="How do you like to recharge?"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mb-8 pr-1">
                {STRATEGIES.map((strat) => (
                    <SelectionCard
                        key={strat.id}
                        selected={prefs.strategy === strat.id}
                        onClick={() => handleSelection(strat.id)}
                        title={strat.title}
                        desc={strat.desc}
                        tag={strat.roi}
                        accentColor={strat.id === OptimizationStrategy.LONG_WEEKENDS ? 'violet' : 'lime'} // Mapped to Lavender/Rose in component
                        tooltipText={strat.tooltip}
                    >
                        {/* Decorative gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${strat.color} opacity-0 transition-opacity duration-500 rounded-3xl ${prefs.strategy === strat.id ? 'opacity-100' : 'group-hover:opacity-20'}`}></div>
                    </SelectionCard>
                ))}
            </div>

            <NavButtons onNext={onNext} onBack={onBack} nextLabel="Next" />
        </div>
    );
});

export const Step4Location: React.FC<StepProps> = React.memo(({ prefs, updatePrefs, onNext, onBack }) => {

    const nextDisabled = !prefs.country || (prefs.hasBuddy && !prefs.buddyCountry);
    const [generating, setGenerating] = useState(false);

    const handleCopyMine = () => {
        updatePrefs('buddyCountry', prefs.country);
        updatePrefs('buddyRegion', prefs.region);
    };

    const handleGenerateClick = () => {
        setGenerating(true);
        setTimeout(() => {
            onNext();
        }, 600);
    };

    return (
        <div className="flex flex-col h-full justify-between pb-32 md:pb-24 relative">
            <StepHeader
                stepNumber={4}
                totalSteps={TOTAL_STEPS}
                title="Where Are You? 🌍"
                subtitle="We need this to find your local holidays."
            />

            <div className="space-y-8 max-w-4xl mb-8 relative pr-1 pb-4">
                {/* Connecting Line if buddy exists */}
                {prefs.hasBuddy && (
                    <div className="absolute left-6 top-10 bottom-10 w-0.5 border-l-2 border-dashed border-rose-200/50 z-0 hidden md:block"></div>
                )}

                {/* User Location */}
                <div className="relative z-10">
                    <LocationSelector
                        label="Your Region"
                        countryValue={prefs.country}
                        regionValue={prefs.region}
                        onCountryChange={(v) => updatePrefs('country', v)}
                        onRegionChange={(v) => updatePrefs('region', v)}
                        accentColor="lime"
                    />
                </div>

                {/* Buddy Location */}
                {prefs.hasBuddy && (
                    <div className="animate-fade-up relative z-10">
                        <div className="flex items-center gap-4 mb-2 opacity-70 pl-1">
                            <div className="h-px flex-1 bg-rose-100"></div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300">Matching Holidays With</div>
                            <div className="h-px flex-1 bg-rose-100"></div>
                        </div>
                        <LocationSelector
                            label="Buddy's Region"
                            countryValue={prefs.buddyCountry || ''}
                            regionValue={prefs.buddyRegion || ''}
                            onCountryChange={(v) => updatePrefs('buddyCountry', v)}
                            onRegionChange={(v) => updatePrefs('buddyRegion', v)}
                            accentColor="violet"
                            isBuddy={true}
                            onCopyMine={prefs.country ? handleCopyMine : undefined}
                        />
                    </div>
                )}
            </div>

            <NavButtons
                onNext={handleGenerateClick}
                onBack={onBack}
                nextDisabled={nextDisabled}
                nextLabel="Generate Plan"
                isLoading={generating}
            />
        </div>
    );
});
