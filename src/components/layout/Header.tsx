import { Building2, Calendar, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">工事日報システム</h1>
              <p className="text-xs lg:text-sm text-gray-500">{title}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Calendar className="h-4 w-4 mr-2" />
            今日: {new Date().toLocaleDateString('ja-JP')}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}