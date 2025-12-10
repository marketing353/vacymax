import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  currentView?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, currentView }) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Home', view: 'landing', icon: '🏠' },
    { label: 'How it Works', view: 'how-it-works', icon: '✨' },
    { label: 'Strategy Demos', view: 'strategy-demos', icon: '📊' },
    { label: 'About', view: 'about', icon: 'ℹ️' },
    { label: 'Privacy', view: 'privacy', icon: '🔒' },
    { label: 'Terms', view: 'terms', icon: '📄' },
  ];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[199]"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[200] w-[85vw] max-w-sm bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-rose-100 safe-pt">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Menu</h2>
                <p className="text-xs text-gray-500 mt-0.5">Navigate to any section</p>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors text-gray-500 hover:text-rose-600 -mr-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col p-4 gap-2 overflow-y-auto safe-pb" style={{ maxHeight: 'calc(100vh - 100px)' }}>
              {menuItems.map((item, index) => {
                const isActive = currentView === item.view;
                return (
                  <motion.button
                    key={item.view}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigate(item.view)}
                    className={`
                      min-h-[56px] px-6 py-4 rounded-2xl flex items-center gap-4 text-left transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-rose-accent to-peach-accent text-white shadow-lg shadow-rose-accent/20'
                        : 'bg-white hover:bg-rose-50 border border-rose-100 hover:border-rose-200 text-gray-700 hover:text-rose-accent'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">{item.icon}</span>
                    <span className="font-semibold text-base">{item.label}</span>
                    <svg className={`w-5 h-5 ml-auto transition-transform ${isActive ? '' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent safe-pb">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span>VacyMax © 2025</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
