import React from 'react';

interface ContentPageProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
    onBack: () => void;
}

const ContentPageLayout: React.FC<ContentPageProps> = ({ title, lastUpdated, children, onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-light-100 via-white to-light-200 text-gray-700 pt-32 pb-20 px-6 selection:bg-rose-accent selection:text-white">
            {/* Decorative Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-rose-accent/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-lavender-accent/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <button
                    onClick={onBack}
                    className="group mb-12 text-sm font-semibold text-rose-accent hover:text-lavender-accent transition-colors flex items-center gap-3"
                >
                    <span className="w-8 h-0.5 bg-gradient-to-r from-rose-accent to-lavender-accent group-hover:w-12 transition-all duration-300 rounded-full"></span>
                    ← Back to Home
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-accent via-lavender-accent to-peach-accent tracking-tight leading-tight mb-4">
                        {title}
                    </h1>
                    {lastUpdated && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-rose-accent"></span>
                            Last updated: {lastUpdated}
                        </div>
                    )}
                </div>

                <div className="glass-panel rounded-3xl p-8 md:p-12 border-2 border-rose-accent/20 shadow-xl">
                    <div className="prose prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-800 prose-headings:tracking-tight
                        prose-p:text-gray-600 prose-p:leading-relaxed 
                        prose-strong:text-rose-accent prose-strong:font-semibold
                        prose-ul:list-none prose-ul:pl-0
                        prose-li:border-l-2 prose-li:border-rose-accent/30 prose-li:pl-6 prose-li:mb-4
                        prose-a:text-rose-accent prose-a:no-underline hover:prose-a:underline">
                        {children}
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    Made with 💖 by VacyMax
                </div>
            </div>
        </div>
    );
};

export const AboutPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="About Us 💖" onBack={onBack}>
        <p className="text-xl text-gray-800 font-medium mb-8">
            We believe everyone deserves <span className="text-rose-accent">more time for what matters most</span> - family, friends, adventures, and self-care.
        </p>

        <p>
            For too long, vacation planning has been stressful and confusing. We end up wasting precious days or feeling guilty about taking time off. That's not right! ✨
        </p>
        <p>
            <strong>VacyMax was created to change that.</strong>
        </p>

        <h3 className="text-2xl mt-12 mb-6">Our Mission 🌟</h3>
        <p>
            We help you plan smarter, not harder. By finding the perfect days to take off, we help you get the most out of every vacation day - so you can focus on creating memories, not spreadsheets.
        </p>

        <ul className="my-12 space-y-8">
            <li className="relative bg-rose-50 rounded-2xl p-6 border-2 border-rose-accent/10">
                <span className="text-2xl mb-3 block">💖</span>
                <strong className="block text-gray-800 text-lg mb-2 font-display">You Deserve Rest</strong>
                Time off isn't a luxury - it's essential for your wellbeing. We help you claim every day you've earned.
            </li>
            <li className="relative bg-lavender-50 rounded-2xl p-6 border-2 border-lavender-accent/10">
                <span className="text-2xl mb-3 block">✨</span>
                <strong className="block text-gray-800 text-lg mb-2 font-display">Work-Life Balance</strong>
                Productivity means nothing without time to recharge. We optimize for your happiness and health.
            </li>
            <li className="relative bg-peach-50 rounded-2xl p-6 border-2 border-peach-accent/10">
                <span className="text-2xl mb-3 block">🌸</span>
                <strong className="block text-gray-800 text-lg mb-2 font-display">Made for You</strong>
                Whether it's a girls' trip, family vacation, or solo retreat - we help you plan the perfect getaway.
            </li>
        </ul>

        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 p-6 rounded-2xl border-2 border-rose-accent/20 mt-12">
            <p className="text-center text-gray-800 font-semibold">
                🎉 Over 14,000 happy planners have already maximized their time off!
            </p>
        </div>
    </ContentPageLayout>
);

export const AlgorithmPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="How It Works ✨" onBack={onBack}>
        <p className="text-xl text-gray-800 font-medium mb-8">
            Our smart planner finds the best days to take off - so you get more time for less stress! 💖
        </p>

        <div className="space-y-8">
            <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-rose-accent to-lavender-accent rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                    Smart Calendar Analysis
                </h3>
                <p className="text-gray-600">
                    We look at all the public holidays in your area and find the perfect "bridge days" - those magic days that connect weekends to holidays for maximum time off! 🌟
                </p>
            </div>

            <div className="bg-lavender-50 rounded-2xl p-6 border-2 border-lavender-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-lavender-accent to-peach-accent rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                    Finding Hidden Opportunities
                </h3>
                <p className="text-gray-600">
                    Our planner identifies those special single days that, when booked, turn a regular weekend into a mini-vacation! Less days used, more time off. ✨
                </p>
            </div>

            <div className="bg-peach-50 rounded-2xl p-6 border-2 border-peach-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-peach-accent to-rose-accent rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                    Personalized for You
                </h3>
                <p className="text-gray-600">
                    We create a plan based on YOUR style - whether you love long adventures, frequent mini-breaks, or a perfect balance. Your wellbeing, your way! 💖
                </p>
            </div>
        </div>
    </ContentPageLayout>
);

export const PrivacyPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="Privacy Policy 🔒" lastUpdated="December 2025" onBack={onBack}>
        <p className="text-xl text-gray-800 font-medium mb-8">
            Your privacy matters to us. <span className="text-rose-accent">We keep your data safe and secure.</span> 💖
        </p>

        <h3 className="text-xl mt-8 mb-4">What We Collect</h3>
        <p>
            VacyMax works right in your browser! Your vacation plans and personal details stay on your device - we don't store them on our servers. ✨
        </p>

        <ul className="my-8 space-y-4">
            <li className="flex items-start gap-3 bg-rose-50 rounded-xl p-4 border-2 border-rose-accent/10">
                <span className="text-rose-accent text-lg">✓</span>
                <span>We don't store your name, email, or salary on our servers</span>
            </li>
            <li className="flex items-start gap-3 bg-lavender-50 rounded-xl p-4 border-2 border-lavender-accent/10">
                <span className="text-lavender-accent text-lg">✓</span>
                <span>We don't track your specific vacation plans</span>
            </li>
            <li className="flex items-start gap-3 bg-peach-50 rounded-xl p-4 border-2 border-peach-accent/10">
                <span className="text-peach-accent text-lg">✓</span>
                <span>We never sell your data to anyone</span>
            </li>
        </ul>

        <h3 className="text-xl mt-8 mb-4">Browser Storage</h3>
        <p>
            We use your browser's local storage to remember your preferences - so you don't have to re-enter everything if you refresh the page. You can clear this anytime in your browser settings! 🌸
        </p>

        <h3 className="text-xl mt-8 mb-4">Payments</h3>
        <p>
            All payments are processed securely through Stripe. We never see or store your credit card details - that's all handled by Stripe's bank-level security. 🔒
        </p>

        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 p-6 rounded-2xl border-2 border-rose-accent/20 mt-12">
            <p className="text-center text-gray-700">
                Questions? Reach out to us at <a href="mailto:privacy@vacymax.com" className="text-rose-accent font-semibold">privacy@vacymax.com</a> 💖
            </p>
        </div>
    </ContentPageLayout>
);

export const TermsPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="Terms of Service 📋" lastUpdated="December 2025" onBack={onBack}>
        <p className="text-xl text-gray-800 font-medium mb-8">
            By using VacyMax, you agree to these simple terms. <span className="text-rose-accent">We've kept them friendly and fair!</span> 💖
        </p>

        <div className="space-y-8">
            <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    Planning Suggestions
                </h3>
                <p className="text-gray-600">
                    VacyMax provides smart suggestions based on public holiday data. Please double-check dates with your employer before booking any travel! We want your plans to go perfectly. ✨
                </p>
            </div>

            <div className="bg-lavender-50 rounded-2xl p-6 border-2 border-lavender-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    Payments & Refunds
                </h3>
                <p className="text-gray-600">
                    We offer a money-back guarantee because we're confident you'll love your plan! If you're not happy, just let us know and we'll make it right. 💖
                </p>
            </div>

            <div className="bg-peach-50 rounded-2xl p-6 border-2 border-peach-accent/10">
                <h3 className="text-xl mb-4 flex items-center gap-3">
                    <span className="text-2xl">🌟</span>
                    Personal Use
                </h3>
                <p className="text-gray-600">
                    VacyMax is for your personal vacation planning. Please don't use automated tools to access our service or resell our plans commercially. Fair use keeps it great for everyone!
                </p>
            </div>
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 p-6 rounded-2xl border-2 border-rose-accent/20 mt-12">
            <p className="text-center text-gray-700">
                Questions about our terms? Email us at <a href="mailto:hello@vacymax.com" className="text-rose-accent font-semibold">hello@vacymax.com</a> 💖
            </p>
        </div>
    </ContentPageLayout>
);

export const RegionPage = ({ region, onBack }: { region: string, onBack: () => void }) => (
    <ContentPageLayout title={`${region} Planning 🌍`} onBack={onBack}>
        <p className="text-xl text-gray-800 font-medium mb-8">
            Special vacation strategies for our friends in <span className="text-rose-accent">{region}</span>! 💖
        </p>

        <div className="bg-gradient-to-r from-rose-50 to-lavender-50 rounded-2xl p-6 border-2 border-rose-accent/20 mb-8">
            <h3 className="text-xl mb-4">🎉 Local Holidays</h3>
            <p className="text-gray-600">
                {region} has unique bank holidays and observances that create amazing opportunities for extended breaks! Our planner is specifically tuned to your local calendar for 2025 and 2026.
            </p>
        </div>

        <p>
            Ready to see the exact dates and maximize your time off? Use our main calculator to get your personalized plan! ✨
        </p>

        <button
            onClick={onBack}
            className="mt-8 w-full py-4 bg-gradient-to-r from-rose-accent to-lavender-accent text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all"
        >
            Create My {region} Plan 💖
        </button>
    </ContentPageLayout>
);
