"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { useHasHydrated, useLocalStorageValue } from "@/hooks/use-local-storage";

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

const THEME_VALUES: Theme[] = ["light", "dark", "pink"];
const LANG_VALUES: Lang[] = ["ar", "en"];

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEME_VALUES as string[]).includes(value);
}

function isLang(value: string | null): value is Lang {
  return value !== null && (LANG_VALUES as string[]).includes(value);
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

  const readTheme = useCallback((_raw: string | null): Theme => {
    const saved = window.localStorage.getItem("aisahl-theme") ?? window.localStorage.getItem("theme");
    return isTheme(saved) ? saved : "dark";
  }, []);

  const readLang = useCallback((raw: string | null): Lang => {
    return isLang(raw) ? raw : "ar";
  }, []);

  const [theme, setTheme] = useLocalStorageValue<Theme>("aisahl-theme", {
    fallback: "dark",
    read: readTheme,
    serialize: (value) => value,
  });

  const [lang, setLang] = useLocalStorageValue<Lang>("aisahl-lang", {
    fallback: "ar",
    read: readLang,
    serialize: (value) => value,
  });

  const hydrated = useHasHydrated();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [theme, lang]);

  const applyTheme = useCallback(
    (next: Theme) => {
      setTheme(next);
      window.localStorage.setItem("theme", next);
    },
    [setTheme]
  );

  const applyLang = useCallback(
    (next: Lang) => {
      setLang(next);
      window.localStorage.setItem("lang", next);
    },
    [setLang]
  );

  const toggleTheme = (newTheme?: Theme) => {
    let nextTheme: Theme;
    if (newTheme) {
      nextTheme = newTheme;
    } else {
      const currentIndex = THEME_VALUES.indexOf(theme);
      nextTheme = THEME_VALUES[(currentIndex + 1) % THEME_VALUES.length];
    }
    applyTheme(nextTheme);
  };

  const toggleLang = (newLang?: Lang) => {
    applyLang(newLang || (lang === "ar" ? "en" : "ar"));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
        <AuthProvider>
          <div style={{ visibility: hydrated ? "visible" : "hidden" }}>
            {children}
          </div>
        </AuthProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
