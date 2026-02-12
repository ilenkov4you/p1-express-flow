import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarCheck, LayoutGrid, Moon, Sun, ArrowRight, ClipboardList, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: CalendarCheck, labelKey: "today" as const },
  { path: "/board", icon: LayoutGrid, labelKey: "board" as const },
  { path: "/plan-tomorrow", icon: ArrowRight, labelKey: "planTomorrow" as const },
  { path: "/reviews", icon: ClipboardList, labelKey: "reviews" as const },
  { path: "/settings", icon: Settings, labelKey: "settings" as const },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-sm font-semibold tracking-tight">P1.express</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs px-2"
            onClick={() => setLang(lang === "en" ? "ru" : "en")}
          >
            {lang === "en" ? "RU" : "EN"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Bottom nav */}
      <nav className="border-t bg-background">
        <div className="flex justify-around py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
