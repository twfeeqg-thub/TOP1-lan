"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";

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
            staleTime: 1000 * 60 * 10, // 10 minutes caching
          },
        },
      })
  );

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("aisahl-theme") || localStorage.getItem("theme")) as Theme;
    if (savedTheme && ["light", "dark", "pink"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    const savedLang = (localStorage.getItem("aisahl-lang") || localStorage.getItem("lang")) as Lang;
    if (savedLang && ["ar", "en"].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
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
    localStorage.setItem("aisahl-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const toggleLang = (newLang?: Lang) => {
    const nextLang = newLang || (lang === "ar" ? "en" : "ar");
    setLang(nextLang);
    localStorage.setItem("aisahl-lang", nextLang);
    localStorage.setItem("lang", nextLang);
    document.documentElement.setAttribute("lang", nextLang);
    document.documentElement.setAttribute("dir", nextLang === "ar" ? "rtl" : "ltr");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
        <AuthProvider>
          <div style={{ visibility: mounted ? "visible" : "hidden" }}>
            {children}
          </div>
        </AuthProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
