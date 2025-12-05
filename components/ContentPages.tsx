import React from 'react';

interface ContentPageProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
    onBack: () => void;
}

const ContentPageLayout: React.FC<ContentPageProps> = ({ title, lastUpdated, children, onBack }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 pt-32 pb-20 px-6 animate-fade-up">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-8 text-sm font-bold text-lime-accent hover:text-white transition-colors flex items-center gap-2"
                >
                    ← Back to App
                </button>

                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">{title}</h1>

                {lastUpdated && (
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-12 border-b border-white/10 pb-6">
                        Last Updated: {lastUpdated}
                    </p>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-a:text-lime-accent prose-strong:text-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const AboutPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="About VacationMax" onBack={onBack}>
        <p className="lead text-xl text-slate-200">
            VacationMax was born from a simple frustration: seeing thousands of PTO hours expire unused every year because planning is hard.
        </p>
        <p>
            We are a team of engineers, travelers, and optimizers who realized that the "standard" work calendar is inefficient. By simply realigning time off with public holidays, most employees can double their effective break time without asking for a raise or extra days.
        </p>
        <h2>Our Mission</h2>
        <p>
            To reclaim 1,000,000 days of personal time for workers worldwide by 2026. We believe rest is a productivity multiplier, not a cost.
        </p>
    </ContentPageLayout>
);

export const AlgorithmPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="The Algorithm" onBack={onBack}>
        <p className="lead text-xl text-slate-200">
            How we turn 10 days into 24.
        </p>
        <h3>1. Graph Traversal</h3>
        <p>
            We model the calendar as a directed acyclic graph (DAG). Each day is a node, and edges represent potential connections. We weight "work days" as a cost and "vacation days" as a reward.
        </p>
        <h3>2. Bridge Identification</h3>
        <p>
            The system scans for "bridge nodes"—single days that, if removed (booked), connect two larger components of non-working days (weekends + holidays).
        </p>
        <h3>3. Efficiency Scoring</h3>
        <p>
            We assign an ROI score to every possible date range.
            <code>Score = (Total Consecutive Days Off) / (PTO Days Used)</code>.
            Only ranges with a score &gt; 2.0 make it into our recommendations.
        </p>
    </ContentPageLayout>
);

export const PrivacyPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="Privacy Policy" lastUpdated="December 1, 2024" onBack={onBack}>
        <p>
            We take a radical approach to privacy: <strong>we don't want your data.</strong>
        </p>
        <h3>Data Collection</h3>
        <p>
            VacationMax operates as a client-side application. The optimization calculations happen right in your browser.
        </p>
        <ul>
            <li>We do not store your name, email, or salary on our servers.</li>
            <li>We do not track your specific vacation plans.</li>
            <li>We do not sell your data to travel agencies.</li>
        </ul>
        <h3>Local Storage</h3>
        <p>
            We use your browser's `localStorage` to save your preferences so you don't have to re-enter them if you refresh the page. You can clear this at any time.
        </p>
    </ContentPageLayout>
);

export const TermsPage = ({ onBack }: { onBack: () => void }) => (
    <ContentPageLayout title="Terms of Service" lastUpdated="December 1, 2024" onBack={onBack}>
        <p>
            By using VacationMax, you agree to the following terms.
        </p>
        <h3>1. No Guarantee</h3>
        <p>
            VacationMax provides optimization suggestions based on public holiday data. Verification of actual holiday dates with your employer is your responsibility. We are not liable for booked flights or denied leave.
        </p>
        <h3>2. Fair Use</h3>
        <p>
            You may use this tool for personal planning. Automated scraping or commercial resale of our optimization data is prohibited.
        </p>
    </ContentPageLayout>
);

export const RegionPage = ({ region, onBack }: { region: string, onBack: () => void }) => (
    <ContentPageLayout title={`Vacation Hacks: ${region}`} onBack={onBack}>
        <p className="lead text-xl text-slate-200">
            Specific optimization strategies for professionals working in {region}.
        </p>
        <h3>Public Holiday Structure</h3>
        <p>
            {region} offers unique opportunities due to its specific bank holidays and observance rules. Our calculator is tuned to the local holiday calendar of {region} for 2025 and 2026.
        </p>
        <p>
            Use the main calculator to see exact dates for the upcoming year.
        </p>
    </ContentPageLayout>
);
