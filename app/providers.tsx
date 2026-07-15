"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type Theme = "light" | "dark" | "pink";
export type Lang = "ar" | "en";

interface AppContextType {
  theme: Theme;
  lang: Lang;
  toggleTheme: (newTheme?: Theme) => void;
  toggleLang: (newLang?: Lang) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Initialize QueryClient lazily to prevent duplicate instances
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes caching
          },
        },
      })
  );

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("thakaa_theme") as Theme;
      if (savedTheme && ["light", "dark", "pink"].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return "dark";
  });

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("thakaa_lang") as Lang;
      if (savedLang && ["ar", "en"].includes(savedLang)) {
        return savedLang;
      }
    }
    return "ar";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply attributes immediately
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [theme, lang]);

  const toggleTheme = (newTheme?: Theme) => {
    let nextTheme: Theme;
    if (newTheme) {
      nextTheme = newTheme;
    } else {
      const themes: Theme[] = ["light", "dark", "pink"];
      const currentIndex = themes.indexOf(theme);
      nextTheme = themes[(currentIndex + 1) % themes.length];
    }
    
    setTheme(nextTheme);
    localStorage.setItem("thakaa_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const toggleLang = (newLang?: Lang) => {
    const nextLang = newLang || (lang === "ar" ? "en" : "ar");
    setLang(nextLang);
    localStorage.setItem("thakaa_lang", nextLang);
    document.documentElement.setAttribute("lang", nextLang);
    document.documentElement.setAttribute("dir", nextLang === "ar" ? "rtl" : "ltr");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
        <div style={{ visibility: mounted ? "visible" : "hidden" }}>
          {children}
        </div>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
