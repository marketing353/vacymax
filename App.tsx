import React, { useState, useRef, useEffect, Suspense, lazy, useCallback } from 'react';
import { OptimizationStrategy, TimeframeType, UserPreferences, OptimizationResult } from './types';
import { Step1PTO, Step2Timeframe, Step3Strategy, Step4Location } from './components/StepWizard';
import { generateVacationPlan } from './services/vacationService';
import { SEOHead } from './components/SEOHead';
import { PainHero, BurnCalculator, SolutionGrid, BattleTestedMarquee } from './components/LandingVisuals';
import { TrustSection } from './components/TrustSection';
import { supabaseHelpers } from './services/supabase';
// Eagerly load the results view to remove chunk-fetch failures when users finish the wizard.
import { ResultsView } from './components/ResultsView';

// Lazy load content pages
const AboutPage = lazy(() => import('./components/ContentPages').then(module => ({ default: module.AboutPage })));
const AlgorithmPage = lazy(() => import('./components/ContentPages').then(module => ({ default: module.AlgorithmPage })));
const PrivacyPage = lazy(() => import('./components/ContentPages').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./components/ContentPages').then(module => ({ default: module.TermsPage })));
const RegionPage = lazy(() => import('./components/ContentPages').then(module => ({ default: module.RegionPage })));

const lazyWithRetry = <T extends { default: React.ComponentType<any> }>(importer: () => Promise<T>) =>
  lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      const message = typeof error === 'object' && error !== null ? (error as Error).message : String(error);
      const failedChunk = message.includes('Failed to fetch dynamically imported module');

      if (failedChunk && typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        const hasRefreshed = sessionStorage.getItem('vmx-chunk-reload');
        if (!hasRefreshed) {
          sessionStorage.setItem('vmx-chunk-reload', '1');
          window.location.reload();
        }
      }

      throw error;
    }
  });

// Lazy load heavy components with retry guard for chunk load failures
const HowItWorks = lazyWithRetry(() => import('./components/HowItWorks').then((module) => ({ default: module.HowItWorks })));

const initialPrefs: UserPreferences = {
  ptoDays: 0,
  timeframe: TimeframeType.CALENDAR_2025,
  strategy: OptimizationStrategy.BALANCED,
  country: '',
  region: '',
  hasBuddy: false,
  buddyPtoDays: 0,
  buddyCountry: '',
  buddyRegion: '',
};

type ViewState = 'landing' | 'how-it-works' | 'results' | 'about' | 'algorithm' | 'privacy' | 'terms' | 'region-us' | 'region-uk' | 'region-ca' | 'region-au';

