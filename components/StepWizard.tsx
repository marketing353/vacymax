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
    { name: "Australia", flag: "🇦🇺", code: "AU", holidays: 10 }
];

const STRATEGIES = [
    {
        id: OptimizationStrategy.BALANCED,
        title: 'Balanced Mix',
        desc: 'A mix of long trips and quick getaways.',
        roi: 'Most Popular',
        color: 'from-blue-500/20 to-cyan-500/20',
        tooltip: "The Algorithm aims for a healthy mix: 1-2 week-long vacations plus several optimized long weekends. Best efficiency for 10-20 PTO days."
    },
    {
        id: OptimizationStrategy.LONG_WEEKENDS,
        title: 'Frequent Breaks',
        desc: 'Lots of 3-4 day weekends. Avoid burnout.',
        roi: 'Stress Free',
        color: 'from-purple-500/20 to-pink-500/20',
        tooltip: "Maximizes trip frequency. The engine prioritizes turning 1 PTO day into 3-4 days off multiple times a year. Great for preventing burnout."
    },
    {
        id: OptimizationStrategy.EXTENDED,
        title: 'Big Adventures',
        desc: 'Focus on long, 2+ week trips.',
        roi: 'Traveler',
        color: 'from-amber-500/20 to-orange-500/20',
        tooltip: "Quality over quantity. We hoard your PTO to build massive 10+ day blocks for international travel, ignoring shorter opportunities."
    },
    {
        id: OptimizationStrategy.MINI_BREAKS,
        title: 'Regular Resets',
        desc: 'A week off every other month.',
        roi: 'Healthy',
        color: 'from-emerald-500/20 to-teal-500/20',
        tooltip: "Consistency is key. The plan attempts to space your time off evenly throughout the year (e.g., a break every ~60 days)."
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

const LocationSelector = ({
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
    const activeText = isLime ? 'text-lime-accent' : 'text-brand-violet';
    const activeBg = isLime ? 'bg-lime-accent' : 'bg-brand-violet';
    const borderClass = isLime ? 'border-lime-accent' : 'border-brand-violet';
    const shadowClass = isLime ? 'shadow-lime-accent/20' : 'shadow-brand-violet/20';

    return (
        <div className={`${isBuddy ? 'bg-brand-violet/5 border border-brand-violet/20' : ''} rounded-3xl p-6 transition-all duration-500`}>
            <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center gap-2 text-xs font-bold ${activeText} uppercase tracking-widest pl-1`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeBg}`}></div>
                    {label}
                </div>
                {onCopyMine && (
                    <button
                        onClick={onCopyMine}
                        className="text-[10px] font-bold bg-brand-violet/10 text-brand-violet hover:bg-brand-violet/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        <span>Same as mine</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {COUNTRIES.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => onCountryChange(c.name)}
                        className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${countryValue === c.name
                            ? `bg-[#0F1014] ${borderClass} ${shadowClass} shadow-lg scale-[1.02]`
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className="text-4xl mb-3 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{c.flag}</span>
                        <span className={`text-xs font-bold ${countryValue === c.name ? 'text-white' : 'text-slate-400'}`}>{c.code}</span>

                        {countryValue === c.name && (
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${activeBg}`}></div>
                        )}
                    </button>
                ))}
            </div>

            <div className={`transition-all duration-500 ${countryValue ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none'}`}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                    Specific State / Region (Optional)
                </label>
                <DebouncedInput
                    value={regionValue}
                    onChange={onRegionChange}
                    placeholder="e.g. California, Victoria..."
                    isLime={isLime}
                    className="text-sm py-2.5"
                />
            </div>
        </div>
    );
};


// --- STEP COMPONENTS ---

const normalizePtoValue = (rawValue: string) => {
    const parsed = parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 365);
};

export const Step1PTO: React.FC<StepProps> = ({ prefs, updatePrefs, onNext }) => {
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
                    title="Your PTO Balance"
                    subtitle="How many vacation days do you have to use?"
                />
            </div>

            <div className="flex flex-col justify-start w-full mt-2 md:mt-4 pb-4 pr-1 flex-1">
                {/* Buddy Toggle */}
                <div className="flex items-center gap-3 mb-8 bg-white/5 w-max px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Planning with a partner?</span>
                    <button
                        onClick={() => updatePrefs('hasBuddy', !prefs.hasBuddy)}
                        className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${prefs.hasBuddy ? 'bg-lime-accent' : 'bg-slate-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.hasBuddy ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className={`grid gap-8 ${prefs.hasBuddy ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>

                    {/* User Input Card */}
                    <div className="relative group w-full bg-gradient-to-br from-lime-accent/5 to-transparent rounded-3xl p-6 border border-lime-accent/10 focus-within:border-lime-accent/50 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                {prefs.hasBuddy && <span className="bg-lime-accent text-dark-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">You</span>}
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days Available</label>
                            </div>
                            {/* Quick Select Chips */}
                            <div className="flex gap-2">
                                {PRESETS.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => handlePtoChange(preset.toString())}
                                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${userDays === preset ? 'bg-lime-accent text-black border-lime-accent' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}
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
                                className="bg-transparent text-7xl font-display font-bold text-white focus:outline-none placeholder-slate-800 tracking-tighter w-full"
                                placeholder="0"
                            />
                            <span className="text-xl font-bold text-slate-600 absolute right-0 bottom-4 uppercase tracking-widest pointer-events-none">Days</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={userDays}
                            onChange={(e) => handlePtoChange(e.target.value)}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-accent hover:accent-lime-400"
                        />
                    </div>

                    {/* Buddy Input Card */}
                    {prefs.hasBuddy && (
                        <div className="relative group w-full bg-gradient-to-br from-brand-violet/5 to-transparent rounded-3xl p-6 border border-brand-violet/10 focus-within:border-brand-violet/50 transition-all duration-300 animate-fade-up">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="bg-brand-violet text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Partner</span>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days Available</label>
                                </div>
                            </div>

                            <div className="relative flex items-baseline gap-2 mb-6">
                                <input
                                    type="number"
                                    min={0}
                                    max={60}
                                    value={localBuddyPto}
                                    onChange={(e) => handleBuddyPtoChange(e.target.value)}
                                    className="bg-transparent text-7xl font-display font-bold text-white focus:outline-none placeholder-slate-800 tracking-tighter w-full"
                                    placeholder="0"
                                />
                                <span className="text-xl font-bold text-slate-600 absolute right-0 bottom-4 uppercase tracking-widest pointer-events-none">Days</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={buddyDays}
                                onChange={(e) => handleBuddyPtoChange(e.target.value)}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-violet hover:accent-violet-400"
                            />
                        </div>
                    )}
                </div>

                <div className={`mt-8 transition-all duration-500 transform ${totalDays > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Estimated Return</p>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-display font-bold text-white text-glow">~${valueEstimate.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Value Recovered</p>
                        </div>
                        <div className="bg-lime-accent/10 border border-lime-accent/20 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-display font-bold text-lime-accent">~{potentialDays} Days</p>
                            <p className="text-[10px] text-lime-accent/70 uppercase tracking-wider">Total Time Off</p>
                        </div>
                    </div>
                </div>
            </div>

            <NavButtons onNext={handleNextClick} nextDisabled={!canProceed} nextLabel="Confirm Balance" />
        </div>
    );
};

export const Step2Timeframe: React.FC<StepProps> = ({ prefs, updatePrefs, onNext, onBack }) => {
    const options = [
        { value: TimeframeType.CALENDAR_2026, label: '2026', desc: 'Plan your next year early', tag: 'Recommended' },
        { value: TimeframeType.CALENDAR_2025, label: '2025', desc: 'Remaining holidays this year', tag: 'Closing Soon' },
        { value: TimeframeType.ROLLING_12, label: 'Next 12 Months', desc: 'Rolling 12-month calendar', tag: 'Flexible' },
    ];

    const handleSelection = (val: TimeframeType) => {
        updatePrefs('timeframe', val);
    };

    return (
        <div className="flex flex-col h-full justify-between pb-32 md:pb-24 relative">
            <StepHeader
                stepNumber={2}
                totalSteps={TOTAL_STEPS}
                title="Select Year"
                subtitle="Which calendar should we look at?"
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
};

export const Step3Strategy: React.FC<StepProps> = ({ prefs, updatePrefs, onNext, onBack }) => {

    const handleSelection = (id: string) => {
        updatePrefs('strategy', id as any);
    };

    return (
        <div className="flex flex-col h-full justify-between pb-32 md:pb-24 relative">
            <StepHeader
                stepNumber={3}
                totalSteps={TOTAL_STEPS}
                title="Travel Style"
                subtitle="How do you like to spend your time off?"
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
                        accentColor={strat.id === OptimizationStrategy.LONG_WEEKENDS ? 'violet' : 'lime'}
                        tooltipText={strat.tooltip}
                    >
                        {/* Decorative gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${strat.color} opacity-0 transition-opacity duration-500 ${prefs.strategy === strat.id ? 'opacity-100' : 'group-hover:opacity-20'}`}></div>
                    </SelectionCard>
                ))}
            </div>

            <NavButtons onNext={onNext} onBack={onBack} nextLabel="Next" />
        </div>
    );
};

export const Step4Location: React.FC<StepProps> = ({ prefs, updatePrefs, onNext, onBack }) => {

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
                title="Your Location"
                subtitle="We need this to load your public holidays."
            />

            <div className="space-y-8 max-w-4xl mb-8 relative pr-1 pb-4">
                {/* Connecting Line if buddy exists */}
                {prefs.hasBuddy && (
                    <div className="absolute left-6 top-10 bottom-10 w-0.5 border-l-2 border-dashed border-white/10 z-0 hidden md:block"></div>
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
                        <div className="flex items-center gap-4 mb-2 opacity-50 pl-1">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Matching Holidays With</div>
                            <div className="h-px flex-1 bg-white/10"></div>
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
};