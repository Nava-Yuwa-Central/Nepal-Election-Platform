import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Leaders from "@/pages/Leaders";
import LeaderDetail from "@/pages/LeaderDetail";
import Leaderboard from "@/pages/Leaderboard";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            )}
            <span className="font-bold text-xl text-slate-900">{APP_TITLE}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost">{t('nav.home')}</Button>
          </Link>
          <Link href="/leaders">
            <Button variant="ghost">{t('nav.leaders')}</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost">{t('nav.leaderboard')}</Button>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 border-l pl-6">
            <Globe size={18} className="text-slate-600" />
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'ne' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('ne')}
            >
              नेपाली
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
          >
            {language === 'en' ? 'नेपाली' : 'EN'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50">
          <div className="px-4 py-4 space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                {t('nav.home')}
              </Button>
            </Link>
            <Link href="/leaders">
              <Button variant="ghost" className="w-full justify-start">
                {t('nav.leaders')}
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="w-full justify-start">
                {t('nav.leaderboard')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leaders" component={Leaders} />
      <Route path="/leaders/:id" component={LeaderDetail} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1">
        <Router />
      </main>
      <footer className="bg-slate-900 text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">Who's My Neta - Civic Engagement Platform</p>
          <p className="text-sm text-slate-400">
            Rate leaders. Discuss agendas. Shape Nepal's future.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
