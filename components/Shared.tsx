import React, { useState, useEffect, useRef } from 'react';

export const StepHeader = React.memo(({ stepNumber, totalSteps, title, subtitle }: { stepNumber: number, totalSteps: number, title: React.ReactNode, subtitle: string }) => (
    <div className="space-y-3 md:space-y-4 mb-6 md:mb-10 animate-fade-up px-1">
        <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gradient-to-r from-rose-accent to-lavender-accent rounded-full"></span>
            <span className="text-rose-accent text-xs md:text-sm font-semibold tracking-wide">Step {stepNumber} of {totalSteps}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-rose-100 overflow-hidden shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min((stepNumber / totalSteps) * 100, 100)}%` }}
                />
            </div>
            <span className="text-xs font-bold text-gray-600 min-w-[46px] text-right">{Math.round((stepNumber / totalSteps) * 100)}%</span>
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-rose-accent to-lavender-accent bg-clip-text text-transparent tracking-tight leading-[1.1]">
                {title}
            </h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-xl leading-relaxed">{subtitle}</p>
        </div>
    </div>
));

export const NavButtons = React.memo(({ onNext, onBack, nextDisabled, nextLabel = "Continue", isLoading = false }: { onNext: () => void, onBack?: () => void, nextDisabled?: boolean, nextLabel?: string | null, isLoading?: boolean }) => (
    // FIX APPLIED HERE: Changed z-50 to z-[100] to fix mobile click issue
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 bg-white/90 backdrop-blur-lg border-t border-rose-accent/10 md:sticky md:bottom-6 md:left-12 md:right-12 md:p-0 md:bg-transparent md:border-none flex flex-row justify-between items-center gap-4 animate-fade-up transition-all duration-300 safe-pb shadow-lg md:shadow-none">
        {onBack ? (
            <button onClick={onBack} disabled={isLoading} className="text-gray-500 hover:text-rose-accent px-4 py-3 md:py-2 font-semibold transition-colors flex items-center gap-2 text-sm group rounded-xl bg-rose-50 hover:bg-rose-100 md:bg-transparent disabled:opacity-50 active:scale-95 min-h-[52px]">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="inline">Back</span>
            </button>
        ) : <div className="hidden md:block" />}

        <button
            onClick={onNext}
            disabled={nextDisabled || isLoading}
            className="flex-1 md:flex-none md:w-auto relative group overflow-hidden px-6 md:px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold font-display text-lg tracking-wide hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg active:scale-95 min-h-[56px]">
            {isLoading && (
                <div
                    className="absolute inset-0 bg-white/30 z-0"
                    style={{
                        width: '0%',
                        animation: 'fillWidth 1.5s ease-out forwards'
                    }}
                />
            )}
            <style>{`
                @keyframes fillWidth {
                    0% { width: 0% }
                    100% { width: 100% }
                }
            `}</style>

            <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating your plan...</span>
                    </>
                ) : (
                    <>
                        {nextLabel}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </>
                )}
            </span>
        </button>
    </div>
));

interface SelectionCardProps {
    selected: boolean;
    onClick: () => void;
    title: string;
    desc: string;
    tag?: string;
    accentColor?: 'lime' | 'violet'; // Keeping prop names for compatibility but mapping to rose/lavender
    tooltipText?: string;
    children?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
    selected,
    onClick,
    title,
    desc,
    tag,
    accentColor = 'lime',
    tooltipText,
    children
}) => {
    const isLime = accentColor === 'lime';
    const activeBorder = isLime ? 'border-rose-accent' : 'border-lavender-accent';
    const activeBg = 'glass-panel'; // Use global glass class
    const activeText = isLime ? 'text-rose-accent' : 'text-lavender-accent';
    const shadow = isLime ? 'shadow-[0_0_30px_rgba(255,107,157,0.2)]' : 'shadow-[0_0_30px_rgba(192,132,252,0.2)]';

    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <button
            onClick={onClick}
            className={`group relative p-6 rounded-3xl border text-left transition-all duration-300 hover:scale-[1.01] active:scale-95 w-full min-h-[88px] ${selected
                ? `${activeBg} ${activeBorder} ${shadow}`
                : 'bg-white/40 border-rose-accent/10 hover:bg-white/60 hover:border-rose-accent/20'
                }`}
        >
            {children}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    {tag && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selected ? `bg-gradient-to-r ${isLime ? 'from-rose-accent to-lavender-accent' : 'from-lavender-accent to-peach-accent'} text-white` : 'bg-rose-100 text-rose-600'}`}>
                            {tag}
                        </span>
                    )}

                    <div className="flex items-center gap-2">
                        {tooltipText && (
                            <div
                                className="relative group/info"
                                onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-help transition-colors ${selected ? `${activeText} ${isLime ? 'border-rose-accent/50' : 'border-lavender-accent/50'}` : 'text-gray-500 border-gray-300 hover:text-rose-accent hover:border-rose-accent'}`}>
                                    ?
                                </div>
                                {showTooltip && (
                                    <div className="absolute bottom-full right-0 mb-3 w-56 bg-white/95 backdrop-blur-md border-2 border-rose-accent/20 p-4 rounded-2xl shadow-2xl z-50 text-left animate-fade-up pointer-events-none">
                                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                            {tooltipText}
                                        </p>
                                        <div className="absolute -bottom-1 right-2 w-2 h-2 bg-white border-r-2 border-b-2 border-rose-accent/20 transform rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        )}
                        {selected && <span className={`${activeText} text-2xl`}>✓</span>}
                    </div>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
        </button>
    );
};

export const DebouncedInput = ({
    value,
    onChange,
    placeholder,
    className,
    isLime = true,
    debounceMs = 400
}: {
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    className?: string,
    isLime?: boolean,
    debounceMs?: number
}) => {
    const [localValue, setLocalValue] = useState(value);

    // Use ref to always have current onChange
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Safe: always uses current callback
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChangeRef.current(localValue);  // ← Always current
            }
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [localValue, value, debounceMs]);

    return (
        <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white/50 border-2 border-rose-accent/20 rounded-2xl py-3 px-4 text-base font-medium text-gray-800 outline-none placeholder-gray-400 transition-all shadow-sm focus:bg-white focus:shadow-md ${isLime ? 'focus:border-rose-accent' : 'focus:border-lavender-accent'} ${className}`}
        />
    );
}
