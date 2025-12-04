import React from 'react';
import { motion } from 'framer-motion';

const integrations = [
  { name: 'Google Calendar', initials: 'G', color: '#4285F4' },
  { name: 'Outlook', initials: 'O', color: '#0A64AD' },
  { name: 'iCal', initials: '', color: '#A2AAAD' }
];

const wallOfLove = [
  {
    handle: '@shipyarddev',
    role: 'Staff Engineer',
    quote: 'Finally, a PTO tool that does the math for me. Stacked 3 days into a 9-day trip. 🤯',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=dev',
  },
  {
    handle: '@nomadloop',
    role: 'Remote PM & Nomad',
    quote: 'Essential for maximizing remote work travel. I plan cities by PTO ROI now.',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=nomad',
  },
  {
    handle: '@opsfocus',
    role: 'Platform Lead',
    quote: 'Read-only calendar ingest plus on-device math = instant trust. Team adopted in one sprint.',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=ops',
  }
];

export const TrustSection: React.FC = () => {
  return (
    <section className="w-full bg-[#05070F] border-y border-white/5 py-24 px-6" id="trust">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Trust Stack</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Works seamlessly with your existing workflow.</h2>
            <p className="text-slate-400 max-w-2xl">Dark-mode first, dev-grade privacy. We stay read-only while syncing next to your calendar stack.</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <button className="px-6 py-3 rounded-full bg-lime-accent text-dark-900 font-bold text-sm md:text-base shadow-lg shadow-lime-accent/30 hover:shadow-lime-accent/50 transition-transform active:scale-95">
              Launch Optimizer
            </button>
            <p className="text-xs text-slate-400">No account required • Free for individuals</p>
          </div>
        </div>

        {/* Integration Marquee */}
        <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-5 overflow-hidden">
          <div className="flex items-center gap-4 mb-3 text-slate-400 text-sm font-medium">
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-white/5">🔌</span>
            <span>Integration-ready with the calendars you already trust</span>
          </div>
          <div className="flex gap-6 flex-wrap md:flex-nowrap md:gap-10 items-center justify-center md:justify-between">
            {integrations.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05, opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors duration-200"
                style={{ opacity: 0.6 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold bg-white/10"
                  style={{ color: item.color }}
                >
                  {item.initials}
                </div>
                <span className="font-semibold">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Privacy First */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-accent/10 via-transparent to-transparent pointer-events-none"></div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wide text-lime-accent">
              Privacy-First
            </div>
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:gap-6">
              <div className="w-14 h-14 rounded-2xl bg-lime-accent/20 border border-lime-accent/40 flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(190,242,100,0.35)] text-lime-accent">
                🛡️
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-display font-bold text-white">Read-Only Access Guaranteed</h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  We calculate PTO windows locally against your calendar feed—no raw events leave your device. Scoped, revocable, and audited tokens keep your data sealed.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[320px] bg-lime-accent text-dark-900 rounded-3xl p-6 shadow-[0_0_50px_rgba(190,242,100,0.35)] border border-lime-accent/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-dark-900 text-lime-accent flex items-center justify-center text-lg">🔒</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">Local-first</p>
                <p className="font-display text-xl font-bold">Secure by default</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-relaxed">
              No password vaulting, no background syncing. Connect when you optimize, disconnect when you're done.
            </p>
          </div>
        </div>

        {/* Wall of Love */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-lime-accent"></div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-bold">Wall of Love</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
            {wallOfLove.map((post) => (
              <div key={post.handle} className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.avatar} alt={post.handle} className="w-10 h-10 rounded-full border border-white/10" />
                  <div>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span>{post.handle}</span>
                      <span className="text-lime-accent">✔</span>
                    </div>
                    <p className="text-xs text-slate-400">{post.role}</p>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">{post.quote}</p>
                <div className="absolute top-4 right-4 text-xs text-slate-500">via X</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
