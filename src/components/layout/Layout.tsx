import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { MobileNavigation } from './MobileNavigation';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Navigation />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
        
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}