// --- Solver Terminal ---
const SolverTerminal = ({ timeframe }: { timeframe: TimeframeType }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      'Checking your calendar... 📅',
      'Loading dreamy destinations... ✈️',
      'Adding long weekends... 🥂',
      'Extending your breaks... 💆‍♀️',
      'Finding the best dates... ✨',
      'Maximizing your relaxation... 🛁',
      'Your perfect plan is ready! 💖'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < sequence.length) {
        setLines((prev) => [...prev, sequence[stepIndex]]);
        stepIndex += 1;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 text-xs md:text-sm relative overflow-hidden transform-gpu shadow-xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent animate-shimmer rounded-t-3xl"></div>
        <div className="space-y-3 h-[250px] overflow-y-auto font-medium scrollbar-hide will-change-transform">
          {lines.map((line, i) => (
            <div key={i} className="text-rose-accent animate-fade-up flex items-center gap-2">
              <span className="text-lavender-accent">✨</span> {line}
            </div>
          ))}
          <div className="animate-pulse text-rose-accent flex items-center gap-2"><span className="text-lavender-accent">✨</span> _</div>
        </div>
      </div>
      <p className="mt-8 text-gray-600 text-sm animate-pulse font-medium tracking-wide">
        ✨ Creating your perfect schedule for {timeframe}...
      </p>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-light-100 via-light-200 to-light-300">
    <div className="w-16 h-16 border-4 border-rose-accent border-t-transparent rounded-full animate-spin shadow-lg"></div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [step, setStep] = useState<number>(0);
  const [prefs, setPrefs] = useState<UserPreferences>(initialPrefs);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const wizardRef = useRef<HTMLDivElement>(null);

  const scrollWizardIntoView = useCallback(() => {
    const element = wizardRef.current;
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    element.focus({ preventScroll: true });
  }, []);

  // Ensure the wizard is always in view when users progress through steps
  useEffect(() => {
    if (step > 0) {
        scrollWizardIntoView();
    }
  }, [scrollWizardIntoView, step]);

  const scrollToWizard = useCallback(() => {
    if (view === 'how-it-works') {
        setView('landing');
        requestAnimationFrame(() => {
             scrollWizardIntoView();
             if(step === 0) setStep(1);
        });
    } else {
        scrollWizardIntoView();
        if(step === 0) setStep(1);
    }
  }, [scrollWizardIntoView, step, view]);

  // FIX: Type-safe update
  const updatePrefs = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
      setStep((prev) => prev + 1);
      if (window.innerWidth < 768) {
          scrollWizardIntoView();
      }
  }, [scrollWizardIntoView]);

  const handleBack = useCallback(() => setStep((prev) => prev - 1), []);

  const handleGenerate = useCallback(async () => {
    setStep(5);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000)); // Longer wait for effect
      const data = await generateVacationPlan(prefs);
      setResult(data);

      // Track plan generation in Supabase
      supabaseHelpers.logPlanGeneration({
        ptoUsed: data.totalPtoUsed,
        totalDaysOff: data.totalDaysOff,
        monetaryValue: data.totalValueRecovered,
        region: prefs.region || prefs.country,
        strategy: prefs.strategy,
      }).catch(err => console.error('Failed to log plan:', err));

      setStep(6);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("We couldn't generate a plan. Please check your inputs.");
      setStep(4);
    }
  }, [prefs]);

  const handlePaymentSuccess = useCallback(() => {
    setIsLocked(false);
    setShowSuccessMessage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowSuccessMessage(false), 8000);
  }, []);

  const handleReset = useCallback(() => {
    setStep(0);
    setPrefs(initialPrefs);
    setResult(null);
    setIsLocked(true);
    setShowSuccessMessage(false);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Track session on app load
  useEffect(() => {
    supabaseHelpers.trackSession({
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }).catch(err => console.error('Failed to track session:', err));
  }, []);

  // Handle payment success from Stripe redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Payment successful - unlock the plan
      setIsLocked(false);
      setShowSuccessMessage(true);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Hide success message after 10 seconds
      setTimeout(() => setShowSuccessMessage(false), 10000);
    } else if (paymentStatus === 'cancelled') {
      // Payment was cancelled
      console.log('Payment was cancelled by user');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFooterLink = useCallback((e: React.MouseEvent, viewName: ViewState) => {
    e.preventDefault();
    setView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStart = useCallback(() => {
    setStep(1);
    const element = document.getElementById('wizard-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col text-gray-700 pb-12 overflow-x-hidden">
      <SEOHead view={view} prefs={prefs} result={result || undefined} country={prefs.country} />

      {/* Navigation */}
      <nav className="w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center z-[60] fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-rose-accent/10 transition-all duration-300 safe-pt shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={handleReset}>
          <div className="w-10 h-10 bg-gradient-to-br from-rose-accent to-lavender-accent rounded-2xl flex items-center justify-center shadow-lg shadow-rose-accent/20 group-hover:shadow-rose-accent/40 transition-all">
            <div className="text-white text-xl">✨</div>
          </div>
          <span className="font-display font-bold text-lg md:text-2xl bg-gradient-to-r from-rose-accent to-lavender-accent bg-clip-text text-transparent">VacationMax</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setView('how-it-works')}
            className="text-xs md:text-sm font-medium text-gray-600 hover:text-rose-accent transition-colors hidden md:block"
          >
            How it Works
          </button>

          {/* New Reset Button */}
          {step > 0 && (
            <button
              onClick={handleReset}
              className="text-xs md:text-sm font-medium text-gray-500 hover:text-rose-accent transition-colors"
            >
              Restart
            </button>
          )}

          <button
            onClick={scrollToWizard}
            className="px-5 py-2.5 text-xs md:text-sm font-bold bg-gradient-to-r from-rose-accent to-lavender-accent hover:shadow-lg text-white rounded-full transition-all active:scale-95 shadow-md hover:shadow-rose-accent/30"
          >
            {step > 0 && view === 'landing' ? '✨ Resume Plan' : '✨ Start Plan'}
          </button>
        </div>
      </nav>

      {view === 'how-it-works' && (
        <Suspense fallback={<LoadingFallback />}>
          <HowItWorks onBack={() => setView('landing')} onLaunch={scrollToWizard} />
        </Suspense>
      )}

      <Suspense fallback={<LoadingFallback />}>
        {view === 'about' && <AboutPage onBack={() => setView('landing')} />}
        {view === 'algorithm' && <AlgorithmPage onBack={() => setView('landing')} />}
        {view === 'privacy' && <PrivacyPage onBack={() => setView('landing')} />}
        {view === 'terms' && <TermsPage onBack={() => setView('landing')} />}
        {view === 'region-us' && <RegionPage region="United States" onBack={() => setView('landing')} />}
        {view === 'region-uk' && <RegionPage region="United Kingdom" onBack={() => setView('landing')} />}
        {view === 'region-ca' && <RegionPage region="Canada" onBack={() => setView('landing')} />}
        {view === 'region-au' && <RegionPage region="Australia" onBack={() => setView('landing')} />}
      </Suspense>

      {/* --- LANDING PAGE --- */}
      {view === 'landing' && (
        <>
          <PainHero onCta={scrollToWizard} />
          <BurnCalculator />
          <SolutionGrid />
          <TrustSection />

          {/* THE WIZARD */}
          <div id="wizard-section" ref={wizardRef} className="w-full bg-gradient-to-br from-light-100 via-light-200 to-light-300 py-24 px-4 scroll-mt-24 relative z-[55]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent bg-clip-text text-transparent mb-3">Let's Plan Your Perfect Year ✨</h2>
                <p className="text-gray-600 text-lg">Build your optimized schedule in 60 seconds.</p>
              </div>

              {/* FIX: Removed 'overflow-hidden' and 'backdrop-blur' to fix mobile sticky buttons */}
              {/* FIX: Added z-[60] to ensure it sits ABOVE the bg-noise layer */}
              <div className="relative z-[60] glass-panel rounded-[2rem] p-6 md:p-12 min-h-[600px] flex flex-col shadow-2xl">
                <div className="min-h-[52px] mb-4" aria-live="polite" aria-atomic="true">
                  <div
                    className={`bg-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-sm border border-rose-200 text-center transition-all duration-300 ${error ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                    role={error ? 'alert' : undefined}
                  >
                    {error || ' '}
                  </div>
                </div>

                {step === 0 && (
                  <div className="text-center space-y-8 animate-fade-up relative z-10 py-10 my-auto">
                    <div className="w-28 h-28 bg-gradient-to-br from-rose-100 to-lavender-100 rounded-full flex items-center justify-center mx-auto text-5xl border-4 border-white shadow-xl">✨</div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-rose-accent to-lavender-accent bg-clip-text text-transparent mb-3">Ready to plan?</h3>
                      <p className="text-gray-600 max-w-md mx-auto text-lg">Tell us how many days off you have, and we'll create the perfect schedule for you! 💖</p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full max-w-md mx-auto py-5 bg-gradient-to-r from-rose-accent to-lavender-accent text-white text-lg font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group shadow-lg"
                    >
                      Let's Get Started ✨
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                )}

                {step === 1 && <Step1PTO prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} />}
                {step === 2 && <Step2Timeframe prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <Step3Strategy prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} onBack={handleBack} />}
                {step === 4 && <Step4Location prefs={prefs} updatePrefs={updatePrefs} onNext={handleGenerate} onBack={handleBack} />}
                {step === 5 && <SolverTerminal timeframe={prefs.timeframe} />}
              </div>
            </div>
          </div>

          <footer className="w-full bg-gradient-to-br from-rose-50 to-lavender-50 border-t border-rose-accent/20 pt-16 pb-12 relative z-[60] overflow-hidden text-sm leading-relaxed selection:bg-rose-accent selection:text-white">
            {/* Soft decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-lavender-100/20 pointer-events-none"></div>

            {/* Scrolling Marquee */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-rose-100/50 to-lavender-100/50 border-b border-rose-accent/20 flex items-center overflow-hidden">
              <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap text-xs text-rose-accent/70 font-medium tracking-wide px-4 flex gap-8">
                <span>✨ Your time is precious</span>
                <span>💖 Plan smarter, not harder</span>
                <span>🌸 Maximize your wellbeing</span>
                <span>✨ Create perfect moments</span>
                <span>💫 Balance work and life</span>
                <span>✨ Your time is precious</span>
                <span>💖 Plan smarter, not harder</span>
                <span>🌸 Maximize your wellbeing</span>
                <span>✨ Create perfect moments</span>
                <span>💫 Balance work and life</span>
              </div>
            </div>
        </nav>

        {view === 'how-it-works' && (
            <Suspense fallback={<LoadingFallback />}>
                <HowItWorks onBack={() => setView('landing')} onLaunch={scrollToWizard} />
            </Suspense>
        )}

        {/* --- PAS LANDING PAGE ARCHITECTURE --- */}
        {view === 'landing' && (
            <>
                {/* 1. THE PAIN: Wake Up Call */}
                <PainHero onCta={scrollToWizard} />

                {/* 2. THE AGITATION: Burn Calculator */}
                <BurnCalculator />

                {/* 3. THE SOLUTION: Feature Grid (Teal Transition) */}
                <SolutionGrid />

                {/* 4. SOCIAL PROOF: Marquee */}
                <BattleTestedMarquee />

                {/* THE WIZARD (The Actual Product) */}
                <div
                    id="wizard-section"
                    ref={wizardRef}
                    tabIndex={-1}
                    className="w-full bg-[#020617] py-24 px-4 scroll-mt-24"
                >
                     <div className="max-w-4xl mx-auto">
                         <div className="text-center mb-12">
                             <h2 className="text-3xl font-display font-bold text-white mb-2">Okay, Let's Fix It.</h2>
                             <p className="text-slate-400">Build your optimized schedule in 60 seconds.</p>
                         </div>

                         <div className="relative bg-[#0F1014] border border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl min-h-[550px] flex flex-col overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none hidden md:block" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            {error && (
                                <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-red-500/20 text-red-200 px-4 py-2 rounded-lg text-sm mb-4 border border-red-500/20 z-20">
                                    {error}
                                </div>
                            )}

                            {step === 0 && (
                                <div className="text-center space-y-8 animate-fade-up relative z-10 py-10 my-auto">
                                    <div className="w-24 h-24 bg-gradient-to-br from-lime-accent/20 to-transparent rounded-full flex items-center justify-center mx-auto text-4xl border border-lime-accent/20 shadow-[0_0_30px_rgba(132,204,22,0.1)]">
                                        ✨
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-display font-bold text-white mb-2">Ready to plan?</h3>
                                        <p className="text-slate-400 max-w-xs mx-auto">Tell us how many days off you have, and we'll do the rest.</p>
                                    </div>
                                    <button onClick={() => setStep(1)} className="w-full py-5 bg-white/5 border border-white/10 hover:border-lime-accent/50 text-white text-lg font-bold rounded-xl transition-all hover:bg-white/10 hover:shadow-lg flex items-center justify-center gap-2 group">
                                        Let's Get Started
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            )}

                            {step === 1 && <Step1PTO prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} />}
                            {step === 2 && <Step2Timeframe prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} onBack={handleBack} />}
                            {step === 3 && <Step3Strategy prefs={prefs} updatePrefs={updatePrefs} onNext={handleNext} onBack={handleBack} />}
                            {step === 4 && <Step4Location prefs={prefs} updatePrefs={updatePrefs} onNext={handleGenerate} onBack={handleBack} />}
                            {step === 5 && <SolverTerminal timeframe={prefs.timeframe} />}
                         </div>
                     </div>
                </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 pt-12 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8 md:mb-16">

                {/* Left: Brand Header */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-block border-2 border-rose-accent/30 bg-rose-50 text-rose-accent px-4 py-2 text-xs mb-6 rounded-full font-semibold shadow-sm">
                      ✨ VacationMax v3.0
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent bg-clip-text text-transparent mb-6 leading-tight">
                      Rest. Recharge. Repeat. 💖
                    </h2>
                    <div className="max-w-md border-l-4 border-rose-accent/30 pl-6 py-2 bg-white/50 rounded-r-2xl">
                      <p className="text-gray-700 mb-4 font-medium">
                        "Your wellbeing matters. Let's make every day count."
                      </p>
                      <div className="flex gap-3 text-xs text-rose-accent/70 font-medium">
                        <span>🔒 Private & Secure</span>
                        <span>✨ Made with Care</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Links Module */}
                <div className="lg:col-span-6 grid grid-cols-1 gap-8">

                  {/* Links Card */}
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-rose-accent/20 p-8 rounded-3xl relative group hover:border-rose-accent/40 transition-all shadow-lg hover:shadow-xl">
                    <div className="absolute top-4 right-4 text-3xl opacity-20">✨</div>

                    <h4 className="text-rose-accent text-sm font-bold mb-6 uppercase tracking-wide border-b-2 border-rose-accent/20 pb-3">Quick Links</h4>
                    <ul className="space-y-4">
                      <li>
                        <button onClick={(e) => handleFooterLink(e, 'about')} className="flex items-center gap-3 w-full text-left group/link hover:bg-rose-50 p-3 -mx-3 rounded-xl transition-all">
                          <span className="text-rose-accent/50 group-hover/link:text-rose-accent text-sm transition-colors">💖</span>
                          <span className="text-gray-700 font-semibold group-hover/link:text-rose-accent transition-colors">About Us</span>
                          <span className="ml-auto opacity-0 group-hover/link:opacity-100 text-rose-accent text-xs">→</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={(e) => handleFooterLink(e, 'privacy')} className="flex items-center gap-3 w-full text-left group/link hover:bg-rose-50 p-3 -mx-3 rounded-xl transition-all">
                          <span className="text-rose-accent/50 group-hover/link:text-rose-accent text-sm transition-colors">🔒</span>
                          <span className="text-gray-700 font-semibold group-hover/link:text-rose-accent transition-colors">Privacy Policy</span>
                          <span className="ml-auto opacity-0 group-hover/link:opacity-100 text-rose-accent text-xs">→</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={(e) => handleFooterLink(e, 'terms')} className="flex items-center gap-3 w-full text-left group/link hover:bg-rose-50 p-3 -mx-3 rounded-xl transition-all">
                          <span className="text-rose-accent/50 group-hover/link:text-rose-accent text-sm transition-colors">📋</span>
                          <span className="text-gray-700 font-semibold group-hover/link:text-rose-accent transition-colors">Terms of Service</span>
                          <span className="ml-auto opacity-0 group-hover/link:opacity-100 text-rose-accent text-xs">→</span>
                        </button>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Footer Status Bar */}
              <div className="border-t-2 border-rose-accent/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm text-gray-600">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-accent">✨</span>
                    <span className="font-medium">Made with love</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lavender-accent">💖</span>
                    <span className="font-medium">For your wellbeing</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-semibold text-gray-700">VacationMax © 2025</p>
                  <p className="text-rose-accent/70 mt-1 text-xs">Your time, optimized ✨</p>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {view === 'results' && result && (
        <main className="flex-grow pt-24 md:pt-32 px-4 md:px-6 relative z-[60] bg-gradient-to-br from-light-100 via-light-200 to-light-300">
          {showSuccessMessage && (
            <div className="max-w-6xl mx-auto mb-6 animate-fade-up">
              <div className="bg-gradient-to-r from-rose-50 to-lavender-50 border-2 border-rose-accent/30 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-accent to-lavender-accent flex items-center justify-center text-white font-bold text-xl shadow-md">✓</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Payment Successful! 🎉</h3>
                  <p className="text-rose-accent text-sm font-medium">Your schedule is unlocked and ready!</p>
                </div>
                <button onClick={() => setShowSuccessMessage(false)} className="ml-auto p-2 text-gray-400 hover:text-rose-accent transition-colors">
                  ✕
                </button>
              </div>
            </div>
          )}

          <Suspense fallback={<LoadingFallback />}>
            <ResultsView
              result={result}
              onReset={handleReset}
              isLocked={isLocked}
              onUnlock={handlePaymentSuccess}
              userCountry={prefs.country}
              prefs={prefs}
            />
          </Suspense>
        </main>
      )}
    </div>
  );
};

export default App;
