"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLACEHOLDERS = [
  "Quiet places to work in Lagos...",
  "Weekend escapes near Accra...",
  "Creative hubs in Nairobi...",
  "Best evening spots in Abuja...",
  "Hidden beaches in Cape Town...",
  "Cultural markets in Dakar...",
];

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  className?: string;
};

export function SearchBar({ value, onChange, suggestions = [], onSuggestion, className = "" }: SearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || value) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isFocused, value]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(210,166,109,0.35), 0 16px 60px rgba(0,0,0,0.25)"
            : "0 8px 32px rgba(0,0,0,0.15)",
        }}
        transition={{ duration: 0.25 }}
        className="relative flex items-center gap-3 px-5 py-4 rounded-2xl"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isFocused ? "1px solid rgba(210,166,109,0.35)" : "1px solid var(--border-default)",
        }}
      >
        {/* Search icon */}
        <span style={{ color: isFocused ? "var(--accent-gold)" : "var(--text-muted)", flexShrink: 0 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </span>

        {/* Input */}
        <div className="relative flex-1">
          <input
            id="search-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)", caretColor: "var(--accent-gold)" }}
            autoComplete="off"
          />
          {/* Animated placeholder */}
          {!value && !isFocused && (
            <div
              className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
              aria-hidden
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {PLACEHOLDERS[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange("")}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: "var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* AI label */}
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(210,166,109,0.10)",
            border: "1px solid rgba(210,166,109,0.20)",
            color: "var(--accent-gold)",
          }}
        >
          AI
        </span>
      </motion.div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                onSuggestion?.(s);
              }}
              className="text-xs px-3.5 py-2 rounded-full transition-all"
              style={{
                background: "var(--bg-glass-light)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(210,166,109,0.35)";
                e.currentTarget.style.color = "var(--accent-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
