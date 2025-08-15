import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  Camera, 
  FileOutput,
  FolderOpen,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
  { name: '日報作成', href: '/create', icon: FileText },
  { name: '変化・要望記録', href: '/changes', icon: AlertTriangle },
  { name: '写真管理', href: '/photos', icon: Camera },
  { name: 'プロジェクト', href: '/projects', icon: FolderOpen },
  { name: 'レポート出力', href: '/export', icon: FileOutput },
];

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile menu */}
      <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}