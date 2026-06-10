"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";

const navItems = [
  {
    href: "/",
    label: "Discover",
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "Map",
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13V7m0 13 6-3M9 7l6-3m0 17 5.447-2.724A1 1 0 0 0 21 16.382V5.618a1 1 0 0 0-1.447-.894L15 7m0 14V7" />
      </svg>
    ),
  },
  {
    href: "/plans",
    label: "Plans",
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        id="main-sidebar"
        initial={false}
        animate={{ width: expanded ? 260 : 76 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed left-4 top-4 bottom-4 z-40 hidden lg:flex flex-col"
        style={{ borderRadius: 28 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-card)",
            borderRadius: 28,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-4" style={{ minHeight: 68 }}>
            <div
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-clay) 100%)",
                color: "#0F0F10",
                letterSpacing: "0.05em",
              }}
            >
              A
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="text-xs font-bold tracking-[0.32em] uppercase" style={{ color: "var(--accent-gold)" }}>
                    AFRIKA
                  </div>
                  <div className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Intelligence layer
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px" style={{ background: "var(--border-subtle)" }} />

          {/* Navigation */}
          <nav className="flex-1 px-3 pt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl relative"
                    style={{
                      color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                      background: isActive ? "rgba(210,166,109,0.10)" : "transparent",
                      border: isActive ? "1px solid rgba(210,166,109,0.20)" : "1px solid transparent",
                    }}
                    whileHover={{
                      background: isActive
                        ? "rgba(210,166,109,0.14)"
                        : "var(--bg-glass-light)",
                      color: isActive ? "var(--accent-gold)" : "var(--text-primary)",
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="flex-shrink-0">{item.icon(isActive)}</span>
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.18 }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent-gold)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pb-4 space-y-1">
            {/* AI assistant entry */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl p-3 mb-2"
                  style={{
                    background: "rgba(210,166,109,0.07)",
                    border: "1px solid rgba(210,166,109,0.15)",
                  }}
                >
                  <div className="text-[0.62rem] uppercase tracking-[0.38em] mb-1.5" style={{ color: "var(--accent-gold)" }}>
                    Intelligence
                  </div>
                  <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>
                    Ask AFRIKA anything about African cities, places &amp; culture.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="flex-shrink-0">
                {theme === "dark" ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  
  // Track scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Hide if scrolled down more than 20px, show if scrolled up
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            setHidden(true);
          } else if (currentScrollY < lastScrollY) {
            setHidden(false);
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      id="mobile-nav"
      initial={{ y: 0 }}
      animate={{ y: hidden ? 120 : 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4 pb-safe"
    >
      <div
        className="flex items-center justify-around py-3 px-2 rounded-3xl"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center gap-1 touch-manipulation">
              <motion.div
                className="relative flex flex-col items-center p-1"
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(210,166,109,0.12)" }}
                    transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  />
                )}
                <span
                  className="relative z-10"
                  style={{ color: isActive ? "var(--accent-gold)" : "var(--text-muted)" }}
                >
                  {item.icon(isActive)}
                </span>
                <span
                  className="relative z-10 text-[10px] font-medium mt-1"
                  style={{ color: isActive ? "var(--accent-gold)" : "var(--text-muted)" }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
