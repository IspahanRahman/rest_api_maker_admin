// components/navigation/UserNavbar.jsx
"use client";

import { useEffect, useState } from "react";
import { Menu, Bell, Moon, Sun } from "lucide-react"
import Image from "next/image";
import CustomIconButton from "@/components/lib/ui-elements/icon-button/CustomIconButton";

interface UserNavbarProps {
  onMenuClick: () => void;
}

export default function UserNavbar({ onMenuClick }: UserNavbarProps) {
  const [theme, setTheme] = useState("system"); // 'light' | 'dark' | 'system'
  const [mounted, setMounted] = useState(false);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const enableDark = () => root.classList.add("dark");
    const disableDark = () => root.classList.remove("dark");

    if (theme === "dark") enableDark();
    else if (theme === "light") disableDark();
    else systemPrefersDark ? enableDark() : disableDark();

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Toggle light/dark (cycles: light <-> dark; hold Alt to set 'system')
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e?.altKey) {
      setTheme("system");
      return;
    }
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 shadow-md bg-background">
      <div className="mx-auto flex h-full items-center bg-background justify-between px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="rounded-md p-2  focus:outline-none focus:ring md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand */}
          <div className="font-semibold tracking-tight">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={200}
              height={120}
              className="inline-block"
            />
          </div>
        </div>

        {/* Right actions: theme switcher, notifications, avatar */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <CustomIconButton
            onClick={toggleTheme}
            title={
              theme === "system"
                ? "Theme: System (Alt+Click to keep system)"
                : `Theme: ${
                    theme === "dark" ? "Dark" : "Light"
                  } (Alt+Click to System)`
            }
            className="rounded-md p-2  focus:outline-none focus:ring cursor-pointer"
            aria-label="Toggle theme"
            typeMap={{ button: "button" }}
            iconMap={{}}
            tone="default"
            color="default"
          >
            {/* Show icon by computed theme */}
            <ThemeIcon theme={theme} />
          </CustomIconButton>
        </div>
      </div>
    </header>
  );
}

function ThemeIcon({ theme }: { theme: string }) {
  // For 'system', show Sun/Moon based on current media query (client-only)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setIsDark(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  if (theme === "dark" || (theme === "system" && isDark)) {
    return <Sun className="h-5 w-5 text-foreground" />;
  }
  return <Moon className="h-5 w-5 text-foreground" />;
}
