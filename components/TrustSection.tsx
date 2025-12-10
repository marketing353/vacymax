import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const integrations = [
  {
    name: 'Google Calendar',
    initials: 'G',
    color: '#4285F4',
    accent: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
  },
  {
    name: 'Outlook',
    initials: 'O',
    color: '#0A64AD',
    accent: 'linear-gradient(135deg, #0A64AD 0%, #50B5FF 100%)',
  },
  { name: 'iCal', initials: '🍎', color: '#A2AAAD', accent: '#ffffff' },
];

const wallOfLove = [
  {
    handle: '@mariewellness',
    role: 'Lifestyle Coach',
    quote: 'This saved my sanity! Turned 12 days into 5 weeks of breaks. Finally prioritizing myself 💖',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=marie',
  },
  {
    handle: '@jessicatravel',
    role: 'Travel Blogger',
    quote: 'Essential for planning girls trips! We finally coordinated our calendars perfectly ✨',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=jessica',
  },
  {
    handle: '@sarahbalance',
    role: 'Working Mom',
    quote: 'As a busy mom, this helps me actually use my vacation days instead of losing them. Life-changing!',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=sarah',
  }
];

// --- BEHAVIORAL TRIGGER: LIVE ACTIVITY FEED ---
const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    { user: 'Sarah (UK)', action: 'just planned 34 days of rest! 💖' },
    { user: 'Emma (USA)', action: 'found 5 perfect long weekends ✨' },
    { user: 'Jessica (Canada)', action: 'maximized her vacation value!' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate activities to simulate live feed
      setActivities(prev => {
        const first = prev[0];
        return [...prev.slice(1), first];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 right-0 p-6 hidden md:block pointer-events-none overflow-hidden h-[200px] w-[320px]">
      <AnimatePresence mode='popLayout'>
        {activities.slice(0, 2).map((activity, i) => (
          <motion.div
            key={`${activity.user}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-3 flex items-center gap-3 bg-white/80 backdrop-blur-md border-2 border-rose-accent/20 p-3 rounded-2xl shadow-lg"
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-accent to-lavender-accent animate-pulse"></div>
            <p className="text-xs text-gray-700">
              <span className="font-bold text-gray-800">{activity.user}</span> {activity.action}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const TrustSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-br from-lavender-50 via-white to-rose-50 border-y-2 border-rose-accent/10 py-24 px-6 relative" id="trust">
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">

        {/* Header with Live Feed */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border-2 border-rose-accent/20 rounded-full text-rose-accent text-sm font-semibold">
              💖 Why women love us
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800">Your wellbeing, our priority.</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We built this with care - your data stays private, your calendar stays yours, and your time off gets maximized. ✨
            </p>
          </div>
          <LiveActivityFeed />
        </div>

        {/* Integration Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-8 border-2 border-rose-accent/20 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                Easy Calendar Sync 📅
                <span className="bg-gradient-to-r from-rose-accent to-lavender-accent text-white text-xs px-3 py-1 rounded-full font-semibold">One-Click</span>
              </h3>
              <p className="text-gray-600 text-sm">Connects with your favorite calendar apps in seconds.</p>
            </div>
            <div className="mt-8 flex gap-4">
              {integrations.map((item) => (
                <div key={item.name} className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold bg-white border-2 border-rose-accent/10 hover:border-rose-accent/30 hover:shadow-md transition-all cursor-pointer" style={{ color: item.color }}>
                  {item.initials}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border-2 border-lavender-accent/20 relative overflow-hidden flex flex-col justify-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-lavender-accent">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span className="font-bold text-sm">Privacy First 🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Data Stays Yours</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use local-first technology - your calendar is processed in your browser and never stored on our servers. Complete peace of mind. 💜
              </p>
            </div>
            <div className="absolute right-4 bottom-4 text-5xl opacity-20 pointer-events-none">🔐</div>
          </div>
        </div>

        {/* Wall of Love */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 bg-gradient-to-r from-rose-accent to-lavender-accent rounded-full"></div>
            <p className="text-sm font-semibold text-gray-600">💖 14,000+ Happy Planners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {wallOfLove.map((post) => (
              <motion.div
                key={post.handle}
                whileHover={{ y: -5 }}
                className="glass-panel glass-panel-hover rounded-3xl p-8 border-2 border-rose-accent/10 relative overflow-hidden group shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-lavender-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={post.avatar} alt={post.handle} className="w-14 h-14 rounded-full border-3 border-rose-accent/20 bg-rose-50" />
                    <div>
                      <div className="flex items-center gap-2 text-gray-800 font-bold">
                        <span>{post.handle}</span>
                        <span className="text-rose-accent text-xs">✓</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{post.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base italic">"{post.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
